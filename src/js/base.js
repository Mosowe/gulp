/**************************************/
/*********** 基础信息获取及配置 *************/
/**************************************/
console.log(ENV()) 
const type = ENV() // test trail  production   
let ua = navigator.userAgent.toLowerCase(); 
let isWxBrowser = ua.indexOf('micromessenger') !== -1;
let isSafari = ua.indexOf('safari') !== -1 && ua.indexOf('browser') === -1  && ua.indexOf('android') === -1;  // 有些浏览器的内核跟Safari有关，但是包含有自己的**browser，非安卓
let isIos = ua.indexOf('iphone') !== -1 || ua.indexOf('iPod') !== -1 || ua.indexOf('iPad') !== -1;
let hrefQuery = location.href.split('?')[1] ? location.href.split('?')[1].split('&') : []
let query = {}
for (const item of hrefQuery) { 
  query[item.split('=')[0]] = item.split('=')[1]
} 
// 接口地址
const url = {
  urlTest: 'https://test.edianyao.com/micro',
  urlTrail: 'https://y.edianyao.com/micro',
  urlProduction: 'https://p.edianyao.com/micro',
}

if (isWxBrowser || location.href.indexOf('h5t.edianyao') > -1) { // 在微信浏览器中显示
  var vConsole = new VConsole();
}
// 基础信息
let baseInfo = {
  type: type,
  apiUrl: type === 'test' ? url.urlTest : type === 'trail' ? url.urlTrail : urlProduction,
  isWxBrowser:isWxBrowser,
  isSafari:isSafari,
  isIos:isIos,
  version:'3.2.0',
  isLogin: query.hasOwnProperty('userId') && query.userId ? true:false,
  isHelp: false,
  ...query  
}
if (sessionStorage.getItem('baseInfo')) {
  baseInfo = JSON.parse(sessionStorage.getItem('baseInfo'))
}
sessionStorage.setItem('baseInfo', JSON.stringify(baseInfo))
// 页面加载状态
function loadingPage(boolean){
  document.getElementById('loading').style.display = boolean ? 'block':'none'
}
loadingPage(true)



// toast提示
function toast(params){
  let toast = document.getElementById('my-toast')
  toast.className = 'my-toast'
  toast.innerText = typeof params === 'object' && params ? params.message: params || ''
  toast.style.display = 'block'
  let t = setTimeout(()=>{
    clearTimeout(t)
    toast.className = ''
    toast.innerText = ''
    toast.style.display = 'none'
  },typeof params === 'object' && params ? params.time || 1500 : 1500)
}


// 上拉加载状态
function uploadStatusText (type) {
  if (type === 'loading') { // 加载中
    loading =  true
    onLoad()
  } else {
    loading = false
  }
  document.getElementById('notice-up').style.display = type === 'loaded' ? 'block' : 'none'
  document.getElementById('notice-loading').style.display = type === 'loading' ? 'block' : 'none'
  document.getElementById('notice-end').style.display = type === 'finished' ? 'block' : 'none'
}
// 下拉刷新状态(未使用)
function refreshStatusText (type) {
  if (type === 'refreshing') {
    refresh = true
    document.getElementById('index').style.top = 50 + 'px'
    onRefresh()
  } else {
    refresh = false
  }
  if (type === 'refreshed') {
    let t = setTimeout(()=>{
      clearTimeout(t)
      document.getElementById('index').style.top = 0
      refreshStatusText('refreshInit')
    },500)
  }
  document.getElementById('refresh-down').style.display = type === 'refreshInit' ? 'block' : 'none'
  document.getElementById('refresh-now').style.display = type === 'refresh' ? 'block' : 'none'
  document.getElementById('refresh-loading').style.display = type === 'refreshing' ? 'block' : 'none'
  document.getElementById('refresh-end').style.display = type === 'refreshed' ? 'block' : 'none'
  
}