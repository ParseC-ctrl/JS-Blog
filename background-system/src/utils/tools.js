export function formatDate(timestamp) {
    let date = new Date(parseInt(timestamp))
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    let weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    let week = weekArr[date.getDay()]
    if (month >= 1 && month <= 9) {
        month = '0' + month
    }
    if (day >= 1 && day <= 9) {
        day = '0' + day
    }
    if (hour >= 1 && hour <= 9) {
        hour = '0' + hour
    }
    if (minute >= 1 && minute <= 9) {
        minute = '0' + minute
    }
    if (second >= 1 && second <= 9) {
        second = '0' + second
    }
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + ' ' + week
}