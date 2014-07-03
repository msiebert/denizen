goog.provide('denizen.graphics.GLHelper');

goog.require('goog.vec.Mat4');

/**
 * @private
 * @enum {number}
 */
denizen.graphics.GLHelper.MatrixMode = {
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
/**@private*/
denizen.graphics.GLHelper.prototype.mat4 = goog.vec.Mat4;

/**@private @type {HTMLCanvasElement}*/
denizen.graphics.GLHelper.prototype.canvas;
/**@private @type {WebGLRenderingContext | null}*/
denizen.graphics.GLHelper.prototype.gl;

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

//------------------------------------------------------------------------
// Matrix methods
//------------------------------------------------------------------------

/**
 * Switch between the matrices
 * @private
 * @this {denizen.graphics.GLHelper}
 * @param {denizen.graphics.GLHelper.MatrixMode} mode the matrix to use
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
	return me.selectedMatrix == denizen.graphics.GLHelper.MatrixMode.GL_MODELVIEW;
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

	me.directionLightColor = me.gl.getUniformLocation(me.shaderProgram, 'directionalLightColor');
	var location = /**@type {number}*/(me.gl.getUniform(me.shaderProgram, me.directionLightColor));
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
