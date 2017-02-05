var camera;
var canvasFrame;
var renderer;
var scene;
var earth;
var radiusEarth = 30.0;

function onLoad() {
    initThree();
    initCamera();
    init3DObjects();
    mainloop();
}

function initThree() {
    canvasFrame = document.getElementById("canvas-frame");
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( canvasFrame.clientWidth, canvasFrame.clientHeight );
    canvasFrame.appendChild( renderer.domElement );

    renderer.setClearColor( 0xEEEEFF, 1.0 );

    scene = new THREE.Scene();
}

function initCamera() {
    setupCamera( canvasFrame );
}

function setupCamera( canvasFrame ) {
    camera = new THREE.PerspectiveCamera( 45, canvasFrame.clientWidth / canvasFrame.clientHeight, 1, 10000 );
    camera.position.set( 60, 0, 130 );
    camera.up.set( 0, 1, 0 );
    camera.lookAt({ x: 0, y: 0, z: 0 });
}

function init3DObjects() {
    earth = createTexturedSphere( "fig/earth.jpg", radiusEarth, new THREE.Vector3( 0, 0, 0 ) );
    scene.add( earth );
}

function createTexturedSphere( imagePath, radius, position ) {
    // 頂点データ
//    var geometry = new THREE.SphereGeometry( radius, 50, 50 );
    var geometry = new THREE.SphereGeometry( radius, 20, 20 );

    // マテリアル
//    var material = new THREE.MeshNormalMaterial();
    var material = new THREE.MeshNormalMaterial({ wireframe: true });

    // メッシュ
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( position.x, position.y, position.z );

    return mesh;
}

// 無限ループ
function mainloop() {
    renderer.render( scene, camera );

    requestAnimationFrame( mainloop );
}
