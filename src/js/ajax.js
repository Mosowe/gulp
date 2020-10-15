function myAjax (params) {
  return new Promise((resolve, reject) => {
    if (!params.url) {
      console.log('url不能为空')
    }
    let request = null; 
    if(window.XMLHttpRequest){ 
      request=new XMLHttpRequest();
    }else{
      request=new ActiveXObject("Microsoft.XMLHTTP");
    }

    request.open(
      params.method?params.method:'get',
      params.url,
      params.async ? params.async : true
    ); 
    for (const key in params.headers) {
      request.setRequestHeader(key,params.headers[key]);  //必须写在open和send中间 
    }
    request.send();
    request.onreadystatechange = () => {
      if(request.readyState === 4){
        if(request.status === 200){
          resolve(JSON.parse(request.responseText));
        } else{
          reject(JSON.parse(request.responseText));
        }
      }
    }
  })
}