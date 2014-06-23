goog.provide('denizen.util.GLHelper');

/**
 * Initialize the GLHelper
 * @constructor
 */
denizen.util.GLHelper = function() {
	var me = this;
	/**@type {Object}*/
	me.canvas = null;
	/**@type {WebGLRenderingContext}*/
	me.gl = null;
};

/**
 * Start up the WebGL context.
 * @param {string} canvasId the id of the canvas element to get
 * @this {denizen.util.GLHelper}
 * @return {void}
 */
denizen.util.GLHelper.prototype.start = function(canvasId) {
	var me = this;
	me.canvas = document.getElementById(canvasId);
	// me.initGL(me.canvas);
	// me.gl.viewport(0, 0, me.canvas.width, me.canvas.height);
	// me.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// me.gl.enable(me.gl.DEPTH_TEST);
	// me.gl.depthFunc(me.gl.LEQUAL);
}