function Player(x,y) {
	this.x = x;
	this.y = y;
	this.width = 10;
	this.height = 20;
	this.xspeed = 12;
	this.yspeed = 12;
	
	this.draw = function(ctx) {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	
	this.moveDown = function() {
		if(this.y < 580)
			this.y = Math.min(this.y+this.yspeed, 580);
	};
	
	this.moveUp = function() {
		if(this.y > 440)
			this.y = Math.max(this.y-this.yspeed, 440);
	};
	
	this.moveLeft = function() {
		this.x = Math.max(this.x-this.xspeed, 0);
	};
	
	this.moveRight = function() {
		this.x = Math.min(this.x+this.xspeed, 590);
	};
}
