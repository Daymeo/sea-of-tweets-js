var Twit = require('twit');
var express = require('express');
var path = require('path');
var pollster = require('pollster');
var fs = require('fs');
var util = require('util');


var app = express();
var router = express.Router();


app.set('port',8080);

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
router.get('/user_tweets.json', function(req, res){
    console.log('/user_tweets.json');

    //if(req.get())

    fs.stat("cache/timeline_"+req.query.screen_name+".txt", function(err,stats){ //Gets the stats of the cached file
        if(stats!=undefined&&new Date().getHours()==stats.mtime.getHours()){
          fs.readFile("cache/timeline_"+req.query.screen_name+".txt", function(err, data){  //if so it reads the cached file
              console.log('Already have a cached user_timeline so Ill just send that');
              res.send(data);  //and sends to client
          });
        } else {
            T.get('statuses/user_timeline', { screen_name: req.query.screen_name, count: req.query.count } , function(err, data) {
                fs.writeFile("cache/timeline_"+req.query.screen_name+".txt", JSON.stringify(data), function(err) {
                    if(err){console.log(err);}
                    console.log('usertimeline does not exist or expired, got one from twitter and sending that');
                    res.send(data);
                });
            });
        }
    });
});
router.get('/poll_data.json', function(req, res){
    fs.stat("cache/2016-president.txt", function(err,stats){
        if(stats!=undefined&&new Date().getHours()==stats.mtime.getHours()){
          fs.readFile("cache/2016-president.txt", function(err,data){
              console.log('poll data is cached and upto date, serving that');
              res.send(data);
          });
        } else {
            pollster.charts({topic: '2016-president'}, function(resp){
                fs.writeFile("cache/2016-president.txt", JSON.stringify(resp), function(err) {
                });
                console.log('poll data is not cached or not up to date, getting from pollster and caching it  ');
                res.send(resp);
            });
        }

    });
});

router.get('/user_object.json', function(req,res){
  //console.log(req);
  fs.stat("cache/user_"+req.query.screen_name+".txt", function(err,stats){
      if(true /*stats!=undefined&&new Date().getHours()==stats.mtime.getHours()*/){
          fs.readFile("cache/user_"+req.query.screen_name+".txt", function(err,data){
              res.send(data);
          });
      } else {
        T.get('users/lookup', {screen_name: req.query.screen_name} , function (err,data){
          fs.writeFile("cache/user_"+req.query.screen_name+".txt",JSON.stringify(data), function (err){
          });
          res.send(data);
        });
      }
  });
});

//Libraries and Styling
router.get("/js/p5.min.js",function(req,res){res.sendFile(__dirname + "/sotjs/js/p5.min.js");});
router.get("/js/p5.sound.js",function(req,res){res.sendFile(__dirname + "/sotjs/js/p5.sound.js");});
router.get("/js/jquery-3.1.0.min.js",function(req,res){res.sendFile(__dirname + "/sotjs/js/jquery-3.1.0.min.js");});
router.get("/js/domvas.js",function(req,res){res.sendFile(__dirname + "/sotjs/js/domvas.js");});
router.get("/css/twitter.css",function(req,res){res.sendFile(__dirname + "/sotjs/css/twitter.css");});

// Our Code
router.get("/js/main.js",function(req,res){res.sendFile(__dirname + "/sotjs/js/main.js");});
router.get("/js/util_functions.js",function(req,res){res.sendFile(__dirname + "/sotjs/js/util_functions.js");});
router.get("/js/classes.js",function(req,res){res.sendFile(__dirname + "/sotjs/js/classes.js");});

//image request connection
router.get("/img/trump_default.jpg",function(req,res){res.sendFile(__dirname + "/sotjs/img/trump_default.jpg");});
router.get("/img/trump_frame_1.png",function(req,res){res.sendFile(__dirname + "/sotjs/img/trump_frame_1.png");});
router.get("/img/trump_frame_2.png",function(req,res){res.sendFile(__dirname + "/sotjs/img/trump_frame_2.png");});
router.get("/img/trump_frame_3.png",function(req,res){res.sendFile(__dirname + "/sotjs/img/trump_frame_3.png");});
router.get("/img/trump_shock.jpg",function(req,res){res.sendFile(__dirname + "/sotjs/img/trump_shock.jpg");});

router.get("/img/clinton_default.jpg",function(req,res){res.sendFile(__dirname + "/sotjs/img/clinton_default.jpg");});
router.get("/img/clinton_frame_1.png",function(req,res){res.sendFile(__dirname + "/sotjs/img/clinton_frame_1.png");});
router.get("/img/clinton_frame_2.png",function(req,res){res.sendFile(__dirname + "/sotjs/img/clinton_frame_2.png");});
router.get("/img/clinton_frame_3.png",function(req,res){res.sendFile(__dirname + "/sotjs/img/clinton_frame_3.png");});
router.get("/img/clinton_shock.jpg",function(req,res){res.sendFile(__dirname + "/sotjs/img/clinton_shock.jpg");});

router.get("/img/boat_hillary.png",function(req,res){res.sendFile(__dirname + "/sotjs/img/boat_hillary.png");});
router.get("/img/boat_trump.png",function(req,res){res.sendFile(__dirname + "/sotjs/img/boat_trump.png");});

router.get("/img/person.png", function(req,res){res.sendFile(__dirname+"/sotjs/img/person.png");});


// sound request connection
router.get("/sounds/pop.mp3",function(req,res){res.sendFile(__dirname + "/sotjs/sounds/pop.mp3");});
router.get("/sounds/waves.wav",function(req,res){res.sendFile(__dirname + "/sotjs/sounds/waves.wav");});

app.use("/",router);

app.listen(80,function(){
  console.log("Loading correctly @ port 8080 ;)");
});
