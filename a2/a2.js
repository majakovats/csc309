// Maja Kovats
// CSC309
// Student #: 999570236

/* Reference for bug movement: http://www.somethinghitme.com/2013/11/13/snippets-i-always-forget-movement/*/

// Display Start Screen
var showStart = function() {
	document.getElementById("startPage").style.visibility = "visible";
	document.getElementById("gameOver").style.visibility = "hidden";

	document.getElementById("gameContent").style.visibility = "hidden";
	document.getElementById("noLevel").style.visibility = "hidden";
	
	document.getElementById("high").innerHTML = localStorage.getItem("highScore");
}

showStart();

// Level Selection Functions
function select1() {
	level = 1;
	speedMult = 1;
	if (document.getElementById("level2").checked == true) {
		document.getElementById("level2").checked = false;
	}
}

function select2() {
	level = 2;
	speedMult = 1.33;
	if (document.getElementById("level1").checked == true) {
		document.getElementById("level1").checked = false;	
	}	
}	

// Set up canvas
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 400,
    height = 700,
    bugs = [],
    foods = [],
    mX = 0,
    mY = 0;

// Initial Variables
pause = false;
time = 10;
score = 0;
started = false;
myStorage = localStorage;
canvas.width = width;
canvas.height = height;

myStorage = localStorage;
localStorage.setItem("highScore", 0);


// Event Listeners
canvas.addEventListener("mousedown", function (e) {
		mX = e.offsetX;
		mY = e.offsetY;
});

canvas.addEventListener("mouseup", function (e) {
		mX = 0;
		mY = 0;
});

// Bug Definition 
var Bug = function (x, y, radius, color, speed) {
    this.x = x || 0;
    this.y = y || 0;
    this.radius = radius || 10;
    this.color = color;
    this.speed = speed * speedMult;
    this.pointLength = 20;
    this.px = 0;
    this.py = 0;
    this.r = 0;
    
    this.food = 0;
    this.foodX = 0;
    this.foodY = 0;
    
    this.velX = 0;
    this.velY = 0;
}

// Food Definition 
var Food = function (x, y) {
	this.x = x;
	this.y = y;
}

// Bug Removal and Score Counting
remove = function(mX,mY,i){
	var x = mX;
	var y = mY;
	var cx = bugs[i].x - x;
	var cy = bugs[i].y - y;
	var mdist = Math.sqrt(cx*cx + cy*cy);
	if (mdist < bugs[i].radius) {
		if (bugs[i].color == "#ffa500"){
			score += 1;
		}
		else if (bugs[i].color == "#ff0000"){
			score += 3;
		}
		else {
			score += 5;
		}
		return true;
	}
	return false;
}

// Updating Bug's Progress
Bug.prototype.update = function () {	

    	// get the food x and y       
    	this.foodX = foods[0].x;
    	this.foodY = foods[0].y;

    	// Get the distance 
    	var tx = this.foodX - this.x;
    	var ty = this.foodY - this.y;
    	var dist = Math.sqrt(tx * tx + ty * ty);
    
    	var currX, currY, currDist;
    	for(var f = 0; f < foods.length; f++){
        	currX = foods[f].x - this.x;
    		currY = foods[f].y - this.y;
   			currDist = Math.sqrt(currX * currX + currY * currY);
     
        	if(currDist < dist){
            	dist = currDist;
            	this.foodX = foods[f].x;
            	this.foodY = foods[f].y;
            	tx = this.foodX - this.x;
            	ty = this.foodY - this.y;
        	}
    	}
    
	    // Calculate velocity
	    this.velX = (tx / dist) * this.speed;
	    this.velY = (ty / dist) * this.speed;
    
	   // Direction bug needs to face 
	    var radians = Math.atan2(-ty,-tx);
    
	    this.px = this.x - this.pointLength * Math.cos(radians);
	    this.py = this.y - this.pointLength * Math.sin(radians);
	    
	    this.r = Math.atan2((this.y - this.py), ((this.x+10) - this.px));

 	   // Move to food 
 	   if (dist > this.radius/2) {
	        this.x += this.velX;
	        this.y += this.velY;
    	}
    	// Eat food
    	else{
        	var findex = foods.indexOf(this.food);
        	foods.splice(findex, 1);
        	if (foods.length == 0){
        		gameOver();
        	}
        	this.food = foods[0];
        
        	this.foodX = foods[0].x;
    		this.foodY = foods[0].y;
        	tx = this.foodX - this.x;
    		ty = this.foodY - this.y;
    		dist = Math.sqrt(tx * tx + ty * ty);
        	for(f = 0; f < foods.length; f++){
        		currX = foods[f].x - this.x;
    			currY = foods[f].y - this.y;
   				currDist = Math.sqrt(currX * currX + currY * currY);
        		if(currDist < dist){
					dist = currDist; 
                	this.food = foods[f];
        		}
    		}
    	}
};

// Drawing Bug
Bug.prototype.render = function () {	

	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.rotate(this.r);
	
	ctx.strokeStyle = this.color;
	ctx.beginPath();
    ctx.moveTo(0,-20);
    ctx.lineTo(0,20);
    ctx.closePath();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(10,-20);
    ctx.lineTo(10,20);
    ctx.closePath();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(20,-20);
    ctx.lineTo(20,20);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = this.color;
    ctx.beginPath();
	ctx.arc(0,0,10,0,2*Math.PI);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
	ctx.arc(10,0,10,0,2*Math.PI);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
	ctx.arc(20,0,10,0,2*Math.PI);
    ctx.closePath();
    ctx.fill();

	ctx.restore();	
   
};

