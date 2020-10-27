/******************************/
/**********接口请求区**********/
/******************************/

// 规则
function getRedRule () {
  let params = {
      url:baseInfo.apiUrl + apis.redProtocol,
      method:'post',
      data: {
        platform:'h5',
        redpackId: baseInfo.aid
      },
      headers:{
        "ydyversion":baseInfo.version
      }
    }
  myAjax(params).then(res => {
      document.getElementById('ruleText').innerHTML = res.data
    }).catch(res=>{
      console.log(res)
    })  
}
getRedRule()

// 轮播
function getBroadcast () {
  let params = {
      url:baseInfo.apiUrl + apis.broadcast,
      method:'post',
      data: {
        platform:'h5'
      },
      headers:{
        "ydyversion":baseInfo.version
      }
    }
  myAjax(params).then(res => {
    let swiperHtml = document.getElementById('swiper').getElementsByClassName('lists')[0]
    let html = ''
    for (const item of res.data.lst) {
      let itemData = `
        <div class="item">
          <div class="avatar">
            <img src="${item.avatar}">
          </div>
          <div class="text">${item.info}</div>
        </div>
      `
      html += itemData
    }
    swiperHtml.innerHTML = html
    swiper()
  }).catch(res=>{
    console.log(res)
  })  
}
getBroadcast()


// 页码
let page = 1
// 红包列表数据
let listRed = []
// 拉新用户数据列表
let userList = [] // 邀请人列表
let userIsEmpty = false // 邀请人数是否为空
let nowTaskPerson = 0 // 已邀请人数
let finished = false // 邀请人数已加载完
let isCountDown = false // 发起活动是否有结束时间

// 获取红包详情
function getRedDetail () {
  // 页码
  page = 1
  // 红包列表数据
  listRed = []
  // 拉新用户数据列表
  userList = [] // 邀请人列表
  userIsEmpty = false // 邀请人数是否为空
  nowTaskPerson = 0 // 已邀请人数
  finished = false // 邀请人数已加载完
  isCountDown = false // 发起活动是否有结束时间
  document.getElementById('requestList').innerHTML = ''

  let params = {
      url:baseInfo.apiUrl + apis.redDetail,
      method:'post',
      data: {
        platform:'h5'
      },
      headers:{
        "ydyversion":baseInfo.version
      }
    }
  // if (baseInfo.hasOwnProperty('pid') && baseInfo.pid) { // 有用户id，这个pid是别人的
  //   params.data.userId = baseInfo.pid
  // }
  if (baseInfo.isHelp || baseInfo.isLogin) { // 给别人助力后或者自己从易点药进来，自己也要邀请人助力，这个时候是有pid的，但是userId传登陆后的用户的
    params.data.userId = baseInfo.userId
  }
  if (baseInfo.hasOwnProperty('aid') && baseInfo.aid) { // 有红包活动id
    params.data.redpackId = baseInfo.aid
  }
  myAjax(params).then(res => {
    if (res.code !== 0) { // 接口失败啥的
      toast(res.msg)
      loadingPage(false)
      document.getElementById('requestListNum').style.display = 'none'
      document.getElementById('requestListEmpty').style.display = 'block'
      document.getElementById('upNotice').style.display = 'none'
      document.getElementById('myPrice').style.display = 'none'
      document.getElementById('swiper').style.display = 'none'
      document.getElementById('time-btn-content').style.display = 'none'
      return
    }
    baseInfo.aid = res.data.redpackId
    sessionStorage.setItem('baseInfo', JSON.stringify(baseInfo))
    // res.data.status = 2
    // 红包列表数据处理
    for (const item of res.data.inviteRules) {
      let obj = {
        id: item.id,
        top:item.amountMsg,
        bottom:item.invateNumMsg,
        content:item.amount, 
        num: item.invateNum,
        status:item.status,
      }
      listRed.push(obj)
    }
    // 拉新用户数据格式化处理
    if (res.data.spreadLst && res.data.spreadLst.list && res.data.spreadLst.list.length > 0) {
      for (const item of res.data.spreadLst.list) {
        let obj = {
            avatar: item.avatar,
            mobile: item.mobile,
            nickname: item.name,
            time: new Date().getTime()
          }
        userList.push(obj)
      }
      if (res.data.spreadLst.list.length === res.data.spreadLst.totalCount) {
        uploadStatusText('finished')
        finished = true
      }
    } else {
      uploadStatusText('finished')
      userIsEmpty = true
      finished = true
    }

    nowTaskPerson = res.data.spreadLst ? res.data.spreadLst.totalCount : 0
    pageDataHandle(res.data)
    redListReset(listRed)
    friendDataRenderer(userList)
    configWxJssdk(location.href.split('?')[0])
  }).catch(res=>{
    loadingPage(false)
    console.log(res)
  })  
}
getRedDetail()


