
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
var trumpTimeline,hillaryTimeline;
var trumpTweet, hillaryTweet;

var speed; //This stores the speed of the waves once calculated
var xSpacing;
var ySpacing;
var trumpX; //Stores the position of the text
var clintonX; //Stores the position of the

var image;

var scene = [];

//scene.insertObject(new Class(x,y,z,state,other,arguments));
//Should automatically put it in order
function insertObject(object){
    console.log(scene);
    /*scene.forEach(function(arrayItem)){
        if(object.z>lastZ && arrayItem.z>object.z){
            scene.splice(scene.indexOf(object.z), 0, object);
        }
    }*/
    lastZ = scene[0].z;
    for (var i = 1; i < Object.keys(scene).length; i++) {
        if (scene[i].hasOwnProperty(['z'])) {
            if(object.z>=lastZ && scene[i].z>=object.z){
                scene.splice(i, 0, object);
                console.log('match',object.z,lastZ, scene[i].z);
                console.log(scene);
                return;
            } else {
                console.log('No match',object.z,lastZ, scene[i].z);
                lastZ = scene[i].z;
            }
            console.log(scene[i]);
        }
    }
    /*for(var i in scene){
        if(lastZ){
            if(object.z>lastZ && scene[i].z>object.z){

            } else {
                lastZ = scene[i].z;
            }
        } else {
            var lastZ = scene[i].z;
        }
    }*/
}

function setup() {
    var canvas = createCanvas(1920, 1080);
    canvas.parent('canvas-container'); //Places it in the right div in the page
    frameRate(30);
    background(20, 20, 20);
    xSpacing = width / oWidth; //'width' isn't initialised until AFTER createCavas so we can't put it at the top :
    ySpacing = height / oHeight / 2; //'height' isn't initialised until AFTER createCavas so we can't put it at the top :
    noStroke();
    fill(100, 100, 255);
    speed = (frequency * 1000) / 1000; //Divides period by ms
    trumpX = width / 4 * 2.2;
    clintonX = width / 80;
    trumpTimeline = getUserTimeline('realDonaldTrump', 10);
    hillaryTimeline = getUserTimeline('HillaryClinton', 10);
    var checkTimeline = setInterval(function(){
        if(trumpTimeline.readyState==4&&hillaryTimeline.readyState==4){
            trumpTimeline = JSON.parse(trumpTimeline['responseText']);
            hillaryTimeline = JSON.parse(hillaryTimeline['responseText']);
            trumpTweet = displayTweet(trumpTimeline[0],'left');
            hillaryTweet = displayTweet(hillaryTimeline[0],'right');
        } else {
            //console.log(trumpTimeline);
        }
    },1000);

    sceneConstructor();
    function sceneConstructor(){
        scene.push(new candidateText(width / 4 * 2.2,0,1,0, 'TRUMP', 200,100,100));
        scene.push(new candidateText(width / 80 * 2.2,0,2,0, 'CLINTON', 100,100,200));
        for (var z = 0; z < oHeight; z++) {
            scene.push(new oceanRow(1,z*5,z*ySpacing,1));
            //console.log('Creating a new ocean row at '+z*ySpacing);
        }
    }
    setTimeout(function(){
        insertObject(new TestBox(300,-200,10));
    },1000)

    setTimeout(function(){
        trumpTweet.remove();
    },8000);
}

function draw() {
    background('#7FB2F0');
    translate(width * 0.025, height / 1.8); //The ocean is offset a really arbitrary ammount so it fits on the screen
    stroke(51);
    ellipse(100,100,50,50);
    noStroke();
    theta += speed;
    sceneObjectRender();
    function sceneObjectRender(){
        for(var i = 0; i < scene.length;i++){
            scene[i].render();
        }
    }

}
/**
 * [oceanRow description]
 * @param  int x     x position, automatically used by sceneConstructor
 * @param  int y     y position, automatically used by sceneConstructor
 * @param  int z     z position, automatically used by sceneConstructor
 * @param  int state not used currently
 * @return void
 */
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
            ellipse(x * xSpacing, sin(x + theta) * amplitude + z, 170, 100);
        }
    }
}

