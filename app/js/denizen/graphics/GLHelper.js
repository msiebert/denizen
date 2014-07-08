goog.provide('denizen.graphics.GLHelper');

goog.require('denizen.graphics.textures.TextureFactory');
goog.require('denizen.map.blocks.BlockId');
goog.require('denizen.player.Player');
goog.require('goog.vec.Mat4');

/**
 * @private
 * @enum {number}
 */
denizen.graphics.MatrixMode = {
	GL_MODELVIEW: 0,
	GL_PROJECTION: 1	
};

/**@private @const @type {number}*/
var TEXT_NODE = 3;

/**
 * Initialize the GLHelper
 * @constructor
 */
denizen.graphics.GLHelper = function() {
	var me = this;
	me.canvas = null;
	me.gl = null;
	me.mvMatrix = me.mat4.createFloat32Identity();
	me.mvNormalMatrix = me.mat4.createFloat32Identity();
	me.pMatrix = me.mat4.createFloat32Identity();
}

//------------------------------------------------------------------------
// Instance Variables
//------------------------------------------------------------------------
/**@private*/
denizen.graphics.GLHelper.prototype.mat4 = goog.vec.Mat4;

/**@type {HTMLCanvasElement}*/
denizen.graphics.GLHelper.prototype.canvas;
/**@private @type {WebGLRenderingContext | null}*/
denizen.graphics.GLHelper.prototype.gl;
/**@private @type {denizen.graphics.textures.TextureFactory}*/
denizen.graphics.GLHelper.prototype.textureFactory;

// Matrix Variables
/**@private @type {number}*/
denizen.graphics.GLHelper.prototype.selectedMatrix = 0;
/**@private @type {!Float32Array}*/
denizen.graphics.GLHelper.prototype.mvMatrix;
/**@private @type {!Float32Array}*/
denizen.graphics.GLHelper.prototype.mvNormalMatrix;
/**@private @type {Array.<!Float32Array>}*/
denizen.graphics.GLHelper.prototype.mvMatrixStack = new Array();
/**@private @type {!Float32Array}*/
denizen.graphics.GLHelper.prototype.pMatrix;
/**@private @type {Array.<!Float32Array>}*/
denizen.graphics.GLHelper.prototype.pMatrixStack = new Array();

//Shader Variables
/**@private @type {WebGLProgram}*/
denizen.graphics.GLHelper.prototype.shaderProgram;
//uniforms
/**@private @type {WebGLUniformLocation}*/
denizen.graphics.GLHelper.prototype.directionalLightColor;
/**@private @type {WebGLUniformLocation}*/
denizen.graphics.GLHelper.prototype.lightDirection;
/**@private @type {WebGLUniformLocation}*/
denizen.graphics.GLHelper.prototype.ambientLight;
//attributes
/**@private @type {number}*/
denizen.graphics.GLHelper.prototype.vertexPosition;
/**@private @type {number}*/
denizen.graphics.GLHelper.prototype.vertexTexture;
/**@private @type {number}*/
denizen.graphics.GLHelper.prototype.vertexNormal;

//------------------------------------------------------------------------
// Public Methods
//------------------------------------------------------------------------
/**
 * Start up the WebGL context.
 * @param {HTMLCanvasElement} canvas to run the game on
 * @this {denizen.graphics.GLHelper}
 * @return {void}
 */
denizen.graphics.GLHelper.prototype.start = function(canvas) {
	var me = this;
	me.canvas = canvas;
	me.initGL(me.canvas);
	me.initShaders("vertex-shader", "fragment-shader");
	me.gl.viewport(0, 0, me.canvas.width, me.canvas.height);
	me.gl.enable(me.gl.DEPTH_TEST);
	me.gl.depthFunc(me.gl.LEQUAL);
	me.textureFactory = new denizen.graphics.textures.TextureFactory(me.gl);
}

/**
 * Set the color to clear the screen to
 * @this {denizen.graphics.GLHelper}
 * @param {number} r the red value
 * @param {number} g the green value
 * @param {number} b the blue value
 * @param {number} a the alpha value
 * @return {void}
 */
denizen.graphics.GLHelper.prototype.clearColor = function(r, g, b, a) {
	var me = this;
	me.gl.clearColor(r, g, b, a);
}

/**
 * Clear the screen
 * @this {denizen.graphics.GLHelper}
 * @return {void}
 */
