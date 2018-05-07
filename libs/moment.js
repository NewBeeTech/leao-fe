export function getNextNDay(AddDayCount) {
  let dd = new Date();
  dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
  let year = dd.getFullYear();
  let month = dd.getMonth()+1;//获取当前月份的日期
  let date = dd.getDate();
  let day = '';
  switch(dd.getDay()) {
    case 0:
      day = '周日';
      break;
    case 1:
      day = '周一';
      break;
    case 2:
      day = '周二';
      break;
    case 3:
      day = '周三';
      break;
    case 4:
      day = '周四';
      break;
    case 5:
      day = '周五';
      break;
    case 6:
      day = '周六';
      break;
  }
  return ({
    year,
    month,
    date,
    day,
    dateObj: dd,
  });
}


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

//数据转化
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * new Date()为null的解法
 * time: 传入时间staging
*/
function dateFromString(time){
  time = time.replace(/-/g, ':').replace(' ', ':')
  time = time.split(':')
  var time1 = new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5])
  return time1
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * time: 传入时间staging
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
export function formatTime(time, format) {
  var formateArr  = ['Y','M','D','h','m','s'];
  var returnArr   = [];

  var date = dateFromString(time);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr)
  {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
