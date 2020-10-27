/******************************/
/**********平台对接-分享配置区**********/
/**********app，H5，微信小程序**********/
/******************************/

// 微信小程序打开分享页
function wxappPosterCreated (params) {
  let params = qsStringify({
    background: params.miniBgImg,
    url: `${url}#/Index`,
    title: params.title,
    desc: params.content,
    hdImageData: params.miniThumb,
    poster: params.poster,
    id: baseInfo.aid
  });
  this.$wx.miniProgram.navigateTo({
    url: `/packageB/pages/share/common-share/common-share?${params}`
  });
}

//APP端打卡元素弹窗
function toPage (params) {
  let ua = navigator.userAgent;
  if (window.webkit && /iPhone|iPod|iPad/.test(ua)) {
    // ios
    window.webkit.messageHandlers.toPage.postMessage(params);
  } else if (window.android && /Android/.test(ua)) {
    // android
    window.android.toPage(JSON.stringify(params));
  }
}
function appPosterCreated (res) {
  let params = {
    tag: 'ydy_share_img',
    data: {
      bgUrl:res.poster,
      id: baseInfo.aid
    }
  };
  toPage(params)
}







// 分享微信
function shareWeChat () {

}
// 分享朋友圈
function shareFriend () {
  // let params = {
  // tag: 'ydy_share_wechatTimeline',
  //   data: {
  //     id: baseInfo.aid,
  //     title: params.title,
  //     subTitle: params.content,
  //     coverImg: params.thumb,
  //     url: params.url,
  //     scene: [0, 1]
  //   }
  // };
  // toPage (params)
}
// 下载海报
function shareDownload () {}
// 分享链接
function shareLink () {}