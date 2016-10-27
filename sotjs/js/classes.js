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
    this.animframe = 0;
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
            this.animframe = 0;
            break;
        case 1:
            //initate the jabber sound
            console.log(this.side+" is jabbering right now");
            this.state = 2;
            break;
        case 2:
            //animation
            if(this.counter >=3){
                this.animframe+=1;
                this.counter = 0;
            }
            if(this.animframe > 3){
              this.animframe = 1;
            }
            this.counter+=1;
            //console.log(this.animframe+"trumpFigure is state 2");
            break;
        case 3:
            this.state = 0;
            //end jabber sound
            break;
        case 4:
            if(this.counter >=3){
                this.animframe = 4;
                counter = 0;
            }
            this.counter+=1;
            //shock expression (flash white?)
            break;
        default:
    }
    //console.log(this.state+"  |  "+ this.animframe);
    image(this.imageArray[this.animframe],this.x,this.y);
};

var SpeechBubble = function (x,y,z,state,side){if(this.x===undefined){
    this.x = x;
    this.y = y;
    this.z = z;
    this.state = state;
    this.side = side;
    this.counter = 0;
}};
SpeechBubble.prototype.render = function(){
    if(this.side=='trump'){
        switch (this.state) {
            case 0:
                //do nothing, no cloud
                break;
            case 1:
                fill(255);
                if(this.side === 'conservative'){
                  ellipse(this.x+50,this.y+70, 30, 30);
                } else {
                  ellipse(this.x-50,this.y+70, 30, 30);
                }

                break;

            case 2:
                fill(255);
                if(side === 'conservative'){
                  ellipse(this.x+50,this.y+70, 30, 30);
                  ellipse(this.x+30,this.y+45, 50, 50);
                } else {
                  ellipse(this.x-50,this.y+70, 30, 30);
                  ellipse(this.x-30,this.y+45, 50, 50);
                }

                break;
            case 3:
                fill(255);
                if(side === 'conservative'){
                  ellipse(this.x+50,this.y+70, 30, 30);
                  ellipse(this.x+30,this.y+45, 50, 50);
                } else {
                  ellipse(this.x-50,this.y+70, 30, 30);
                  ellipse(this.x-30,this.y+45, 50, 50);
                }
                ellipse(this.x,this.y, 200, 100);
                break;
            default:
                break;
        }
    }
};
SpeechBubble.prototype.grow = function(tweetObject){
  var delay = 1000;
  this.state = 1;
  setTimeout(function(){
    this.state = 2;
    setTimeout(function(){
      this.state = 3;
      //tweetObject.show();
    },delay);
  },delay);
};

SpeechBubble.prototype.shrink = function(tweetObject){
  var delay = 1000;
  this.state = 2;
  setTimeout(function(){
    this.state = 1;
    setTimeout(function(){
      this.state = 0;
      //tweetObject.hide();
    },delay);
  },delay);
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
   for(var i = 0; i < this.trumpFollowerCount/1000000; i++){
       yZSpacing = 120+random(380);
       //console.log(width-random(majorities[2]*19.2));
       insertObject(new Boat(width - random(majorities[2])*19.2, yZSpacing, yZSpacing,0,'conservative'),true);
   }
   for(var j = 0; j < this.clintonFollowerCount/1000000; j++){
       yZSpacing = 120+random(380);
       //console.log(majorities[0]*1920/100)
       insertObject(new Boat(random(majorities[0])*19.2,yZSpacing, yZSpacing ,0,'democratic'),true);
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
      console.log(scene[this.trumpBoats[i]]);
      console.log(Math.round(retweetCount/this.trumpBoats.length));
      scene[this.trumpBoats[i]].support = retweetCount;
      scene[this.trumpBoats[i]].state=1;
  }
};
BoatManager.prototype.clintonSupport = function(retweetCount){
    retweetCount = Math.round(retweetCount/this.clintonBoats.length);
    for(var i = 0; i < this.clintonBoats; i++){
        scene[this.clintonBoats[i]].state = 1;
        scene[this.clintonBoats[i]].support = retweetCount;
    }
};

BoatManager.prototype.stopJumping = function(){
  for(var i = 0; i < this.trumpBoats; i++){
    scene[this.trumpBoats[i]].state = 0;
  }
  for(var j = 0; i < this.clintonBoats; i++){
    scene[this.clintonBoats[i]].state = 0;
  }
};

// end of BoatManager class

var Boat = function(x,y,z,state,side){if(this.x===undefined){
    this.x = x-50;
    this.z = z;
    this.y = Math.round(z/54)*54-60;
    this.state = state;
    this.side = side;
    this.people =  [[25,-80],
                    [75,-80],
                    [125,-80]]; //xy coordinates of the people on each boat, (relative to the boat so when the boat bobs we don't have to calculate to much);
    this.actualY = this.y;
    this.support = 0;
}};
Boat.prototype.render = function(){
    //console.log(this.people.length) ;
    this.actualY = sin(this.x +this.z+ theta)*amplitude + this.y-20;
    if(this.side=='conservative'){
        fill(200,150,150);
    }  else {
        fill(150,150,200);
    }
    rect(this.x, this.actualY, 170, 100);

    //Manages the people on the boat
    //
    switch (this.state) {
        case 0:
            for(i=0;i<this.people.length;i++){
              this.people[i][0] = 25+i*50;
              this.people[i][1] = -40;
            }
            this.state = 1;
            break;
        case 1:
            //Do nothing
            break;
        case 2:
            for(i=0;i<this.people.length;i++){
              this.people[i][1] -= 3;
            }
            if(this.people[i][1]<=-80){
                state = 3;
            }
            break;
        case 3:
            for(i=0;i<this.people.length;i++){
              this.people[i][1] +=3;
            }
            if(this.people[i][1]>= 80){
                state = 2;
            }
            break;
        default:
            break;
    }
    fill(50);
    for(i=0;i<this.people.length;i++){
        //console.log("making a rect("+this.x + this.people[i].x,this.y + this.people[i].y, 20,50+")") //activate this debug statement for browser death
        rect(this.x + this.people[i][0],this.actualY + this.people[i][1], 20,50);
    }
    if(this.support>0){
        fill(255);
        textAlign(CENTER);
        text(this.support + "<3", this.x, this.actualY-100);
    }
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
}};
Balloon.prototype.render = function(){
  if(this.side=='conservative'){
      fill(200,150,150);
  } else {
      fill(150,150,200);
  }
  textAlign(CENTER);
  text(this.displayCount+=(this.retweetCount-this.displayCount)/20, this.x, this.y - 20);
  switch (this.state) {
    case 0: //Default state, non moving
      fill(100,100,100);
      rect(this.x,this.y, 50,120);
      break;
    case 1: //Raising into sky and counting score
      if(this.x >-200){
          this.x-=2;
      } else {
          displayCount = this.retweetCount;
      }
      break;
    case 2:// deflating
      this.x+=2;
      fill(255,0,0);
      rect(this.x,this.y, 50,120);
      break;
    case 3: //triumphing
      this.x-= (this.x-height)/20;
      fill(255,255,0);
      rect(this.x,this.y,50,120);
      break;
    default:
      break;
  }
};
Balloon.prototype.countScore = function(indexArray){
    this.displayCount = 0;
    for(i = 0; i < indexArray.length; i ++){
        this.retweetCount += scene[indexArray[i]].getSupport();
    }
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
    this.y = -800;
    this.state = 0;
};
