#include "hosttoken.hpp"

namespace eosio {

void hosttoken::create( name   issuer,
                    asset  maximum_supply,
                    std::string purpose
                 )
{
    require_auth( _self );

    auto sym = maximum_supply.symbol;
    check( sym.is_valid(), "invalid symbol name" );
    check( maximum_supply.is_valid(), "invalid supply");
    check( maximum_supply.amount > 0, "max-supply must be positive");

    stats statstable( _self, sym.code().raw() );
    auto existing = statstable.find( sym.code().raw() );
    check( existing == statstable.end(), "token with symbol already exists " );

    statstable.emplace( _self, [&]( auto& s ) {
       s.supply.symbol = maximum_supply.symbol;
       s.max_supply    = maximum_supply;
       s.issuer        = issuer;
    });

    gtokens_index gtokens(_self, _self.value);

    gtokens.emplace(_self, [&](auto &gt){
      gt.supply = asset(0, sym);
      gt.max_supply = maximum_supply;
      gt.purpose = purpose;
      gt.issuer = issuer;
    });
}

void hosttoken::addmethod(name username, name type, asset token, std::string details, double rate, asset quote)
{
    require_auth( _self );

    check(token.amount == 0, "amount should be a zero");

    gtokens_index gtokens(_self, _self.value);
    auto gtoken = gtokens.find(token.symbol.code().raw());
    check(gtoken != gtokens.end(), "Token is not found on the host");

    methods_index methods(_self, _self.value);
    
    methods.emplace(_self, [&](auto &m){
      m.creator = username;
      m.id = methods.available_primary_key();
      m.token = token;
      m.type = type;
      m.details = details;

      //ADD
      m.rate = rate;
      m.quote = quote;
      m.quote_contract = _self;
      //  
    });

}

void hosttoken::setachange(eosio::asset token, bool status)
{
    require_auth( _self );
    
    gtokens_index gtokens(_self, _self.value);

    auto gtoken = gtokens.find(token.symbol.code().raw());
    eosio::check(gtoken != gtokens.end(), "Token is not found");

    gtokens.modify(gtoken, _self, [&](auto &gt){
      gt.auto_change = status;
    });

}


void hosttoken::addachangem(uint64_t method_id)
{
    require_auth( _self );
    methods_index methods(_self, _self.value);
    auto method = methods.find(method_id);
    check(method != methods.end(), "Method is not found");
    
    gtokens_index gtokens(_self, _self.value);

    auto gtoken = gtokens.find(method->token.symbol.code().raw());
    std::vector<uint64_t> methods_idx = gtoken -> auto_change_methods;
    
    
    if (std::find(methods_idx.begin(), methods_idx.end(), method_id) == methods_idx.end()){

      methods_idx.push_back(method_id);
      gtokens.modify(gtoken, _self, [&](auto &gt) {
        gt.auto_change_methods = methods_idx;
      });
      
    } else {

      eosio::check(false, "method already exist");

    }

}

void hosttoken::rmachangem(uint64_t method_id)
{
    require_auth( _self );
    methods_index methods(_self, _self.value);
    auto method = methods.find(method_id);
    check(method != methods.end(), "Method is not found");
    
    gtokens_index gtokens(_self, _self.value);

    auto gtoken = gtokens.find(method->token.symbol.code().raw());
    std::vector<uint64_t> methods_idx = gtoken -> auto_change_methods;
    

    std::vector<uint64_t>::iterator position = std::find(methods_idx.begin(), methods_idx.end(), method_id);

    if (position != methods_idx.end()) // == myVector.end() means the element was not found
      methods_idx.erase(position);

    gtokens.modify(gtoken, _self, [&](auto &gt){
      gt.auto_change_methods = methods_idx;
    });


}

void hosttoken::rmmethod(uint64_t id )
{
    require_auth( _self );

    methods_index methods(_self, _self.value);
    auto method = methods.find(id);
    eosio::check(method != methods.end(), "Method is not found");
    methods.erase(method);

}

// uint64_t id;
// name curator;
// double rate;
// name type;
// asset quantity;
// asset quote;
// std::string details;
// name status;


void hosttoken::createorder(name username, name curator, name type, eosio::asset quantity, double rate, name quote_type, eosio::asset quote, std::string details)
{
    require_auth( username );

    orders_index orders(_self, _self.value);
    
    auto sym_code_raw = quantity.symbol.code().raw();
    
    stats statstable( _self, sym_code_raw );
    const auto& st = statstable.get( sym_code_raw, "symbol does not exist" );
    check( st.supply.symbol == quantity.symbol, "symbol precision mismatch" );
    check( quantity.amount <= st.max_supply.amount - st.supply.amount, "quantity exceeds available supply");
    
    check(type == "buy"_n || type == "sell"_n, "Only buy or sell types");

    if (type == "sell"_n){
      sub_balance( username, quantity, username );
      add_balance( _self, quantity, username );
    };

    orders.emplace(username, [&](auto &o) {
      o.id = orders.available_primary_key();
      o.curator = _self;
      o.creator = username;

      if (type == "buy"_n){
        o.buyer = username;
        if (quote_type == "cash"_n){
          o.seller = _self;   
          o.status = "process"_n;
        } else {
          o.status = "waiting"_n;
        }
      }
      else if (type == "sell"_n){
        o.seller = username;
        if (quote_type == "cash"_n){
          o.buyer = _self;   
          o.status = "process"_n;
        } else {
          o.status = "waiting"_n;
        }
      }

      o.rate = rate;
      o.type = type;
      o.quote_type = quote_type;
      o.quantity = quantity;
      o.quantity_symbol = quantity.symbol.code().to_string(); 
      o.quote_symbol = quote.symbol.code().to_string(); 
      o.quote = asset(uint64_t(quantity.amount * rate), quote.symbol);
      o.details = details;
      o.created_at = eosio::time_point_sec(eosio::current_time_point().sec_since_epoch());
    });

}



void hosttoken::accept(name username, uint64_t id, std::string details)
{
    require_auth( username );

    orders_index orders(_self, _self.value);
    auto order = orders.find(id);
    eosio::check(order != orders.end(), "Order is not found");
    eosio::check(order -> status == "waiting"_n, "Only order on waiting mode can be accepted");
    orders.modify(order, _self, [&](auto &o) {
    
      if (order -> type == "buy"_n){
      
        eosio::check(order->buyer != username, "Cannot buy from youself");
        o.seller = username;
        o.details = details;
        o.expired_at = eosio::time_point_sec(eosio::current_time_point().sec_since_epoch()+ _DATA_ORDER_EXPIRATION);
      
      }
      else if (order -> type == "sell"_n) {

        eosio::check(order->seller != username, "Cannot buy from youself");
        o.buyer = username;
        o.expired_at = eosio::time_point_sec(eosio::current_time_point().sec_since_epoch()+ _DATA_ORDER_EXPIRATION);
      
      };

      o.status = "process"_n;

    });
}

void hosttoken::approve(name username, uint64_t id)
{
    require_auth( _self );

    orders_index orders(_self, _self.value);
    auto order = orders.find(id);
    eosio::check(order != orders.end(), "Order is not found");
    
    eosio::check(order -> status == "process"_n, "Only processed transactions can be approved");

    if (order -> type == "buy"_n) {
      eosio::check(order -> seller == username, "Waiting approve only from seller");
      issue(order -> buyer, order->quantity, "issue for buyer");

    } else {
      eosio::check(order -> buyer == username, "Waiting approve only from buyer");
      retire(order->quantity, "retire from seller");
    };

    orders.modify(order, _self, [&](auto &o) {
      o.status = "finish"_n;
      o.expired_at = eosio::time_point_sec(0);
    });

}



void hosttoken::cancel(name username, uint64_t id)
{
    require_auth( username );

    orders_index orders(_self, _self.value);
    auto order = orders.find(id);
    eosio::check(order != orders.end(), "Order is not found");
    eosio::check(order -> status == "waiting"_n, "Only order on the waiting can be cancel");
    
    if (order -> status == "process"_n) {

      if (order -> type == "buy"_n) {
        
        orders.modify(order, username, [&](auto &o){
          o.seller = ""_n;
          o.expired_at = eosio::time_point_sec(-1);
          o.details = "";
        });

        eosio::check(order -> buyer == username, "Only buyer can cancel order");
      
      } else {

        orders.modify(order, username, [&](auto &o) {
          o.buyer = ""_n;
          o.expired_at = eosio::time_point_sec(-1);
        });
      
        eosio::check(order -> seller == username, "Only seller can cancel order");
      
      }


    } else if (order->status == "waiting"_n){
      if (order -> type == "buy"_n){
        eosio::check(order -> buyer == username, "Only buyer can cancel order");
      } else {
        eosio::check(order -> seller == username, "Only seller can cancel order");
      }

      orders.erase(order);
    }


}




void hosttoken::issue( name to, asset quantity, string memo )
{
    auto sym = quantity.symbol;
    check( sym.is_valid(), "invalid symbol name" );
    check( memo.size() <= 256, "memo has more than 256 bytes" );

    stats statstable( _self, sym.code().raw() );
    auto existing = statstable.find( sym.code().raw() );
    check( existing != statstable.end(), "token with symbol does not exist, create token before issue" );
    const auto& st = *existing;

    require_auth( st.issuer );

    check( quantity.is_valid(), "invalid quantity" );
    check( quantity.amount > 0, "must issue positive quantity" );

    check( quantity.symbol == st.supply.symbol, "symbol precision mismatch" );
    check( quantity.amount <= st.max_supply.amount - st.supply.amount, "quantity exceeds available supply");

    statstable.modify( st, same_payer, [&]( auto& s ) {
       s.supply += quantity;
    });

    gtokens_index gtokens(_self, _self.value);
    auto gtoken = gtokens.find(sym.code().raw());
    gtokens.modify(gtoken, _self, [&](auto &gt){
      gt.supply += quantity;
    });

    add_balance( st.issuer, quantity, st.issuer );

    if( to != st.issuer ) {
      SEND_INLINE_ACTION( *this, transfer, { {st.issuer, "active"_n} },
                          { st.issuer, to, quantity, memo }
      );
    }
}

void hosttoken::retire( asset quantity, string memo )
{
    auto sym = quantity.symbol;
    check( sym.is_valid(), "invalid symbol name" );
    check( memo.size() <= 256, "memo has more than 256 bytes" );

    stats statstable( _self, sym.code().raw() );
    auto existing = statstable.find( sym.code().raw() );
    check( existing != statstable.end(), "token with symbol does not exist" );
    const auto& st = *existing;

    require_auth( st.issuer );
    check( quantity.is_valid(), "invalid quantity" );
    check( quantity.amount > 0, "must retire positive quantity" );

    check( quantity.symbol == st.supply.symbol, "symbol precision mismatch" );

    statstable.modify( st, same_payer, [&]( auto& s ) {
       s.supply -= quantity;
    });

    gtokens_index gtokens(_self, _self.value);
    auto gtoken = gtokens.find(sym.code().raw());
    gtokens.modify(gtoken, _self, [&](auto &gt){
      gt.supply -= quantity;
    });


    sub_balance( st.issuer, quantity, st.issuer );
}

void hosttoken::transfer( name    from,
                      name    to,
                      asset   quantity,
                      string  memo )
{
    check( from != to, "cannot transfer to self" );
    
    eosio::check(has_auth(_self) || has_auth(from), "missing required authority");

    // require_auth( from );
    check( is_account( to ), "to account does not exist");
    auto sym = quantity.symbol.code();
    stats statstable( _self, sym.raw() );
    const auto& st = statstable.get( sym.raw() );

    require_recipient( from );
    require_recipient( to );

    check( quantity.is_valid(), "invalid quantity" );
    check( quantity.amount > 0, "must transfer positive quantity" );
    check( quantity.symbol == st.supply.symbol, "symbol precision mismatch" );
    check( memo.size() <= 256, "memo has more than 256 bytes" );

    auto payer = has_auth( to ) ? to : (has_auth(_self) ? _self : from);

    sub_balance( from, quantity, payer );
    add_balance( to, quantity, payer );
}


void hosttoken::sub_balance( name owner, asset value, name ram_payer ) {
   accounts from_acnts( _self, owner.value );

   const auto& from = from_acnts.get( value.symbol.code().raw(), "no balance object found" );
   check( from.balance.amount >= value.amount, "overdrawn balance" );

   from_acnts.modify( from, ram_payer, [&]( auto& a ) {
         a.balance -= value;
      });
}

void hosttoken::add_balance( name owner, asset value, name ram_payer )
{
   accounts to_acnts( _self, owner.value );
   auto to = to_acnts.find( value.symbol.code().raw() );
   if( to == to_acnts.end() ) {
      to_acnts.emplace( ram_payer, [&]( auto& a ){
        a.balance = value;
      });
   } else {
      to_acnts.modify( to, same_payer, [&]( auto& a ) {
        a.balance += value;
      });
   }
}

void hosttoken::open( name owner, const symbol& symbol, name ram_payer )
{
   require_auth( ram_payer );

   check( is_account( owner ), "owner account does not exist" );

   auto sym_code_raw = symbol.code().raw();
   stats statstable( _self, sym_code_raw );
   const auto& st = statstable.get( sym_code_raw, "symbol does not exist" );
   check( st.supply.symbol == symbol, "symbol precision mismatch" );

   accounts acnts( _self, owner.value );
   auto it = acnts.find( sym_code_raw );
   if( it == acnts.end() ) {
      acnts.emplace( ram_payer, [&]( auto& a ){
        a.balance = asset{0, symbol};
      });
   }
}

void hosttoken::close( name owner, const symbol& symbol )
{
   require_auth( owner );
   accounts acnts( _self, owner.value );
   auto it = acnts.find( symbol.code().raw() );
   check( it != acnts.end(), "Balance row already deleted or never existed. Action won't have any effect." );
   check( it->balance.amount == 0, "Cannot close because the balance is not zero." );
   acnts.erase( it );
}


void hosttoken::setprincipal(eosio::name host, std::string first_name, std::string last_name, std::string middle_name, std::string details)
{
    require_auth( host );
    check( first_name.size() > 0, "first_name should be setted" );
    check( last_name.size() > 0, "last_name should be setted " );
    
    principals_index principals(_self, host.value);
    
    principals.emplace(host, [&](auto &p){
      p.id = principals.available_primary_key();
      p.first_name = first_name;
      p.last_name = last_name;
      p.middle_name = middle_name;
      p.details = details;
    });

}


void hosttoken::rmprincipal(eosio::name host, uint64_t id)
{
    require_auth( host );
    principals_index principals(_self, host.value);
    auto pr = principals.find(id);
    principals.erase(pr);
}


} /// namespace eosio

EOSIO_DISPATCH( eosio::hosttoken, (create)(issue)(transfer)(open)(close)(retire)(createorder)(accept)(approve)(cancel)(addmethod)(rmmethod)(setachange)(setprincipal)(rmprincipal)(addachangem)(rmachangem))
