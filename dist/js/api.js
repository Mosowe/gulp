/******************************/
/**********接口请求区**********/
/******************************/

// 红包列表数据
let listRed = [
  {
    top:'拆最高2元',
    bottom:'邀请2人可拆',
    content:'0.15', 
    isLastOver: false,
    num: 2,
    status:1,
  },
  {
    top:'拆最高2元',
    bottom:'邀请2人可拆',
    content:'0.15', 
    isLastOver: false,
    num: 7,
    status:0,
  },
]
setTimeout(()=>{
  redListReset(listRed)
},500)

// 开完红包
function apiOpened (index) {
  listRed[index - 1].status = 2
  redListReset(listRed)
}

/********* 红包列表数据处理 *********/
function redListReset (dataLists) {
  let divLists = document.getElementById('redContent').getElementsByClassName('list')[0]
  divLists.innerHTML = ''
  let html = ''
  let dataListsLen = dataLists.length
  let nowTaskIndex = -1
  let nowTaskPerson = 4
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
let page = 1
let isRefresh = false
let lists = [
  {
    avatar: 'https://ydystore.oss-cn-shenzhen.aliyuncs.com/hwfiles/HW-YDY-STORE-46251603105349856.png',
    mobile: '132****2678',
    nickname: '测试1',
    time: new Date().getTime()
  },
  {
    avatar: 'https://ydystore.oss-cn-shenzhen.aliyuncs.com/hwfiles/HW-YDY-STORE-46251603105349856.png',
    mobile: '132****2678',
    nickname: '测试2',
    time: new Date('2020/10/20').getTime()
  },
  {
    avatar: 'https://ydystore.oss-cn-shenzhen.aliyuncs.com/hwfiles/HW-YDY-STORE-46251603105349856.png',
    mobile: '132****2678',
    nickname: '测试3',
    time: new Date('2020/10/15').getTime()
  },

]
// 上拉加载
function onLoad () {
  setTimeout(()=>{
    getData()
  },2000)
}
// 下拉刷新(未使用)
function onRefresh () {
  isRefresh = true
  document.getElementById('requestList').innerHTML = ''
  setTimeout(()=>{
    getData()
  },2000)
}
// 数据获取
function getData () {
  let data = lists
  dataRenderer(data)
}
// 数据渲染
function dataRenderer (lists) {
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
  uploadStatusText('loaded')
  if (isRefresh) {
    refreshStatusText('refreshed')
  }
}


/***************规则数据*************** */
















// document.getElementById('send').onclick  =() =>  {
//   let data  = document.getElementById('file').files[0]
//   let file = new FormData()
//   file.append('file', data);
//   let params = {
//       url:'https://test.edianyao.com/micro/ydycommonh5/file/uploadImage',
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
//       url:'https://test.edianyao.com/micro/ydyuserh5/qywusers/getInfo/13277082678',
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
//       url:'https://test.edianyao.com/micro/ydyimh5/qywhelpinfo/lists',
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