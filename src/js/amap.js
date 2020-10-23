// <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=76f4f13469b0ca80578376ee5735885d"></script> 
function amap () {
      AMap.plugin('AMap.Geolocation', function () {
        let geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: true,
            // 设置定位超时时间，默认：无穷大
            timeout: 10000,
            // noIpLocate: 1, // ios11： 禁止ip定位
        });
        geolocation.getCurrentPosition(); // 浏览器精确定位
        AMap.event.addListener(geolocation, 'complete', onComplete);
        AMap.event.addListener(geolocation, 'error', onError);
        function onComplete (data) { 
            // data是具体的定位信息：开发环境中，默认是http，将不能使用浏览器精确定位
            console.log('定位成功信息：', data);
            
        }
        function onError (data) {
            // 定位出错：// 开发环境，高德浏览器精确定位需要https，但是在微信浏览器打不开，可以在手机浏览器软件打开并能获取精确的浏览器定位，在开发环境中，
            console.log('定位失败错误：', data);
            getLngLatLocation()
        }
    });
}    

// 城市定位：只能定位到城市，不能到区，加入逆地理编码，不能获取准确的位置信息，
// 因为经纬度（得到的是一个范围result.rectangle）处理后是城市中心点（本人设置）
const getLngLatLocation = () => {
    AMap.plugin('AMap.CitySearch', function () {
        let citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                // 查询成功，result即为当前所在城市信息
                console.log('通过ip获取当前城市：', result);
            }
        });
    });
};
getLngLatLocation()
// amap()