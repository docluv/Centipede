function Display(x,y) {
	this.x = x;
	this.y = y;
	this.value = 0;
	
	this.draw = function(ctx) {
		ctx.fillText(this.value, this.x, this.y);
	};
}
