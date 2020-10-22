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
    // get请求，拼接参数在url后面 
    if (params.method && params.method.toLowerCase() === 'get' || !params.method) {
      let data = ''
      for (const key in params.data) {
        data ? data += `&${key}=${params.data[key]}` : data = `?${key}=${params.data[key]}`
      }
      params.url = params.url + data
    }
    
    request.open(
      params.method?params.method:'get',
      params.url,
      params.async ? params.async : true
    ); 
    /*********** 配置请求头 ************/
    /*********** setRequestHeader必须写在open和send中间  ************/

    request.setRequestHeader("accept", "application/json, text/plain, */*");
    // params附带其他请求头
    let hasContentType = false
    for (const key in params.headers) {
      request.setRequestHeader(key,params.headers[key]);
      if (key.toLowerCase() === 'content-type') {
        hasContentType = true
      }
    }
    // get请求
    if (params.method && params.method.toLowerCase() === 'get' || !params.method) {
      hasContentType ? '': request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    } else {
      if (!params.file) { // 非文件上传的其他请求
        hasContentType ? '': request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      }
    }
    /*********** end 配置请求头 ************/
    if (params.file) { // 文件数据
      request.send(params.file);
    } else{ // 一般数据
      request.send(JSON.stringify(params.data) || null);
    }
    

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