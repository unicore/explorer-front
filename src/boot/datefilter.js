import Vue from 'vue'
import moment from 'moment'

export default ({ app, store }) => {

  Vue.filter('formatDate', (value = '') => {
    // var locale = app.$cookies.get("lang", 'ru')
    
    moment.locale('ru')
    
    var offset = moment().utcOffset(); 
    var a = moment.utc(value)
    //.add(offset, 'minutes');


    // var a = moment(new Date())

    
    var b = moment.utc()
    // console.log('TIME', a, offset, b)

    return a.from(b)

    // return moment.utc(value.toString()).fromNow()
  })

  Vue.filter('formatDate2', (value = '') => {
    // var locale = app.$cookies.get("lang", 'ru')
    
    // moment.locale('ru')
    
    // var a = moment.utc(value);
    // var offset = moment().utcOffset();
    
    // var b = moment(new Date()).subtract(offset, 'minutes')
    // // var b = moment.utc()
    
    // return a.from(b)

    // return moment.utc(value.toString()).fromNow()
    
    return moment(value).lang("ru").format("dddd, MMMM Do YYYY, HH:mm"); 

  })


}