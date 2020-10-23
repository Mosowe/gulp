/** 
 * 友盟数据统计配置
 * 友盟代码引入在index.html文件中
*/
const _czc = window._czc;

/**
 * 页面曝光
 * @pageType 曝光平台：指手机系统类别安卓及ios
 *           来源平台：指是ios app还是安卓app或H5
 */
function czc_pageShowPlat (pageType,platform) {
  _czc.push(['_trackEvent', '页面曝光', '平台来源',platform +'-'+ pageType, '']);
};

// 立即邀请点击
function czc_clickRequest () {
  _czc.push(['_trackEvent', '立即邀请', '点击', '','']);
};
// 邀好友赚现金点击
function czc_clickRequestFriend () {
  console.log(0)
  _czc.push(['_trackEvent', '邀好友赚现金', '点击','','']);
};
