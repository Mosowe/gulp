/* 加密 */
function ksort (obj){ // sign签名串
    let md5 = hex_md5;
    let arr = [];
    let result = '';
    for (let key in obj) {
        arr.push(key);
    }
    arr.sort();
    for (let i in arr) {
        result += arr[i] + obj[arr[i]];
    }
    return md5(md5(result).toUpperCase()).toUpperCase();
};