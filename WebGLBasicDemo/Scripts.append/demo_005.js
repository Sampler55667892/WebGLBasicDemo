var camera;
var canvasFrame;
var renderer;
var scene;
var trackball;
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
    setupTrackball( camera, canvasFrame );
}

function setupCamera( canvasFrame ) {
    camera = new THREE.PerspectiveCamera( 45, canvasFrame.clientWidth / canvasFrame.clientHeight, 1, 10000 );
    camera.position.set( 60, 0, 130 );
    camera.up.set( 0, 1, 0 );
    camera.lookAt({ x: 0, y: 0, z: 0 });
}

function setupTrackball( camera, canvasFrame ) {
    trackball = new THREE.TrackballControls( camera, canvasFrame );

    // 回転の設定
    trackball.noRotate = false;
    trackball.rotateSpeed = 2.0;

    // 拡大の設定
    trackball.noZoom = false;
    trackball.zoomSpeed = 1.0;

    // パンの設定
    trackball.noPan = false;
    trackball.panSpeed = 1.0;
    trackball.target = new THREE.Vector3( 0, 0, 10 );

    // スタティックムーブ関連
    trackball.staticMoving = true;

    // ダイナミックムーブ関連
    trackball.dynamicDampingFactor = 0.3;
}

function init3DObjects() {
    earth = createTexturedSphere( "fig/earth.jpg", radiusEarth, new THREE.Vector3( 0, 0, 0 ) );
    scene.add( earth );
}

function createTexturedSphere( imagePath, radius, position ) {
    // 頂点データ
    var geometry = new THREE.SphereGeometry( radius, 50, 50 );

    // テクスチャー
    var loader = new THREE.TextureLoader();
    var texture = loader.load( imagePath );

    // マテリアル
    var material = new THREE.MeshBasicMaterial({ map: texture });

    // メッシュ
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( position.x, position.y, position.z );

    return mesh;
}

// 無限ループ
function mainloop() {
    trackball.update();

    renderer.render( scene, camera );

    requestAnimationFrame( mainloop );
}
