var Twit = require('twit');
var express = require('express');
var path = require('path');

var app = express();
var router = express.Router();


app.set('port',80);

//app.use(express.static(path.join(__dirname, 'sotjs')));

var T = new Twit({
  consumer_key:         'ogJQ6157RdDrXQ2Re4ZItWzaG',
  consumer_secret:      'MJVavzuROzV9X7wbWE58pSbc1oG1PFywEAGdkLEuW8DUCBKaMC',
  access_token:         '2323180442-LvkxeJNBniBTeX0vDYQ77bQIMPOKA1euvaxYkIS',
  access_token_secret:  '1t73ENaypp9afIqRl74q03wxvjoOW4nXk16afpujSbbD2',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

//Log all connections to outpu
router.use(function (req,res,next) {
    console.log("/" + req.method + " | " + req.path + " | " + req.hostname + " | " + JSON.stringify(req.query) + " | " + req.ip);
    next();
});

router.get("/",function(req,res){res.sendFile(__dirname + "/sotjs/index.html");});
router.get('/user_tweets.get', function(req, res){
    console.log('/user_tweets.get');
    T.get('statuses/user_timeline', { screen_name: req.query.screen_name, count: req.query.count } , function(err, data) {
        console.log(req.query.screen_name);
        console.log(data);
        res.send(data);
    });
});
router.get("/js/p5.min.js",function(req,res){res.sendFile(__dirname + "/sotjs/js/p5.min.js");});
router.get("/js/main.js",function(req,res){res.sendFile(__dirname + "/sotjs/js/main.js");});
router.get("/js/jquery-3.1.0.min.js",function(req,res){res.sendFile(__dirname + "/sotjs/js/jquery-3.1.0.min.js");});
router.get("/js/main.js",function(req,res){res.sendFile(__dirname + "/sotjs/js/main.js");});
router.get("/js/domvas.js",function(req,res){res.sendFile(__dirname + "/sotjs/js/domvas.js");});
router.get("/css/twitter.css",function(req,res){res.sendFile(__dirname + "/sotjs/css/twitter.css");});

app.use("/",router);

app.listen(80,function(){
  console.log("Loading correctly @ port 80 ;)");
});
