
/*
                    SETTINGS
*/

var oWidth = 20; // Ocean Width (in ellpises)
var oHeight = 10; //Ocean Height (in ellipses)

var theta = 0.0; // stores the current angle of the wave
var amplitude = 9.0; //The height of the waves
var frequency = 0.2; //Not used but you could increase 'theta' by 'period/1000' to change the wave speed.  if you divide this by
var objectX = 0;
var objectY = 0;
var gradient = 155 / oHeight;
var xObjectLocation = 10; //Stores the y location (on the scope of oWidth) of the tweet
var yObjectLocation = 5; //Stores the y location (in the scope of the oHeight) of the tweet
var trumpPolls = 0.45;
var tweets = new Array(0);

/*
                    GLOBAL VARIABLES

*/
var canvas;  //stores the canvas pointer
var context;  //stores the context or st, it's how we reference the content on the canvas

var speed; //This stores the speed of the waves once calculated
var xSpacing;
var ySpacing;
var trumpX; //Stores the position of the text
var clintonX; //Stores the position of the

var image;

var scene = [];

//scene.insertObject(new Class(x,y,z,state,other,arguments));
//Should automatically put it in order
scene.insertObject = function(object){
    console.log(scene);
    for(var i in scene){
        if(lastZ){
            if(object.z>lastZ && scene[i]['z']>object.z){
                scene.splice(i, 0, object);
                return scene[i];
            } else {
                lastZ = scene[i]['z'];
            }
        } else {
            var lastZ = scene[i]['z'];
        }
    }
}

function setup() {
    frameRate(30);
    createCanvas(1920, 1080);
    background(20, 20, 20);
    xSpacing = width / oWidth; //'width' isn't initialised until AFTER createCavas so we can't put it at the top :
    ySpacing = height / oHeight / 2; //'height' isn't initialised until AFTER createCavas so we can't put it at the top :
    noStroke();
    fill(100, 100, 255);
    speed = (frequency * 1000) / 1000; //Divides period by ms
    trumpX = width / 4 * 2.2;
    clintonX = width / 80;
    //tweets[0] = new tweet("NULL", (1 - trumpPolls) / 2 * oWidth, oHeight / 2);
    //tweets[1] = new tweet("NULL", (1 + trumpPolls) / 2 * oWidth, oHeight / 2);
    tweets = getUserTimeline('realDonaldTrump', 10);
    sceneConstructor();
    function sceneConstructor(){
        scene.push(new candidateText(width / 4 * 2.2,0,1,0, 'TRUMP', 200,100,100));
        scene.push(new candidateText(width / 80 * 2.2,0,2,0, 'CLINTON', 100,100,200));
        for (var z = 0; z < oHeight; z++) {
            scene.push(new oceanRow(1,z*5,z*ySpacing,1));
            console.log('Creating a new ocean row at '+z*ySpacing);
        }
    }
    setTimeout(function(){
        /*console.log('set timeout 1000');
        var test = new TestBox(120,-100,10,null);
        scene.insertObject(test);
        console.log(scene);*/
        displayTweet(tweets[1]);
    },5000);
}

function draw() {
    background('#7FB2F0');
    translate(width * 0.025, height / 1.8); //The ocean is offset a really arbitrary ammount so it fits on the screen

    theta += speed;

    //This will render all objects in the scene[] array

    sceneObjectRender();
    function sceneObjectRender(){
        for(var i = 0; i < scene.length;i++){
            scene[i].render();
        }
    }

}

var oceanRow = function(x,y,z,state){
    //this.x = x;
    this.y = y;
    this.z = z;
    //this.state = state;
    this.render = function(){
        for(var x = 0; x < oWidth; x++){
            var zColour = z/ySpacing;
            if (x / oWidth > trumpPolls) {
                fill(100+gradient*zColour, gradient * zColour, gradient * zColour);
            } else {
                fill(gradient * zColour, gradient * zColour, 100 + gradient * zColour);
            }
            ellipse(x * xSpacing, sin(x + theta) * amplitude + z,
                170, 100);
        }
    }
}

