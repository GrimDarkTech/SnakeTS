import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";

import HavokPhysics from "@babylonjs/havok";

import {BoxBody} from "./Boxbody"
import {SegmentHinge} from "./SegmentHinge"
import {MeshColorEditor} from "./MeshColorEditor"

import { Engine, Scene, FlyCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, HavokPlugin, 
    StandardMaterial, CubeTexture, Texture, Color3, PhysicsAggregate, PhysicsShapeType, PointerDragBehavior} from "@babylonjs/core";


class App {

    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _physics!: HavokPlugin;

    constructor() 
    {
        this._canvas = document.createElement("canvas");
        this._canvas.style.width = "100%";
        this._canvas.style.height = "100%";
        this._canvas.id = "gameCanvas";
        document.body.appendChild(this._canvas);

        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);

        let camera: FlyCamera = new FlyCamera("Camera",new Vector3(-5, 1, 0), this._scene);
        camera.rotation = new Vector3(0, 0.5 * Math.PI, 0);
        camera.attachControl(true);

        this.initPhysics();

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

    private async initPhysics()
    {
        var havok = await HavokPhysics();
        this._physics = new HavokPlugin(true, havok);
        this._scene.enablePhysics(new Vector3(0, -9.8, 0), this._physics)

        this.start();
    }

    private start(): void
    {
        let light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);

        let skyboxMaterial = new StandardMaterial("skyBox", this._scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("/textures/skyboxes/skybox", this._scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);

        let skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this._scene);
        skybox.material = skyboxMaterial;

        let ground = MeshBuilder.CreateGround("ground", {width: 20, height: 20}, this._scene);
        var groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, this._scene);
        
        let boxes: Mesh[] = [];
        let bodies: BoxBody[] = [];
        let joints: SegmentHinge[] = [];

        let number_of_boxes = 4;

        for(let i = 0; i < number_of_boxes; i++){
            let box = MeshBuilder.CreateBox("box"+i, {height: 1, width: 1, depth: 1}, this._scene);
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

        let colorEditor = new MeshColorEditor(this._scene);

      
        boxes.forEach(box => {
            const pointerDragBehavior = new PointerDragBehavior();
            box.addBehavior(pointerDragBehavior);
            let rb: BoxBody;

            pointerDragBehavior.onDragStartObservable.add((event) => {
                this._scene.activeCamera.detachControl(this._canvas);
                rb = (box.getBehaviorByName("BoxBody") as BoxBody);
                rb.setStatic();
                colorEditor.selectedSegment = box;
                colorEditor.updateId(box);
            });
    
            pointerDragBehavior.onDragEndObservable.add((event) => {
                this._scene.activeCamera.attachControl(this._canvas);
                rb.setDynamic();
            });
        });
    }
    

    private update(): void{

    }
}

new App();
