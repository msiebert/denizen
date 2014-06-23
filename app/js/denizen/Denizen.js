goog.provide('denizen');
goog.provide('denizen.Game');

goog.require('denizen.util.GLHelper');

/**
 * This is the function that starts the whole game. Basically just creates
 * the game object and then tells it to run
 * @param {string} canvasId the id of the canvas to run the game on
 */
denizen.play = function(canvasId) {
	var game = new denizen.Game(new denizen.util.GLHelper(), canvasId);
	game.run();
}

/**
 * How often the game updates
 * @const
 * type {number}
 */
denizen.Game.refreshRate = 1000 / 30;
/**
 * The main Game object
 * @constructor
 * @param {denizen.util.GLHelper} gl the gl helper object to call methods on
 * @param {string} canvasId the id of the canvas to run the game on
 */
denizen.Game = function(gl, canvasId) {
	gl.start(canvasId);
	var me = this;
}

/**
 * Run the game, executes the main game loop
 */
denizen.Game.prototype.run = function() {
	var me = this;
	me.update();
	me.render();

	// setInterval(function() {
	// 	me.update();
	// 	me.render();
	// }, denizen.Game.refreshRate);
}

/**
 * Update the game environment based on calculations and user input
 * @private
 */
denizen.Game.prototype.update = function() {
	console.log("update");
}

/**
 * Render the game
 * @private
 */
denizen.Game.prototype.render = function() {
	console.log("render");
}
