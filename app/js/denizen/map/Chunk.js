goog.provide('denizen.map.Chunk');

goog.require('denizen.map.Block');
goog.require('denizen.map.blocks.BlockId');


/**
 * @constructor
 * @this {denizen.map.Chunk}
 */
denizen.map.Chunk = function() {
	var me = this;

	var BlockId = denizen.map.blocks.BlockId;
	var size = denizen.map.Chunk.size;
	me.blocks = new Array(size);
	for (var i = 0; i < size; i++) {
		me.blocks[i] = new Array(size);

		for (var j = 0; j < size; j++) {
			 me.blocks[i][j] = new Array(size);

			for (var k = 0; k < size; k++) {
				me.blocks[i][j][k] = new denizen.map.Block(denizen.map.blocks.BlockId.None, false);
			}
		}
	}
}

/**
 * The dimensions of a Chunk
 * @const
 * @type {number}
 */
denizen.map.Chunk.size = 32;

//------------------------------------------------------------------------
// Instance Variables
//------------------------------------------------------------------------

/**
 * The 3D array of Blocks that make up this Chunk
 * @type {Array.<Array.<Array.<denizen.map.Block>>>}
 */
denizen.map.Chunk.prototype.blocks;

//------------------------------------------------------------------------
// Public Methods
//------------------------------------------------------------------------

/**
 * Perform an action on all blocks in the Chunk
 * @this {denizen.map.Chunk}
 * @param {function(denizen.map.Block, number, number, number): *} f
 * @return {void}
 */
denizen.map.Chunk.prototype.forEachBlock = function(f) {
	var me = this;
	var size = denizen.map.Chunk.size;
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			for (var k = 0; k < size; k++) {
				f(me.blocks[i][j][k], i, j, k);
			}
		}
	}
}
