/******************************/
/***********红包弹框区*********/
/******************************/

// 模拟注册
function register () {
  document.getElementById('registerDialog').classList.add('show-dialog')
}
// 点击注册红包弹框‘开’按钮
function openRed202010 () {
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
}


let thisRed = '' // 点击的当前红包，数字1开始
// 点击红包列表的待开红包
function clickOpen (type,index) {
  thisRed = index
  if (type === 'red') {
    document.getElementById('activeDialog').classList.add('show-dialog')
    document.getElementById('activeDialogWrapper').classList.add('show-red')
  } else {
    document.getElementById('ruleDialog').classList.add('show-dialog')
  }
}
// 点击红包弹框区的开按钮
function btnOpen () {
  document.getElementById('btnOpen').style.display = 'none'
  document.getElementById('bg-top').classList.add('opening')
  document.getElementById('bg-bottom').classList.add('opening')
  let t2 = setTimeout(() => {
    clearTimeout(t2);
    document.getElementById('result-content').classList.add('result-open')
    document.getElementById('close').style.display = 'block'
    apiOpened(thisRed)
  }, 300);
}
// 点击关闭
function closeDialog (type) {
  if (type === 'red') {
    document.getElementById('activeDialogWrapper').classList.remove('show-red')
    document.getElementById('activeDialogWrapper').classList.add('hide-red')
    let t = setTimeout(()=>{
      clearTimeout(t)
      document.getElementById('activeDialog').classList.remove('show-dialog')
      document.getElementById('activeDialogWrapper').classList.remove('hide-red')
      document.getElementById('close').style.display = 'none'
      document.getElementById('result-content').classList.remove('result-open')
      document.getElementById('btnOpen').style.display = 'block'
      document.getElementById('bg-top').classList.remove('opening')
      document.getElementById('bg-bottom').classList.remove('opening')
    },500)
  } else if (type === 'rule') {
    document.getElementById('ruleDialog').classList.remove('show-dialog')
  } else if (type === 'register') {
    document.getElementById('registerDialog').classList.remove('show-dialog')
  }
}
// 去钱包+去提现
function gotoWallet () {
  console.log(0)
}