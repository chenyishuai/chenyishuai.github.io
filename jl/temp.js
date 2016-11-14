/**
 * Created by Administrator on 2016/11/6.
 * 获取图片地址的临时js程序
 */
var fs = require('fs');
fs.readdir('./imgs',function (error,fileAry) {
    console.log(fileAry);
});