var MajorityMarker = function(x,y,z,state,party,textOnLeft){if(this.x===undefined){
    this.y = y;
    this.z = z;
    this.lineX = 0;
    this.party = party;
    this.state = state;
    switch (this.party) {
        case 'democrat':
            this.lineX = (majorities[0]/100*1920);
            //console.log(majorities[0]);
            //console.log('setting x to '+majorities[0]+"~~~"+this.lineX );
            break;
        case 'conservative':
            this.lineX = width - majorities[2]/100*1920;
            //console.log("republican majority:  "+this.lineX);
            break;
        case 'undecided':
            this.lineX = majorities[0]/100*1920 + majorities[1]/100*1920;
            break;
        default:

    }
}};
MajorityMarker.prototype.render = function(){
    if(this.party=='democrat'){
        strokeWeight(3);
        stroke(100,100,250);
        line(this.lineX,-450,this.lineX,1080);

        strokeWeight(1);
        fill(100,100,250);
        textSize(26);
        textAlign(RIGHT);
        text('Democrat',this.lineX-20,-450);
        text(majorities[0]+"%",this.lineX-20,-400);
        noStroke();
    } else if (this.party=='conservative') {
        strokeWeight(3);
        stroke(200,100,100);
        line(this.lineX,-450,this.lineX,1080);
        noStroke();

        strokeWeight(1);
        fill(250,100,100);
        textSize(26);
        textAlign(LEFT);
        text("Conservative",this.lineX+20,this.y-450);
        text(majorities[2]+"%",this.lineX+20,this.y-400);
    } else {
        strokeWeight(3);
        stroke(80,80,80);
        line(this.lineX, -500, this.lineX, 1080);

        strokeWeight(1);
        fill(80);
        textSize(26);
        textAlign(CENTER);
        text("Undecided",this.lineX,this.y-550);
        text(majorities[1]+"%",this.lineX,this.y-520);

    }
};

var OceanRow = function(x,y,z,state){if(this.z === undefined){
    this.y = y;
    this.z = z;
}};
OceanRow.prototype.render = function(){
    for(var x = 0; x < oWidth; x++){
        var zColour = this.z/ySpacing;
        if (x <= oceanMajorities[0]) {fill(gradient * zColour, gradient * zColour, 100 + gradient * zColour);} else
        if (x <= oceanMajorities[0] + oceanMajorities[1]){ fill(gradient*zColour, gradient * zColour, gradient * zColour);}
        else {fill(100+gradient*zColour, gradient * zColour, gradient * zColour);}
        ellipse(x * xSpacing, sin(x + theta) * amplitude + this.z, 170, 100);
    }
};

