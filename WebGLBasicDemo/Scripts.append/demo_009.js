var model;
var view;
var perlin;
var landform;
var scale;

var Landform = (function () {
    function Landform() {
        this.cellSize = 1;
        this.xHalfRange = 35;
        this.yHalfRange = 35;
    }
    return Landform;
}());

function onLoad() {
    model = new Model();
    view = new View(model, "canvas-frame");
    perlin = new PerlinNoise();

    setScale();

    initThree(view);
    init3DObjects(model);
    mainloop();
}

function enableWireframe(isOn) {
    landform.material.wireframe = isOn;
}

function updateScale() {
    setScale();

    model.scene.remove(landform);

    init3DObjects(model);
}

function setScale() {
    scale = new THREE.Vector3(0, 0, 0);
    scale.x = (Number)(document.getElementById("scaleX").value);
    scale.y = (Number)(document.getElementById("scaleY").value);
    scale.z = (Number)(document.getElementById("scaleZ").value);
}

function initThree(v) {
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(v.canvasFrame.clientWidth, v.canvasFrame.clientHeight);
    v.setRenderer(renderer);

    v.canvasFrame.appendChild(v.renderer.domElement);

    v.renderer.setClearColor(0xEEEEFF, 1.0);
    v.camera.position.set(20, -40, 80);
}

function init3DObjects(m) {
    landform = createLandform(scale);
    m.addObject(landform);
}

function createLandform(scale) {
    // 頂点データ
    var geometry = createLandformGeometry(scale);

    // テクスチャー
    var loader = new THREE.TextureLoader();
    var texture = loader.load("fig/cray.jpg");

    // マテリアル
    var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

    // メッシュ
    var ob = new THREE.Mesh(geometry, material);
    ob.position.set(0, 0, 0);

    return ob;
}

function createLandformGeometry(scale) {
    var geometry = new THREE.Geometry();
    var lf = new Landform();
    var lineWidth = lf.xHalfRange * 2 + 1;

    for (var y = -lf.yHalfRange; y <= lf.yHalfRange; ++y) {
        var yIndex = y + lf.yHalfRange;
        for (var x = -lf.xHalfRange; x <= lf.xHalfRange; ++x) {
            var xIndex = x + lf.xHalfRange;
            var index = yIndex * lineWidth + xIndex;
            // 起伏を設定
            var z = perlin.noise(x * scale.x, y * scale.y, 0) * scale.z;
            geometry.vertices[index] = new THREE.Vector3((lf.cellSize + 0.1) * x, (lf.cellSize + 0.1) * y, z);
        }
    }

    var indexFace = 0;
    for (var y = -lf.yHalfRange; y < lf.yHalfRange; ++y) {
        var yIndex = y + lf.yHalfRange;
        for (var x = -lf.xHalfRange; x < lf.xHalfRange; ++x) {
            var xIndex = x + lf.xHalfRange;
            var index = yIndex * lineWidth + xIndex;
            geometry.faces[indexFace] = new THREE.Face3(index, index + 1, index + lineWidth);
            geometry.faces[indexFace + 1] = new THREE.Face3(index + lineWidth, index + 1, index + lineWidth + 1);
            // Texture UV座標の設定
            var textureUv = [
                new THREE.Vector2((xIndex + 0.0) / (lf.xHalfRange * 2 + 1.0), (yIndex + 0.0) / (lf.yHalfRange * 2 + 1.0)),
                new THREE.Vector2((xIndex + 1.0) / (lf.xHalfRange * 2 + 1.0), (yIndex + 0.0) / (lf.yHalfRange * 2 + 1.0)),
                new THREE.Vector2((xIndex + 0.0) / (lf.xHalfRange * 2 + 1.0), (yIndex + 1.0) / (lf.yHalfRange * 2 + 1.0)),
                new THREE.Vector2((xIndex + 1.0) / (lf.xHalfRange * 2 + 1.0), (yIndex + 1.0) / (lf.yHalfRange * 2 + 1.0))
            ];
            
            geometry.faceVertexUvs[0].push([
                textureUv[0], textureUv[1], textureUv[2]
            ]);
            geometry.faceVertexUvs[0].push([
                textureUv[2], textureUv[1], textureUv[3]
            ]);
            indexFace += 2;
        }
    }

    // 法線計算
    geometry.computeFaceNormals();

    return geometry;
}

function mainloop() {
    landform.geometry.verticesNeedUpdate = true;

    view.updateTrackball();
    view.render();

    requestAnimationFrame(mainloop);
}
