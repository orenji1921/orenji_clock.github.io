var canvas = document.querySelector('canvas');
canvas.width = innerWidth*window.devicePixelRatio;
canvas.height = innerHeight*window.devicePixelRatio;
canvas.getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio);

document.addEventListener("click",onClick);
document.addEventListener("mousedown", onHold);

var ctx = canvas.getContext('2d');
var rec = [];
var particle = [];

// ctx.beginPath();
// ctx.moveTo(50, 300);
// ctx.lineTo(300, 100);
// ctx.lineTo(400, 300);
// ctx.stroke();

function clock()
{
	var curr_date = new Date();

	var hour = curr_date.getHours();
	var minute = curr_date.getMinutes();
	var second = curr_date.getSeconds();
	var ampm = "";

	hour > 12 ? ampm = "PM" : ampm = "AM";
	hour < 10 ? hour = "0" + hour : hour;
	minute < 10 ? minute = "0" + minute : minute;
	second < 10 ? second = "0" + second : second

	var time = hour + " : " + minute + " : " + second + " " + ampm;

	return time;
}
	

function loop()
{
	//ctx.clearRect(0, 0, innerWidth, innerHeight);

	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, innerWidth, innerHeight);

	var time = clock();

	ctx.textBaseLine = "middle";
	ctx.textAlign = "center";
	ctx.font = "100px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText(time, canvas.width / 2, canvas.height / 2);

	for(var i = 0; i < rec.length; i++)
	{
		var isBlown = rec[i].update();
		rec[i].draw();
		if(isBlown) rec.splice(i, 1);
	}

	for(var i = 0; i < particle.length; i++)
	{
		particle[i].update();
		particle[i].draw();

		if(particle[i].life > 100) particle.splice(i, 1);
	}

	var random = Math.floor(Math.random() * 101);

	//if(Math.random()<1/60) rec.push(new Circle(Math.floor(Math.random() * innerWidth)));
}

setInterval(loop, 1/60);


function onClick(e)
{	
	var x = e.clientX;
	var y = e.clientY;

	//ctx.fillRect(e.clientX, e.clientY, 50,50);

	let ver = "";
	let hori = "";

	rec.push(new Circle(x));

	//alert(x + " : " + y);
}

function onHold(e)
{
	
}

function randomCol()
{
	var letter = '0123456789ABCDEF';
	var nums = [];

	for(var i=0; i<3; i++){
		nums[i] = Math.floor(Math.random()*256);
	}

	let brightest = 0;
	for(var i=0; i<3; i++){
		if(brightest<nums[i]) brightest = nums[i];
	}

	brightest /=255;
	for(var i=0; i<3; i++){
		nums[i] /= brightest;
	}

	let color = "#";
	for(var i=0; i<3; i++){
		color += letter[Math.floor(nums[i]/16)];
		color += letter[Math.floor(nums[i]%16)];
	}

	return color;
}

function randomVec(max)
{
	let dir = Math.random()*Math.PI*2;
	let spd = Math.random()*max;
	return{x: Math.cos(dir)*spd, y: Math.sin(dir)*spd};
}

class Circle
{
	constructor(x)
	{
		this.x = x;

		var random_ver = Math.floor(Math.random() * 2);
		var random_hori = Math.floor(Math.random() * 2);

		if(random_ver == 0)
		{
			this.y = 0;
			this.ver = "top";
		}
		else if(random_ver == 1)
		{
			this.y = innerHeight;
			this.ver = "bottom";
		}

		if(random_hori == 0) this.hori = "left";
		else if(random_hori == 1) this.hori = "right";


		this.vel = 3;
		this.radius = 8;
		this.isBlown = false;
		this.col = randomCol();	
		this.life = 0;
	}

	update()
	{	
		if(this.ver == "top") this.y += this.vel;
		else if(this.ver == "bottom") this.y -= this.vel;

		if(this.y < 0) this.ver = "top";
		else if(this.y > innerHeight) this.ver = "bottom";

		if(this.hori == "left") this.x += this.vel;
		else if(this.hori == "right") this.x -= this.vel;

		if(this.x < 0) this.hori = "left";
		else if(this.x > innerWidth) this.hori = "right";

		this.life++;

		if(this.life == 800)
		{
			this.isBlown = true;
			
			for(var i = 0; i < 140; i++)
			{
				particle.push(new Particle(this.x, this.y, this.col));
			}
		}

		return this.isBlown;
	}

	draw()
	{
		// ctx.globalAlpha = 1;
		// ctx.fillStyle = this.col;
		// ctx.fillRect(this.x, this.y, 15, 15);

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.strokeStyle = this.col;
		ctx.stroke();
	}
}

class Particle{
	constructor(x, y, col)
	{
		this.x = x;
		this.y = y;
		this.col = col;
		this.vel = randomVec(2);
		this.life = 0;
		this.size = 2;
	}

	update(){
		this.x += this.vel.x;
		this.y += this.vel.y;
		this.vel.y += 0.01;
		this.vel.x *= 1;
		this.vel.y *= 1;
		this.life++;
	}

	draw(){
		// ctx.beginPath();
		// ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		// ctx.strokeStyle = this.col;
		// ctx.stroke();

		ctx.globalAlpha = Math.max(1-this.lifetime/80, 0);
		ctx.fillStyle = this.col;
		ctx.fillRect(this.x, this.y, 5, 5);
	}
}
