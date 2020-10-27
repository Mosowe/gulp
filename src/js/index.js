/******************************/
/********活动页js功能区**********/
/******************************/
// navigator.geolocation.getCurrentPosition((res)=>{
//   console.log('navigator',res.coords) // 只能拿到经纬度,ios中若拒绝也不会获取
// })

let loading = false
let refresh = false
// 页面滚动
function pageScroll () {
  let screenHeight = window.innerHeight
  let scrollLen = 0
  let touchStartX = 0
  let touchStartY = 0
  let touchMoveX = 0
  let touchMoveY = 0
  // 滚动监听
  document.getElementById('bodyContent').addEventListener('scroll', (e) => {

    // 判断按钮悬浮
    let countDownBtn = document.getElementById('countDownBtn').getBoundingClientRect().top
    if (countDownBtn < -60) {
      document.getElementById('countDownBtn').getElementsByClassName('btn-wrap')[0].classList.add('fixed-btn-wrap')
    } else {
      document.getElementById('countDownBtn').getElementsByClassName('btn-wrap')[0].classList.remove('fixed-btn-wrap')
    }
    // 以下上拉加载
    let bodyHeight = e.target.scrollHeight
    scrollLen = e.target.scrollTop
  // window.addEventListener('scroll', (e) => {
  //   let bodyHeight = e.target.body.scrollHeight
  //   scrollLen = Math.abs(document.getElementById('bodyContent').getBoundingClientRect().top)
    if (scrollLen > bodyHeight - screenHeight - 30) {
      if (loading || refresh || userIsEmpty || finished) {
        return
      }

      uploadStatusText('loading')
    }
  })
  // 下拉刷新（未使用）
  if (false) {
    window.addEventListener('touchstart', (e) => {
      if (loading) {
        return
      }
      if (refresh) {
        return
      }
      let event = e.changedTouches[0]
      touchStartX = event.clientX
      touchStartY = event.clientY
    })
    window.addEventListener('touchmove', (e) => {
      if (loading) {
        return
      }
      if (refresh) {
        return
      }
      let event = e.changedTouches[0]
      touchMoveX = event.clientX
      touchMoveY = event.clientY
      if (scrollLen <= 0 && touchMoveX - touchStartX < 10 && touchMoveY - touchStartY > 0) {
        document.getElementById('index').style.top = (touchMoveY - touchStartY) / 5 + 'px'
      } 
      if (scrollLen <= 0 && touchMoveX - touchStartX < 10 && touchMoveY - touchStartY >= 250) {
        refreshStatusText('refresh')
      } else {
        refreshStatusText('refreshInit')
      }
    })
    window.addEventListener('touchend', (e) => {
      if (loading) {
        return
      }
      if (refresh) {
        return
      }
      if (scrollLen <= 0 && touchMoveX - touchStartX < 10 && touchMoveY - touchStartY >=250 ) {
        refreshStatusText('refreshing')
      } else {
        document.getElementById('index').style.top = 0
        refreshStatusText('refreshInit')
      }
    })
  }

}


// 轮播
function swiper () {
  let height = document.getElementById('swiper').getElementsByClassName('item')[0].getBoundingClientRect().height
  let style = `
      <style>
      @keyframes swiperMove{
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(-${height}px);
      }
    }</style>`
  document.getElementById('style').innerHTML = style
  window.addEventListener('resize', () => {
    height = document.getElementById('swiper').getElementsByClassName('item')[0].getBoundingClientRect().height
    style = `
        <style>
        @keyframes swiperMove{
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-${height}px);
        }
      }</style>`
    document.getElementById('style').innerHTML = style
  })
  setInterval(()=>{
    document.getElementById('swiper').classList.add('swiper-move')
    let t = setTimeout(()=>{
      clearTimeout(t)
      document.getElementById('swiper').getElementsByClassName('lists')[0].append(document.getElementById('swiper').getElementsByClassName('item')[0])
      document.getElementById('swiper').classList.remove('swiper-move')
    },500)
  },3000)
}

// 活动倒计时
function timeDown (time = 0) {
  if (time <= 0) {
    document.getElementById('countDown').style.display = 'none'
    document.getElementById('countDownNotice').style.display = 'none'
    document.getElementById('countDownNotice').innerText = ''    
  }

  let t = setInterval(()=>{
    if (time > 0) {
      time --
      let D = Math.floor(time / (24*60*60))
      let H = Math.floor((time % (24*60*60)) / (60*60))
      let M = Math.floor((time % (24*60*60)) % (60*60) / 60)
      let S = Math.floor((time % (24*60*60)) % (60*60) % 60)
      document.getElementById('countDown').style.display = 'block'
      document.getElementById('countDownNotice').style.display = 'none'
      document.getElementById('countDown').innerHTML = `
        距离本期红包失效还有${D ? D +'天' : ''}
        <span class="text">${H < 10 ? '0' + H : H}</span>
        <span class="dot">:</span>
        <span class="text">${M < 10 ? '0' + M : M}</span>
        <span class="dot">:</span>
        <span class="text">${S < 10 ? '0' + S: S}</span>`
    } else {
      clearInterval(t)
      document.getElementById('countDown').style.display = 'none'
      document.getElementById('countDownNotice').style.display = 'block'
      document.getElementById('countDownNotice').innerText = '本期红包已失效，请重新发起'
      document.getElementById('countDownBtn').getElementsByClassName('image-help')[0].style.display = 'none'
      document.getElementById('countDownBtn').getElementsByClassName('image-get')[0].style.display = 'none'
      document.getElementById('countDownBtn').getElementsByClassName('image-start')[0].style.display = 'block'
    }
  },1000)
}

