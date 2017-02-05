var model;
var view;
var earth;
var moon;
var radiusEarth = 30.0;
var radiusMoon = 8.18;
var distanceEarthToMoon = 905;
var distanceEarthToSun = 352221;
var thRevolution = -0.002;

function onLoad() {
    model = new Model();
    view = new View( model, "canvas-frame" );

    initThree( view );
    initLight( model );
    init3DObjects( model );
    mainloop();
}

function makeTranslucence( isOn ) {
    earth.material.opacity = isOn ? 0.8 : 1.0;
}

function initThree( v ) {
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( v.canvasFrame.clientWidth, v.canvasFrame.clientHeight );
    v.setRenderer( renderer );

    v.canvasFrame.appendChild( v.renderer.domElement );

    v.renderer.setClearColor( 0x000000, 1.0 );
    v.camera.position.set( 60, 0, 130 );
}

function initLight( m ) {
    // 平行光源
    var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    directionalLight.position.set( distanceEarthToSun, 0, 0 );
    m.addObject( directionalLight );
}

function init3DObjects( m ) {
    earth = createTexturedSphere( "fig/earth.jpg", radiusEarth, new THREE.Vector3( 0, 0, 0 ) );
    moon = createTexturedSphere( "fig/moon.jpg", radiusMoon, new THREE.Vector3( distanceEarthToMoon, 0, 0 ) );
    m.addObject( earth );
    m.addObject( moon );
}

function createTexturedSphere( imagePath, radius, position ) {
    // 頂点データ
    var geometry = new THREE.SphereGeometry( radius, 50, 50 );

    // テクスチャー
    var loader = new THREE.TextureLoader();
    var texture = loader.load( imagePath );

    // マテリアル
    var material = new THREE.MeshPhongMaterial({ map: texture, color: 0xFFFFFF, specular: 0x555555, shininess: 30, transparent: true, opacity: 1.0 });

    // メッシュ
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( position.x, position.y, position.z );

    return mesh;
}

// 無限ループ
function mainloop() {
    view.updateTrackball();
    view.render();

    // 自転
    earth.rotateY(0.01);
    moon.rotateY(0.002);

    // 公転
    var x = moon.position.x;
    var z = moon.position.z;
    var xNext = x * Math.cos( thRevolution ) - z * Math.sin( thRevolution );
    var zNext = x * Math.sin( thRevolution ) + z * Math.cos( thRevolution );
    moon.position.x = xNext;
    moon.position.z = zNext;

    requestAnimationFrame( mainloop );
}
