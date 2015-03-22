function Spider(x,y) {
	this.x = x;
	this.y = y;
	this.height = 20;
	this.width = 40;
	this.xspeed;
	this.yspeed;
	this.speedConst = 8;
	this.speedConstB = 4;
	this.xmark;
	this.ymark;
	this.upperBound = 360;
	this.lowerBound = 540;
	this.bigShift = 120;
	this.littleShift = 30;
	
	this.generateMove = function() {
		var r = Math.random();
		// AT BOTTOM
		if(this.y == 600-this.height) {
			if(r <= .25) { // Retreat up
				this.xmark = this.x;
				this.ymark = this.upperBound;
				this.xspeed = 0;
				this.yspeed = this.speedConst*-1;
			} else if(r <= .5) { // Fake up
				this.xmark = this.x;
				this.ymark = this.lowerBound;
				this.xspeed = 0;
				this.yspeed = this.speedConst*-1;
			} else if(r <= .75) { // Swoop up-right
				this.xmark = this.x+this.bigShift;
				this.ymark = this.upperBound;
				this.xspeed = this.speedConstB;
				this.yspeed = this.speedConst*-1;
			} else { // Swoop up-left
				this.xmark = this.x-this.bigShift;
				this.ymark = this.upperBound;
				this.xspeed = this.speedConstB*-1;
				this.yspeed = this.speedConst*-1;
			} 
		// AT TOP
		} else if(this.y == this.upperBound) {
			if(r <= .25) { // Strike down
				this.xmark = this.x;
				this.ymark = 600-this.height;
				this.xspeed = 0;
				this.yspeed = this.speedConst;
			} else if(r <= .5) { // Fake down
				this.xmark = this.x;
				this.ymark = this.lowerBound;
				this.xspeed = 0;
				this.yspeed = this.speedConst;
			} else if(r <= .75) { // Strike right
				this.xmark = this.x+this.bigShift;
				this.ymark = 600-this.height;
				this.xspeed = this.speedConstB;
				this.yspeed = this.speedConst;
			} else { // Strike left
				this.xmark = this.x-this.bigShift;
				this.ymark = 600-this.height;
				this.xspeed = this.speedConstB;
				this.yspeed = this.speedConst;
			}
		// AT FAKE UP
		} else if(this.y == this.lowerBound) {
			if(r <= .33) {
				this.xmark = this.x;
				this.ymark = 600-this.height;
				this.xspeed = 0;
				this.yspeed = this.speedConst;
				this.xspeed=0;
			} else if(r <= .66) {
				this.xmark = this.x+this.littleShift;
				this.ymark = 600-this.height;
				this.xspeed = this.speedConstB;
				this.yspeed = this.speedConst;
			} else {
				this.xmark = this.x-this.littleShift;
				this.ymark = 600-this.height;
				this.xspeed = this.speedConstB*-1;
				this.yspeed = this.speedConst;
			}
		}
	};
	
	this.update = function() {
		this.x += this.xspeed;
		this.y += this.yspeed;
		if(this.xspeed > 0) {
			this.x = Math.min(this.x, this.xmark);
		} else if(this.speedx < 0) {
			this.x = Math.max(this.x, this.xmark);
		}
		if(this.yspeed > 0) {
			this.y = Math.min(this.y+this.yspeed, 580);
			this.y = Math.min(this.y, this.ymark);
		} else if(this.yspeed < 0) {
			this.y = Math.max(this.y+this.yspeed, 0);
			this.y = Math.max(this.y, this.ymark);
		}
		
		if(this.x == this.xmark && this.y == this.ymark) {
			this.generateMove();
		}
	};
	
	this.draw = function(context, spriteSheet) {
		context.drawImage(spriteSheet[0], this.x, this.y);
	};
	
	this.generateMove();
}