// 页面相关布局处理
function pageDataHandle (data) {
  document.title = data.title // 设置标题
  // 红包活动状态
  if (data.status === 0) { // 未开始
    toast('活动还未开始')
    document.getElementById('swiper').style.display = 'none'
    document.getElementById('redContent').style.display = 'none'
    document.getElementById('countDown').style.display = 'none'
    document.getElementById('countDownBtn').style.display = 'none'
    document.getElementById('myPrice').style.display = 'none'
    document.getElementById('requestListNum').style.display = 'none'
    document.getElementById('countDownNotice').style.display = 'block'
    document.getElementById('countDownNotice').innerText = '活动还未开始'
  } else if (data.status === 1) { // 进行中
    // 钱包
    let priceInfo = `
          <div class="price">
            <span class="text">待提现</span>
            <span class="icon">¥</span>
            <span class="num">${data.toCashNum}</span>
          </div>
          <div class="notice">活动累计收益${data.totalAmount}元></div>
          <div class="btn" onclick="getPriceNow()">立即提现</div>`
    document.getElementById('myPrice').innerHTML = priceInfo
    // 邀请人数
    if (data.spreadLst && data.spreadLst.totalCount) {
      document.getElementById('requestListNum').innerHTML = `成功邀请${data.spreadLst.totalCount}人`
    } else {
      document.getElementById('requestListNum').style.display = 'none'
    }

  } else { // 已结束
    toast(data.finishWord)
    document.getElementById('countDown').style.display = 'none'
    document.getElementById('countDownBtn').style.display = 'none'
    document.getElementById('countDownNotice').style.display = 'block'
    document.getElementById('countDownNotice').innerText = data.finishWord
    // 钱包
    let priceInfo = `
          <div class="price">
            <span class="text">待提现</span>
            <span class="icon">¥</span>
            <span class="num">${data.toCashNum}</span>
          </div>
          <div class="notice">活动累计收益${data.totalAmount}元></div>
          <div class="btn" onclick="getPriceNow()">立即提现</div>`
    document.getElementById('myPrice').innerHTML = priceInfo
    // 邀请人数
    if (data.spreadLst && data.spreadLst.totalCount) {
      document.getElementById('requestListNum').innerHTML = `成功邀请${data.spreadLst.totalCount}人`
    } else {
      document.getElementById('requestListNum').style.display = 'none'
    }
  }
  if (data.invite) { // 有发起活动
    data.invite.endTime = 1603987200
    document.getElementById('countDownBtn').getElementsByClassName('image-help')[0].style.display = 'none'
    document.getElementById('countDownBtn').getElementsByClassName('image-get')[0].style.display = 'block'
    document.getElementById('countDownBtn').getElementsByClassName('image-start')[0].style.display = 'none'
    document.getElementById('countDownNotice').innerText ='邀请好友，领取现金红包'
    document.getElementById('countDown').style.display = 'none'
    if (data.invite.endTime === 0) { // 没有结束时间
      isCountDown = false
    } else { // 有结束时间
      isCountDown = true
      timeDown(data.invite.endTime - Math.floor(new Date().getTime() / 1000))
    }
  }
}
// 开拉新红包
function apiOpened (index) {
  loadingPage(true)
  let params = {
      url:baseInfo.apiUrl + apis.openNewRed,
      method:'post',
      data: {
        platform:'h5',
        redpackId: baseInfo.aid,
        userId: baseInfo.userId,
        ruleId: listRed[index].id
      },
      headers:{
        "Authorization": baseInfo.sid,
        "ydyversion":"3.2.0"
      }
    }
  myAjax(params).then(res => {
    console.log(res)
    loadingPage(false)
    if (res.code === 0) {
      document.getElementById('result-content').innerHTML = `
            <div class="content">
              <div class="text">恭喜您获得</div>
              <div class="price">
                <span>￥</span>${res.data.amount}
              </div>
              <div class="notice">红包已存入“个人中心-我的钱包”</div>
              <div class="more-btns" onclick="closeDialog('red')">开心收下</div>
              <div class="get-now" onclick="gotoWallet()">立即提现></div>
            </div>`
      // listRed[index - 1].content = res.data.amount
      // listRed[index - 1].status = 2
      // redListReset(listRed)
      getRedDetail()
      document.getElementById('btnOpen').style.display = 'none'
      document.getElementById('bg-top').classList.add('opening')
      document.getElementById('bg-bottom').classList.add('opening')
      let t2 = setTimeout(() => {
        clearTimeout(t2);
        document.getElementById('result-content').classList.add('result-open')
        document.getElementById('close').style.display = 'block'
      }, 300);
    } else {
      toast('请求失败')
    }
  }).catch(res=>{
    loadingPage(false)
    console.log(res)
  }) 
}


