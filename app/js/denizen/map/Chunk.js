goog.provide('denizen.map.Chunk');

goog.require('denizen.map.Block');

/**
 * Constructs a Chunk, which is a section of map that contains Blocks and other items
 * @constructor
 * @param {Array.<denizen.map.Block>=} blocks the blocks contained in this Chunk*/
denizen.map.Chunk = function(blocks) {
	var me = this;
	me.blocks = (blocks) ? blocks : [];
}

/**
 * Add all the meshes in this Chunk to the Scene
 * @param {THREE.Scene} scene
 */
denizen.map.Chunk.prototype.fillScene = function(scene) {
	var me = this;
	for (var i = 0; i < me.blocks.length; i++) {
		scene.add(me.blocks[i].mesh);
	}
}