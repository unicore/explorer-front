
async function lazy_fetch_all_table_internal(api, code, scope, table, lower_bound, upper_bound, limit, index_position, key_type){
    if (!limit) limit = 100
    if (!lower_bound) lower_bound = 0
  
    
    var data = await api.getTableRows({json: true, code: code, scope: scope, table: table, lower_bound: lower_bound, upper_bound: upper_bound, limit: limit, index_position: index_position, key_type: key_type})
    var result = data.rows

    
    if (data.more == true) {
      
      var redata = await lazy_fetch_all_table_internal(api, code, scope, table, data.next_key, upper_bound, limit, index_position, key_type)
      result = [...result, ...redata]
      return result
    
    } else {
    
      return result
      
    }
}

export {lazy_fetch_all_table_internal}