// Drawing Food
Food.prototype.render = function () {

	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.x-10,this.y+40);
	ctx.closePath();
	ctx.stroke();

	ctx.fillStyle = "#00BFFF";
	ctx.beginPath();
	ctx.arc(this.x,this.y,20,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.arc(this.x,this.y,17,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle = "#FFFF00";
	ctx.beginPath();
	ctx.arc(this.x,this.y,15,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.arc(this.x,this.y,12,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle = "#FF0000";
	ctx.beginPath();
	ctx.arc(this.x,this.y,10,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.arc(this.x,this.y,7,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle = "#00BFFF";
	ctx.beginPath();
	ctx.arc(this.x,this.y,4,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
};

function release () {
	if (pause == false) {
		var rand = Math.random();
		var x = Math.random() * 400;
		if (rand <= 0.4) {
			bugs.push(new Bug(x, 100 , 20, "#ffa500", 0.6));
		}
		else if (rand <= 0.7){
			bugs.push(new Bug(x, 100 , 20, "#ff0000", .75));
		}
		else {
			bugs.push(new Bug(x, 100, 20, "#000000", 1.5));
		}
	}						
}

function increment() {
	if (pause == false) {
		time-= 1;
	}
}

function throwFood () {
	for(var j = 1; j < 6; j++){
		var x = Math.floor((Math.random() * 400) + 1);
		var y = Math.floor((Math.random() * 400) + 200);
		foods.push(new Food(x, y));
	}
}

// Starting Game
function start () {
	throwFood();
	releaseBug = setInterval(release, Math.random()*3000);
	timer = setInterval(increment, 1000);
	if (document.getElementById("level1").checked == false && document.getElementById("level2").checked == false) {
		document.getElementById("noLevel").style.visibility = "visible";
	}
	document.getElementById("startPage").style.visibility = "hidden";
    document.getElementById("gameContent").style.visibility = "visible";
    document.getElementById("gameOver").style.visibility = "hidden";
    render();
	started = true;
}

// Reset Game
function reset () {
	var currScore = localStorage.getItem("highScore");
	if (score > currScore){
		localStorage.setItem("highScore", score);
		document.getElementById("high").innerHTML = localStorage.getItem("highScore");
	}
	bugs = [];
	foods = [];
	time = 10;
	clearInterval(releaseBug);
	clearInterval(timer);
	started = false;
}

function nextLevel () {
	if (level == 2){
		reset();
		showStart();
	}
	else{
		reset();
		select2();
		start();
	}
} 

var gameOver = function () {
	document.getElementById("gameOver").style.visibility = "visible";
	document.getElementById("gameContent").style.visibility = "hidden";	
	document.getElementById("noLevel").style.visibility = "hidden";
	reset();	
}

var pauseButton = function(mX, mY) {	
	if (mX > 180 && mX < 220 && mY > 10 && mY < 50) {
		if (pause == false) {
			pause = true;
		} 
		else{
			pause = false;
		}
	}
}
			
function render() {

	if (time == 0 && foods.length > 0) {
		nextLevel();
	}
	
	if (time == 0 || foods.length < 1){
		gameOver();
	}

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#FFFFFF";
    ctx.rect(0, 0, width, 65);
    ctx.fill();
 	ctx.beginPath();
    ctx.moveTo(0,65);
    ctx.lineTo(400,65);
    ctx.closePath();
	ctx.stroke();

	ctx.fillStyle = "#000000";		
	ctx.font = "20px Arial";
	ctx.fillText("Score: " + score, 300, 30);
	ctx.fill();
		
	pauseButton(mX,mY);		

	if (pause == true) {
			ctx.fillStyle = "#000000";
			ctx.font = "30px Arial";
			ctx.fillText(time+"s", 20, 30);

			ctx.rect(180, 10, 40, 40);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(190,15);
			ctx.lineTo(210,30);
			ctx.lineTo(190,45);
			ctx.closePath();
			ctx.fill();
			
			bugs.forEach(function(el){
				el.render();
			});
			foods.forEach(function(el){
				el.render();
			});
		 	requestAnimationFrame(render);
		}
	else{			
			ctx.fillStyle = "#000000";
			ctx.font = "30px Arial";
			ctx.fillText(time+"s", 20, 30);
			
			ctx.rect(180, 10, 40, 40);
			ctx.stroke();
			ctx.beginPath();			
			ctx.moveTo(190, 15);
			ctx.lineTo(190, 45);
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(210, 15);
			ctx.lineTo(210, 45);
			ctx.closePath();
			ctx.stroke();
    		
			for(var k = 0; k < bugs.length; k++){
				var bindex = remove(mX,mY,k);
				if(bindex == true){
					bugs.splice(bugs[k], 1);
					break;
				}
			}

			bugs.forEach(function(el){
        		//el.remove(mX,mY);
        		el.update();
        		el.render();
    		});
			
			foods.forEach(function(el){
				el.render();
			});
 			requestAnimationFrame(render);
 		}
}