/********* 红包列表数据处理 *********/
function redListReset (dataLists) {
  if (dataLists.length === 0) {
    loadingPage(false)
    return
  }
  let divLists = document.getElementById('redContent').getElementsByClassName('list')[0]
  divLists.innerHTML = ''
  let html = ''
  let dataListsLen = dataLists.length
  let nowTaskIndex = -1
  for (let i = 0; i < dataLists.length; i++) {
    let item = listRed[i]
    if (item.status > 0) {
      nowTaskIndex = i
    }
    let obj = `<div class="item">
          <div class="icon-red"></div>
          <div class="icon-line"></div>
          <div class="red-wrap  ${item.status === 1 ? 'wait' : item.status === 2 ? 'opened' : 'lockup'}"
             onclick="${item.status === 1 ? `clickOpen('red',${i+1})`: ''}"
          >
            ${item.status === 2 ? `
            <div class="text">恭喜您获得</div>
            <div class="price"><span>¥</span>${item.content}</div>
            <div class="notice">现金已存入<br>我的钱包</div>            
            ` : `
            <div class="text">${item.top}</div>
            <div class="limit">${item.bottom}</div>
            `}

          </div>
        </div> `
    html += obj
  }
  divLists.innerHTML = html
  let itemWidth = divLists.getElementsByClassName('item')[0].clientWidth
  let width = 0
  if (nowTaskPerson > 0) { // 有邀请人
    // 邀请多少人的提示语位置
    if (nowTaskIndex > -1) { // 有完成任务
      if (nowTaskIndex + 1 >= dataListsLen) { // 全部完成
        width = nowTaskPerson > dataLists[nowTaskIndex].num ? itemWidth * dataListsLen -10 : itemWidth * dataListsLen - itemWidth / 2 - 5
      } else {
        width = itemWidth / 2 - 5 + itemWidth * nowTaskIndex + itemWidth * (nowTaskPerson - dataLists[nowTaskIndex].num) / (dataLists[nowTaskIndex + 1].num - dataLists[nowTaskIndex].num)        
      }
    } else { // 一个任务都没有完成，但是有邀请人
      width = nowTaskPerson / dataLists[0].num * (itemWidth / 2 - 5)
    }
  }
  // 进度条位置

  html += `<div class="progress-content" id="progressContent">
          <div class="progress">
            <div class="active" style="width:${width}px;${nowTaskIndex + 1 >= dataListsLen ? 'border-radius: 50px': ''}"></div>
          </div>
          <div class="light-text" id="redLightText" style="display:${nowTaskPerson > 0 ? 'block' : 'none'};left:${width}px">
            <div class="text">已邀请${nowTaskPerson}人</div>
          </div>
        </div>`
  divLists.innerHTML = html
  loadingPage(false)
}

