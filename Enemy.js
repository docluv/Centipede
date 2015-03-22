function Enemy(x,y) {
	this.x = x;
	this.y = y;
	this.width = 20;
	this.height = 20;
	this.xspeed = 10;
	this.yspeed = 0;
	this.speedConst = 10;
	this.xdirection = "right";
	this.ydirection = "down";
	this.ymark = -99;
	this.xmark = -99;
	this.dead = false;
	this.frame = 0;
	this.stage = 1;
	
	this.update = function(obstacles, enemies) {
		var obstacleFound = false;
		if(this.xspeed > 0) {
			for(var i=0; i < obstacles.length && obstacleFound == false; i++) {
				if(obstacles[i].y == this.y && obstacles[i].x-20 == this.x) {
					this.xspeed = 0;
					this.yspeed = this.speedConst;
					if(this.ydirection == "up")
						this.yspeed*=-1;
					this.ymark = this.y;
					obstacleFound = true;
				}
			}
			if(!obstacleFound) {
				this.x = Math.min(this.x+this.xspeed, 580);
				if(this.x == this.xmark+20) {
					this.xspeed = 0;
					this.yspeed = this.speedConst;
					if(this.ydirection == "up")
						this.yspeed *= -1;
					this.ymark = this.y;
					this.xmark = -99;
					var enemyFound = false;
					for(var j=0; j < enemies.length && enemyFound == false; j++) {
						if(enemies[j].x == this.x-20 && enemies[j].y == this.y) {
							enemies[j].xmark = enemies[j].x;
							if(enemies[j].y == 460 && enemies[j].ydirection == "up")
								enemies[j].ydirection = "down";
							else if(enemies[j].y == 580 && enemies[j].ydirection == "down")
								enemies[j].ydirection = "up";
							enemyFound = true;
						}
					}
				}
				if(this.x == 580) {
					this.xspeed = 0;
					if(this.y == 580)
						this.ydirection = "up";
					else if(this.y == 460 && this.ydirection == "up")
						this.ydirection = "down";
					this.yspeed = this.speedConst;
					if(this.ydirection == "up")
						this.yspeed *= -1;
					this.ymark = this.y;
				}
			}
		} else if(this.xspeed < 0) {
			for(var i=0; i < obstacles.length && obstacleFound == false; i++) {
				if(obstacles[i].y == this.y && obstacles[i].x+20 == this.x) {
					this.xspeed = 0;
					this.yspeed = this.speedConst;
					if(this.ydirection == "up")
						this.yspeed*=-1;
					this.ymark = this.y;
					obstacleFound = true;
				}
			}
			if(!obstacleFound) {
				this.x = Math.max(this.x+this.xspeed, 0);
				if(this.x == this.xmark-20) {
					this.xspeed = 0;
					this.yspeed = this.speedConst;
					if(this.ydirection == "up")
						this.yspeed *= -1;
					this.ymark = this.y;
					this.xmark = -99;
					var enemyFound = false;
					for(var j=0; j < enemies.length && enemyFound == false; j++) {
						if(enemies[j].x == this.x+20 && enemies[j].y == this.y) {
							enemies[j].xmark = enemies[j].x;
							if(enemies[j].y == 460 && enemies[j].ydirection == "up")
									enemies[j].ydirection = "down";
							else if(enemies[j].y == 580 && enemies[j].ydirection == "down")
									enemies[j].ydirection = "up";
							enemyFound = true;
						}
					}
				}
				if(this.x <= 0) {
					this.xspeed = 0;
					if(this.y == 580)
						this.ydirection = "up";
					else if(this.y == 460 && this.ydirection == "up")
						this.ydirection = "down";
					this.yspeed = this.speedConst;
					if(this.ydirection == "up")
						this.yspeed *= -1;
					this.ymark = this.y;
				}
			}
		} else if(this.yspeed > 0) {
			this.y = Math.min(this.y+this.yspeed, this.ymark+20);
			if(this.y == this.ymark+20) {
				if(this.x == 0) {
					this.xspeed = this.speedConst;
					this.xdirection = "right";
				}
				else if(this.x == 580) {
					this.xspeed = this.speedConst*-1;
					this.xdirection = "left";
				}
				else if(this.xdirection == "left") {
					this.xdirection = "right";
					this.xspeed = this.speedConst;
				}
				else if(this.xdirection == "right") {
					this.xdirection = "left";
					this.xspeed = this.speedConst*-1;
				}
				this.yspeed = 0;
				this.ymark = -99;
			}
		} else if(this.yspeed < 0) {
			this.y = Math.max(this.y+this.yspeed, this.ymark-20);
			if(this.y == this.ymark-20) {
				if(this.x == 0) {
					this.xspeed = this.speedConst;
					this.xdirection = "right";
				}
				else if(this.x == 580) {
					this.xspeed = this.speedConst*-1;
					this.xdirection = "left";
				}
				else if(this.xdirection == "left") {
					this.xdirection = "right";
					this.xspeed = this.speedConst;
				}
				else if(this.xdirection == "right") {
					this.xdirection = "left";
					this.xspeed = this.speedConst*-1;
				}
				this.yspeed = 0;
				this.ymark = -99;
			}
		}
	};
	
	this.draw = function(ctx, spriteSheet, pausedAnimation) {
		/*ctx.beginPath();
		ctx.arc(this.x+10, this.y+10, 10, 0, Math.PI*2);
		ctx.closePath();
		ctx.fill();*/
		if(!pausedAnimation)
			this.frame++;
		if(this.stage == 1 && this.frame >= 10) {
			this.stage = 2;
			this.frame = 0;
		} else if(this.stage == 3 && this.frame >= 10) {
			this.stage = 4;
			this.frame = 0;
		} else if(this.stage == 2 && this.frame >= 5) {
			this.stage = 3;
			this.frame = 0;
		} else if(this.stage == 4 && this.frame >= 5) {
			this.stage = 1;
			this.frame = 0;
		}
		var img;
		// Horizontal animation
		if(this.xspeed != 0) {
			if(this.stage == 1) 
				img = 0;
			else if(this.stage == 2 || this.stage == 4) 
				img = 1;
			else if(this.stage == 3) 
				img = 2;
		} 
		// Vertical animation
		else {
			// Top of animation
			if(this.y%20 <= 7) {
				// Going to move right
				if(this.xdirection == "left") {
					if(this.ydirection == "down") 
						img = 3;
					else
						img = 5;
				}
				// Going to move left
				else {
					if(this.ydirection == "down") 
						img = 6;
					else
						img = 7;
				}
			// Bottom of animation
			} else if(this.y%20 >= 14) {
				// Going to move right
				if(this.xdirection == "left") {
					if(this.ydirection == "down")
						img = 5;
					else
						img = 5;
				} else {
					if(this.ydirection == "down")
						img = 7;
					else
						img = 7;
				}
			// Middle of animation
			} else
				img = 4;
		}
		
		ctx.drawImage(spriteSheet[img], this.x, this.y);
	};
}
