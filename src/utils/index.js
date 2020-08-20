function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

const getTimeInfo = str => {
  if (!str) return ''
  const date = new Date(str);
  const time = new Date().getTime() - date.getTime();
  if (time < 0) {
    return '';
  } else if (time / 1000 < 60) {
    return '刚刚';
  } else if ((time / 60000) < 60) {
    return parseInt((time / 60000)) + '分钟前';
  } else if ((time / 3600000) < 24) {
    return parseInt(time / 3600000) + '小时前';
  } else if ((time / 86400000) < 31) {
    return parseInt(time / 86400000) + '天前';
  } else if ((time / 2592000000) < 12) {
    return parseInt(time / 2592000000) + '月前';
  } else {
    return parseInt(time / 31536000000) + '年前';
  }
}

//正则验证
function regexConfig() {
  var reg = {
    userid: /^[A-Za-z0-9]+$/,  //邮箱正则验证
    phone: /^1(3|4|5|7|8)\d{9}$/,  //手机号正则验证
    cards: /^[\u4e00-\u9fa5]{2,4}$/  //姓名汉字正则验证
  }
  return reg;
}

// module.exports = {
//   formatTime: formatTime,
//   regexConfig: regexConfig
// }
const getTodayDate = () => {
  let now = new Date()
  let yy = now.getFullYear()
  let mm = now.getMonth() + 1
  let dd = now.getDate()
  let day = new Array()
  day[0] = "星期日"
  day[1] = "星期一"
  day[2] = "星期二"
  day[3] = "星期三"
  day[4] = "星期四"
  day[5] = "星期五"
  day[6] = "星期六"
  return (yy + '年' + mm + '月' + dd + '日 ' + day[now.getDay()])
}
export default {
  formatNumber,
  formatTime,
  getTodayDate,
  regexConfig,
  getTimeInfo
}
