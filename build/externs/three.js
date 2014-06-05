
var THREE = {};

/** @constructor */
THREE.Scene = function() {};

/**
 * Add a Mesh to a Scene
 * @param {THREE.Mesh} mesh
 */
THREE.Scene.prototype.add = function(mesh) {};

/** 
 * Create a perspective camera
 * @constructor 
 * @param {number} fov
 * @param {number} aspect
 * @param {number} near
 * @param {number} far
 */
THREE.PerspectiveCamera = function(fov, aspect, near, far) {};

/**
 * Create a new renderer for a canvas
 * @constructor
 */
THREE.CanvasRenderer = function() {};

/**
 * Set the size of the Canvas Renderer
 * @param {number} width
 * @param {number} height
 */
THREE.CanvasRenderer.prototype.setSize = function(width, height) {};

/**
 * The interal canvas in the CanvasRenderer
 * @type {HTMLCanvasElement}
 */
THREE.CanvasRenderer.prototype.domElement;

/**
 * Render the canvas renderer
 * @param {THREE.Scene} scene
 * @param {THREE.PerspectiveCamera} camera
 */
THREE.CanvasRenderer.prototype.render = function(scene, camera) {};

// =======================================================================
// Geometry
// =======================================================================

/**
 * Create a new Box geometry object
 * @constructor
 * @param {number} width
 * @param {number} height
 * @param {number} depth
 */
THREE.BoxGeometry = function(width, height, depth) {};

/**
 * Create a new Mesh object
 * @constructor
 * @param {THREE.BoxGeometry} geometry
 * @param {THREE.MeshBasicMaterial} material
 */
THREE.Mesh = function(geometry, material) {};

// =======================================================================
// Materials
// =======================================================================

/**
 * Create a new basic mesh material
 * @constructor
 * @param {Object.<string, ?>} properties
 */
THREE.MeshBasicMaterial = function(properties) {};