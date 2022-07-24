window.addEventListener("load",
	function() {

		//constants
		var GAME_WIDTH = 630;
		var GAME_HEIGHT = 230;

		//keep the game going
		var gameLive = true;

		//current level
		var level = 1;
		var life = 5;
		//random color 
		const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
		
		//enemies
		var enemies = [{
				x: randomIntFromInterval(50, 500), //x coordinate
				y: 100, //y coordinate
				speedY: 1, //speed in Y
				w: 50, //width
				h: 50 //heght
			}
		];

		//the player object
		var player = {
			x: 10,
			y: GAME_HEIGHT - 50,
			speedX: 2,
			isMoving: false,
			isMovingToLeft: false,//keep track whether the player is moving or not
			w: 40,
			h: 40
		};

		//the goal object
		var goal = {
			x: 560,
			y: GAME_HEIGHT - 60,
			w: 55,
			h: 60
		}

		var sprites = {};

		var movePlayer = () => {
			player.isMoving = true;
		}

		var stopPlayer = () => {
			player.isMoving = false;
		}
		var movePlayerToLeft = () => {
		  player.isMovingToLeft = true;
		}
		var stopPlayerToLeft = () => {
		  player.isMovingToLeft = false;
		} 
		//grab the canvas and context
		var canvas = document
			.getElementById("mycanvas");
		var arrowKeys = document.querySelectorAll('button');
		
	  canvas.height = 300;
	  canvas.width = 630;
		var ctx = canvas.getContext("2d");
		
		//event listeners to move player
		canvas.addEventListener(
			'mousedown', movePlayer);
		canvas.addEventListener('mouseup',
			stopPlayer);
		canvas.addEventListener(
			'touchstart', movePlayer);
		canvas.addEventListener(
			'touchend', stopPlayer);
			
		arrowKeys[1].addEventListener('touchstart', movePlayer);
		arrowKeys[1].addEventListener('touchend', stopPlayer);
		arrowKeys[0].addEventListener('touchstart', movePlayerToLeft);
		arrowKeys[0].addEventListener('touchend', stopPlayerToLeft);
		//update the logic
		var update = function() {

			//check if you've won the game
			if (checkCollision(player,
					goal)) {
				level += 1;
				life += 1;
				player.speedX += 1;
				player.x = 10;
				player.y = GAME_HEIGHT - 50;
				player.isMoving = false;
				if(enemies.length < 10) {
				  enemies.push({
	    			x: randomIntFromInterval(200, 500),
	    			y: randomIntFromInterval(0, 100),
		    		speedY: 2,
		    		w: randomIntFromInterval(30, 50),
		    		h: 40
	     		})
				}
				
				for (var i = 0; i < enemies
					.length; i++) {
					if (enemies[i].speedY > 1) {
						enemies[i].speedY += 1;
					} else {
						enemies[i].speedY -= 1;
					}
				}
			}

			//update player
			if (player.isMoving) {
				player.x = player.x + player
					.speedX;
			}else if(player.isMovingToLeft && player.x > 0) {
			  player.x = player.x - player.speedX;
			}

			//update enemies
	
			var n = enemies.length;
			var i = 0;
			enemies.forEach(function(
				element, index) {

				//check for collision with player
				if (checkCollision(player,
						element)) {
					//stop the game
					if (life === 0) {
					  alert('Game Over!');
					  enemies.splice(1, enemies.length - 1);
					  
						for (var i = 0; i <
							enemies.length; i++) {

							if (enemies[i].speedY >
								1) {
								enemies[i].speedY -= (
									level - 1);
							} else {
								enemies[i].speedY += (
									level - 1);
							}
						}
						level = 1;
						life = 6;
						player.speedX = 2;
					}

					if (life > 0) {
						life -= 1;
					}

					player.x = 10;
					player.y = GAME_HEIGHT - 50;
					player.isMoving = false;
				}

				//move enemy
				element.y += element.speedY;

				//check borders
				if (element.y <= 10) {
					element.y = 10;
					element.speedY *= -1;
				} else if (element.y >=
					GAME_HEIGHT - 50) {
					element.y = GAME_HEIGHT -
						50;
					element.speedY *= -1;
				}
			});
		};

		//show the game on the screen
		var draw = function() {
			//clear the canvas
			ctx.clearRect(0, 0, GAME_WIDTH,
				GAME_HEIGHT);
			const bg = new Image()
	  	bg.src = './images/bg.jpeg'
	  	ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
			//draw level
			ctx.font = "18px Sans-serif";
			ctx.fillStyle = "#000";
			ctx.fillText("Level :   " + level,
				10, 20);
			ctx.fillText("Lives :   " + life,
				10, 40);
			ctx.fillText("Speed : " + player
				.speedX, 10, 60);
			ctx.fillText(((enemies.length <= 1) ? 'Enemy :' : 'Enemies :') + enemies.length, 10, 80);
			const img = new Image()
			img.src = './images/bomb.png';
			ctx.drawImage(img, player.x, player.y, player.w + 10, player.h + 10);

			//draw enemies
			enemies.forEach(function(
				element, index) {
				 const img = new Image()
				 img.src = './images/b2.png';
			   ctx.drawImage(img,element.x, element.y,element.w, element.h);
			});

			const door = new Image()
	    door.src = './images/door.jpg'
	  	ctx.drawImage(door, goal.x, goal.y, goal.w, goal.h)
		};
		var step = function() {
			update();
			draw()
			if(gameLive) {
				window.requestAnimationFrame(
					step);
			}
		};
		var checkCollision = function(
			rect1, rect2) {
			var closeOnWidth = Math.abs(
					rect1.x - rect2.x) <= Math
				.max(rect1.w, rect2.w);
			var closeOnHeight = Math.abs(
					rect1.y - rect2.y) <= Math
				.max(rect1.h, rect2.h);
			return closeOnWidth &&
				closeOnHeight;
		}
		step();
	});