var candidateText = function(x,y,z,state,textContent,r,g,b){
    this.x = x;
    this.y = y;
    this.z = z;
    this.state = state;
    this.textContent = textContent;
    this.r = r;
    this.g = g;
    this.b = b;
    this.render = function(){
        textSize(width / 10);
        fill(r,g,b);
        text(textContent, x, y);
        fill(color(r+20,g+20,b+20))
        text(textContent, x, y-10);
    }
}

var TestBox = function(x,y,z,state){
    this.x = x;
    this.y = y;
    this.z = z;
    this.state = state;
    this.render = function(){
        rect(x,y,x,y);
    }
}

var tweet = function(x,y,z,state,image){
    this.x = x;
    this.y = y;
    this.z = z;
    this.state = state;
    this.render = function(){
        console.log('rendering a square at ',x,y);
        rect(x,y, 20, 20);
    }
}
/*function renderTweets(tweetToRender){
    var tweetConstructor =
    "<div class='tweet-container timeline-Tweet  u-cf js-tweetIdInfo' >"
    +"<div class='timeline-Tweet-brand u-floatRight'><div class='Icon Icon--twitter ' aria-label='' title='' role='presentation'></div></div>"
    +"<div class='timeline-Tweet-author'>"
    +"<div class='TweetAuthor' data-scribe='component:author'>"
    +"<a class='TweetAuthor-link Identity u-linkBlend' data-scribe='element:user_link' href='https://twitter.com/TwitterDev' aria-label='TwitterDev (screen name: TwitterDev)'>"
    +"<span class='TweetAuthor-avatar Identity-avatar'>"
    +"<img class='Avatar' data-scribe='element:avatar' src='"+tweetToRender['user']['profile_image_url']+"'>"
    +"</span>"
    +"<span class='TweetAuthor-name Identity-name customisable-highlight' title='TwitterDev' data-scribe='element:name'>"+trumpTweet['user']['name']+"</span>"
    +"<span class='TweetAuthor-verifiedBadge' data-scribe='element:verified_badge'><div class='Icon Icon--verified ' aria-label='Verified Account' title='Verified Account' role='img'></div><b class='u-hiddenVisually'>✔</b></span>"
    +"<span class='TweetAuthor-screenName Identity-screenName' title='@TwitterDev' data-scribe='element:screen_name' dir='ltr'>@"+"</span>"
    +"</a>"
    +"</div>"
    +"</div>"
    +"<p class='timeline-Tweet-text' lang='en' dir='ltr'>";
    try {

    } catch (e) {

    }
    trumpTweetConstructor+="</p>"
    +"<div class='timeline-Tweet-metadata'>"
    +"<a href='https://twitter.com/TwitterDev/status/774337407692832769' class='timeline-Tweet-timestamp' data-scribe='element:mini_timestamp'>"
    +"<time class='dt-updated' datetime='2016-09-09T20:03:19+0000' pubdate='' title='Time posted: 09 Sep 2016, 20:03:19 (UTC)' aria-label='Posted on 09 Sep'> 09 Sep</time></a>"
    +"</div>"
    +"<ul class='timeline-Tweet-actions' data-scribe='component:actions' role='menu' aria-label='Tweet actions'>"
    +"<li class='timeline-Tweet-action'>"
    +"<a class='TweetAction TweetAction--heart web-intent' href='https://twitter.com/intent/like?tweet_id=774337407692832769' data-scribe='element:heart'><div class='Icon Icon--heart TweetAction-icon' aria-label='Like' title='Like' role='img'></div></a></li>"
    +"<li class='timeline-Tweet-action timeline-ShareMenu'>"
    +"<a class='TweetAction TweetAction--share js-showShareMenu' href='#' aria-haspopup='true' data-scribe='component:share'><div class='Icon Icon--share ' aria-label='Share Tweet' title='Share Tweet' role='img'></div></a>"
    +"<div class='timeline-ShareMenu-container'>"
    +"<div class='timeline-ShareMenu-caret'></div>"
    +"<h3 class='timeline-ShareMenu-title'>Share on</h3>"
    +"<ul role='menu'>"
    +"<li><a class='timeline-ShareMenu-option' href='https://twitter.com/intent/retweet?tweet_id=774337407692832769' role='menuitem' data-scribe='element:twitter'>Twitter</a></li>"
    +"<li><a class='timeline-ShareMenu-option' href='https://facebook.com/dialog/share?app_id=2231777543&amp;display=popup&amp;href=https%3A%2F%2Ftwitter.com%2FTwitterDev%2Fstatus%2F774337407692832769' role='menuitem' data-scribe='element:facebook'>Facebook</a></li>"
    +"<li><a class='timeline-ShareMenu-option' href='https://linkedin.com/shareArticle?mini=true&amp;url=https%3A%2F%2Ftwitter.com%2FTwitterDev%2Fstatus%2F774337407692832769' role='menuitem' data-scribe='element:linkedin'>LinkedIn</a></li>"
    +"<li><a class='timeline-ShareMenu-option' href='https://tumblr.com/widgets/share/tool?canonicalUrl=https%3A%2F%2Ftwitter.com%2FTwitterDev%2Fstatus%2F774337407692832769' role='menuitem' data-scribe='element:tumblr'>Tumblr</a></li>"
    +"</ul>"
    +"</div>"
    +"</li>"
    +"</ul>";
}*/

