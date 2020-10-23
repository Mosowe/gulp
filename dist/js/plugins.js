// 时间戳格式化
function timeFormat(date, formatStr) {
    if (date.toString().indexOf('.') > -1 || date.toString().indexOf('-') > 0 || date.toString().indexOf('/') > -1) {
      return date;
    }
    if (typeof date === 'number' || typeof date === 'string') {
      date = 
        date.toString().indexOf('-') === 0 ? 
          date.toString().length <= 11 ? new Date(date * 1000) : new Date(date) :
          date.toString().length <= 10 ? new Date(date * 1000) : new Date(date) ;
    }
    let str = formatStr;
    str=str.replace(/yyyy|YYYY/, date.getFullYear());
    str=str.replace(/MM/, date.getMonth()+1>9?(date.getMonth()+1).toString():'0' + (date.getMonth()+1));
    str=str.replace(/dd|DD/, date.getDate()>9?date.getDate().toString():'0' + date.getDate());
    str=str.replace(/hh|HH/, date.getHours()>9?date.getHours().toString():'0' + date.getHours());
    str=str.replace(/mm/, date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes());
    str=str.replace(/ss/, date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds());
    return str;
};


// 时间转义
function checkDate (time) {
  if (timeFormat(time, 'YYYYMMDD') === timeFormat(new Date(), 'YYYYMMDD')) { // 是否今天
    return '今天 ' + timeFormat(time, 'hh:mm:ss');
  } else if (timeFormat(time, 'YYYYMMDD') === timeFormat(Math.floor(new Date().getTime() / 1000) - 24*3600, 'YYYYMMDD')) { // 是否昨天
    return '昨天 ' + timeFormat(time, 'hh:mm:ss');
  } else {
    return timeFormat(time, 'YYYY-MM-DD hh:mm:ss');
  }
}