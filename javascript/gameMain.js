/*********************************
* Author: Divan visagie
* Created: 06/02/2012
* This file operates an html5 
* canvas element of id="canvas".
* It draws the game to the canvas
* on a timed event 
**********************************/
var canvas;  
var ctx;
var x = 400;
var y = 500;
var dx = 4;
var dy = 4;
var WIDTH = 800;
var HEIGHT = 600; 

var health = 100;
var score = 0;

var bulletCount = 0;
var bullets = [];

var pointMult =25;

var asteroids = [];
newAsteroid();
newAsteroid();
newAsteroid();

var paused = false;

var w=0;
var a=0;
var s=0;
var d=0;
var f =0;
	

//library importer
function Import(file){
	var NewScript=document.createElement('script')
	NewScript.src=file+".js"
	document.body.appendChild(NewScript);
}


function init() {
   //
  
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  return setInterval(draw, 15);
}

//sounds
function sndExplosion(){ 
    
	var audio = new Audio("sounds/explosion.wav");	
	audio.play();
	
}
function sndRockBreak(){ 
	
	var audio = new Audio("sounds/rock_breaking.wav");
	audio.play();
	
}	
	


function random(max){
	return Math.floor(Math.random()*max);
}


function drawImage(x,y,file){
	var img=new Image();
	img.src=file;
	ctx.drawImage(img,x,y);
}
	
function drawText(x,y,text,size){
	var font = "bold " + size + "px sans-serif";
	ctx.font=font;
	ctx.textBaseLine = 'top';	
	ctx.fillText(text,x,y);
}
	
function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.fill();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

 
function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}




//drawing here
function draw(){
	clear();
	checkControls();	
	ctx.fillStyle = "#444444";
	rect(0,0,WIDTH,HEIGHT);
	drawImage(0,0,"images/bg.jpg");
	ctx.fillStyle = "#FAF7F8";
	drawImage(x,y,"images/spartanm.png");
	//draw the bullets	
	for(var i = 0; i < bullets.length; i++){
		drawImage(bullets[i][0],bullets[i][1],"images/lazer.png");	
						
		//update the bullet position
		bullets[i][1]-=7;
	}
	
	//draw asteroids
	for(var i = 0; i < asteroids.length;i++){
	    drawImage(asteroids[i][0], asteroids[i][1], asteroids[i][6]);
	    var x2 = asteroids[i][0] + 32;
	    var y2 = asteroids[i][1] + 32;
	    if (!paused) {
	        for (var j = 0; j < bullets.length; j++) {
	           
			   //check if bullets should be removed
	            if (bullets[j][1] < -100 && bullets.length > 5 || bullets[j][2] <=0) {
	                bullets = bullets.splice(j);
	            }
	            //check for bullet-asteroid collision	        	           
				
				var a = (bullets[j][0]+8)-x2;
				var b = (bullets[j][1]+32)-y2;				
				
				/*Use theorim of Pythagoras to calculate distance 
				between the centers of the two objects*/
				if (Math.sqrt((a*a)+(b*b)) <= 32) {               
					
	                //draw explostion
	                drawImage(bullets[j][0] - 40, bullets[j][1] - 40, "images/explosion.png");
	                //explosion sound					
					sndExplosion();
	                //damage the asteroid from the array
	                asteroids[i][5] -= (48-Math.sqrt((a*a)+(b*b)))/2;
					bullets[2] -= (48-Math.sqrt((a*a)+(b*b)))/2;

	                if (asteroids[i][5] < 0) {
	                   
	                    bullets.splice(j);
						 //play rock break sound
	                    sndRockBreak();
	                    asteroids.splice(i, 1);

	                    if (score > asteroids.length * asteroids.length * 100 && asteroids.length < 25) {
	                        pointMult += 10;
	                        newAsteroid();
	                        newAsteroid();
	                    }
	                    newAsteroid();
	                    score += pointMult;
	                }
	            }
	        }
	        //move asteroid
	        asteroids[i][1] += asteroids[i][4];
	        if (asteroids[i][2] > WIDTH / 2 || asteroids[i][0] > WIDTH)
	            asteroids[i][0] -= asteroids[i][3];
	        else
	            asteroids[i][0] += asteroids[i][3];

	        //check if asteroid should be regenetated
	        if (asteroids[i][1] > HEIGHT && health >= 0) {
	            asteroids.splice(i, 1);
	            newAsteroid();
	            score -= ((pointMult - 5) / 2);
	        }

	        //check if asteroid has hit player
	        if ((Math.sqrt((x-x2)*(x-x2))+((y-y2)*(y-y2))) < 64) {
	            drawImage(x, y, "images/explosion.png");
	            sndRockBreak();
	            health -= 20;
	            if (health <= 0)
	                paused = true;
	        }
	    }	
	}
	
	
	//draw text
	drawText(5,HEIGHT-30,"Health: "+health,12);
	drawText(5,HEIGHT-20,"Score: "+score,12);
	drawText(5,HEIGHT-580,"Tracking Asteroids: "+asteroids.length,12);
	
	drawText(5,HEIGHT-10,"Bullets fired: "+bulletCount,12);
	drawText(5,HEIGHT-570,"Tracking bullets: "+bullets.length,12);

	if (health <= 0) {
	    drawText(200, HEIGHT / 2, "Game Over!", 72);
	    drawText(220, HEIGHT / 2 + 30, "Score: " + score, 26);
	    drawText(220, HEIGHT / 2 + 60, "Bullets Fired: -" + bulletCount, 26);
	    drawText(220, HEIGHT / 2 + 90, "Health: " + health, 26);
	    drawText(220, HEIGHT / 2 + 140, "Total: " + (score - bulletCount + health), 32);
	}
	else if (paused && health >= 0) {
	    drawText(260, (HEIGHT / 2) + 20, "Paused", 72);
    }	
    			
}

function newAsteroid(){
	var textures = ["images/ast.png","images/ast3.png"];
	
	var ranx = random(750);
	var speedx = random(2);
	var speedy = 0;
	var texture = textures[random(2)];
	//speedy must be more than 1
	while(speedy < 1){
		speedy = random(3);
	}
	asteroids.push(new Array(ranx,-32,ranx,speedx,speedy,100,texture));	
}

function fireBullet() {
    if (bullets.length < 36) {
        bullets.push(new Array(x + 26, y - 60,100));
        bulletCount++;
    }
}

function fireDouble() {
    if (bullets.length < 34) {
        bullets.push(new Array(x + 20, y - 60,100));
        bullets.push(new Array(x + 32, y - 60,100));
        bulletCount += 2;
    }
}

//the following functions are related to input
document.onkeypress = function (e) {
    var key = String.fromCharCode(e.charCode);
    var kc = e.keyCode;
    if (health > 0 && !paused) {        
        if (key == "d") {
            d = 1;
            a = 0;
        }
        else if (key == "a") {
            a = 1;
            d = 0;
        }

        if (key == "w") {
            w = 1;
            s = 0;
        }
        else if (key == "s") {
            s = 1;
            w = 0;
        }

        if (key == "f" || kc == 32)
            fireBullet();

        if (key == "q") {
            fireDouble();
            fireBullet();
        }

        if (key == "e")
            fireDouble();
    }
    if (key == "p")
        paused = !paused;
}
function checkControls()
{
	if(w && y > 0)
		y-=dy;
	if(s && y+64 < HEIGHT)
		y+=dy;
	if(a && x > 0)
		x-=dx;
	if(d && x+64 < WIDTH)
		x+=dx;
	
}
document.onkeyup=function(ev){	
		w=0;a=0;s=0;d=0;

}
//start the game timer and set up the game
init();
