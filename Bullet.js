function Bullet(x,y) {
	this.x = x;
	this.y = y;
	this.width = 4;
	this.height = 12;
	
	this.draw = function(ctx) {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
}