denizen.graphics.GLHelper.prototype.clear = function() {
	var me = this;
	me.gl.clear(me.gl.COLOR_BUFFER_BIT | me.gl.DEPTH_BUFFER_BIT);
}

/**
 * Create the perspective. Overwrites the original perspective matrix.
 * @this {denizen.graphics.GLHelper}
 * @param {number} fovy the field of view angle
 * @param {number} width the width of the viewport
 * @param {number} height the height of the viewport
 * @param {number} near the near plane
 * @param {number} far the far plane
 * @return {void}
 */
denizen.graphics.GLHelper.prototype.perspective = function(fovy, width, height, near, far) {
	var me = this;
	var temp = me.mat4.createFloat32Identity();
	me.pMatrix = /**@type {!Float32Array}*/(me.mat4.makePerspective(temp, me.degreesToRadians(fovy), width / height, near, far));
}


/**
 * Draw a Chunk to the screen
 * @this {denizen.graphics.GLHelper}
 * @param {denizen.map.Chunk} chunk the Chunk to draw
 * @param {denizen.player.Player} player the Player who's view should be drawn
 * @return {void}
 */
denizen.graphics.GLHelper.prototype.drawChunk = function(chunk, player) {
	var me = this;
	//translate by the player's position
	var rotated = me.mat4.makeRotateY(me.mat4.createFloat32Identity(), me.degreesToRadians(player.rotationX));
	var translated = me.mat4.makeTranslate(me.mat4.createFloat32Identity(), player.x, player.y, player.z);
	me.mvMatrix = /**@type {!Float32Array}*/(me.mat4.multMat(rotated, translated, me.mvMatrix));
	me.updateNormalMatrix();

	//set the shader matrices
	var shaderPMatrix = me.gl.getUniformLocation(me.shaderProgram, "PerspectiveMatrix");
	me.gl.uniformMatrix4fv(shaderPMatrix, false, new Float32Array(me.pMatrix));

	//lighting stuff
	var light = [0, 0, 0];
	light = me.mat4.multVec3(me.mvMatrix, light, light);
	me.gl.uniform3f(me.directionalLightColor, 1, 1, 1);
	me.gl.uniform3f(me.lightDirection, light[0], light[1], light[2]);
	me.gl.uniform3f(me.ambientLight, .4, .4, .4);

	me.gl.activeTexture(me.gl.TEXTURE0);

	//loop through all the blocks in the chunk and draw them
	chunk.forEachBlock(
		/**
		 * @param {denizen.map.Block} block
		 * @param {number} x
		 * @param {number} y
		 * @param {number} z
		 */
		function(block, x, y, z) {
			if (block.active && block.id != denizen.map.blocks.BlockId.None) {
				me.drawBlock(block, x, y, z);
			}
		}
	);
}

//------------------------------------------------------------------------
// Matrix methods
//------------------------------------------------------------------------

/**
 * Switch between the matrices
 * @private
 * @this {denizen.graphics.GLHelper}
 * @param {denizen.graphics.MatrixMode} mode the matrix to use
 * @return {void}
 */
denizen.graphics.GLHelper.prototype.matrixMode = function(mode) {
	var me = this;
	me.selectedMatrix = mode;
}

/**
 * Load the identity matrix into the currently selected matrix
 * @private
 * @this {denizen.graphics.GLHelper}
 * @return {void}
 */
denizen.graphics.GLHelper.prototype.loadIdentity = function() {
	var me = this;
	if (me.modelViewIsSelected()) {
		me.mvNormalMatrix = me.mat4.createFloat32Identity();
		me.mvMatrix = me.mat4.createFloat32Identity();
	}
	else {
		me.pMatrix = me.mat4.createFloat32Identity();
	}
}

/**
 * Push the current matrix onto the stack
 * @private
 * @this {denizen.graphics.GLHelper}
 * @return {void}
 */
denizen.graphics.GLHelper.prototype.pushMatrix = function() {
	var me = this;
	if (me.modelViewIsSelected()) {
		var copy = me.mat4.cloneFloat32(me.mvMatrix);
		me.mvMatrixStack.push(copy);
	}
	else {
		var copy = me.mat4.cloneFloat32(me.pMatrix);
		me.pMatrixStack.push(copy);
	}
}

/**
 * Pop a matrix off the stack and onto the current matrix
 * @private
 * @this {denizen.graphics.GLHelper}
 * @return {void}
 */
