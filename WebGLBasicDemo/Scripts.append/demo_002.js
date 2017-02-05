function createRenderer( canvasFrame ) {
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasFrame.clientWidth, canvasFrame.clientHeight );
    return renderer;
}

function createCamera( canvasFrame ) {
    var camera = new THREE.PerspectiveCamera( 45, canvasFrame.clientWidth / canvasFrame.clientHeight, 1, 10000 );
    camera.position.set( 0, 0, 2.5 );
    camera.up.set( 0, 1, 0 );
    camera.lookAt({ x: 0, y: 0, z: 0 });
    return camera;
}

function create3DObject() {
    // 頂点データ
    var geometry = new THREE.Geometry();
    geometry.vertices[0] = new THREE.Vector3(    0,  0.5, 0 );
    geometry.vertices[1] = new THREE.Vector3( -0.5, -0.5, 0 );
    geometry.vertices[2] = new THREE.Vector3(  0.5, -0.5, 0 );
    // 面指定
    geometry.faces[0] = new THREE.Face3( 0, 1, 2 );

    // マテリアル
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // メッシュ
    var rectangle = new THREE.Mesh( geometry, material );
    rectangle.position.set( 0, 0, 0 );

    return rectangle;
}

function startThree() {
    var canvasFrame = document.getElementById("canvas-frame");
    var renderer = createRenderer( canvasFrame );
    canvasFrame.appendChild( renderer.domElement );

    var scene = new THREE.Scene();

    var camera = createCamera( canvasFrame );

    var ob = create3DObject();
    scene.add( ob );

    renderer.setClearColor( 0x000000, 1.0 );
    renderer.clear();
    renderer.render( scene, camera );
}

function onLoad() {
    startThree();
}