/*************邀请列表********** */
// 上拉加载
function onLoad () {
  if (userIsEmpty) {
    uploadStatusText('finished')
    return
  }
  page++
  getFriendData()
}

// 邀请列表数据渲染
function friendDataRenderer (lists) {
  if (lists.length === 0) { // 无邀请人
    userIsEmpty = true
    document.getElementById('upNotice').style.display = 'none'
    document.getElementById('requestList').style.display = 'none'
    document.getElementById('requestListEmpty').style.display = 'block'
    return
  }
  let listsHtml = document.getElementById('requestList').innerHTML
  let html = ''
  for (const item of lists) {
    item.time = checkDate(item.time)
    let listItem = `<div class="item">
          <div class="avatar">
            <img src="${item.avatar}" />
          </div>
          <div class="info">
            <div class="nickname">${item.nickname}</div>
            <div class="time">${item.time}</div>
          </div>
          <div class="mobile">${item.mobile}</div>
        </div>`
    html += listItem
  }
  listsHtml += html
  document.getElementById('requestList').innerHTML = listsHtml
  uploadStatusText(finished ? 'finished':'loaded')
}

// 上拉加载的
// 获取邀请人列表数据
// 因为红包详情有一页的邀请人数据，所以这里是从第二页开始
function getFriendData () {
  let params = {
      url:baseInfo.apiUrl + apis.userNewList,
      method:'post',
      data: {
        platform:'h5',
        redpackId: baseInfo.aid,
        userId: baseInfo.userId,
        current: page,
        appType: baseInfo.type !== 'production' ? 'y' : ''
      },
      headers:{
        "Authorization": baseInfo.sid,
        "ydyversion":"3.2.0"
      }
    }
  myAjax(params).then(res => {
    console.log(res)
    uploadStatusText('loaded')
    if (res.code === 0) {
      // 拉新用户数据格式化处理
      if (res.data.list  && res.data.list.length > 0) {
        for (const item of res.data.list) {
          let obj = {
              avatar: item.avatar,
              mobile: item.mobile,
              nickname: item.name,
              time: new Date().getTime()
            }
          userList.push(obj)
        }
        friendDataRenderer(userList)
      } else {
        uploadStatusText('finished')
        userIsEmpty = true
        finished = true
      }
    } else {
      uploadStatusText('loaded')
      toast('请求失败')
    }
  }).catch(res=>{
    uploadStatusText('loaded')
    console.log(res)
  }) 
}


// 分享海报生成
let posterImage = ''
function posterCreated() {
  if (posterImage && baseInfo.platform === 'h5') {
    document.getElementById('posterImg').setAttribute('src', posterImage)
    document.getElementById('posterDialog').classList.add('show-dialog')
    return
  }
  loadingPage(true)
  let params = {
      url:baseInfo.apiUrl + apis.shareRed,
      method:'post',
      data: {
        platform:'h5',
        redpackId: baseInfo.aid,
        userId: baseInfo.userId
      },
      headers:{
        "Authorization": baseInfo.sid,
        "ydyversion":"3.2.0"
      }
    }
  myAjax(params).then(res => {
    console.log(res)
    loadingPage(false)
    if (res.code === 0) {
      posterImage = res.data. poster
      getRedDetail()
      if (baseInfo.platform === 'h5') { // H5的
        document.getElementById('posterImg').setAttribute('src', posterImage)
        document.getElementById('posterDialog').classList.add('show-dialog')
      } else if (baseInfo.platform === 'wxapp') { // 小程序的
        wxappPosterCreated (res.data)
      } else { // app的
        appPosterCreated (res.data)
      }
    } else {
      toast('请求失败')
    }
  }).catch(res=>{
    loadingPage(false)
    console.log(res)
  }) 
}




