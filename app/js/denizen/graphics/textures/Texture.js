goog.provide('denizen.graphics.textures.Texture');
goog.provide('denizen.graphics.textures.BlueTexture');
goog.provide('denizen.graphics.textures.TextureFactory');

goog.require('denizen.map.blocks.BlockId');

/**
 * Base class for all Textures used in the game
 * @constructor
 * @param {string} src the source image for the texture
 * @param {denizen.map.blocks.BlockId} id the BlockId for the texture
 */
denizen.graphics.textures.Texture = function(src, id) {
	var me = this;
	me.src = src;
	me.id = id;
	me.image = new Image();
	me.texture = null;
}

//------------------------------------------------------------------------
// Instance Variables
//------------------------------------------------------------------------
/**
 * The source URL for the image this Texture is based on
 * @private
 * @type {string}
 */
denizen.graphics.textures.Texture.prototype.src;

/**
 * The BlockId this Texture belongs to
 * @type {denizen.map.blocks.BlockId}
 */
denizen.graphics.textures.Texture.prototype.id;
/**
 * The Image associated with the texture
 * @private
 * @type {Image}
 */
denizen.graphics.textures.Texture.prototype.image;
/**
 * The actual WebGLTexture
 * @type {WebGLTexture}
 */
denizen.graphics.textures.Texture.prototype.texture;

/**
 * Initialize the Texture by loading it into a WebGLTexture
 * @this {denizen.graphics.textures.Texture}
 * @param {denizen.graphics.textures.TextureFactory} factory the TextureFactory to load textures with
 * @return {void}
 */
denizen.graphics.textures.Texture.prototype.init = function(factory) {
	var me = this;
	//when the image is loaded, read in the texture
	me.image.onload = function() {
		me.texture = factory.loadTexture(me.image);
	}
	me.image.src = me.src;
}

//------------------------------------------------------------------------
// Instance Variables
//------------------------------------------------------------------------
/**@type {WebGLTexture}*/
denizen.graphics.textures.Texture.prototype.texture;
/**@private @type {Image}*/
denizen.graphics.textures.Texture.prototype.image;

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
	var me = this;
	/**@type {Object.<denizen.map.blocks.BlockId, denizen.graphics.textures.Texture>}*/
	me.textures = {};
	/**@type {WebGLRenderingContext}*/
	me.gl = gl;
}

//------------------------------------------------------------------------
// Instance Variables
//------------------------------------------------------------------------
/**@private @type {Object.<denizen.map.blocks.BlockId, denizen.graphics.textures.Texture>}*/
denizen.graphics.textures.TextureFactory.prototype.textures;
/**@private @type {WebGLRenderingContext}*/
denizen.graphics.textures.TextureFactory.prototype.gl;

/**
 * Get an instance of a texture
 * @this {denizen.graphics.textures.TextureFactory}
 * @param {denizen.map.blocks.BlockId} id the id of the texture
 * @return {denizen.graphics.textures.Texture} the requested texture
 */
denizen.graphics.textures.TextureFactory.prototype.get = function(id) {
	var me = this;
	//if we've already got an instance, just return it
	if (id in me.textures) {
		return me.textures[id];
	}

	//otherwise, create a new one
	/**@type {denizen.graphics.textures.Texture | null}*/
	var texture = null;
	if (id == denizen.map.blocks.BlockId.Blue) {
		texture = new denizen.graphics.textures.BlueTexture();
		texture.init(me);
	}

	if (texture) {
		me.textures[id] = texture;
		return texture;
	}
	else {
		return null;
	}
}

/**
 * Load texture from an image
 * @private
 * @this {denizen.graphics.textures.TextureFactory}
 * @param {Image} image the image to load from
 * @return {WebGLTexture}
 */
denizen.graphics.textures.TextureFactory.prototype.loadTexture = function(image) {
	var me = this;
	var texture = me.gl.createTexture();
	me.gl.bindTexture(me.gl.TEXTURE_2D, texture);
	 
	//Flip Positive Y (Optional)
	me.gl.pixelStorei(me.gl.UNPACK_FLIP_Y_WEBGL, 1);
	 
	//Load in The Image
	me.gl.texImage2D(me.gl.TEXTURE_2D, 0, me.gl.RGBA, me.gl.RGBA, me.gl.UNSIGNED_BYTE, image);	
	 
	//Setup Scaling properties
	me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MAG_FILTER, me.gl.LINEAR);	
	me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MIN_FILTER, me.gl.LINEAR_MIPMAP_NEAREST);	
	me.gl.generateMipmap(me.gl.TEXTURE_2D); 
	 
	//Unbind the texture and return it.
	me.gl.bindTexture(me.gl.TEXTURE_2D, null);
	return texture;
}