var database;
var dogimg, happydogimg;
var dog, foodObj;
var feedbutton, addbutton;
var refoffood, foodS;
var fedTime, lastFed;

function preload(){
  dogimg = loadImage("dogImg.png");
  happydogimg = loadImage("dogImg1.png");
}

function setup() {
  database = firebase.database();

  createCanvas(1000, 500);
  foodObj = new Food();

  dog = createSprite(800, 150, 10, 10);
  dog.addImage("dog", dogimg);
  dog.scale = 0.3;

  feedbutton = createButton("Feed!");
  feedbutton.position(600, 95)
  feedbutton.mousePressed(feedDog);

  addbutton = createButton("Buy food!");
  addbutton.position(800, 95)
  addbutton.mousePressed(addFood);

  refoffood = database.ref('Food');
  refoffood.on("value", readStock);

  input = createInput("Enter Name Of Your Dog");
  input.position(400, 315);

 choosename = createButton("Confirm");
  choosename.position(400,340);
}

function draw() {  
  background(46, 139, 87);

  drawSprites();
  
  foodObj.display();
  
  choosename.mousePressed(function(){
    var name = input.value();
    feed = createButton("Feed "+name);
    feed.position(600, 95);
    feed.mousePressed(feedDog);
    choosename.hide();
    input.hide();
  })

  fill("white")
  text("Food Stock: "+ foodS, 100, 100);

  fedTime = database.ref('FeedTime')
  fedTime.on("value", function (data) {
    lastFed = data.val();
  })

  fill(255, 255, 254);
        textSize(15)
        if (lastFed>=12) {
            text("Last Fed: "+ lastFed%12 + "PM", 350, 30);
        } else if (lastFed === 0) {
            text("Last Fed: 12 AM", 350, 30);
        } else {
            text("Last Fed: "+ lastFed + "AM", 350, 30);
        }
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS)
}
function writeStock(x) {
  if(x<=0){
    x=0
  } else{
    x = x-1;
  }
  database.ref('/').update({
    Food:x
  })
}
function addFood() {
  foodS++
  database.ref('/').update({
    Food: foodS
  })
}
function feedDog(){
  dog.addImage("dog", happydogimg);
  if(foodS>0){
    foodObj.updateFoodStock(foodObj.getFoodStock()-1)
    database.ref('/').update({
      Food: foodObj.getFoodStock(),
      FeedTime:hour()
    })
  }
}
  