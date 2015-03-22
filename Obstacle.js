function Obstacle(x,y) {
	this.x = x;
	this.y = y;
	this.width = 20;
	this.height = 20;
	this.state = 3;
	
	this.draw = function(ctx, spriteSheet) {
		var img;
		if(this.state == 3)
			img = 0;
		else if(this.state == 2)
			img = 1;
		else
			img = 2;
		ctx.drawImage(spriteSheet[img], this.x, this.y);
	};
}
