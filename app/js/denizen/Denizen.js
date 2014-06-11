goog.provide('denizen');
goog.provide('denizen.Game');

goog.require('denizen.player.Player');
goog.require('denizen.map.Chunk');
goog.require('denizen.map.Block');

/**
 * @constructor
 */
denizen.Game = function() {
	var me = this;
	me.player = new denizen.player.Player();

	// // set up graphics environment

	// var geometry = new THREE.BoxGeometry( 200, 200, 200 );
	// var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	// me.mesh = new THREE.Mesh( geometry, material );
	// me.scene.add(me.mesh);

	// var blocks = [
	// 	new denizen.map.Block(200, 200, 200)
	// ];
	// me.chunk = new denizen.map.Chunk(blocks);

	// //set up the renderer
	// me.renderer = new THREE.CanvasRenderer();
	// me.renderer.setSize(window.innerWidth, window.innerHeight);

	// document.body.appendChild(me.renderer.domElement);
}

/** @type {denizen.Game} 
 * For some reason, it only works if there's a global Game object
*/
var game;
/**@type {THREE.Scene}*/
denizen.Game.prototype.scene;
/**@type {THREE.CanvasRenderer}*/
denizen.Game.prototype.renderer;
/**@type {THREE.BoxGeometry}*/
denizen.Game.prototype.geometry;
/**@type {THREE.PerspectiveCamera}*/
denizen.Game.prototype.camera;
/**@type {THREE.MeshBasicMaterial}*/
denizen.Game.prototype.material;
/**@type {THREE.Mesh}*/
denizen.Game.prototype.mesh;

denizen.Game.prototype.run = function() {
	// var me = this;
	// me.camera.z = me.player.z;
	// me.render();
}

denizen.Game.start = function() {
	game = new denizen.Game();
	denizen.Game.init();
	denizen.Game.animate();
}

var geometry, material, mesh;
var renderer, scene, camera;

denizen.Game.init = function() {

	geometry = new THREE.BoxGeometry(200, 200, 200);
	material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
	mesh = new THREE.Mesh(geometry, material);
	
	game.scene = new THREE.Scene();
	game.scene.add(mesh);

	game.renderer = new THREE.CanvasRenderer();
	game.renderer.setSize( window.innerWidth, window.innerHeight );

	game.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	game.camera.position.z = 1000;

	document.body.appendChild(game.renderer.domElement);
}

denizen.Game.animate = function() {
	requestAnimationFrame( denizen.Game.animate );
	// game.run();

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;
	game.renderer.render(game.scene, game.camera);
}
