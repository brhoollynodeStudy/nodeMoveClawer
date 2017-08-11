//express_demo.js 文件
var express = require('express');
var fs = require('fs');
var app = express();

app.get('/', function (req, res) {
    fs.readFile('result.json', function (err, data) {
        if (err) {
            res.send({err: 500, msg: '服务器错误'})
        }else {
            res.send(JSON.parse(data))
        }
    })
})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})