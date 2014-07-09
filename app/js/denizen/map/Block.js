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
 * Vertex locations for any Block
 * @const
 * @type {Array.<number>}
 */
denizen.map.Block.vertices = [ // X, Y, Z Coordinates
	//Front
	1.0,	1.0,	-1.0,
	1.0,	-1.0,	-1.0,
	-1.0,	1.0,	-1.0,
	-1.0,	-1.0,	-1.0,
	
	//Back
	1.0,	1.0,	1.0,
	1.0,	-1.0,	1.0,
	-1.0,	1.0,	1.0,
	-1.0,	-1.0,	1.0,
	
	//Right
	1.0,	1.0,	1.0,
	1.0,	-1.0,	1.0,
	1.0,	1.0,	-1.0,
	1.0,	-1.0,	-1.0,
		
	//Left
		
	-1.0,	1.0,	1.0,
	-1.0,	-1.0,	1.0,
	-1.0,	1.0,	-1.0,
	-1.0,	-1.0,	-1.0,
	
	//Top
	1.0,	1.0,	1.0,
	-1.0,	-1.0,	1.0,
	1.0,	-1.0,	-1.0,
	-1.0,	-1.0,	-1.0,
	
	//Bottom
	1.0,	-1.0,	1.0,
	-1.0,	-1.0,	1.0,
	1.0,	-1.0,	-1.0,
	-1.0,	-1.0,	-1.0
];

/**
 * Texture coordinates for any Block
 * @const
 * @type {Array.<number>}
 */
denizen.map.Block.textureCoords = [
	//Front
	1.0,	1.0,
	1.0,	0.0,
	0.0,	1.0,
	0.0,	0.0,
		
	//Back
	0.0,	1.0,
	0.0,	0.0,
	1.0,	1.0,
	1.0,	0.0,
	
	//Right
	1.0,	1.0,
	1.0,	0.0,
	0.0,	1.0,
	0.0,	0.0,
		
	//Left
	0.0,	1.0,
	0.0,	0.0,
	1.0,	1.0,
	1.0,	0.0,
	
	//Top
	1.0,	0.0,
	1.0,	1.0,
	0.0,	0.0,
	0.0,	1.0,
	
	//Bottom
	0.0,	0.0,
	0.0,	1.0,
	1.0,	0.0,
	1.0,	1.0
];


/**
 * Triangle vertices for all blocks
 * @const
 * @type {Array.<number>}
 */
denizen.map.Block.triangles = [ 
	//Front
	0, 1, 2,
	1, 2, 3,
	 
	//Back
	4, 5, 6,
	5, 6, 7,
	 
	//Right
	8, 9, 10,
	9, 10, 11,
	 
	//Left
	12, 13, 14,
	13, 14, 15,
	 
	//Top
	16, 17, 18,
	17, 18, 19,
	 
	//Bottom
	20, 21, 22,
	21, 22, 23
];

/**
 * Vertex normals for all blocks
 * @const
 * @type {Array.<number>}
 */
denizen.map.Block.vertexNormals = [
	// Front
	0.0,	0.0,	1.0,
	0.0,	0.0,	1.0,
	0.0,	0.0,	1.0,
	0.0,	0.0,	1.0,

	// Back
	0.0,	0.0,	-1.0,
	0.0,	0.0,	-1.0,
	0.0,	0.0,	-1.0,
	0.0,	0.0,	-1.0,
	
	// Right
	1.0,	0.0,	0.0,
	1.0,	0.0,	0.0,
	1.0,	0.0,	0.0,
	1.0,	0.0,	0.0,
	
	// Left
	-1.0,	0.0,	0.0,
	-1.0,	0.0,	0.0,
	-1.0,	0.0,	0.0,
	-1.0,	0.0,	0.0,
	
	// Top
	0.0,	1.0,	0.0,
	0.0,	1.0,	0.0,
	0.0,	1.0,	0.0,
	0.0,	1.0,	0.0,

	// Bottom
	0.0,	-1.0,	0.0,
	0.0,	-1.0,	0.0,
	0.0,	-1.0,	0.0,
	0.0,	-1.0,	0.0
];

//------------------------------------------------------------------------
// Instance Variables
//------------------------------------------------------------------------
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