function getUserTimeline(screen_name, count) {
    var data = {
        screen_name: screen_name,
        count: count,
    }
    $.ajax({
        type: 'GET',
        url: "user_tweets.get",
        data: data,
        success: function(returnData) {
            obj = jQuery.parseJSON(JSON.stringify(returnData));
            var tweetArray;
            for (i in obj) {
                try {
                    var tweetText = obj[i]['retweeted_status']['text'];
                } catch (e) {
                    var tweetText = obj[i]['text'];
                }
                //console.log(tweetText);
                var img =
                "<div class='tweet-container timeline-Tweet  u-cf js-tweetIdInfo' data-tweet-id='774337407692832769' data-rendered-tweet-id='774337407692832769' data-scribe='component:tweet'>"
                +"<div class='timeline-Tweet-brand u-floatRight'><div class='Icon Icon--twitter ' aria-label='' title='' role='presentation'></div></div>"
                +"<div class='timeline-Tweet-author'>"
                +"<div class='TweetAuthor' data-scribe='component:author'>"
                +"<a class='TweetAuthor-link Identity u-linkBlend' data-scribe='element:user_link' href='https://twitter.com/TwitterDev' aria-label='TwitterDev (screen name: TwitterDev)'>"
                +"<span class='TweetAuthor-avatar Identity-avatar'>"
                +"<img class='Avatar' data-scribe='element:avatar' src='"+obj[i]['user']['profile_image_url']+"'>"
                +"</span>"
                +"<span class='TweetAuthor-name Identity-name customisable-highlight' title='TwitterDev' data-scribe='element:name'>"+obj[i]['user']['name']+"</span>"
                +"<span class='TweetAuthor-verifiedBadge' data-scribe='element:verified_badge'><div class='Icon Icon--verified ' aria-label='Verified Account' title='Verified Account' role='img'></div><b class='u-hiddenVisually'>✔</b></span>"
                +"<span class='TweetAuthor-screenName Identity-screenName' title='@TwitterDev' data-scribe='element:screen_name' dir='ltr'>@"+"</span>"
                +"</a>"
                +"</div>"
                +"</div>"
                +"<p class='timeline-Tweet-text' lang='en' dir='ltr'>"+tweetText+"</p>"
                +"<div class='timeline-Tweet-metadata'>"
                +"<a href='https://twitter.com/TwitterDev/status/774337407692832769' class='timeline-Tweet-timestamp' data-scribe='element:mini_timestamp'>"
                +"<time class='dt-updated' datetime='2016-09-09T20:03:19+0000' pubdate='' title='Time posted: 09 Sep 2016, 20:03:19 (UTC)' aria-label='Posted on 09 Sep'> 09 Sep</time></a>"
                +"</div>"
                +"<ul class='timeline-Tweet-actions' data-scribe='component:actions' role='menu' aria-label='Tweet actions'>"
                +"<li class='timeline-Tweet-action'>"
                +"<a class='TweetAction TweetAction--heart web-intent' href='https://twitter.com/intent/like?tweet_id=774337407692832769' data-scribe='element:heart'><div class='Icon Icon--heart TweetAction-icon' aria-label='Like' title='Like' role='img'></div></a></li>"
                +"<li class='timeline-Tweet-action timeline-ShareMenu'>"
                +"<a class='TweetAction TweetAction--share js-showShareMenu' href='#' aria-haspopup='true' data-scribe='component:share'><div class='Icon Icon--share ' aria-label='Share Tweet' title='Share Tweet' role='img'></div></a>"
                +"<div class='timeline-ShareMenu-container'>"
                +"<div class='timeline-ShareMenu-caret'></div>"
                +"<h3 class='timeline-ShareMenu-title'>Share on</h3>"
                +"<ul role='menu'>"
                +"<li><a class='timeline-ShareMenu-option' href='https://twitter.com/intent/retweet?tweet_id=774337407692832769' role='menuitem' data-scribe='element:twitter'>Twitter</a></li>"
                +"<li><a class='timeline-ShareMenu-option' href='https://facebook.com/dialog/share?app_id=2231777543&amp;display=popup&amp;href=https%3A%2F%2Ftwitter.com%2FTwitterDev%2Fstatus%2F774337407692832769' role='menuitem' data-scribe='element:facebook'>Facebook</a></li>"
                +"<li><a class='timeline-ShareMenu-option' href='https://linkedin.com/shareArticle?mini=true&amp;url=https%3A%2F%2Ftwitter.com%2FTwitterDev%2Fstatus%2F774337407692832769' role='menuitem' data-scribe='element:linkedin'>LinkedIn</a></li>"
                +"<li><a class='timeline-ShareMenu-option' href='https://tumblr.com/widgets/share/tool?canonicalUrl=https%3A%2F%2Ftwitter.com%2FTwitterDev%2Fstatus%2F774337407692832769' role='menuitem' data-scribe='element:tumblr'>Tumblr</a></li>"
                +"</ul>"
                +"</div>"
                +"</li>"
                +"</ul>";
                $('#trumpCache').append(img);
                var tweetObject={
                    tweet: $('tweet-'+i),
                    retweets: obj[i]['retweet_count'],
                }
                tweets.push(tweetObject);
            }
        console.log(tweets);
        return tweetArray;
        }
    });
}

function displayTweet(tweet,side){
    tweet.css('display', 'block');
    if(side==='left'){
        tweet.css('left','20%');
    } else {
        tweet.css('right','20%')
    }
}


/*This starts a timed loop which runs event loop every x microseconds
function setup(){
    setInterval(function(){
        eventLoop();
    }, <time for entire loop in microseconds> );
}

function eventLoop(){
    //This block controls timing of each thing
    function0(); //runs immediately, this would cleanup the scene + initiate the next scene
    setTimeout(function(){
        function1();
        setTimeout(function(){
            function2();
            //Time is going to be listed ascending instead of descending
        },<time as int in microseconds>);  //This is for function2();
    },<time as int in microseconds>); //This is for function1();
    //It's just how this function is layed out.
    function0(){
        state=0;
        ...
    }

    function1(){
        state = 1; // we have a global variable of the state of the event loop for gui;
        ...
    }

    function2(){
        state = 2;
        ...
    }
}*/
