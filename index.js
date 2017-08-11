var Crawler = require("crawler");
var url = require('url')
var fs = require('fs');
var repUrls = []
var result = []
var c = new Crawler({
    maxConnections: 10,
    // proxy: 'http://xxx.com:8080',
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            var move = {}
            var moveTile = $(".bd3r .co_area2 .title_all h1").text()
            var moveCover = ""
            var moveGlice = []
            $(".bd3r .co_area2 .co_content8 #Zoom img").each(function (index, element) {
                var $element = $(element)
                if (index == 0) {
                    moveCover = $element.attr("src")
                } else {
                    moveGlice.push($element.attr("src"))
                }
            })
            var moveUlr = $(".bd3r .co_area2 .co_content8 #Zoom table tbody a").text()
            move.moveTitle = moveTile
            move.moveCover = moveCover
            move.moveGlice = moveGlice
            move.moveUrl = moveUlr
            //保存结果
            result.push(move)
        }
        done();
    }
});

//Emitted when queue is empty.
c.on('drain', function () {
    // For example, release a connection to database.
    // console.log(result)
    /*保存为json文件*/
    fs.writeFile('result.json', JSON.stringify(result), function (err) {
        if (err) throw err;
        console.log('The file has been saved!');
    })
})

// Queue just one URL, with default callback
c.queue({
    uri: 'http://www.dytt8.net/',
    callback: function (error, res, done) {//自己也是可以有回调的
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            $(".bd3r .bd3rl .co_area2 a").each(function (index, element) {
                var $element = $(element)
                if ($element.attr("href").match('/html/\\w{4}/\\w{4}/\\d{1,8}/\\d{1,5}\.html')) {
                    var urlstr = url.resolve('http://www.dytt8.net/', $element.attr("href"))
                    /*初始种子url提取*/
                    repUrls.push(urlstr)
                }
            })
            c.queue(repUrls)
        }
        done();
        console.log("种子链接准备ok")
    }
});

/*todo 可以多搞几个种子*/