// 按钮初始化配置
function btnInit () {
  if (baseInfo.hasOwnProperty('pid') && baseInfo.pid && !baseInfo.isHelp) { // 来自别人的助力邀请，还未助力
    document.getElementById('countDownBtn').getElementsByClassName('image-help')[0].style.display = 'block'
    document.getElementById('countDownBtn').getElementsByClassName('image-get')[0].style.display = 'none'
    document.getElementById('countDownBtn').getElementsByClassName('image-start')[0].style.display = 'none'
    document.getElementById('countDownNotice').innerText ='助力好友，你也有机会领现金红包哦~'
    document.getElementById('countDown').style.display = 'none'
  } else if (baseInfo.hasOwnProperty('userId') && baseInfo.userId) { // 自己从易点药点进来的，但是还未发起活动（接口请求前的，请求后的可能就有了）
      document.getElementById('countDownBtn').getElementsByClassName('image-help')[0].style.display = 'none'
      document.getElementById('countDownBtn').getElementsByClassName('image-get')[0].style.display = 'none'
      document.getElementById('countDownBtn').getElementsByClassName('image-start')[0].style.display = 'block'
      document.getElementById('countDownNotice').innerText ='邀请好友，领取现金红包'
      document.getElementById('countDown').style.display = 'none'
  } else if (baseInfo.hasOwnProperty('pid') && baseInfo.pid && baseInfo.isHelp) { // 来自别人的助力邀请，已助力或助力失败
      document.getElementById('countDownBtn').getElementsByClassName('image-help')[0].style.display = 'none'
      document.getElementById('countDownBtn').getElementsByClassName('image-get')[0].style.display = 'block'
      document.getElementById('countDownBtn').getElementsByClassName('image-start')[0].style.display = 'none'
      document.getElementById('countDownNotice').innerText ='邀请好友，领取现金红包'
      document.getElementById('countDown').style.display = 'none'  
  } else {
      document.getElementById('countDownBtn').getElementsByClassName('image-help')[0].style.display = 'none'
      document.getElementById('countDownBtn').getElementsByClassName('image-get')[0].style.display = 'none'
      document.getElementById('countDownBtn').getElementsByClassName('image-start')[0].style.display = 'block'
      document.getElementById('countDownNotice').innerText ='邀请好友，领取现金红包'
      document.getElementById('countDown').style.display = 'none'  
  }
  if (baseInfo.platform === 'h5') {
    // document.getElementById('shareList').style.display = 'none'
    document.getElementById('posterH5Show').style.display = 'block'
  } else {
    // document.getElementById('shareList').style.display = 'block'
    // document.getElementById('posterDialog').getElementsByClassName('poster-content')[0].style.marginTop = '-150px'
    // document.getElementById('posterH5Show').style.display = 'none'
  }
}

// czc_是埋点
czc_pageShowPlat(baseInfo.hasOwnProperty('platform') ? baseInfo.platform : 'H5', baseInfo.isIos ? 'Ios' : 'Android')
// 邀好友赚现金点击
function requestActive () {
  czc_clickRequestFriend()
  if (!baseInfo.isLogin) {
    registerOrLogin()
    return
  }
    posterCreated()
}
// 助力好友
function toFriend () {
  if (!baseInfo.isLogin) {
    registerOrLogin()
  } else {
    toast('您已经是老用户了，助力失败')
  }
}
// 立即发起活动点击
function beginActive () {
  czc_clickRequest()
  if (!baseInfo.isLogin) {
    registerOrLogin()
    return
  }
  let hasRed = false
  for (const item of listRed) {
    if (item.status === 1) { // 还有未开启红包
      hasRed = true
    }
  }
  hasRed ? toast('您有未领取红包') : posterCreated()
}

// 提现
function getPriceNow () {
  if (baseInfo.hasOwnProperty('sid') &&baseInfo.sid) {
    location.href = 'https://h5t.edianyao.com/edy-activity-javaEvn/edy-redbags-pull/dist/#/Purse?sid=' + baseInfo.sid
  } else {
    // 登录
    registerOrLogin()
  }
  
}

// 注册红包再开
function openAgain (url) {
  location.reload()
}

pageScroll()
btnInit()






  
