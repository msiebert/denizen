goog.provide('denizen.util.GLHelper');

/**
 * Initialize the GLHelper
 * @constructor
 */
denizen.util.GLHelper = function() {
	var me = this;
	me.canvas = null;
	me.gl = null;
};

/** @type {HTMLCanvasElement} */
denizen.util.GLHelper.prototype.canvas;
/** @type {WebGLRenderingContext | null} */
denizen.util.GLHelper.prototype.gl;

/**
 * Start up the WebGL context.
 * @param {HTMLCanvasElement} canvas to run the game on
 * @this {denizen.util.GLHelper}
 * @return {void}
 */
denizen.util.GLHelper.prototype.start = function(canvas) {
	var me = this;
	me.canvas = canvas;
	me.initGL(me.canvas);
	me.gl.viewport(0, 0, me.canvas.width, me.canvas.height);
	me.gl.enable(me.gl.DEPTH_TEST);
	me.gl.depthFunc(me.gl.LEQUAL);
}

/**
 * Set the color to clear the screen to
 * @this {denizen.util.GLHelper}
 * @param {number} r the red value
 * @param {number} g the green value
 * @param {number} b the blue value
 * @param {number} a the alpha value
 * @return {void}
 */
denizen.util.GLHelper.prototype.clearColor = function(r, g, b, a) {
	var me = this;
	me.gl.clearColor(r, g, b, a);
}

/**
 * Clear the screen
 * @this {denizen.util.GLHelper}
 * @return {void}
 */
denizen.util.GLHelper.prototype.clear = function() {
	var me = this;
	me.gl.clear(me.gl.COLOR_BUFFER_BIT | me.gl.DEPTH_BUFFER_BIT);
}

/**--------------------------------------------------------------
* Unexposed helper functions
-----------------------------------------------------------------*/

/**
 * Helper function that initializes a canvas
 * @private
 * @param {HTMLCanvasElement} canvas the canvas element to turn into a webgl rendering context
 * @this {denizen.util.GLHelper}
 * @return {void}
 */
denizen.util.GLHelper.prototype.initGL = function(canvas) {
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
