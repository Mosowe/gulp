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
const url = {
  urlTest: 'https://test.edianyao.com/micro',
  urlTrail: 'https://y.edianyao.com/micro',
  urlProduction: 'https://p.edianyao.com/micro',
}

if (isWxBrowser) { // 在微信浏览器中显示
  var vConsole = new VConsole();
}

// 基础信息
function base () {
  return {
    type: type,
    apiUrl: type === 'test' ? url.urlTest : type === 'trail' ? url.urlTrail : urlProduction,
    isWxBrowser:isWxBrowser,
    isSafari:isSafari,
    isIos:isIos,
    ...query
  }
}
// 接口信息
function apis () {
  return {
    wxJssdkConfig: '/ydyuserh5/qywuseroauth/signature', // 微信分享参数
    protocol:'/ydymgrh5/qywconfigs/site', // 规则
    main: ''
  }
}
// 加载状态
function loadingPage(boolean){
  document.getElementById('loading').style.display = boolean ? 'block':'none'
}
loadingPage(true)