/**
 * [CandidateText description]
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
var CandidateText = function(x,y,z,state,textContent,r,g,b){if(this.x===undefined){
    this.x = x;
    this.y = y;
    this.z = z;
    this.state = state;
    this.textContent = textContent;
    this.r = r;
    this.g = g;
    this.b = b;
}};
CandidateText.prototype.render = function(){
    textAlign(LEFT);
    textSize(width / 10);
    fill(this.r,this.g,this.b);
    text(this.textContent, this.x, this.y);
    fill(color(this.r+20,this.g+20,this.b+20));
    text(this.textContent, this.x, this.y-10);
};

var TestBox = function(x,y,z,state){if(this.x===undefined){
    this.x = x;
    this.y = y;
    this.z = z;
    this.state = state;
}};
TestBox.prototype.render = function(){
    console.log('rendering textbox');
    color(255,255,255);
    rect(x,y,100,300);
};

var CandidateFigure = function(x,y,z,state,side,imageArray,userObject){if(this.x===undefined){
    this.x = x;
    this.y = y;
    this.z = z;
    this.state = state;
    this.side = side;
    this.imageArray = imageArray;
    this.userObject = userObject;
    this.counter = 0;
    this.animFrame = 0;
}};
CandidateFigure.prototype.startJabber = function(){
  this.state = 1;
};
CandidateFigure.prototype.stopJabber = function(){
  this.state = 3;
};
CandidateFigure.prototype.shockExpression = function(){
  this.state = 4;
};
CandidateFigure.prototype.render = function(){
    switch (this.state) {
        case 0:
            //default
            this.animFrame = 0;
            break;
        case 1:
            //initate the jabber sound
            console.log(this.side+" is jabbering right now");
            this.state = 2;
            break;
        case 2:
            //animation
            if(this.counter >=3){
                this.animFrame+=1;
                this.counter = 0;
            }
            if(this.animFrame > 3){
              this.animFrame = 1;
            }
            this.counter+=1;
            //console.log(this.animFrame+"trumpFigure is state 2");
            break;
        case 3:
            this.state = 0;
            //end jabber sound
            break;
        case 4:
            if(this.counter >=3){
                this.animFrame = 4;
                counter = 0;
            }
            this.counter+=1;
            //shock expression (flash white?)
            break;
        default:
    }
    //console.log(this.state+"  |  "+ this.animFrame);
    //console.log(this.imageArray);
    image(this.imageArray[this.animFrame],this.x,this.y);
};

var SpeechBubble = function (x,y,z,state,side){
    this.x = x;
    this.y = y;
    this.z = z;
    this.state = state;
    this.side = side;
    this.counter = 0;
};
SpeechBubble.prototype.render = function(){
  //console.log(this.counter, this.state);
    if(this.state === 1){
        if(this.counter < 30){
            this.counter++;
        }
    } else if(this.state ===2){
        if(this.counter > 0){
            this.counter--;
        }
    } else {
        this.counter = 0;
    }
    if(this.counter === 0){

    } else if(this.counter < 10){
      fill(255);
      if(this.side === 'conservative'){
        ellipse(this.x+100,this.y+120, 30, 30);
      } else {
        ellipse(this.x-200,this.y+120, 30, 30);
      }
    } else if (this.counter < 20){
      fill(255);
      if(this.side === 'conservative'){
        ellipse(this.x+100,this.y+120, 30, 30);
        ellipse(this.x+70,this.y+80, 70, 50);
      } else {
        ellipse(this.x-200,this.y+120, 30, 30);
        ellipse(this.x-170,this.y+80, 70, 50);

      }
    } else if  (this.counter <= 30){
      fill(255);
      if(this.side === 'conservative'){
        ellipse(this.x+100,this.y+120, 30, 30);
        ellipse(this.x+70,this.y+80, 70, 50);
      } else {
        ellipse(this.x-200,this.y+120, 30, 30);
        ellipse(this.x-170,this.y+80, 70, 50);
      }

      ellipse(this.x,this.y, 450, 250);
    }
    if(this.counter === 30){
        if(this.side ==='conservative'){
            $('#trump-tweet').css('display','block');
        } else {
            $('#clinton-tweet').css('display','block');
        }
    }
};
SpeechBubble.prototype.grow = function(tweetObject){
  this.state = 1;
};

SpeechBubble.prototype.shrink = function(tweetObject){
  $('#clinton-tweet').css('display','none');
  $('#trump-tweet').css('display','none');
  this.state =2;
};

var BoatManager = function(x,y,z,state,trumpFollowerCount, clintonFollowerCount){if(this.x===undefined){
      this.x = x;
      this.y = y;
      this.z = z;
      this.trumpFollowerCount = trumpFollowerCount;
      this.clintonFollowerCount = clintonFollowerCount;
      this.trumpBoats = []; //Stores the index of all trumppBoats
      this.clintonBoats = []; //storres the  index of all clintonBoats
}};
BoatManager.prototype.generateBoats = function(){
   console.log(this.trumpFollowerCount, this.clintonFollowerCount);
   var yZSpacing;
   var boatNumber = Math.round(this.trumpFollowerCount/1000000);
   var numberOfRows = boatNumber/4;
   var heightDistance = 350/numberOfRows;
   //console.log(numberOfRows);
   var widthDistance = (majorities[2]*19.2)/4;
   for(var i = 0; i < this.trumpFollowerCount/1000000; i++){
       yZSpacing = i/numberOfRows*heightDistance+100;
       //console.log(width-random(majorities[2]*19.2));
       //insertObject(new Boat(width - random(majorities[2])*19.2, yZSpacing, yZSpacing,0,'conservative'),true);
       insertObject(new Boat(width - (i%4)*widthDistance-200+random(-50,50), yZSpacing,yZSpacing,0,'conservative',true));
   }
   boatNumber = Math.round(this.clintonFollowerCount/1000000);
   numberOfRows = boatNumber/4;
   heightDistance = 250/numberOfRows;
   widthDistance = (majorities[0]*19.2)/4;
   console.log(numberOfRows, heightDistance, widthDistance);
   for(var j = 0; j < this.clintonFollowerCount/1000000; j++){
        yZSpacing = j/numberOfRows*heightDistance+150;
        console.log(yZSpacing);
       //console.log(majorities[0]*1920/100)
       insertObject(new Boat((j%4)*widthDistance+random(-50,50)+100,yZSpacing, yZSpacing ,0,'democratic'),true);
   }

   for(var k = 0; j < scene.length; j++){
     if(scene[j] instanceof Boat){
       //console.log(scene[j]);
       if(scene[j].side=="conservative"){
         //console.log(scene[j].side);
         this.trumpBoats.push(j);
       } else {
         this.clintonBoats.push(j);
       }
     }
     //console.log(this.trumpBoats);
   }

   //console.log(this.trumpBoats);
   //console.log(this.clintonBoats);
 };
BoatManager.prototype.render = function(){
    // Do nnothing, just to avoid errors :/
};
BoatManager.prototype.trumpSupport = function(retweetCount){
  retweetCount = Math.round(retweetCount/this.trumpBoats.length);
  console.log(this.trumpBoats);
  for(var i = 0; i < this.trumpBoats.length; i++){
      //console.log(scene[this.trumpBoats[i]]);
      //console.log(Math.round(retweetCount/this.trumpBoats.length));
      scene[this.trumpBoats[i]].displaySupport(retweetCount);
      scene[this.trumpBoats[i]].state=2;
      //scene[this.trumpBoats[i]].startJumping();
  }
};
BoatManager.prototype.clintonSupport = function(retweetCount){
    retweetCount = Math.round(retweetCount/this.clintonBoats.length);
    for(var i = 0; i < this.clintonBoats.length; i++){
        scene[this.clintonBoats[i]].displaySupport(retweetCount);


        scene[this.clintonBoats[i]].state = 2;
        //console.log("index: "+ i + "support ammount: "+scene[this.clintonBoats[i]].support,"  |  ",scene[this.clintonBoats[i]].state);
    }
};

BoatManager.prototype.reset = function(){
  for(var i = 0; i < this.trumpBoats; i++){
    scene[this.trumpBoats[i]].state = 0;
    scene[this.trumpBoats[i]].deleteSupport();
  }
  for(var j = 0; i < this.clintonBoats; i++){
    scene[this.clintonBoats[i]].state = 0;
    scene[this.clintonBoats[i]].deleteSupport();
  }
};

// end of BoatManager class

var Boat = function(x,y,z,state,side){
    this.x = x-50;
    this.z = z;
    this.y = Math.round(z/54)*54-60;
    this.state = state;
    this.side = side;
    this.people =  [[-20,-80],
                    [30,-80],
                    [80,-80]]; //xy coordinates of the people on each boat, (relative to the boat so when the boat bobs we don't have to calculate to much);
    this.actualY = this.y;
    this.support = 0;
    this.animFrame = 0;
    this.counter = 0;
    if(this.side=="conservative"){
      this.imageResources = imgTrumpBoat;
    } else {
      this.imageResources = imgClintonBoat;
    }
};
Boat.prototype.render = function(){
    //console.log(this.people.length) ;
    this.actualY = sin(this.x +this.z+ theta)*amplitude + this.y-20;

    //Manages the people on the boat
    //
    switch (this.state) {
        case 0:
            for(i=0;i<this.people.length;i++){
              this.people[i][0] = i*50-20;
              this.people[i][1] = -40;
            }

            break;
        case 1:
            //Do nothing
            break;
        case 2:
          //console.log(this.animFrame);
            if(this.counter > 10){ // every 10 frames
                this.animFrame++;
                if(this.animFrame > 3){
                  this.animFrame = 0;
                }
              this.counter = 0;
            } else {
              this.counter++;
            }
            break;
        default:
            break;
    }
    fill(50);
    for(i=0;i<this.people.length;i++){
        //console.log("making a rect("+this.x + this.people[i].x,this.y + this.people[i].y, 20,50+")") //activate this debug statement for browser death
        //rect(this.x + this.people[i][0],this.actualY + this.people[i][1], 20,50);
        image(imgPersonArray[this.animFrame],this.x + this.people[i][0],this.actualY + this.people[i][1]);
    }
    if(this.support>0){
        fill(255);
        textAlign(CENTER);
        textSize(26);
        text(this.support + "<3", this.x+85, this.actualY-50);
    }

    image(this.imageResources,this.x, this.actualY);
};

Boat.prototype.startJumping = function(){
    this.state = 2;
};
Boat.prototype.stopJumping = function(){
    this.state = 0;
};
Boat.prototype.displaySupport = function(support){
    this.support = support;
};
Boat.prototype.getSupport = function(){
    return this.support;
};
Boat.prototype.deleteSupport = function(){
    this.state = 0;
    this.support = 0;
};


var Balloon = function(x,y,z,state,side){if(this.x===undefined){
    this.x = x;
    this.y = y;
    this.z = z;
    this.state = state;
    this.side = side;
    this.retweetCount = 0;
    this.displayCount = 0;
    this.animFrame = 0;
    if(this.side ==='conservative'){
      this.imageResources = imgTrumpBalloonArray;
    } else {
      this.imageResources = imgClintonBalloonArray;
    }
}};
Balloon.prototype.render = function(){
  textAlign(CENTER);

  switch (this.state) {
    case 0: //Default state, non moving
      fill(100,100,100);
      rect(this.x,this.y, 50,120);
      break;
    case 1: //Raising into sky and counting score
    //console.log("balloon state is "+this.state, "position: ",this.x,this.y);
      if(this.y >-600){
          this.y-= (this.y+600)/70;
          this.displayCount += (this.retweetCount-this.displayCount)/40;
      } else {
          this.displayCount = this.retweetCount;
      }
      break;
    case 2:// deflating
      this.y-= (this.y-height)/80;
      this.displayCount = 0;
      this.animFrame = 1;
      break;
    case 3: //triumphing
      for(var i = 0; i < 3; i++){
        fill(255,255,0);
        rect(this.x + random(-300,500),this.y + random(-300,500), 50,50);
      }
      this.y -= (-400-this.y)*0.02;
      break;
    default:
      break;
  }
  image(this.imageResources[this.animFrame], this.x, this.y);
  fill(255);
  textSize(26);
  if(this.displayCount!==0){
    text(Math.round(this.displayCount), this.x+165, this.y +280);
  }
  //rect(this.x,this.y,50,120);
};
Balloon.prototype.countScore = function(indexArray){
    this.displayCount = 0;
    for(i = 0; i < indexArray.length; i ++){
        this.retweetCount += scene[indexArray[i]].getSupport();
    }
    console.log(this.retweetCount);
    this.state = 1;
};
Balloon.prototype.deflate = function(){
    this.state = 2;
};
Balloon.prototype.triumph = function(){
    this.state = 3;
};
Balloon.prototype.reset = function(){
    this.retweetCount = 0;
    this.displayCount = 0;
    this.y = 600;
    this.state = 0;
};

var GreaterThan = function(x,y,z,state){
  this.x = x;
  this.y = y;
  this.z = z;
  this.state = state;
};
GreaterThan.prototype.render = function(){
  //rect(this.x,this.y,10,10);
  text("greaterThan location x"+this.x+"y"+this.y);
  textSize(200);
  if(this.state === 0){
    //do nothing, resting state
  } else if(this.state == 1){
    fill(255,100,100);
    text("<", this.x, this.y);
  } else if(this.state == 2){
    fill(100,100,255);
    text(">", this.x, this.y);
  } else if(this.state == 3){
    text("=", this.x,this.y);
  }
};
GreaterThan.prototype.compare = function(clintonRetweets, trumpRetweets){
  console.log(clintonRetweets, trumpRetweets);
    if(clintonRetweets==trumpRetweets){
      this.state = 3;
      if(random(1)>0.5){
        return 'trump';
      } else {
        return 'random';
      }
    }
    if(clintonRetweets > trumpRetweets){
      this.state = 2;
      return 'clinton';
    } else {
      this.state = 1;
      return 'trump';
    }
};

var CloudManager = function(x,y,z,state){
  this.x = x;
  this.y = y;
  this.z = z;
  this.state = state;
  this.trumpResponseRate = 0;
  this.clintonResponseNumber = 0;
};
CloudManager.prototype.render = function(){
  log(this.state);
  if(this.state === 0){

  } else if(this.state===1){
    this.x += (this.centerPoint-this.x)/20;
    image(imgCloudTrump, this.x, this.y);
    image(imgCloudClinton, this.x-1920, this.y);
    fill(0);
    textSize(80);
    text(Math.round(this.x/1920*100)+"%",this.x-200,this.y+150);
    text(100-(Math.round(this.x/1920*100))+"%",this.x+70,this.y+150);
    textSize(16);
    text('Twitter Presence', this.x-230, this.y+170);
    text('Twitter Presence', this.x+70, this.y+170);
  }
};
CloudManager.prototype.updateData = function(trumpRespNo, clintonRespNo){
  console.log(this.state = 1);
  if(this.trumpResponseNumber===undefined){
    this.trumpResponseNumber = trumpRespNo;
    this.clintonResponseNumber = clintonRespNo;
  } else {
    this.trumpResponseNumber += trumpRespNo;
    this.clintonResponseNumber += clintonRespNo;
  }
  if(this.trumpResponseNumber > this.clintonResponseNumber){
    this.centerPoint = (this.trumpResponseNumber-this.clintonResponseNumber)/this.trumpResponseNumber*1920;
  } else {
    this.centerPoint = (this.clintonResponseNumber-this.trumpResponseNumber)/this.clintonResponseNumber*1920;
  }
  console.log(this.x);
};