// 发送短信
let isSendCode = false
let countTime = 120
function sendCode () {
  if (isSendCode) {
    return
  }
  if (!document.getElementById('userMobile').value.replace(/\s/g, '')) {
    toast('手机号不能为空')
    return
  }
  let params = {
    url:baseInfo.apiUrl + apis.sendCode,
    method:'post',
    data: {
      platform:'h5',
      mobile: document.getElementById('userMobile').value.replace(/\s/g, ''),
      type: 'qlogin'
    },
    headers:{
      "ydyversion":"3.2.0"
    }
  }
  myAjax(params).then(res => {
    console.log(res)
    toast(res.msg)
    if (res.data) {
      isSendCode = true
      let t = setInterval(() => {
        if (countTime > 0) {
          countTime--
          document.getElementById('codeSend').classList.add('gray')
          document.getElementById('codeSend').innerText = `${countTime}s后再次发送`
        } else {
          clearInterval(t)
          isSendCode = false
          document.getElementById('codeSend').className = 'code-send'
          document.getElementById('codeSend').innerText = '获取验证码'
        }
      }, 1000);
    }
  }).catch(res=>{
    console.log(res)
  }) 
}

// 快捷登录
function login () {
  if (!document.getElementById('userMobile').value.replace(/\s/g, '')) {
    toast('手机号不能为空')
    return
  }
  if (!document.getElementById('userCode').value.replace(/\s/g, '')) {
    toast('验证码不能为空')
    return
  }
  let data = {
    username: document.getElementById('userMobile').value.replace(/\s/g, ''),
    code: document.getElementById('userCode').value,
    loginType: 'qlogin',
    loginWhere: 'edianyao',
    city: baseInfo.city,
    province: baseInfo.province,
    activeId: baseInfo.aid
  };
  if (baseInfo.hasOwnProperty('pid') && baseInfo.pid) { // 有上级id
    data.pid=baseInfo.pid
  }
  let params = {
      url:baseInfo.apiUrl + apis.userQLogin,
      method:'post',
      data: {
        platform:'h5',
        ...data
      },
      headers:{
        "ydyversion":"3.2.0"
      }
    }
  myAjax(params).then(res => {
      console.log(res)
      document.getElementById('loginDialog').classList.remove('show-dialog')
      if (res.code === 0) {
        baseInfo.sid = res.data.token_type + res.data.access_token
        baseInfo.mobile = res.data.mobile
        baseInfo.userId = res.data.user_id
        baseInfo.isLogin = true
        baseInfo.isHelp = true
        sessionStorage.setItem('baseInfo', JSON.stringify(baseInfo))
        if (baseInfo.hasOwnProperty('pid') && baseInfo.pid) { // 是助力的才提示
          if (res.data.isNew) {
            toast('助力成功')
          } else {
            toast('您已经是老用户，助力失败')
          }
          let t = setTimeout(() => {
            clearTimeout(t)
            location.reload()
          }, 2000);
          return
        }
        location.reload()
      }
    }).catch(res=>{
      console.log(res)
    }) 
}

