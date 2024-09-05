import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

import {BoxBody} from "./Boxbody"
import {SegmentHinge} from "./HingeJoint"

import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder } from "@babylonjs/core";

class App {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _physics!: BABYLON.HavokPlugin;

    constructor() 
    {
        this._canvas = document.createElement("canvas");
        this._canvas.style.width = "100%";
        this._canvas.style.height = "100%";
        this._canvas.id = "gameCanvas";
        document.body.appendChild(this._canvas);

        this._engine = new BABYLON.Engine(this._canvas, true);
        this._scene = new BABYLON.Scene(this._engine);

        let camera: BABYLON.FlyCamera = new BABYLON.FlyCamera("Camera",new Vector3(-5, 1, 0), this._scene);
        camera.rotation = new Vector3(0, 0.5 * Math.PI, 0);
        camera.attachControl(true);

        this.init_physics();

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
                this.update();
                this._scene.render();
        });
    }

    private async init_physics()
    {
        var havok = await HavokPhysics();
        this._physics = new BABYLON.HavokPlugin(true, havok);
        this._scene.enablePhysics(new BABYLON.Vector3(0, -2.3, 0), this._physics)

        this.start();
    }

    private start(): void{



        let light1: BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);

        let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this._scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/textures/skyboxes/skybox", this._scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this._scene);
        skybox.material = skyboxMaterial;

        let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 20}, this._scene);
        var groundAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, this._scene);
        
        let boxes: BABYLON.Mesh[] = [];
        let bodies: BoxBody[] = [];
        let joints: SegmentHinge[] = [];

        let number_of_boxes = 4;

        for(let i = 0; i < number_of_boxes; i++){
            let box = BABYLON.MeshBuilder.CreateBox("box"+i, {height: 1, width: 1, depth: 1}, this._scene);
            box.position = new Vector3(0, 3, 0);
            box.metadata = { id: i };

            let rb = new BoxBody();
            rb.mass = 0.1;
            box.addBehavior(rb, true);

            boxes.push(box);
            bodies.push(rb);
        }

        for(let i =0; i < number_of_boxes - 1; i++){
            let hinge = new SegmentHinge();
            hinge.connected_body = bodies[i + 1];
            hinge.axis = new Vector3(1, 0, 0);
            hinge.connected_axis = new Vector3(1, 0, 0);
            hinge.pivot = new Vector3(0, 0.5, 0);
            hinge.connected_pivot = new Vector3(0, -0.6, 0);
            boxes[i].addBehavior(hinge, true);

            joints.push(hinge);
        }

      
        boxes.forEach(box => {
            const pointerDragBehavior = new BABYLON.PointerDragBehavior();
            box.addBehavior(pointerDragBehavior);
            let rb: BoxBody;
            let start_position: Vector3;
            
            pointerDragBehavior.onDragStartObservable.add((event) => {
                this._scene.activeCamera.detachControl(this._canvas);
                start_position = event.dragPlanePoint;
                rb = (box.getBehaviorByName("BoxBody") as BoxBody);
                rb.set_kinematic();
            });
    
            pointerDragBehavior.onDragEndObservable.add((event) => {
                this._scene.activeCamera.attachControl(this._canvas);
                rb.reset_kinematic();
                rb.get_rigidbody().body.applyImpulse(event.dragPlanePoint.subtract(start_position), Vector3.Zero());
            });
        });
        
    }

    private update(): void{
    
    }
}

new App();
