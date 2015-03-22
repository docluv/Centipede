function Game() {
	canvas = document.getElementById('game');
	this.context = canvas.getContext('2d');
	this.context.fillStyle = 'white';
	this.context.font = "10px Arial";
	this.width = canvas.width;
	this.height = canvas.height;
	this.paused = false;
	this.playerPaused = false;
	this.gameStarted = false;
	this.setupGame = true;
	this.enemiesDead = 0;
	this.framesSincePause = 0;
	this.color = 1;
	
	this.titleImage = new Image();
	this.titleImage.src = "title.png";
	
	var img1 = new Image();
	img1.src = 'redblue_x_1.png';
	var img2 = new Image();
	img2.src = 'redblue_x_2.png';
	var img3 = new Image();
	img3.src = 'redblue_x_3.png';
	var img4 = new Image();
	img4.src = 'redblue_y_1.png';
	var img5 = new Image();
	img5.src = 'redblue_y_2.png';
	var img6 = new Image();
	img6.src = 'redblue_y_3.png';
	var img7 = new Image();
	img7.src = 'redblue_y_4.png';
	var img8 = new Image();
	img8.src = 'redblue_y_5.png';
	this.enemy_sprites = [img1, img2, img3, img4, img5, img6, img7, img8];
	
	var img9 = new Image();
	img9.src = 'red_obstacle_1.png';
	var img10 = new Image();
	img10.src = 'red_obstacle_2.png';
	var img11 = new Image();
	img11.src = 'red_obstacle_3.png';
	this.obstacle_sprites = [img9, img10, img11];
	
	var img12 = new Image();
	img12.src = 'red_spider.png';
	this.spider_sprites = [img12];
	
	this.score = new Display(10, 10);
	this.score.value = 0;
	this.level = new Display(580, 10);
	this.level.value = 1;
	this.lives = 3;
	this.rank = 1;
	
	this.bullets = [];
	this.enemies = [];
	this.spiders = [];
	this.obstacles = [];
	this.numEnemies;

	// ---Sound files---
	// sounds[0] - shoot
	// sounds[1] - hit
	// sounds[2] - victory
	// sounds[3] - death
	// sounds[4] - extra life
	// sounds[5] - revive mushroom
	// sounds[6] - background
	this.sounds = [new Audio("shoot.wav"), new Audio("hit.wav"), new Audio("victory.wav"), new Audio("death.wav"), new Audio("hallelujah.wav"),
					new Audio("revive.wav"), new Audio("background.mp3")];
	
	this.keys = new KeyListener();
	
	this.p1 = new Player(this.width/2,this.height - 30);
	
	this.sounds[6].load();
	this.sounds[6].play();
	
	this.spiders.push(new Spider(360, 360));
	
	this.update = function() {
	
	if(this.gameStarted == false) {
		if(this.keys.isPressed(32))
			this.gameStarted = true;
	}
		
		// INPUT PAUSE
		if(this.keys.isPressed(27)) {
			if(this.paused && this.framesSincePause > 10) {
				this.paused = false;
				this.framesSincePause=0;
			}
			else if(this.framesSincePause > 10) {
				this.paused = true;
				this.framesSincePause=0;
			}
		}
		this.framesSincePause++;
		if(this.paused)
			return;
		
			
		// BULLETS
		if(this.bullets.length != 0) {
			// Update bullet positions
			this.bullets[0].y -= 35;
			// Remove invalid bullets
				if(this.bullets[0].y < 0)
					this.bullets.shift();
		}
		
		// UPDATE ENEMY POSITIONS
		for(var i=0; i < this.enemies.length; i++) {
			this.enemies[i].update(this.obstacles, this.enemies);
		}
		
		// INPUT ARROWS AND PLAYER POSITION
		if(!this.p1.dead && !this.playerPaused) {
			if(this.keys.isPressed(40))
				this.p1.moveDown();
			if(this.keys.isPressed(38))
				this.p1.moveUp();
			if(this.keys.isPressed(37))
				this.p1.moveLeft();
			if(this.keys.isPressed(39))
				this.p1.moveRight();
		}
			
		// INPUT FIRING
		if(this.keys.isPressed(32) && this.bullets.length == 0 && !this.playerPaused) {
			this.bullets.push(new Bullet(this.p1.x+3, this.p1.y-2));
			this.sounds[0].load();
			this.sounds[0].play();
		}
		
		// ENEMY-BULLET COLLISION
		if(this.bullets.length > 0) {
			for(var i=0; i < this.enemies.length && this.bullets.length > 0; i++) {
				if(this.enemies[i].dead != true)
					if(this.bullets[0].x <= this.enemies[i].x + this.enemies[i].width &&
							this.bullets[0].x + this.bullets[0].width > this.enemies[i].x) {
						if(this.enemies[i].y+this.enemies[i].height >= this.bullets[0].y &&
								this.bullets[0].y+35 > this.enemies[i].y+this.enemies[i].height) {
							this.obstacles.push(new Obstacle(this.enemies[i].x-this.enemies[i].x%20, this.enemies[i].y-this.enemies[i].y%20));
							this.enemies.splice(i, 1);
							this.enemiesDead++;
							this.bullets.shift();
							this.score.value += 100;
							this.sounds[1].load();
							this.sounds[1].play();
						}
					}
			}
		}
		
		// BULLET-OBSTACLE COLLISION
		if(this.bullets.length > 0) {
			for(var i=0; i < this.obstacles.length && this.bullets.length > 0; i++) {
				if(this.obstacles[i].state != 0)
					if(this.bullets[0].x <= this.obstacles[i].x + this.obstacles[i].width &&
							this.bullets[0].x + this.bullets[0].width > this.obstacles[i].x) {
						if(this.obstacles[i].y+this.obstacles[i].height >= this.bullets[0].y &&
								this.bullets[0].y+35 > this.obstacles[i].y + this.obstacles[i].height) {
							this.obstacles[i].state--;
							this.score.value++;
							if(this.obstacles[i].state == 0) {
								this.obstacles.splice(i, 1);
								this.score.value += 9;
							}
							this.bullets.shift();
						}		
					}
			}
		}
		
		// ENEMY-ENEMY COLLISION
		// BUG: When chains collide, extra pieces don't follow if not matched by other chain.
		for(var i=0; i < this.enemies.length-1; i++) {
			var collisionFound = false;
			for(var j=i+1; j < this.enemies.length && collisionFound == false; j++) {
				// i<->j
				if(this.enemies[i].xspeed > 0) {
					if(this.enemies[j].xspeed < 0) {
						if(this.enemies[j].x <= this.enemies[i].x+this.enemies[i].width &&
								this.enemies[j].x >= this.enemies[i].x) {
							if(this.enemies[i].y == this.enemies[j].y) {
								// i enemy recalculations
								this.enemies[i].xspeed = 0;
								this.enemies[i].yspeed = this.enemies[i].speedConst;
								// if collision is on top or bottom
								if(this.enemies[i].y == 580 && this.enemies[i].ydirection == "down")
									this.enemies[i].ydirection = "up";
								else if(this.enemies[i].y == 460 && this.enemies[i].ydirection == "up")
									this.enemies[i].ydirection = "down";
								
								if(this.enemies[i].ydirection == "up")
									this.enemies[i].yspeed *= -1;
								this.enemies[i].ymark = this.enemies[i].y;
								// check for trailing enemies
								for(var k=0; k < this.enemies.length; k++) {
									if(k != i && this.enemies[i].x == this.enemies[k].x+20 && 
											this.enemies[i].y == this.enemies[k].y) {
										this.enemies[k].xmark = this.enemies[k].x;
										if(this.enemies[k].y == 460 && this.enemies[k].ydirection == "up")
											this.enemies[k].ydirection = "down";
										else if(this.enemies[k].y == 580 && this.enemies[k].ydirection == "down")
											this.enemies[k].ydirection = "up";
									}
								}
								// j enemy recalculations
								this.enemies[j].xspeed = 0;
								this.enemies[j].yspeed = this.enemies[j].speedConst;
								// if collision is on top or bottom
								if(this.enemies[j].y == 580 && this.enemies[j].ydirection == "down")
									this.enemies[j].ydirection = "up";
								else if(this.enemies[j].y == 460 && this.enemies[j].ydirection == "up")
									this.enemies[j].ydirection = "down";
								
								if(this.enemies[j].ydirection == "up")
									this.enemies[j].yspeed *= -1;
								this.enemies[j].ymark = this.enemies[j].y;
								// check for trailing enemies
								for(var k=0; k < this.enemies.length; k++) {
									if(k != j && this.enemies[j].x == this.enemies[k].x-20 && 
											this.enemies[j].y == this.enemies[k].y) {
										this.enemies[k].xmark = this.enemies[k].x;
										if(this.enemies[k].y == 460 && this.enemies[k].ydirection == "up")
											this.enemies[k].ydirection = "down";
										else if(this.enemies[k].y == 580 && this.enemies[k].ydirection == "down")
											this.enemies[k].ydirection = "up";
									}
								}
								collisionFound = true;
							}
						}
					}
				// j<->i
				} else if(this.enemies[j].xspeed < 0) {
					if(this.enemies[i].xspeed > 0) {
						if(this.enemies[i].x <= this.enemies[j].x+this.enemies[j].width &&
								this.enemies[i].x >= this.enemies[j].x) {
							if(this.enemies[j].y == this.enemies[i].y) {
								// j enemy recalculations
								this.enemies[j].xspeed = 0;
								this.enemies[i].yspeed = this.enemies[j].speedConst;
								// if collision is on top or bottom
								if(this.enemies[j].y == 580 && this.enemies[j].ydirection == "down")
									this.enemies[j].ydirection = "up";
								else if(this.enemies[j].y == 460 && this.enemies[j].ydirection == "up")
									this.enemies[j].ydirection = "down";
									
								if(this.enemies[j].ydirection == "up")
									this.enemies[j].yspeed *= -1;
								this.enemies[j].ymark = this.enemies[j].y;
								// check for trailing enemies
								for(var k=0; k < this.enemies.length; k++) {
									if(k != j && this.enemies[j].x == this.enemies[k].x+20 && 
											this.enemies[j].y == this.enemies[k].y) {
										this.enemies[k].xmark = this.enemies[k].x;
										if(this.enemies[k].y == 460 && this.enemies[k].ydirection == "up")
											this.enemies[k].ydirection = "down";
										else if(this.enemies[k].y == 580 && this.enemies[k].ydirection == "down")
											this.enemies[k].ydirection = "up";
									}
								}
								// i enemy recalculations
								this.enemies[i].xspeed = 0;
								this.enemies[i].yspeed = this.enemies[i].speedConst;
								// if collision is on top or bottom
								if(this.enemies[i].y == 580 && this.enemies[i].ydirection == "down")
									this.enemies[i].ydirection = "up";
								else if(this.enemies[i].y == 460 && this.enemies[i].ydirection == "up")
									this.enemies[i].ydirection = "down";
								
								if(this.enemies[i].ydirection == "up")
									this.enemies[i].yspeed *= -1;
								this.enemies[i].ymark = this.enemies[i].y;
								// check for trailing enemies
								for(var k=0; k < this.enemies.length; k++) {
									if(k != i && this.enemies[i].x == this.enemies[k].x-20 && 
											this.enemies[i].y == this.enemies[k].y) {
										this.enemies[k].xmark = this.enemies[k].x;
										if(this.enemies[k].y == 460 && this.enemies[k].ydirection == "up")
											this.enemies[k].ydirection = "down";
										else if(this.enemies[k].y == 580 && this.enemies[k].ydirection == "down")
											this.enemies[k].ydirection = "up";
									}
								}
								collisionFound = true;
							}
						}
					}
				}
			}
		}
		
		// ENEMY-PLAYER COLLISION
		for(var i=0; i < this.enemies.length; i++) {
			if(this.enemies[i].x+this.enemies[i].width >= this.p1.x &&
					this.enemies[i].x+this.enemies[i].width <= this.p1.x+this.p1.width ||
				this.enemies[i].x <= this.p1.x+this.p1.width &&
					this.enemies[i].x >= this.p1.x) {
				if(this.enemies[i].y+this.enemies[i].height > this.p1.y &&
						this.enemies[i].y+this.enemies[i].height <= this.p1.y+this.p1.height ||
					this.enemies[i].y > this.p1.y &&
						this.enemies[i].y <= this.p1.y+this.p1.height) {
					this.p1.dead = true;
					this.lives--;
					this.playerPaused = true;
					this.enemies = [];
					this.spiders = [];
				}
			}
		}
		
		// SPIDER-PLAYER COLLISION
		for(var i=0; i < this.spiders.length; i++) {
			if(this.spiders[i].x+this.spiders[i].width > this.p1.x &&
					this.spiders[i].x+this.spiders[i].width < this.p1.x+this.p1.width ||
				this.spiders[i].x > this.p1.x &&
					this.spiders[i].x < this.p1.x+this.p1.width) {
				if(this.spiders[i].y+this.spiders[i].height > this.p1.y &&
						this.spiders[i].y+this.spiders[i].height < this.p1.y+this.p1.height ||
					this.spiders[i].y > this.p1.y &&
						this.spiders[i].y < this.p1.y+this.p1.height) {
					this.p1.dead = true;
					this.lives--;
					this.playerPaused = true;
					this.enemies = [];
					this.spiders = [];
				}
			}
		}
		
		// CHECK SPIDER DISAPPEARANCE
		for(var i=0; i < this.spiders.length; i++) {
			if(this.spiders[i].x+this.spiders[i].width < 0)
				this.spiders.splice(i, 1);
			else if(this.spiders[i].x > 600)
				this.spiders.splice(i, 1);
		}
		/*
		// CHECK SPIDER-BULLET COLLISION
		for(var i=0; i < this.spiders.length; i++) {
			if(this.bullets[0].x < this.spiders[i].x+this.spiders[i].width &&
					this.bullets[0].x > this.spiders[i].x ||
				this.bullets[0].x+this.bullets[0].width > this.spiders[i].x &&
					this.bullets[0].x+this.bullets[0].width < this.spiders[i].x+this.spiders[i].width) {
				if(this.bulllets[0].y < this.spiders[i].y+this.spiders[i].height &&
						this.bullets[0].y > this.spiders[i].y ||
					this.bullets[0].y+this.bullets[0].height < this.spiders[i].y+this.spiders[i].height &&
						this.bullets[0].y+this.bullets[0].height > this.spiders[i].y) {
					this.spiders.splice(i, 1);
					this.score.value += 600;
				}
			}
		}*/
		
		for(var i=0; i < this.spiders.length; i++) {
			this.spiders[i].update();
		}

		// CHECK WIN CONDITION
		if(this.enemiesDead == this.numEnemies && !this.p1.dead) {
			this.sounds[2].load();
			this.sounds[2].play();
			this.enemiesDead = 0;
			this.level.value++;
			this.generateEnemies();
		}
		
		// CHECK EXTRA LIFE
		if(this.rank==1 && this.score.value > 10000) {
			this.rank++;
			this.lives++;
			this.sounds[4].load();
			this.sounds[4].play();
		}
		
		// REVIVE OBSTACLES UPON PLAYER DEATH
		if(this.p1.dead) {
			this.p1.dead = this.reviveObstacle();
			if(!this.p1.dead)
				this.generateEnemies();
		}
		
		// CHECK GAME OVER
		if(this.lives == 0) {
			alert("Game over.");
		}

	};
	
	this.draw = function() {
		this.context.clearRect(0, 0, this.width, this.height);
		
		// TITLE
		if(!this.gameStarted) {
			this.drawTitle();
		}
		else {
			if(this.gameStarted && this.setupGame) {
				this.startGame();
				this.setupGame = false;
			}
			// PLAYER
			if(!this.p1.dead)
				this.p1.draw(this.context);
			// BULLET
			for(var i=0; i < this.bullets.length; i++) {
				this.bullets[i].draw(this.context);
			}
			// ENEMIES
			for(var i=0; i < this.enemies.length; i++) {
				this.enemies[i].draw(this.context, this.enemy_sprites, this.paused);
			}
			// SPIDERS
			for(var i=0; i < this.spiders.length; i++) {
				this.spiders[i].draw(this.context, this.spider_sprites);
			}
			// OBSTACLES
			for(var i=0; i < this.obstacles.length; i++) {
				if(this.obstacles[i].state != 0)
					this.obstacles[i].draw(this.context, this.obstacle_sprites);
			}
			// LIVES COUNTER
			for(var i=0; i < this.lives; i++) {
				this.context.fillRect(50+(i*8), 4, 4, 4);
			}
			// PAUSED
			if(this.paused) {
				this.context.font = "50px Arial";
				this.context.fillText("PAUSED", 200, 290);
				this.context.font = "10px Arial";
			}
		
			this.score.draw(this.context);
			this.level.draw(this.context);
		}
	};
	
	this.generateObstacles = function() {
		for(var i=1; i < 28; i++) {
			for(var j=0; j < 28; j++) {
				if(Math.random() <= .055) {
					this.obstacles.push(new Obstacle(i*20, j*20));
				}
			}
		}
	};
	
	this.reviveObstacle = function() {
		for(var i=0; i < this.obstacles.length; i++) {
			if(this.obstacles[i].state < 3) {
				this.obstacles[i].state++;
				this.sounds[5].load();
				this.sounds[5].play();
				return true;
			}
		}
		this.playerPaused = false;
		return false;
	};
	
	this.generateEnemies = function() {
		if(this.level.value == 1) {
			for(var i=0; i < 10; i++) {
				this.enemies.push(new Enemy(60+(i*20), 20));
			}
		} else if(this.level.value == 2) {
			for(var i=0; i < 12; i++) {
				this.enemies.push(new Enemy(60+(i*20), 20));
			}
		} else if(this.level.value == 3) {
			for(var i=0; i < 14; i++) {
				this.enemies.push(new Enemy(60+(i*20), 20));
			}
		} else if(this.level.value == 4) {
			for(var i=0; i < 16; i++) {
				this.enemies.push(new Enemy(140+(i*20), 20));
			}
		} else if(this.level.value == 5) {
			for(var i=0; i < 18; i++) {
				this.enemies.push(new Enemy(60+(i*20), 20));
			}
		} else {
			for(var i=0; i < 20; i++) {
				this.enemies.push(new Enemy(60 + (i*20), 20));
			}
		}
		if(this.level.value > 1) {
			var colorChanged = true;
			do {
				var r = Math.random();
				if(r<=.2 && this.color != 1) {
					this.enemy_sprites[0].src = "redblue_x_1.png";
					this.enemy_sprites[1].src = "redblue_x_2.png";
					this.enemy_sprites[2].src = "redblue_x_3.png";
					this.enemy_sprites[3].src = "redblue_y_1.png";
					this.enemy_sprites[4].src = "redblue_y_2.png";
					this.enemy_sprites[5].src = "redblue_y_3.png";
					this.enemy_sprites[6].src = "redblue_y_4.png";
					this.enemy_sprites[7].src = "redblue_y_5.png";
					this.obstacle_sprites[0].src = "red_obstacle_1.png";
					this.obstacle_sprites[1].src = "red_obstacle_2.png";
					this.obstacle_sprites[2].src = "red_obstacle_3.png";
				} else if(r<=.4 && this.color != 2) {
					this.enemy_sprites[0].src = "yellowpink_x_1.png";
					this.enemy_sprites[1].src = "yellowpink_x_2.png";
					this.enemy_sprites[2].src = "yellowpink_x_3.png";
					this.enemy_sprites[3].src = "yellowpink_y_1.png";
					this.enemy_sprites[4].src = "yellowpink_y_2.png";
					this.enemy_sprites[5].src = "yellowpink_y_3.png";
					this.enemy_sprites[6].src = "yellowpink_y_4.png";
					this.enemy_sprites[7].src = "yellowpink_y_5.png";
					this.obstacle_sprites[0].src = "yellow_obstacle_1.png";
					this.obstacle_sprites[1].src = "yellow_obstacle_2.png";
					this.obstacle_sprites[2].src = "yellow_obstacle_3.png";
				} else if(r<=.6 && this.color != 3) {
					this.enemy_sprites[0].src = "orangepurple_x_1.png";
					this.enemy_sprites[1].src = "orangepurple_x_2.png";
					this.enemy_sprites[2].src = "orangepurple_x_3.png";
					this.enemy_sprites[3].src = "orangepurple_y_1.png";
					this.enemy_sprites[4].src = "orangepurple_y_2.png";
					this.enemy_sprites[5].src = "orangepurple_y_3.png";
					this.enemy_sprites[6].src = "orangepurple_y_4.png";
					this.enemy_sprites[7].src = "orangepurple_y_5.png";
					this.obstacle_sprites[0].src = "orange_obstacle_1.png";
					this.obstacle_sprites[1].src = "orange_obstacle_2.png";
					this.obstacle_sprites[2].src = "orange_obstacle_3.png";
				} else if(r<=.8 && this.color != 4) {
					this.enemy_sprites[0].src = "bluewhite_x_1.png";
					this.enemy_sprites[1].src = "bluewhite_x_2.png";
					this.enemy_sprites[2].src = "bluewhite_x_3.png";
					this.enemy_sprites[3].src = "bluewhite_y_1.png";
					this.enemy_sprites[4].src = "bluewhite_y_2.png";
					this.enemy_sprites[5].src = "bluewhite_y_3.png";
					this.enemy_sprites[6].src = "bluewhite_y_4.png";
					this.enemy_sprites[7].src = "bluewhite_y_5.png";
					this.obstacle_sprites[0].src = "blue_obstacle_1.png";
					this.obstacle_sprites[1].src = "blue_obstacle_2.png";
					this.obstacle_sprites[2].src = "blue_obstacle_3.png";
				} else if(this.color != 5){
					this.enemy_sprites[0].src = "greenred_x_1.png";
					this.enemy_sprites[1].src = "greenred_x_2.png";
					this.enemy_sprites[2].src = "greenred_x_3.png";
					this.enemy_sprites[3].src = "greenred_y_1.png";
					this.enemy_sprites[4].src = "greenred_y_2.png";
					this.enemy_sprites[5].src = "greenred_y_3.png";
					this.enemy_sprites[6].src = "greenred_y_4.png";
					this.enemy_sprites[7].src = "greenred_y_5.png";
					this.obstacle_sprites[0].src = "green_obstacle_1.png";
					this.obstacle_sprites[1].src = "green_obstacle_2.png";
					this.obstacle_sprites[2].src = "green_obstacle_3.png";
				} else
					colorChanged = false;
			} while(!colorChanged);
		}
		this.numEnemies = this.enemies.length;
		this.enemiesDead = 0;
	};
	
	this.drawTitle = function() {
		this.context.drawImage(this.titleImage, 0, 0);
	};
	
	this.startGame = function() {
		this.generateObstacles();
		this.generateEnemies();
	};
}