goog.provide('denizen.graphics.textures.Texture');
goog.provide('denizen.graphics.textures.BlueTexture');
goog.provide('denizen.graphics.textures.TextureFactory');

goog.require('denizen.map.blocks.BlockId');

/**
 * Base class for all Textures used in the game
 * @constructor
 * @param {string} src the source image for the texture
 * @param {number} id the BlockId for the texture
 */
denizen.graphics.textures.Texture = function(src, id) {
	/**@type {string}*/this.src = src;
	/**@type {number}*/this.id = id;
	/**@type {Image}*/this.image = new Image();
	this.image.src = src;
	this.texture = null;
}

/**
 * Constructor for a BlueTexture
 * @constructor
 * @extends {denizen.graphics.textures.Texture}
 */
denizen.graphics.textures.BlueTexture = function() {}
denizen.graphics.textures.BlueTexture.prototype = new denizen.graphics.textures.Texture(
	'img/blue.png',
	denizen.map.blocks.BlockId.Blue
);

/**
 * A class that will load all the textures into memory
 * @constructor
 * @param {WebGLRenderingContext} gl
 */
denizen.graphics.textures.TextureFactory = function(gl) {
	/**@type {Object.<denizen.map.blocks.BlockId, denizen.graphics.textures.Texture>}*/
	this.textures = {};
	/**@type {WebGLRenderingContext}*/
	this.gl = gl;
}

/**
 * Get an instance of a texture
 * @param {denizen.map.blocks.BlockId} id the id of the texture
 * @return {denizen.graphics.textures.Texture} the requested texture
 */
denizen.graphics.textures.TextureFactory.prototype.get = function(id) {
	//if we've already got an instance, just return it
	if (id in this.textures) {
		return this.textures[id];
	}

	//otherwise, create a new one
	/**@type {denizen.graphics.textures.Texture | null}*/
	var texture = null;
	if (id ==  denizen.map.blocks.BlockId.Blue) {
		texture = new denizen.graphics.textures.BlueTexture();
	}

	if (texture) {
		this.textures[name] = texture;
		texture.texture = this.loadTexture(texture.image);
		return texture;
	}
	else {
		return null;
	}
}

/**
 * Load texture from an image
 * @param {Image} image the image to load from
 */
denizen.graphics.textures.TextureFactory.prototype.loadTexture = function(image) {
	var texture = this.gl.createTexture();
	this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
	 
	//Flip Positive Y (Optional)
	this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
	 
	//Load in The Image
	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);	
	 
	//Setup Scaling properties
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);	
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);	
	this.gl.generateMipmap(this.gl.TEXTURE_2D); 
	 
	//Unbind the texture and return it.
	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	return texture;
}