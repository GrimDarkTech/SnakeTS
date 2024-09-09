
import {Image, AdvancedDynamicTexture, TextBlock, Button, Rectangle, Control} from '@babylonjs/gui'
import {StandardMaterial, Color3, Scene, Mesh} from "@babylonjs/core";

export class MeshColorEditor{

    private _canvas: AdvancedDynamicTexture;
    private _scene: Scene;
    private _idTextBlock: TextBlock;
    
    public selectedSegment: Mesh| null;

    constructor(scene: Scene){

        this._canvas = AdvancedDynamicTexture.CreateFullscreenUI("GUI");
        this._scene = scene;

        const rect1 = new Rectangle();

        rect1.width = "20%";
        rect1.height = "80%";
        rect1.cornerRadius = 5;
        rect1.color = "white";
        rect1.thickness = 2;
        rect1.background = "black";
        rect1.paddingRight = 10;
        rect1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        rect1.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this._canvas.addControl(rect1);  
        
        const image = new Image("img","textures/gui/MeshColorEditor.png");
        image.width = 1;
        image.height = 0.5;
        image.verticalAlignment  = Control.VERTICAL_ALIGNMENT_TOP;
        rect1.addControl(image);  
        
        const titleText = new TextBlock();
        titleText.text = "Mesh color editor";
        titleText.color = "white";
        titleText.fontSize = 22;
        titleText.verticalAlignment  = Control.VERTICAL_ALIGNMENT_TOP;
        titleText.top = "-45%";
        rect1.addControl(titleText);

        this._idTextBlock = new TextBlock();
        this._idTextBlock.text = "The segment is not selected";
        this._idTextBlock.color = "white";
        this._idTextBlock.fontSize = 22;
        this._idTextBlock.verticalAlignment  = Control.VERTICAL_ALIGNMENT_TOP;
        this._idTextBlock.top = "-10%";
        rect1.addControl(this._idTextBlock);
        
        const colorButton1 = Button.CreateSimpleButton("colorButton1", "Set color to Red");
        colorButton1.width = "200px";
        colorButton1.height = "40px";
        colorButton1.color = "white";
        colorButton1.background = "red";
        colorButton1.top = "0%";
        colorButton1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        rect1.addControl(colorButton1);
        
        const colorButton2 = Button.CreateSimpleButton("colorButton2", "Set color to Blue");
        colorButton2.width = "200px";
        colorButton2.height = "40px";
        colorButton2.color = "white";
        colorButton2.background = "blue";
        colorButton2.top = "10%";
        colorButton2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        rect1.addControl(colorButton2);
    
        colorButton1.onPointerUpObservable.add(() => {
            if (this.selectedSegment != null) {
                this.selectedSegment.material = new StandardMaterial("material1", this._scene);
                (this.selectedSegment.material as StandardMaterial).diffuseColor = new Color3(1, 0, 0);
            }
        });
        
        colorButton2.onPointerUpObservable.add(() => {
            if (this.selectedSegment != null) {
                this.selectedSegment.material = new StandardMaterial("material2", this._scene);
                (this.selectedSegment.material as StandardMaterial).diffuseColor = new Color3(0, 0, 1);
            }
        });
    }

    public updateId(box: Mesh): void{
        this._idTextBlock.text = "Selected Segment ID: " + box.metadata.id;
    }
}


