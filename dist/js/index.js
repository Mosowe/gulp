/******************************/
/********活动页js功能区**********/
/******************************/
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
      if (loading) {
        return
      }
      if (refresh) {
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
  document.getElementById('style').innerHTML =style
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
function timeDown () {
  let time = 3
  let t = setInterval(()=>{
    if (time > 0) {
      time --
      let D = Math.floor(time / (24*60*60))
      let H = Math.floor((time % (24*60*60)) / (60*60))
      let M = Math.floor((time % (24*60*60)) % (60*60) / 60)
      let S = Math.floor((time % (24*60*60)) % (60*60) % 60)
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
      document.getElementById('countDownBtn').getElementsByClassName('image-help')[0].style.display = 'none'
      document.getElementById('countDownBtn').getElementsByClassName('image-get')[0].style.display = 'none'
      document.getElementById('countDownBtn').getElementsByClassName('image-start')[0].style.display = 'block'
    }
  },1000)
}


czc_pageShowPlat(base().hasOwnProperty('platform') ? base().platform : 'H5', base().isIos ? 'Ios' : 'Android')
// 邀好友赚现金点击
function requestActive () {
  czc_clickRequestFriend()
}
// 助力好友
function toFriend () {}
// 立即发起活动点击
function beginActive () {
  czc_clickRequest()
}



pageScroll()
swiper()
timeDown()







  
