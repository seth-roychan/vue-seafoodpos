export function formatDateTime(date) {
  var months = date.getMonth() + 1
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var seconds = new Date(date).getSeconds()
  hours = hours >= 12 ? hours : '0' + hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds
  var strTime = hours + ':' + minutes + ':' + seconds
  return date.getFullYear() + '-' + months + '-' + date.getDate() + ' ' + strTime
}

export function formatDate(date) {
  var months = date.getMonth() + 1
  // var hours = date.getHours()
  // var minutes = date.getMinutes()
  // var seconds = new Date(date).getSeconds()
  // hours = hours >= 12 ? hours : '0' + hours
  // hours = hours % 12
  // hours = hours || 12 // the hour '0' should be '12'
  // minutes = minutes < 10 ? '0' + minutes : minutes
  // seconds = seconds < 10 ? '0' + seconds : seconds
  //  var strTime = hours + ':' + minutes + ':' + seconds
  return date.getFullYear() + '-' + months + '-' + date.getDate()
}
