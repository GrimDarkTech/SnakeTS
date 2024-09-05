import * as BABYLON from "@babylonjs/core";
import * as GUI from '@babylonjs/gui'

export class BoxBody implements BABYLON.Behavior<BABYLON.Mesh> {

    private _rigidbody: BABYLON.PhysicsAggregate | null;

    public gameObject: BABYLON.Mesh | null;

    public name: string;

    public mass: BABYLON.float;

    public attach(target: BABYLON.Mesh): void {
        this.gameObject = target;
        const scene = target.getScene();

        this._rigidbody = new BABYLON.PhysicsAggregate(target, BABYLON.PhysicsShapeType.BOX, { mass: this.mass, restitution:0.75}, scene);
    }

    public detach(): void {
        this._rigidbody.dispose();
    }

    public init(): void {
        this.name = "BoxBody";
        this.gameObject = null;

        if(this.mass < 0)
        {
            this.mass = 0;
        }
    }

    public get_rigidbody(): BABYLON.PhysicsAggregate{
        return this._rigidbody;
    }

    public set_kinematic(){
        this._rigidbody.body.setMotionType(BABYLON.PhysicsMotionType.STATIC);
    }

    public reset_kinematic(){
        this._rigidbody.body.setMotionType(BABYLON.PhysicsMotionType.DYNAMIC);
    }

}