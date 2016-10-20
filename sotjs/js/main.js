
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
var majorities = [47.6,4,42.8];
var oceanMajorities;
var tweets = new Array(0);
var wonLastRound = 'trump'; //stores who won the previous round so that the ordering of tweets can change
/*
                    GLOBAL VARIABLES

*/
var tweetCount = 100; //keeps track of which tweet will be displayed on either side, also number of tweets to get from API
var trumpUserObject, hillaryUserObject;
var trumpTimeline,hillaryTimeline;
var trumpTweet, hillaryTweet;
var trumpDisplay, clintonDisplay; //stores the names of the candidate objects in global namespace;
var pollData;

var speed; //This stores the speed of the waves once calculated
var xSpacing;
var ySpacing;

var trumpImgArray = [];
var clintonImgArray = [];
var pop;
var waves;

var scene = [];



function setup() {
    var canvas = createCanvas(1920, 1080);
    canvas.parent('canvas-container'); //Places it in the right div in the page
    frameRate(30);
    background(20, 20, 20);
    noStroke();

    //load all necessary resources
    trumpImgArray = [loadImage('img/trump_default.jpg'),
                    loadImage('img/trump_frame_1.jpg'),
                    loadImage('img/trump_frame_2.jpg'),
                    loadImage('img/trump_frame_1.jpg'),
                    loadImage('img/trump_shock.jpg')];
    clintonImgArray = [loadImage('img/clinton_default.jpg')];

    pop = loadSound('sounds/pop.mp3');
    waves = loadSound('sounds/waves.wav');


    xSpacing = width / oWidth; //'width' isn't initialised until AFTER createCavas so we can't put it at the top :
    ySpacing = height / oHeight / 2; //'height' isn't initialised until AFTER createCavas so we can't put it at the top :
    speed = (frequency * 1000) / 1000; //Divides period by ms

    //Get all required data
    trumpTimeline = getUserTimeline('realDonaldTrump', tweetCount);
    hillaryTimeline = getUserTimeline('HillaryClinton', tweetCount);
    pollData = getPollData();
    trumpUserObject = getUserObject('realDonaldTrump');
    hillaryUserObject = getUserObject('HillaryClinton');
    tweetCount = 0; //resets tweet count so we can use it as an indexer


    //Check if all data has been received
    var checkTimeline = setInterval(function(){
        if(trumpTimeline.readyState==4&&hillaryTimeline.readyState==4&&pollData.readyState==4&&trumpUserObject.readyState==4&&hillaryUserObject.readyState==4){
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

    trumpUserObject = JSON.parse(trumpUserObject['responseText']);
    trumpTimeline = JSON.parse(trumpTimeline['responseText']);
    trumpTweet = displayTweet(trumpTimeline[0],'left');

    hillaryUserObject = JSON.parse(hillaryUserObject['responseText']);
    hillaryTimeline = JSON.parse(hillaryTimeline['responseText']);
    hillaryTweet = displayTweet(hillaryTimeline[0],'right');


    pollData = JSON.parse(pollData['responseText']);
    oceanMajorities =   [Math.round((pollData[53]['estimates'][0]['value'])/5),
                        Math.round((pollData[53]['estimates'][2]['value'])/5),
                        Math.round((pollData[53]['estimates'][1]['value'])/5)];
    majorities = [(pollData[53]['estimates'][0]['value']),
                  (pollData[53]['estimates'][2]['value']),
                  (pollData[53]['estimates'][1]['value'])];
    console.log("majorities:  "+majorities);

    waves.play();

    /*
     *  SCENE CONSTRUCTOR
     */
    scene.push(new candidateText(width / 4 * 2.2,0,1,0, 'TRUMP', 200,100,100));
    scene.push(new candidateText(width / 80 * 2.2,0,2,0, 'CLINTON', 100,100,200));
    for (var z = 0; z < oHeight; z++) {
        scene.push(new oceanRow(1,z*5,z*ySpacing,1));
        //console.log('Creating a new ocean row at '+z*ySpacing);
    }
    //creates the trump Oject and gives it the tweet and speech objects as children.
    trumpDisplay = insertObject(new candidateFigure(1400,-300,100,0,'conservative',trumpImgArray, trumpUserObject));
    trumpDisplay.tweet = displayTweet(trumpTimeline[0],'left');
    trumpDisplay.speech = insertObject(new speechBubble(1300,-400,120,1,'trump'));

    //creates the hillary object and gives it the tweet and sspeach objects as children
    clintonDisplay = insertObject(new candidateFigure(-100, -300, 100,0,'democratic', clintonImgArray, hillaryUserObject));
    clintonDisplay.tweet = displayTweet(hillaryTimeline[0],'right');
    clintonDisplay.speech = insertObject(new speechBubble(500,-400,120,1));

    console.log(scene);

    //creates the majority marker for all sides
    insertObject(new majorityMarker(0,0,10,0,'democrat',true));
    insertObject(new majorityMarker(0,0,10,0,'conservative',true));
    insertObject(new majorityMarker(0,0,10,0,'undecided',true));

    console.log(clintonDisplay);

    setInterval(function(){
        eventLoop();
    },10000);
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

    function displayTweets(){
        setTimeout(function(){
            if(wonLastRound=="trump"){
                jabber(trumpDisplay,clintonDisplay);
            } else {
                jabber(clintonDisplay,trumpDisplay)
            }
            setTimeout(function(){
                renderBubble();
            },1000);
        },1000);
        function jabber(candidate1,candidate2){
            gState.state = "jabber"
            candidate1.state = 2;
            setTimeout(function(){candidate1.speech.state = 1});
            setTimeout(function(){
                candidate1.state = 4;

            }, 5000);
        }
        function renderBubble(){
            gState.state = "jabber"
        }
    }

    function compareResponse(){

    }

    function decideWinner(){

    }

    function resetScene(){

    }

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
