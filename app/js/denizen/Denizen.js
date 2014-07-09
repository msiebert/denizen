goog.provide('denizen');
goog.provide('denizen.Game');

goog.require('denizen.graphics.GLHelper');
goog.require('denizen.map.blocks.BlockId');
goog.require('denizen.map.Chunk');
goog.require('denizen.player.Player');

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
	me.gl.viewport(window.innerWidth, window.innerHeight);
	me.gl.clearColor(0.9, 0.9, 0.9, 1.0);
	me.chunk = new denizen.map.Chunk();
	me.chunk.blocks[0][0][0].id = denizen.map.blocks.BlockId.Blue;
	me.chunk.blocks[0][0][0].active = true;
	me.chunk.blocks[3][1][0].id = denizen.map.blocks.BlockId.Blue;
	me.chunk.blocks[3][1][0].active = true;
	me.player = new denizen.player.Player(5, 0, -10, 0, 0);
}

/** @type {denizen.graphics.GLHelper} */
denizen.Game.prototype.gl;

/**
 * The Game's player
 * @type {denizen.player.Player}
 */
denizen.Game.prototype.player;

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
	var i = 0;

	var intervalId = setInterval(function() {
		me.update();
		me.render();

		i++;
		if (i >= 5) {
			window.clearInterval(intervalId);
		}
	}, denizen.Game.refreshRate);
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
	me.gl.perspective(90, me.gl.canvas.width, me.gl.canvas.height, 1, 1000);
	me.gl.drawChunk(me.chunk, me.player);
}
