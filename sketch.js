var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var touches;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var score=0;
var gameOver, restart;
touches=[0];

function preload(){
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,185,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,windowWidth,20);
  ground.velocityX = -(6 + 3*score/100);
  ground.x = ground.width/2;
  ground.addImage("ground",groundImage);
  
  invisibleGround = createSprite(200,190,windowWidth,10);
  invisibleGround.visible = false;
  
  restart = createSprite(windowWidth/2,windowHeight/4);
  restart.addImage(restartImg);
  
  gameOver = createSprite(windowWidth/2,windowHeight/6);
  gameOver.addImage(gameOverImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  score = 0;
}

function draw() {
  //trex.debug = true;
  background("white");
  fill("red");
  text("Score: "+ score, windowWidth-80,windowHeight/11);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(touches==1 && trex.y >= 159) {
      trex.velocityY = -12;
      touches[0];
    }
  
    trex.velocityY = trex.velocityY + 0.8
    
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    trex.changeAnimation("collided",trex_collided);
  
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
 
    ground.velocityX = 0;
    trex.velocityY = 0;
  
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    text("Tap Four Times To RESET!",windowWidth/2.5,windowHeight/11);
    
    if(touches==4) {
      reset();
      touches[0];
    }
  }
  
  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.lifetime = 200;
    cloud.velocityX = -3;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
 
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
            
  obstacle.scale = 0.5;
  obstacle.lifetime = 270;
  obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation("running",trex_running);
  score = 0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
}