// 判断新用户注册弹框
function checkNewUser () {
  let params = {
    url:baseInfo.apiUrl + apis.indexDialog,
    method:'post',
    data: {
      platform:'h5',
    },
    headers:{
      "Authorization": baseInfo.sid,
      "ydyversion":"3.2.0"
    }
  }
  myAjax(params).then(res => {
    console.log(res)
    loadingPage(false)
    if (res.code === 0) {
      if (res.data && res.data.type === 4) { // 注册红包
        document.getElementById('registerDialog').classList.add('show-dialog')
        document.getElementById('bgBottomR').innerHTML = `
          <div class="text">已有${res.data.hadOpenCount}人领到红包</div>
          <div class="notice">每天可领${res.data.dayLimitCount}个红包，最高领${res.data.maxMoney}元</div>`
      }
    } else {
      toast('请求失败')
    }
  }).catch(res=>{
    loadingPage(false)
    console.log(res)
  }) 
}
checkNewUser()
// 开注册红包
function apiOpenedRegister () {
  loadingPage(true)
  let params = {
      url:baseInfo.apiUrl + apis.openNewRedDialog,
      method:'get',
      data: {
        platform:'h5'
      },
      headers:{
        "Authorization": baseInfo.sid,
        "ydyversion":"3.2.0"
      }
    }
  myAjax(params).then(res => {
    console.log(res)
    loadingPage(false)
    if (res.code === 0) {
      document.getElementById('resultContentR').innerHTML = `
        <div class="content">
            <div class="text">恭喜您获得</div>
            <div class="price">
              <span>￥</span>${res.data.packerMoney}
            </div>
            <div class="notice">红包已存入“个人中心-我的钱包”</div>
            <div class="more-btns" onclick="openAgain(${res.data.beginOpenUrl})">${res.data.beginOpenCount}</div>
            <div class="get-now" onclick="gotoWallet()">立即提现></div>
          </div>`


      let btnOpenR = document.getElementById('btnOpenR').classList
      let bgTopR = document.getElementById('bgTopR').classList
      let bgBottomR = document.getElementById('bgBottomR').classList
      btnOpenR.add('opening')
      let t = setTimeout(() => {
        clearTimeout(t);
        btnOpenR.remove('opening')
        btnOpenR.add('opened')
        bgTopR.add('opening')
        bgBottomR.add('opening')
        let t1 = setTimeout(() => {
          clearTimeout(t1);
          bgTopR.add('hidden')
          bgBottomR.add('hidden')
        }, 1000);
        let t2 = setTimeout(() => {
          clearTimeout(t2);
          document.getElementById('resultContentR').classList.add('result-open')
        }, 100);
      }, 1000);
    } else {
      toast('请求失败')
    }
  }).catch(res=>{
    loadingPage(false)
    console.log(res)
  }) 
}















// document.getElementById('send').onclick  =() =>  {
//   let data  = document.getElementById('file').files[0]
//   let file = new FormData()
//   file.append('file', data);
//   let params = {
//       url:baseInfo.apiUrl + apis.broadcast,,
//       method:'post',
//       file:file,
//       headers:{
//         "Authorization":"bearer ebd103ec-a8ab-44a8-9c2b-d91d09fcdc4f",
//         "ydyversion":"3.2.0"
//       }
//     }
//   myAjax(params).then(res => {
//       console.log(res)
//     }).catch(res=>{
//       console.log(res)
//     })      
// }
// document.getElementById('get').onclick  =() =>  {
//   let params = {
//       url:baseInfo.apiUrl + apis.broadcast,,
//       method:'get',
//       data: {
//         platform:'h5'
//       },
//       headers:{
//         "Authorization":"bearer ebd103ec-a8ab-44a8-9c2b-d91d09fcdc4f",
//         "ydyversion":"3.2.0"
//       }
//     }
//   myAjax(params).then(res => {
//       console.log(res)
//     }).catch(res=>{
//       console.log(res)
//     })      
// }
// document.getElementById('post').onclick  =() =>  {
//   let params = {
//       url:baseInfo.apiUrl + apis.broadcast,,
//       method:'post',
//       data: {
//         platform: 'h5'
//       }
//     }
//   myAjax(params).then(res => {
//       console.log(res)
//     }).catch(res=>{
//       console.log(res)
//     })      
// }
// document.getElementById('login').onclick = () => {
//   location.href='https://h5t.edianyao.com/testydyH5/Login?redirect='+location.href
// }