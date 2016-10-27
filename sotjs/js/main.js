
/*
~~~~~~~~~~~~~~~~~~SETTINGS~~~~~~~~~~~~~~~``
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
var hostname = 'localhost'; //TODO: Add VPS ip so it runs on the VPS
/*
~~~~~~~~~~~~~~~~GLOBAL VARIABLES~~~~~~~~~~~~~~~~~~~~~``
*/

//Global OBJECTS (to render)
var boatManager;
var trumpBallon, clintonBalloon;
var trumpTweet, clintonTweet;
var trumpDisplay, clintonDisplay; //stores the names of the candidate objects in global namespace;

//Global DATA OBJECTS (to get information from, just console.log(pollData); to explore them)
var pollData;
var trumpUserObject, clintonUserObject;
var trumpTimeline, clintonTimeline;
var tweets = new Array(0);

//Global VARIABLES (to refer to)
var tweetCount = 100; //keeps track of which tweet will be displayed on either side, also number of tweets to get from API
var speed; //This stores the speed of the waves once calculated
var xSpacing;
var ySpacing;
var majorities; // used to render where the markers show up, set to 477
var oceanMajorities;  //this is just the 'majorities' variable mapped to oWidth (ocean width) so the ocean can be calculated faster
var wonLastRound = 'clinton'; //stores who won the previous round so that the ordering of tweets can change

//Global LISTS (to itterate through)
var trumpImgArray = [];
var clintonImgArray = [];
var scene = [];

//Global MEDIA (to display/play)
var pop; // mp3 of the pop sound when the tweets are displayed
var waves;  //wave sound in bacckground

function setup() {
    var canvas = createCanvas(1920, 1080);
    canvas.parent('canvas-container'); //Places it in the right div in the page
    frameRate(30);
    background(20, 20, 20);
    noStroke();

    //load all necessary resources
    trumpImgArray = [loadImage('img/trump_default.jpg'),
                    loadImage('img/trump_frame_1.png'),
                    loadImage('img/trump_frame_3.png'),
                    loadImage('img/trump_frame_2.png'),
                    loadImage('img/trump_shock.jpg')];
    clintonImgArray = [loadImage('img/clinton_default.jpg')];

    pop = loadSound('sounds/pop.mp3');
    waves = loadSound('sounds/waves.wav');


    xSpacing = width / oWidth; //'width' isn't initialised until AFTER createCavas so we can't put it at the top :
    ySpacing = height / oHeight / 2; //'height' isn't initialised until AFTER createCavas so we can't put it at the top :
    speed = (frequency * 1000) / 1000; //Divides period by ms

    //Get all required data
    trumpTimeline = getUserTimeline('realDonaldTrump', tweetCount);
    clintonTimeline = getUserTimeline('HillaryClinton', tweetCount);
    pollData = getPollData();
    trumpUserObject = getUserObject('realDonaldTrump');
    clintonUserObject = getUserObject('HillaryClinton');
    tweetCount = 0; //resets tweet count so we can use it as an indexer


    //Check if all data has been received
    var checkTimeline = setInterval(function(){
        if(trumpTimeline.readyState==4&&clintonTimeline.readyState==4&&pollData.readyState==4&&trumpUserObject.readyState==4&&clintonUserObject.readyState==4){
            initializeScene();
            clearInterval(checkTimeline);
        }
    },1000);
}
/**
 * This will only run once all necessary data has been received.
 * This builds scene and starts the event loop.
 * @return {[type]} [description]
 */
