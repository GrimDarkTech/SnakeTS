import * as BABYLON from "@babylonjs/core";
import * as GUI from '@babylonjs/gui'
import {BoxBody} from "./Boxbody"

export class SegmentHinge implements BABYLON.Behavior<BABYLON.Mesh> {

    private _rigidbody: BABYLON.PhysicsAggregate | null;
    private _connected_rigidbody: BABYLON.PhysicsAggregate | null;
    private _joint: BABYLON.HingeConstraint | null;

    public connected_body: BoxBody | null;

    public pivot: BABYLON.Vector3;
    public connected_pivot: BABYLON.Vector3;

    public axis: BABYLON.Vector3;
    public connected_axis: BABYLON.Vector3;

    public gameObject: BABYLON.Mesh | null;

    public name: string;
    

    public attach(target: BABYLON.Mesh): void {
        this.gameObject = target;

        this._rigidbody = (target.getBehaviorByName("BoxBody") as BoxBody).get_rigidbody();
        this._connected_rigidbody = this.connected_body.get_rigidbody();
        const scene = target.getScene();

        this._joint = new BABYLON.HingeConstraint(this.pivot, this.connected_pivot, 
        this.axis, this.connected_axis, scene);

        this._rigidbody.body.addConstraint(this._connected_rigidbody.body, this._joint)
    }   

    public detach(): void {
        this._joint.dispose();
    }

    public init(): void {
        this.name = "SegmentHinge";
        this.gameObject = null;
    }

}