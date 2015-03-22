var canvas;

// Initialize game
var game = new Game();

// Main loop for game
function MainLoop() {
	game.update();
	game.draw();
	// Call main loop at 30 fps
	setTimeout(MainLoop, 33.33);
}
// Start game
MainLoop();