denizen.graphics.GLHelper.prototype.popMatrix = function() {
	var me = this;
	if (me.modelViewIsSelected) {
		me.mvMatrix = me.mvMatrixStack.pop();
		me.updateNormalMatrix();
	}
	else {
		me.pMatrix = me.pMatrixStack.pop();
	}
}

/**
 * Update the normals matrix for use with lighting
 * @private
 * @this {denizen.graphics.GLHelper}
 * @return {void}
 */
denizen.graphics.GLHelper.prototype.updateNormalMatrix = function() {
	var me = this;
	me.mvNormalMatrix = me.mat4.createFloat32();
	me.mat4.invert(me.mvMatrix, me.mvNormalMatrix);
	me.mat4.transpose(me.mvNormalMatrix, me.mvNormalMatrix);
}


/**
 * Determine if the currently selected matrix is the modelview matrix
 * @private
 * @this {denizen.graphics.GLHelper}
 * @return {boolean}
 */
denizen.graphics.GLHelper.prototype.modelViewIsSelected = function() {
	var me = this;
	return me.selectedMatrix == denizen.graphics.MatrixMode.GL_MODELVIEW;
}

//------------------------------------------------------------------------
// Unexposed helper functions
//------------------------------------------------------------------------

/**
 * Helper function that initializes a canvas
 * @private
 * @param {HTMLCanvasElement} canvas the canvas element to turn into a webgl rendering context
 * @this {denizen.graphics.GLHelper}
 * @return {void}
 */
denizen.graphics.GLHelper.prototype.initGL = function(canvas) {
	var me = this;
	/**@type {WebGLRenderingContext | null}*/me.gl = null;
	
	try {
		me.gl = /**@type {WebGLRenderingContext}*/ (canvas.getContext('webgl'));
	}
	catch(e) {}
	
	if (!me.gl) {
		alert('Unable to initialize WebGL. Your browser may not support it.');
		me.gl = null;
	}
}
/**
 * Initialize the shaders
 * @private
 * @this {denizen.graphics.GLHelper}
 * @param {string} vertexId the id of the vertex shader script
 * @param {string} fragmentId the id of the fragment shader script
 * @return {void}
 */
denizen.graphics.GLHelper.prototype.initShaders = function(vertexId, fragmentId) {
	var me = this;
	var vertexShaderElement = document.getElementById(vertexId);
	var fragmentShader = document.getElementById(fragmentId);

	//if we couldn't find the shaders, we're in trouble
	if (!vertexShaderElement || !fragmentShader) {
		alert('Could not find shaders!');
		return;
	}

	var code = me.loadShader(vertexShaderElement);
	var vertexShader = me.gl.createShader(me.gl.VERTEX_SHADER);
	me.gl.shaderSource(vertexShader, code);
	me.gl.compileShader(vertexShader);

	code = me.loadShader(fragmentShader);
	fragmentShader = me.gl.createShader(me.gl.FRAGMENT_SHADER);
	me.gl.shaderSource(fragmentShader, code);
	me.gl.compileShader(fragmentShader);

	me.shaderProgram = me.gl.createProgram();
	me.gl.attachShader(me.shaderProgram, fragmentShader);
	me.gl.attachShader(me.shaderProgram, vertexShader);
	me.gl.linkProgram(me.shaderProgram);
	me.gl.useProgram(me.shaderProgram);

	me.vertexPosition = me.gl.getAttribLocation(me.shaderProgram, 'position');
	me.gl.enableVertexAttribArray(me.vertexPosition);

	me.vertexTexture = me.gl.getAttribLocation(me.shaderProgram, 'TextureCoord');
	me.gl.enableVertexAttribArray(me.vertexTexture);

	me.vertexNormal = me.gl.getAttribLocation(me.shaderProgram, 'VertexNormal');
	me.gl.enableVertexAttribArray(me.vertexNormal);

	me.directionalLightColor = me.gl.getUniformLocation(me.shaderProgram, 'directionalLightColor');
	var location = /**@type {number}*/(me.gl.getUniform(me.shaderProgram, me.directionalLightColor));
	me.gl.enableVertexAttribArray(location);

	me.lightDirection = me.gl.getUniformLocation(me.shaderProgram, 'lightDirection');
	location = /**@type {number}*/(me.gl.getUniform(me.shaderProgram, me.lightDirection));
	me.gl.enableVertexAttribArray(location);

	me.ambientLight = me.gl.getUniformLocation(me.shaderProgram, 'ambientLight');
	location = /**@type {number}*/(me.gl.getUniform(me.shaderProgram, me.ambientLight));
	me.gl.enableVertexAttribArray(location);
}

