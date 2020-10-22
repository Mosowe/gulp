/******************************/
/**********微信配置区**********/
/******************************/
const baseInfo = base()
const apiInfo = apis()
const wxEmpowerUrl = baseInfo.type !=='production' ? 'https://t.edianyao.com/wechat/code' : 'https://www.edianyao.com/wechat/code' // 微信授权调用PHP中转页---E点药/易点药
const shareUrl = location.href.split('?')[0] // 分享链接
const iosHref = location.href // 分享链接ios
const shareData = {
  title: '202010拉新的活动',
  desc: '邀好友，赚现金',
  link: shareUrl,
  shareImage: baseInfo.type !=='production' ? 'https://h5t.edianyao.com/active202010Test/images/202010active/index-top-bg.png' : 'https://h5t.edianyao.com/active202010/images/202010active/index-top-bg.png' //分享图片
}

// 获取授权
// function wxEmpower () {
//   if (location.href.indexOf('localhost') > -1 || location.href.indexOf('192.168.74.115') > -1) { // 测试环境不授权
//     return false;
//   } else {
//     // window.location.href = `https://www.edianyao.com/wechat/code?redirect=${url}/login`; // 生产环境的
//     redirect = encodeURIComponent(`${url}/login?${redirect}`);
//     window.location.href = `${wxUrl.wxEmpowerUrl}?redirect=${redirect}`; // 测试环境的
//   }
// }

// 配置微信jssdk
function configWxJssdk  (href) {
  if (!baseInfo.isWxBrowser) {
    return;
  }
  if (baseInfo.isIos) {
    href = iosHref;
  }
  let params = {
      url: baseInfo.apiUrl + apiInfo.wxJssdkConfig,
      method:'get',
      data: {
        url:href
      },
    }
  myAjax(params).then(data => {
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.data.appId, // 必填，公众号的唯一标识
      timestamp: parseInt(data.data.timestamp), // 必填，生成签名的时间戳
      nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
      signature: data.data.signature, // 必填，签名
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
        ], // 必填，需要使用的JS接口列表
    });
    wx.ready(() => {
      console.log('微信配置成功ok');
      // 分享朋友及QQ
      wx.updateAppMessageShareData({ 
        title: shareData.title, // 分享标题
        desc: shareData.desc, // 分享描述
        link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareData.shareImage, // 分享图标
        success: function () {
          // 设置成功
          console.log('分享朋友及QQ')
        },
        fail: function() {
          console.log('分享朋友及QQ失败')
        }
      });
      // 分享到朋友圈及QQ空间
      wx.updateTimelineShareData({ 
        title: shareData.title, // 分享标题
        link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareData.shareImage, // 分享图标
        success: function () {
          // 设置成功
          console.log('分享到朋友圈及QQ空间')
        },
        fail: function() {
          console.log('分享到朋友圈及QQ空间失败')
        }
      });  
      // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
      wx.hideMenuItems({
        menuList: [
          'menuItem:share:facebook', // 分享到facebook
          'menuItem:share:brand', // 分享到特殊公众号
          'menuItem:share:email' // 邮件
          ]
      });
    });
    wx.error((res) => {
      console.log('微信配置失败：', res);
    });

  }).catch(res=>{
    console.log('获取微信配置参数失败');
  })
};
configWxJssdk(shareUrl)

// 微信分享配置
/**
 * 微信详情分享配置-页面单独配置时，此项目在上方已配置
 * @params ：
 * @url 分享路由及参数
 * @shareImage 分享图标
 * @title 分享标题
 */
function wxReadyConfig (params = '') {
  if (!baseInfo.isWxBrowser) {
    return;
  }
  wx.ready(() => {
    // 分享朋友及QQ
    wx.updateAppMessageShareData({ 
      title: params ? params.title : '易点药', // 分享标题
      desc: params.desc ?params.desc :'吃药的事，一点就行', // 分享描述
      link: params ? params.url : link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params ? params.shareImage : shareImage, // 分享图标
      success: function () {
        // 设置成功
      }
    });
    // 分享到朋友圈及QQ空间
    wx.updateTimelineShareData({ 
      title: params ? params.title :'易点药', // 分享标题
      link: params ? params.url : link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: params ? params.shareImage : shareImage, // 分享图标
      success: function () {
        // 设置成功
      }
    });
  });
};

