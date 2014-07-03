goog.provide('denizen.map.Block');

goog.require('denizen.map.blocks.BlockId');

/**
 * @constructor
 * @param {denizen.map.blocks.BlockId} id the id of this Block's type
 * @param {boolean} active whether or not this Block is active
 * @this {denizen.map.Block}
 */
denizen.map.Block = function(id, active) {
	var me = this;
	me.id = id;
	me.active = active;
}

/**
 * The id of this Block's type
 * @type {denizen.map.blocks.BlockId}
 */
denizen.map.Block.prototype.id;

/**
 * Whether or not this Block is active
 * @type {boolean}
 */
denizen.map.Block.prototype.active;
