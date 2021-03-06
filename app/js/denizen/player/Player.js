goog.provide('denizen.player.Player');

/**
 * @constructor
 * @this {denizen.player.Player}
 * @param {number} x the player's starting coordinate
 * @param {number} y the player's starting coordinate
 * @param {number} z the player's starting coordinate
 * @param {number} rotationX the player's starting rotation
 * @param {number} rotationY the player's starting rotation
 */
denizen.player.Player = function(x, y, z, rotationX, rotationY) {
	var me = this;
	me.x = x;
	me.y = y;
	me.z = z;
	me.rotationX = rotationX;
	me.rotationY = rotationY;
}

//------------------------------------------------------------------------
// Instance Variables
//------------------------------------------------------------------------

/**@type {number}*/
denizen.player.Player.prototype.x;
/**@type {number}*/
denizen.player.Player.prototype.y;
/**@type {number}*/
denizen.player.Player.prototype.z;
/**@type {number}*/
denizen.player.Player.prototype.rotationX;
/**@type {number}*/
denizen.player.Player.prototype.rotationY;
