# sea-of-tweets-js
JavaScript version of Sea Of Tweets.  Processing code is in 'main.js'.  

All of the settings are declared at the start, I've documented them all.

##Syntax and stuff
```/*
                    SETTINGS
*/

var oWidth = 20; // Ocean Width (in ellpises)
var oHeight = 10; //Ocean Height (in ellipses)

var theta = 0.0; // stores the current angle of the wave
var amplitude = 9.0; //The height of the waves
var frequency = 0.2; //Not used but you could increase 'theta' by 'period/1000' to change the wave speed.  if you divide this by
var objectX = 0;
var objectY = 0;
var gradient = 155/oHeight;
var xObjectLocation = 10; //Stores the y location (on the scope of oWidth) of the tweet
var yObjectLocation = 5; //Stores the y location (in the scope of the oHeight) of the tweet

/*
                    GLOBAL VARIABLES

*/

var speed; //This stores the speed of the waves once calculated
var xSpacing;
var ySpacing;
```

You'll notice that instead of declaring variables as ```int```, ```float```, etc; they are all declared with the encompassing ```var``` which discerns the type by itself.  Arrays are also declared as ```var <arrayName> = new Array(<number of elements>);```, the type is also discerned by whatever you put in it.

Instead of ```void setup(){...}``` and ```void draw(){...}``` p5.js uses ```function setup(){...}``` and ```function draw(){...}```
This is because javascript doesn't need the type of output to be declared, it is a free spirit and works with what it has.

##Functions and Stuff
```
function setup(){
    frameRate(30);
    createCanvas(1800,900);
    background(20,20,20);
    xSpacing = width/oWidth; //'width' isn't initialised until AFTER createCavas so we can't put it at the top :
    ySpacing = height/oHeight/2; //'height' isn't initialised until AFTER createCavas so we can't put it at the top :
    noStroke();
    fill(100,100,255);
    speed = (frequency*1000)/1000;  //Divides period by ms
}
```
instead of ```size(x,y);```, ```createCanvas(x,y);``` is used + ```function``` instead of ```void```;


This is the ```draw()``` function
```
function draw(){
    background('#7FB2F0');
    translate(width*0.025,height/1.8);
```
The ocean is offset a really arbitrary ammount so it fits on the screen
```
    theta+=speed;
```
Incrementing this slowly is what makes the waves roll, increment by speed to make it editable
```
f   or(var k = 0; k < oHeight; k++){
```
incrementing up oHeight or ocean height.  This starts at the bottom of the ocean and moves up the screen.
```
        fill(gradient*k,gradient*k,100+gradient*k);
```
Changes the colour so that the first iterations/lower levels are pale and the higher levels are blue
```
        if(round(yObjectLocation) == k){
            ```
            //This checks if the tweet is on the level of ocean
            ```
            fill(100,100,100); //placeholder colour

            rect(xObjectLocation*xSpacing-200,(sin(yObjectLocation/oHeight+theta)*amplitude+k*ySpacing)-100,400,100);

            ```
            The line with rect() is exactly the same as the way ellipses are rendered with a couple of differences.
            --> instead of using i and k (which basically are x and y coordinates in the ocean) it uses xObjectLocation and yObjectLocation
            --> at the end of the equation there is an offset of '-200' and '-100 so it's a little bit above the water
            I'll explain more in the second for loop
            ```
            fill(gradient*k,gradient*k,100+gradient*k); //Sets the colour back to blue for the rest of the ocean
        }
        ```
```
        for(var i = 0; i < oWidth; i++){
```
            This iterates ACROSS.  The ocean is rendered in horizontal lines, it renders one horizontal line and then moves up
            ```
            ellipse(i*xSpacing ,sin(i+theta)*amplitude+k*ySpacing,100,100);
            ```
            Omg this line is hell, this is what makes the 'waves'
            --> xSpacing keeps each ellipse seperated to the right ammount.
            --> sin(x) returns a number between 0 and 1 based on how close the input is to 45 and how far it is from 0,  (i.e. 0 or 90 return 0 but 45 returns 1)
                    I can't really explain more... ehhh http://i.imgur.com/c9P9FPl.gif :// sorry
            --> By adding theta (and because theta is always increasing) it changes the wave slowly from a crest to a trough and back to a crest
            --> Amplitude makes the waves visible (because otherwise we'd be moving it up between 0 and 1 pixels)
            --> ySpacing just keeps the ellipses seperated the right ammount on the y plane
            ```
        }
        //xObjectLocation-=0.005;
    }
}
```
And we close off a lot of ifs and loops.
I just spent ages editting this pls enjoy
