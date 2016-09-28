var scene = [];

var theta = 0;
var ySpacing;
function setup(){
    frameRate(30);
    createCanvas(1800, 900);
    background(20, 20, 20);
    noStroke();
    sceneConstructor();
}

function draw(){
    //Changing data goes here

    //Render all elements here
    renderSceneObjects();
    function renderSceneObjects(){
        for(var i = 0; i < scene.length;i++){
            scene[i].render();
        }
    }
}

function sceneConstructor(){
    //Ocean Constructor
    var oHeight = 10;
    var oWidth = 20;
    ySpacing = width/oWidth;
    for (var z = 0; z < oHeight; z++) {
        var o = new oceanRow(1,z,z,1);
        scene.push(o);
    }
}


var oceanRow = function(x,y,z,state){
    this.x = x;
    this.y = y;
    this.z = z;
    this.state = state;
    this.render = function(){
        for(var x = 0; x < oWidth; x++){
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
