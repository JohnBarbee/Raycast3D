fov = 80; //field of view
res = 180; //resolution (# of lines rendered)
p = null;
walls = [];
debug = true;

wStep = 0;
const lensDist = 0.3;
viewDist = 0;

function setup() {
  createCanvas(640, 360);
  for(i = 0; i < 5; i++){
    walls[i] = new Wall(random(width),random(height),
                        random(width),random(height));
  }
  p = new Player(200,200,0,fov,res,walls);
  wStep = width / res;
  viewDist = (width/2) / tan((fov / 2));
}

function draw() {
  background(220);
  controls();
  p.show()
  if(debug){
    for(let wall of walls){
      wall.show();
    }
  }
}

function controls(){
  if(keyIsDown(LEFT_ARROW)){
    p.rotate(-2 * (60/frameRate()));
  } else if(keyIsDown(RIGHT_ARROW)){
    p.rotate(2 * (60/frameRate()));
  }
  
  if(keyIsDown(UP_ARROW)){
    p.move(0.5 * (60/frameRate()));
  } else if(keyIsDown(DOWN_ARROW)){
    p.move(-0.5 * (60/frameRate()));
  }
}

function keyPressed(){
  if(keyCode == 32){
    debug = !debug;
  }
}