import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";

import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder } from "@babylonjs/core";

class App {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _physics!: any;

    constructor() 
    {

        this._canvas = document.createElement("canvas");
        this._canvas.style.width = "100%";
        this._canvas.style.height = "100%";
        this._canvas.id = "gameCanvas";
        document.body.appendChild(this._canvas);

        this._engine = new BABYLON.Engine(this._canvas, true);
        this._scene = new BABYLON.Scene(this._engine);

        var camera: BABYLON.FlyCamera = new BABYLON.FlyCamera("Camera",new Vector3(1, 1, 0), this._scene);
        camera.attachControl(true);
        var light1: BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);
        var sphere: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this._scene);

        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this._scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/textures/skyboxes/skybox", this._scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this._scene);
        skybox.material = skyboxMaterial;

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            if (ev.shiftKey && ev.ctrlKey) {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide();
                } else {
                    this._scene.debugLayer.show();
                }
            }
        });

        this._engine.runRenderLoop(() => 
            {
                this._scene.render();
        });
    }
}

new App();