function initializeScene(){
    tweetCount = 0;

    trumpUserObject = JSON.parse(trumpUserObject.responseText);
    trumpTimeline = JSON.parse(trumpTimeline.responseText);

    clintonUserObject = JSON.parse(clintonUserObject.responseText);
    clintonTimeline = JSON.parse(clintonTimeline.responseText);
    clintonTweet = displayTweet(clintonTimeline[0],'right');


    pollData = JSON.parse(pollData.responseText);
    oceanMajorities =   [Math.round((pollData[53].estimates[0].value)/5),
                        Math.round((pollData[53].estimates[2].value)/5),
                        Math.round((pollData[53].estimates[1].value)/5)];
    majorities = [(pollData[53].estimates[0].value),
                  (pollData[53].estimates[2].value),
                  (pollData[53].estimates[1].value)];
    console.log("majorities:  "+majorities);
    waves.play();

    /*
     *  SCENE CONSTRUCTOR
     */
    scene.push(new CandidateText(width / 4 * 2.2,0,1,0, 'TRUMP', 200,100,100));
    scene.push(new CandidateText(width / 80 * 2.2,0,2,0, 'CLINTON', 100,100,200));
    //scene.push(new Boat(new Boat(1000,300,6000,0,'conservative')));
    for (var z = 0; z < oHeight; z++) {
        scene.push(new OceanRow(1,z*5,z*ySpacing,1));
        //console.log('Creating a new ocean row at '+z*ySpacing);
    }
    //creates the trump Oject and gives it the tweet and speech objects as children.
    trumpDisplay = insertObject(new CandidateFigure(1400,-300,100,0,'conservative',trumpImgArray, trumpUserObject));
    trumpDisplay.tweet = displayTweet(trumpTimeline[0],'left');
    trumpDisplay.speech = insertObject(new SpeechBubble(1300,-400,120,0,'conservative'));

    //creates the clinton object and gives it the tweet and sspeach objects as children
    clintonDisplay = insertObject(new CandidateFigure(-100, -300, 100,0,'democratic', clintonImgArray, clintonUserObject));
    clintonDisplay.tweet = displayTweet(clintonTimeline[0],'right');
    clintonDisplay.speech = insertObject(new SpeechBubble(500,-400,120,0));
    //insertObject(new Boat(1000,0,300,0,'conservative'));
    boatManager = insertObject(new BoatManager(0,0,0,0,trumpUserObject[0].followers_count, clintonUserObject[0].followers_count));

    trumpBalloon = insertObject(new Balloon(width/1.5, -800, 400, 0,'conservative'));
    clintonBaloon = insertObject(new Balloon(width/0.5, -800, 400, 0, 'democratic'));
    trumpDisplay.tweet.hide();
    clintonDisplay.tweet.hide();

    //console.log(boatTest);
    console.log(scene);

    //creates the majority marker for all sides
    insertObject(new MajorityMarker(0,0,10,0,'democrat',true));
    insertObject(new MajorityMarker(0,0,10,0,'conservative',true));
    insertObject(new MajorityMarker(0,0,10,0,'undecided',true));

    //Do this last because it relies on the scene array not being deleted after;
    boatManager.generateBoats();

    console.log(clintonDisplay);

    setInterval(function(){
        eventLoop();
    },15000);
}

function eventLoop(){
    setTimeout(function(){
        displayTweets();
        setTimeout(function(){
            compareResponse();
            setTimeout(function(){
                decideWinner();
                setTimeout(function(){
                    resetScene();
                });
            },1000);
        },1000);
    },1000);
}

function displayTweets(){
  if(wonLastRound=="clinton"){
    trumpDisplay.startJabber();
    setTimeout(function(){
      trumpDisplay.speech.grow(trumpDisplay.tweet);
    setTimeout(function(){
      trumpDisplay.stopJabber();
      boatManager.trumpSupport(trumpUserObject[0].followers_count);
    setTimeout(function(){
      trumpBalloon.countScore(boatManager.trumpBoats);
    setTimeout(function(){
      trumpDisplay.speech.shrink(trumpDisplay.tweet);
    },1000);
  },1000); //stop talking --> balloon starts raising
  },1000); //tweet being displayed --> stop talking and boats showing support
},100); //start talking --> display speechbubble
  } else {
    clintonDisplay.startJabber();
    setTimeout(function(){
      clintonDisplay.speech.state=1;
    setTimeout(function(){
      clintonDisplay.tweet.show();
    setTimeout(function(){
      clintonDisplay.stopJabber();
      boatManager.clintonSupport(clintonUserObject[0].followers_count);
    setTimeout(function(){

    },100);
    },2000); //show's the support for the tweet
    },1000); // makes trump display the tweet
    },2000); //Makes the speech bubble show
  }
}
function renderBubble(){
    trumpTweet = displayTweet(trumpTimeline[tweetCount],'left');
}

function compareResponse(){

}

function decideWinner(){

}

function resetScene(){

}

function draw() {
    background('#7FB2F0');
    translate(width * 0.025, height / 1.8); //The ocean is offset a really arbitrary ammount so it fits on the screen
    theta += speed;
    sceneObjectRender();
    function sceneObjectRender(){
        for(var i = 0; i < scene.length;i++){
            scene[i].render();
        }
    }
}
