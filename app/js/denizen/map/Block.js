goog.provide('denizen.map.Block');

goog.require('denizen.map.Map');

/**
 * The Block class represents a block in the game
 * @constructor
 * @param {number} width the width of a Block in game units
 * @param {number} height the height of the Block in game units
 * @param {number} depth the depth of the Block in game units
 */
denizen.map.Block = function(width, height, depth) {
	var me = this;
	/** @type {number} */
	me.width = width;
	/** @type {number} */
	me.height = height;
	/** @type {number} */
	me.depth = depth;
	
	// setup graphics stuff
	var ratio = denizen.map.Map.unitRatio;
	/** @type {THREE.BoxGeometry} */
	me.geometry = new THREE.BoxGeometry(
		me.width * ratio,
		me.height * ratio,
		me.depth * ratio
	);
	me.material = new THREE.MeshBasicMaterial({
		color: 0xff0000,
		wireframe: true
	});
	me.mesh = new THREE.Mesh(me.geometry, me.material); 
}
