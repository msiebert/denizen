goog.provide('denizen');
goog.provide('denizen.Game');

denizen.play = function() {
	var game = new denizen.Game();
	game.run();
}

/**
 * How often the game updates
 * @const
 * type {number}
 */
denizen.Game.refreshRate = 33;
/**
 * The main Game object
 * @constructor
 */
denizen.Game = function() {
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
