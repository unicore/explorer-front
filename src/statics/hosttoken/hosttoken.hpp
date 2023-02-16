#pragma once

#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>
#include <eosio/time.hpp>
#include <eosio/system.hpp>

#include <string>

namespace eosiosystem {
   class system_contract;
}



namespace eosio {

   using std::string;

   class [[eosio::contract("hosttoken")]] hosttoken : public contract {
      public:
         static constexpr uint64_t _DATA_ORDER_EXPIRATION = 86400;

         using contract::contract;

         [[eosio::action]]
         void create( name   issuer,
                      asset  maximum_supply,
                      std::string purpose
                     );

         [[eosio::action]]
         void createorder(name username, name curator, name type, eosio::asset quantity, double rate, name quote_type, eosio::asset quote, std::string details);

         [[eosio::action]]
         void accept(name username, uint64_t id, std::string details);
         
         [[eosio::action]]
         void approve(name username, uint64_t id);

         [[eosio::action]]
         void cancel(name username, uint64_t id);
         
         [[eosio::action]]
         void addmethod(name username, name type, asset token, std::string details, double rate, asset quote);
         
         [[eosio::action]]
         void addachangem(uint64_t method_id);

         [[eosio::action]]
         void rmachangem(uint64_t method_id);

         [[eosio::action]]
         void rmmethod(uint64_t id);

         [[eosio::action]]
         void setachange(eosio::asset token, bool status);

         [[eosio::action]]
         void issue( name to, asset quantity, string memo );

         [[eosio::action]]
         void retire( asset quantity, string memo );

         

         [[eosio::action]]
         void setprincipal(eosio::name host, std::string first_name, std::string last_name, std::string middle_name, std::string details);
         void rmprincipal(eosio::name host, uint64_t id);


         [[eosio::action]]
         void transfer( name    from,
                        name    to,
                        asset   quantity,
                        string  memo );

         [[eosio::action]]
         void open( name owner, const symbol& symbol, name ram_payer );

         [[eosio::action]]
         void close( name owner, const symbol& symbol );

         static asset get_supply( name token_contract_account, symbol_code sym_code )
         {
            stats statstable( token_contract_account, sym_code.raw() );
            const auto& st = statstable.get( sym_code.raw() );
            return st.supply;
         }

         static asset get_balance( name token_contract_account, name owner, symbol_code sym_code )
         {
            accounts accountstable( token_contract_account, owner.value );
            const auto& ac = accountstable.get( sym_code.raw() );
            return ac.balance;
         }

         using create_action = eosio::action_wrapper<"create"_n, &hosttoken::create>;
         using issue_action = eosio::action_wrapper<"issue"_n, &hosttoken::issue>;
         using retire_action = eosio::action_wrapper<"retire"_n, &hosttoken::retire>;
         using transfer_action = eosio::action_wrapper<"transfer"_n, &hosttoken::transfer>;
         using open_action = eosio::action_wrapper<"open"_n, &hosttoken::open>;
         using close_action = eosio::action_wrapper<"close"_n, &hosttoken::close>;


         struct [[eosio::table]] account {
            asset    balance;

            uint64_t primary_key()const { return balance.symbol.code().raw(); }
         };

         struct [[eosio::table]] currency_stats {
            asset    supply;
            asset    max_supply;
            name     issuer;

            uint64_t primary_key()const { return supply.symbol.code().raw(); }
         };

         typedef eosio::multi_index< "accounts"_n, account > accounts;
         typedef eosio::multi_index< "stat"_n, currency_stats > stats;

         
      private:

         struct [[eosio::table]] gtokens {
            asset supply;
            asset max_supply;
            std::string purpose;
            name issuer;
            bool transfer_is_prohibited = true;
            bool auto_change = false;
            std::vector<uint64_t> auto_change_methods;

            uint64_t primary_key()const { return supply.symbol.code().raw(); }
         };

         typedef eosio::multi_index< "gtokens"_n, gtokens > gtokens_index;

         struct [[eosio::table]] methods {
            uint64_t id;
            name creator;
            asset token;
            name type;
            
            double rate;
            asset quote;
            name quote_contract;
            std::string details;
            
            uint64_t primary_key()const { return id; }
            uint64_t bycreator() const {return creator.value;}
            uint64_t bytype() const {return type.value;}
            uint64_t bytoken() const {return token.symbol.code().raw();}
         };

         typedef eosio::multi_index< "methods"_n, methods,
            eosio::indexed_by<"bycreator"_n, eosio::const_mem_fun<methods, uint64_t, &methods::bycreator>>,
            eosio::indexed_by<"bytoken"_n, eosio::const_mem_fun<methods, uint64_t, &methods::bytoken>>,
            eosio::indexed_by<"bytype"_n, eosio::const_mem_fun<methods, uint64_t, &methods::bytype>>
          > methods_index;


         struct [[eosio::table]] principals {
            uint64_t id;
            std::string first_name;
            std::string last_name;
            std::string middle_name;
            std::string details;

            uint64_t primary_key() const { return id; }
                  
         };

         typedef eosio::multi_index< "principals"_n, principals> principals_index;

         
         struct [[eosio::table]] orders {
            uint64_t id;
            uint64_t parent_id;
            name curator;
            name creator;
            name buyer;
            name seller;

            double rate;
            name type;
            asset quantity;
            std::string quantity_symbol;
            asset quote;
            std::string quote_symbol;
            name quote_type;

            std::string details;
            name status;
            eosio::time_point_sec expired_at;
            eosio::time_point_sec created_at;

            uint64_t primary_key()const { return id; }
            uint64_t byparent()const { return parent_id; }

            uint64_t bybuyer() const {return buyer.value;} 
            uint64_t bycreator() const {return creator.value;}
            uint64_t byseller() const {return seller.value;} 
            uint64_t bystatus() const {return status.value;} 
            uint64_t bycurator() const {return curator.value;}
            uint64_t bytype() const {return type.value;} 
         };

         typedef eosio::multi_index< "orders"_n, orders,
            eosio::indexed_by<"byparent"_n, eosio::const_mem_fun<orders, uint64_t, &orders::byparent>>,
            eosio::indexed_by<"bytype"_n, eosio::const_mem_fun<orders, uint64_t, &orders::bytype>>,
            eosio::indexed_by<"bycurator"_n, eosio::const_mem_fun<orders, uint64_t, &orders::bycurator>>,
            eosio::indexed_by<"bycreator"_n, eosio::const_mem_fun<orders, uint64_t, &orders::bycreator>>,
            eosio::indexed_by<"bybuyer"_n, eosio::const_mem_fun<orders, uint64_t, &orders::bybuyer>>,
            eosio::indexed_by<"byseller"_n, eosio::const_mem_fun<orders, uint64_t, &orders::byseller>>,
            eosio::indexed_by<"bystatus"_n, eosio::const_mem_fun<orders, uint64_t, &orders::bystatus>>
            
         > orders_index;


         void sub_balance( name owner, asset value, name ram_payer );
         void add_balance( name owner, asset value, name ram_payer );
   };





} /// namespace eosio