/**
 * Helper function that loads a shader
 * @private
 * @param {HTMLElement | null} script the script to read in
 * @return {string}
 */
denizen.graphics.GLHelper.prototype.loadShader = function(script) {
	var code = '';
	var currentChild = script.firstChild;
	while (currentChild) {
		if (currentChild.nodeType == TEXT_NODE) {
			code += currentChild.textContent;
		}
		currentChild = currentChild.nextSibling;
	}
	return code;
}

/**
 * Helper function that changes degrees to radians
 * @private
 * @this {denizen.graphics.GLHelper}
 * @param {number} degrees the degrees to use
 * @return {number} the value in radians
 */
denizen.graphics.GLHelper.prototype.degreesToRadians = function(degrees) {
	return degrees * Math.PI / 180;
}

/**
 * A function that will draw a block
 * @private
 * @this {denizen.graphics.GLHelper}
 * @param {denizen.map.Block} block
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {void}
 */
denizen.graphics.GLHelper.prototype.drawBlock = function(block, x, y, z) {
	var me = this;
	//first check if the texture is loaded, cause if it's not, there's no point in rendering
	var texture = me.textureFactory.get(block.id);
	if (!texture.texture) {
		return;
	}

	me.matrixMode(denizen.graphics.MatrixMode.GL_MODELVIEW);
	me.pushMatrix();
	var translated = me.mat4.makeTranslate(me.mat4.createFloat32Identity(), x, y, z);
	me.mvMatrix = /**@type {!Float32Array}*/(me.mat4.multMat(me.mvMatrix, translated, me.mvMatrix));
	me.updateNormalMatrix();

	//update shaders
	var shaderMVMatrix = me.gl.getUniformLocation(me.shaderProgram, "TransformationMatrix");
	me.gl.uniformMatrix4fv(shaderMVMatrix, false, new Float32Array(me.mvMatrix));
	me.gl.uniform1i(me.gl.getUniformLocation(me.shaderProgram, "uSampler"), 0);
	var shaderNMatrix = me.gl.getUniformLocation(me.shaderProgram, "NormalMatrix");
	me.gl.uniformMatrix4fv(shaderNMatrix, false, new Float32Array(me.mvNormalMatrix));

	//handle vertices
	var vertexBuffer = me.gl.createBuffer();
	me.gl.bindBuffer(me.gl.ARRAY_BUFFER, vertexBuffer);
	me.gl.bufferData(me.gl.ARRAY_BUFFER, new Float32Array(denizen.map.Block.vertices), me.gl.STATIC_DRAW);
	me.gl.vertexAttribPointer(me.vertexPosition, 3, me.gl.FLOAT, false, 0, 0);

	//handle textures
	var textureBuffer = me.gl.createBuffer();
	me.gl.bindBuffer(me.gl.ARRAY_BUFFER, textureBuffer);
	me.gl.bufferData(me.gl.ARRAY_BUFFER, new Float32Array(denizen.map.Block.textureCoords), me.gl.STATIC_DRAW);
	me.gl.enableVertexAttribArray(me.vertexTexture);
	me.gl.vertexAttribPointer(me.vertexTexture, 2, me.gl.FLOAT, false, 0, 0);

	me.gl.bindTexture(me.gl.TEXTURE_2D, texture.texture);

	//triangles
	var triangleBuffer = me.gl.createBuffer();
	me.gl.bindBuffer(me.gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
	me.gl.bufferData(me.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(denizen.map.Block.triangles), me.gl.STATIC_DRAW);

	//normals
	var normalBuffer = me.gl.createBuffer();
	me.gl.bindBuffer(me.gl.ARRAY_BUFFER, normalBuffer);
	me.gl.bufferData(me.gl.ARRAY_BUFFER, new Float32Array(denizen.map.Block.vertexNormals), me.gl.STATIC_DRAW);
	me.gl.bindBuffer(me.gl.ARRAY_BUFFER, normalBuffer);
	me.gl.vertexAttribPointer(me.vertexNormal, 3, me.gl.FLOAT, false, 0, 0);

	//draw
	me.gl.drawElements(me.gl.TRIANGLES, denizen.map.Block.triangles.length, me.gl.UNSIGNED_SHORT, 0);

	me.popMatrix();
}