/**
 * [candidateText description]
 * @param  int x           position
 * @param  int y           position
 * @param  int z           position
 * @param  int state       to add conditions i.e. if we set state to 1 we can make the text flash or st
 * @param  string textContent what we'd like the text to say
 * @param  int r           colours
 * @param  int g           colours
 * @param  int b           colours
 * @return void
 */
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
        console.log('rendering textbox');
        color(255,255,255);
        rect(x,y,100,300);
    }
}

/**
 * Gets the most recent tweets of a twitter account
 * @param  string screen_name enter the unique screen_name i.e @realDonaldTrump
 * @param  int count       number of tweets you want
 * @return array             An array of all the data twitter returns, notably the tweet text, profile image url and number of retweets.
 */
function getUserTimeline(screen_name, count) {
    return $.ajax({
        type: 'GET',
        url: "user_tweets.get",
        data: {
            screen_name: screen_name,
            count: count,
        },
        success: function(returnData) {
            obj = jQuery.parseJSON(JSON.stringify(returnData));
            console.log(screen_name+'timeline got');
        }
    });

}
/**
 * Displays a tweet on the left or right side of the screen
 * @param  object tweet this is the tweet object from the array of getUserTimeline(), i.e. userTimeline[0] will render first tweet
 * @param  string side  'left' or 'right' hardcoded to fit in the speach bubbles
 * @return object       returns an object (variable) of the tweet.  This lets us do var trumpTweet=(userTimeline[0], 'left'); and then trumpTweet.remove(); to delete it from the scene.
 */
function displayTweet(tweet,side){
    console.log('displaying tweet', tweet);
    if(side==='left'){
        var tweetObject = $('<div id="trump-tweet"></div>');
    } else {
        var tweetObject = $('<div id="hillary-tweet"></div>');
    }
    var domTweet =
    "<div class='tweet-container timeline-Tweet  u-cf js-tweetIdInfo' data-tweet-id='774337407692832769' data-rendered-tweet-id='774337407692832769' data-scribe='component:tweet'>"
    +"<div class='timeline-Tweet-brand u-floatRight'><div class='Icon Icon--twitter ' aria-label='' title='' role='presentation'></div></div>"
    +"<div class='timeline-Tweet-author'>"
    +"<div class='TweetAuthor' data-scribe='component:author'>"
    +"<a class='TweetAuthor-link Identity u-linkBlend' data-scribe='element:user_link' href='https://twitter.com/TwitterDev' aria-label='TwitterDev (screen name: TwitterDev)'>"
    +"<span class='TweetAuthor-avatar Identity-avatar'>"
    +"<img class='Avatar' data-scribe='element:avatar' src='"+tweet['user']['profile_image_url']+"'>"
    +"</span>"
    +"<span class='TweetAuthor-name Identity-name customisable-highlight' title='TwitterDev' data-scribe='element:name'>"+tweet['user']['name']+"</span>"
    +"<span class='TweetAuthor-verifiedBadge' data-scribe='element:verified_badge'><div class='Icon Icon--verified ' aria-label='Verified Account' title='Verified Account' role='img'></div><b class='u-hiddenVisually'>✔</b></span>"
    +"<span class='TweetAuthor-screenName Identity-screenName' title='@TwitterDev' data-scribe='element:screen_name' dir='ltr'>@"+"</span>"
    +"</a>"
    +"</div>"
    +"</div>"
    +"<p class='timeline-Tweet-text' lang='en' dir='ltr'>";
    try {
        domTweet+=tweet['retweeted_status']['text'];
    } catch (e) {
        domTweet+=tweet['text'];
    }
    domTweet+="</p>"
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
    tweetObject.append(domTweet).appendTo('body');
    tweetObject.fadeIn(100);
    return tweetObject;
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
