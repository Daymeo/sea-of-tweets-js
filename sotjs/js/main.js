
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

function setup() {
    frameRate(30);
    createCanvas(1800, 900);
    background(20, 20, 20);
    xSpacing = width / oWidth; //'width' isn't initialised until AFTER createCavas so we can't put it at the top :
    ySpacing = height / oHeight / 2; //'height' isn't initialised until AFTER createCavas so we can't put it at the top :
    noStroke();
    fill(100, 100, 255);
    speed = (frequency * 1000) / 1000; //Divides period by ms
    trumpX = width / 4 * 2.2;
    clintonX = width / 80;
    tweets[0] = new tweet("NULL", (1 - trumpPolls) / 2 * oWidth, oHeight / 2);
    tweets[1] = new tweet("NULL", (1 + trumpPolls) / 2 * oWidth, oHeight / 2);
    drawTweets(getUserTimeline('realDonalTrump', 10));
}

function draw() {
    background('#7FB2F0');
    translate(width * 0.025, height / 1.8); //The ocean is offset a really arbitrary ammount so it fits on the screen

    textSize(width / 10);
    //Renders TRUMP background
    fill("#E44")
    text("TRUMP", trumpX, -10);
    fill("#F77")
    text("TRUMP", trumpX, -20);
    //Renders CLINTON background
    fill("#44E")
    text("CLINTON", clintonX, -10);
    fill("#77F")
    text("CLINTON", clintonX, -20);

    fill("#FFF");
    //stroke("#FFF");
    rect(width / 3, height / 3, 100, 100);
    ellipse(100, 100, 100, 100);

    theta += speed;
    for (var z = 0; z < oHeight; z++) {
        fill(gradient * z, gradient * z, 100 + gradient * z);

        if (round(yObjectLocation) == z) {
            fill(100, 100, 100);
            rect(xObjectLocation * xSpacing - 200, (sin(yObjectLocation /
                    oHeight +
                    theta) * amplitude + z * ySpacing) - 100, 400,
                100);
        }
        for (var x = 0; x < oWidth; x++) {

            //Changes colour of whater depending on what side it's on
            if (x / oWidth > trumpPolls) {
                fill(100 + gradient * z, gradient * z, gradient * z);
            } else {
                fill(gradient * z, gradient * z, 100 + gradient * z);
            }

            ellipse(x * xSpacing, sin(x + theta) * amplitude + z * ySpacing,
                100, 100);
        }
    }
}

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
            obj = JSON.parse(returnData);
            for (i in obj) {
                try {
                    var tweetText = obj[i]['retweeted_status']['text'];
                } catch (e) {
                    var tweetText = obj[i]['text'];
                }
                console.log(tweetText);
                var img =
                "<div id='tweet-"+i+"' class='tweet-container timeline-Tweet  u-cf js-tweetIdInfo' data-tweet-id='774337407692832769' data-rendered-tweet-id='774337407692832769' data-scribe='component:tweet'>"
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
            }

            canvas = $("#defaultCanvas0");
            context = canvas.getContext('2d');
            domvas.toImage($("#tweet-"+i), function() {
                context.drawImage(this, 20, 20);
            });

        }
    });
}

function drawTweets(tweetsObject) {
    $.each(tweetsObject, function(i, val) {
        $("#trumpCache").append(val.text);
    });
}

function convertTweetsToImages() {
    $("#twitter-widget-0").contents().find(
        ".timeline-TweetList-tweet customisable-border").each(
        function(
            i) {
            domtoimage.toPng(i).then(function() {
                console.log('creating PNGs');
                var img = new Image();
                //tweets[i] = img;
                document.body.appendChild(img);
            });
        });
}

var checkExist = setInterval(function() {
    if ($(".timeline-TweetList-tweet customisable-border").length >
        0) {
        console.log("It exists, converting tweets to images");
        convertTweetsToImages();
        clearInterval(checkExist);
    } else {
        // console.log("It doesn't exist, not converting tweets to images");
    }
}, 100); // check every 100ms

class tweet {
    constructor(img, xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
    }
    render(xSpacing, oHeight, theta, amplitude, k) {
        fill(100, 100, 100); //placeholder colour
        rect(this.xPos * xSpacing - 200, (sin(this.yPos / oHeight +
                theta) *
            amplitude + k * ySpacing) - 100, 400, 100);
        /*  This line is exactly the same as the way ellipses are rendered with a couple of differences.
        --> instead of using i and k (which basically are x and y coordinates in the ocean) it uses xObjectLocation and yObjectLocation
        --> at the end of the equation there is an offset of '-200' and '-100 so it's a little bit above the water
        I'll explain more in the second for loop
        */
        fill(gradient * k, gradient * k, 100 + gradient * k); //Sets the colour back to blue for the rest of the ocean
    }
}
