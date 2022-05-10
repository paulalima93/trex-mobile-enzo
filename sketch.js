var trex, trex_running, trex_isdead, edges;
var groundImage, ground, invisibleGround;
var nuvemImagem;
var obstaculo1Img, obstaculo2Img, obstaculo3Img, obstaculo4Img, obstaculo5Img, obstaculo6Img;
var pontuacao = 0;

var gameOver, gameOverImg, restart, restartImg;
var somPulo, somMorte, somCheckPoint;

var JOGAR = 1;
var ENCERRAR = 0;
var gameState = JOGAR;

var grupoNuvem, grupoObstaculo;


function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_isdead = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  nuvemImagem = loadImage("cloud.png");
  obstaculo1Img = loadImage("obstacle1.png");
  obstaculo2Img = loadImage("obstacle2.png");
  obstaculo3Img = loadImage("obstacle3.png");
  obstaculo4Img = loadImage("obstacle4.png");
  obstaculo5Img = loadImage("obstacle5.png");
  obstaculo6Img = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  somPulo = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //criando o trex
  trex = createSprite(50,height-60,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("isdead", trex_isdead);
  edges = createEdgeSprites();
  
  ground = createSprite (width/2,height-20,600,20);
  ground.addImage(groundImage);

  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;

  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50;

  //trex.debug = true;
  trex.setCollider("circle", 0, 0, 30);
  //trex.setCollider("rectangle", 20, 0, 150,30);

  grupoNuvem = new Group();
  grupoObstaculo = new Group();

  gameOver = createSprite(width/2, height-120);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;


  restart = createSprite(width/2,height-80);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;

}


function draw(){
  //definir a cor do plano de fundo 
  background("white");
  text("Pontuação: "+ pontuacao, 500, 50);


  if (gameState === JOGAR) {
    if (touches.length>0 && trex.y >= height-50){
      trex.velocityY = -10;
      somPulo.play();
      touches = [];
    }

    pontuacao = pontuacao + Math.round(frameRate()/60);

    if (pontuacao>0 && pontuacao%100===0) {
      somCheckPoint.play();
    }

    ground.velocityX = -(5 + 3*pontuacao/100);
    grupoObstaculo.setVelocityXEach(-(5 + 3*pontuacao/100));

    if(ground.x<0) {
      ground.x = ground.width/2;
    }

    gerarNuvens();
    gerarObstaculos();

    if (trex.isTouching(grupoObstaculo)) {
      gameState = ENCERRAR;
      somMorte.play();

      //IA
      //trex.velocityY = -10;
      //somPulo.play();
    }

  } else if(gameState === ENCERRAR) {
    ground.velocityX = 0;
    grupoNuvem.setVelocityXEach(0);
    grupoObstaculo.setVelocityXEach(0);

    grupoObstaculo.setLifetimeEach(-1);
    grupoNuvem.setLifetimeEach(-1);
    trex.changeAnimation("isdead", trex_isdead);

    gameOver.visible = true;
    restart.visible = true;

    if(touches.length>0){
      reset();
    }
  }

  trex.velocityY = trex.velocityY + 0.5;
  
 //impedir que o trex caia
  trex.collide(invisibleGround);
  drawSprites();
  

}


function reset(){
  gameState = JOGAR;

  grupoObstaculo.destroyEach();
  grupoNuvem.destroyEach();

  pontuacao = 0;

  gameOver.visible = false;
  reset.visible = false;

  trex.changeAnimation("running", trex_running);
}

function gerarNuvens() {
  if(frameCount % 60 ===0){
    var nuvem = createSprite(width,100,40,10);
    nuvem.velocityX = -5;
    nuvem.addImage(nuvemImagem);
    nuvem.y = Math.round(random(20,300));

    trex.depth = nuvem.depth;
    trex.depth = trex.depth +1;

    nuvem.lifetime = width/5;
    grupoNuvem.add(nuvem);
    
  }
}

function gerarObstaculos(){
  if (frameCount % 60 === 0) {
    var obstaculo = createSprite(width,height-30,40,80);
    obstaculo.velocityX = -5;

    var aleatorio = Math.round(random(1,6));
    switch (aleatorio) {
      case 1: obstaculo.addImage(obstaculo1Img);
        break;
      case 2: obstaculo.addImage(obstaculo2Img);
        break;  
      case 3: obstaculo.addImage(obstaculo3Img);
        break;
      case 4: obstaculo.addImage(obstaculo4Img);
        break;
      case 5: obstaculo.addImage(obstaculo5Img);
        break;
      case 6: obstaculo.addImage(obstaculo6Img);
        break;
      default:
        break;
    }

    obstaculo.scale = 0.5;
    obstaculo.lifetime = width/5;
    grupoObstaculo.add(obstaculo);
  }
}