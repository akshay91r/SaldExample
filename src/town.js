/*
Build system issues
Main loop
-involving resizing support(get and set up canvas)
-key input
-actual animation loop and update() or tick() 
Tilemap support
-loading / drawing functions
-authoring
-user data/tags
Sprite support
*/
var TileSize = 20;
var skySize = 256;//size of image
var PlayerSpeed = 10.0; //tiles per second
var shipAngle = 0;
var shipScale = 5;
var shipPosX = 5;
var shipPosY = 5;

var heroImgs = [
	require("../img/hero1.png"),
	require("../img/hero2.png"),
	require("../img/hero3.png")
];

var sprite = require('sald:Sprite.js');

var tilesImg = require("../img/ground.png");
var skyImg = require("../img/sky.png");
var spaceshipImg = require("../img/spaceship.png");
var heroImg = require("../img/HeroSpriteh.png");
var squareImg = require("../img/square.png");

//var shipSprite = new sprite(heroImg, { 'walk' : { x:0,y:0, width:20,height:20, size:3 }});
var shipSprite = new sprite(squareImg, { 'walk' : { x:0,y:0, width:32,height:32, size:1}},{x:1,y:1,angle:shipAngle,scaleX:1,scaleY:1,anchorX:0.5,anchorY:0.5});
//shipSprite.animators['walk'].loop(true); 						
//posX,posY,angle,scaleX,scaleY,anchorX,anchorY
//shipSprite.draw('walk',player.x,player.y,shipAngle,5,5,0,0);

var map = [
	/*[6,1,1,1,1,1,1,1,8],
	[3,4,4,4,4,4,4,4,3],
	[3,4,4,6,7,8,4,4,3],
	[3,4,4,5,4,3,4,4,3],
	[3,4,4,3,4,3,4,4,3],
	[3,4,4,4,4,5,4,4,3],
	[3,4,4,0,1,2,4,4,3],
	[3,4,4,4,4,4,4,4,3],
	[3,4,4,4,4,4,4,4,3],
	[3,4,4,4,4,4,4,4,3],
	[0,1,1,1,1,1,1,1,2]*/
];



//camera position (in tiles):
var camera = {
	x: 4.5,
	y: 5.5
};

//player position (in tiles):
var player = {
	x: 4.5,
	y: 5.5,
	frameAcc: 0.0,
	frame: 0,
};


function draw() {
	var ctx = window.sald.ctx;
	//First, clear the screen:
	ctx.setTransform(ctx.factor,0, 0,ctx.factor, 0,0);
	ctx.fillStyle = "#f0f"; //bright pink, since this *should* be drawn over

	ctx.fillRect(0, 0, 320, 240); //<--- hardcoded size. bad style!

	//don't interpolate scaled images. Let's see those crisp pixels:
	ctx.imageSmoothingEnabled = false;

	//Now transform into camera space:
	//  (units are tiles, +x is right, +y is up, camera is at the center:
	ctx.setTransform(
		//x direction:
			ctx.factor * TileSize, 0,
		//y direction (sign is negative to make +y up):
			0,-ctx.factor * TileSize,
		//offset (in pixels):
			ctx.factor * (320 / 2 - Math.round(camera.x * TileSize)),
			ctx.factor * (240 / 2 + Math.round(camera.y * TileSize)) //<-- y is added here because of sign flip
		);

	(function rotate_spaceship() {
		//var img = heroImgs[player.frame];
		shipAngle += 1;
		shipPosX += 0.1;
		shipPosY += 0.1;
		//shipScale += 0.1;
		//shipSprite.setRotation(shipAngle);
		//shipSprite.setScale(shipScale,shipScale);
		//shipSprite.setPosition(shipPosX,shipPosY);
		//shipSprite.draw('walk',5,5,shipAngle,5,5,0,0);
		shipSprite.draw('walk');
		//shipSprite.draw('walk',player.x,player.y,shipAngle,5,5,0,0);
	})();
}

function update(elapsed) {
	var command = {
		x:0.0,
		y:0.0
	};
	var keys = window.sald.keys;
	//First column is 'wasd', second is arrow keys:
	if (keys['LEFT']) {command.x -= 1.0; }
	if (keys['RIGHT']) command.x += 1.0;
	if (keys['DOWN']) command.y -= 1.0;
	if (keys['UP']) command.y += 1.0;
	
	if (command.x != 0.0 || command.y != 0.0) {
		var len = Math.sqrt(command.x * command.x + command.y * command.y);
		command.x /= len;
		command.y /= len;

		player.x += command.x * PlayerSpeed * elapsed;
		player.y += command.y * PlayerSpeed * elapsed;

console.log("player x : " + player.x);

		//alternate player frames 1 and 2 if walking:
		player.frameAcc = (player.frameAcc + (elapsed * PlayerSpeed) / 0.3) % 2; 
		player.frame = 1 + Math.floor(player.frameAcc);
	} else {
		//player is stopped:
		player.frame = 0;
	}

	//pan camera if player is within 3 tiles of the edge:
	camera.x = Math.max(camera.x, player.x - (320 / TileSize / 2 - 3));
	camera.x = Math.min(camera.x, player.x + (320 / TileSize / 2 - 3));
	camera.y = Math.max(camera.y, player.y - (240 / TileSize / 2 - 3));
	camera.y = Math.min(camera.y, player.y + (240 / TileSize / 2 - 3));

}

function key(key, state) {
	//don't do anything
}


module.exports = {
	draw:draw,
	update:update,
	key:key
};
