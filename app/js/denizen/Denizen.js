goog.provide('denizen');
goog.provide('denizen.Game');

goog.require('denizen.graphics.GLHelper');
goog.require('denizen.map.Chunk');

/**
 * This is the function that starts the whole game. Basically just creates
 * the game object and then tells it to run
 * @param {HTMLCanvasElement} canvas the canvas to run the game on
 */
denizen.play = function(canvas) {
	var game = new denizen.Game(new denizen.graphics.GLHelper(), canvas);
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
 * @param {denizen.graphics.GLHelper} gl the gl helper object to call methods on
 * @param {HTMLCanvasElement} canvas the canvas to run the game on
 */
denizen.Game = function(gl, canvas) {
	var me = this;
	me.gl = gl;
	me.gl.start(canvas);
	me.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	me.chunk = new denizen.map.Chunk();
}

/** @type {denizen.graphics.GLHelper} */
denizen.Game.prototype.gl;

/**
 * The Game's current Chunk
 * @type {denizen.map.Chunk}
 */
denizen.Game.prototype.chunk;

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
 * @this {denizen.Game}
 * @private
 */
denizen.Game.prototype.render = function() {
	var me = this;
	me.gl.clear();
}
