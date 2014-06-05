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

	// set up graphics environment
	me.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	me.scene = new THREE.Scene();

	var blocks = [
		new denizen.map.Block(200, 200, 200)
	];
	me.chunk = new denizen.map.Chunk(blocks);

	//set up the renderer
	me.renderer = new THREE.CanvasRenderer();
	me.renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(me.renderer.domElement);

}

denizen.Game.prototype.run = function() {
	var me = this;
	me.camera.z = me.player.z;
	me.render();
}

denizen.Game.prototype.render = function() {
	var me = this;
	me.chunk.fillScene(me.scene);
	me.chunk.blocks[0].mesh.rotation.x += .01;
	me.chunk.blocks[0].mesh.rotation.y += .02;
	me.renderer.render(me.scene, me.camera);
}


function animate() {
	requestAnimationFrame( animate );

	document.game.render();
}

document.game = new denizen.Game();
document.game.run();
animate();