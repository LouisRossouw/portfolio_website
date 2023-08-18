import * as THREE from "three";
import * as YUKA from "yuka";
import Experience from "../Experience.js";


export default class SteeringBehavior
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.settings = this.experience.settings
        this.world_speed = this.settings.world_speed[this.settings.world_speed_value]
        this.time = this.experience.time

        // entityManager for steering behavior using YUKA lib - https://mugen87.github.io/yuka/examples/
        this.entityManager = new YUKA.EntityManager();

        this.obsticle_list = []

        this.target = null
        this.set_mouse_target()  
        
    }

    sync(entity, renderComponent){
        renderComponent.matrix.copy(entity.worldMatrix);
    }


    set_mouse_target(){

        // TargetMesh that the Woman entity will follow.
        // this targertMesh follows the mouse raycast position to the floor.
        this.targetMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 6, 6), 
            new THREE.MeshBasicMaterial({color: 0xFFEA00})
        );
        this.targetMesh.matrixAutoUpdate = false;
        this.targetMesh.visible = true
        // this.scene.add(this.targetMesh);

        // Add target to entity
        this.target = new YUKA.GameEntity();
        this.target.setRenderComponent(this.targetMesh, this.sync);
        this.entityManager.add(this.target);

    }

    


    resize(){

    }

    update(){

        const speed = this.time.delta * 0.003
        this.entityManager.update(speed);

    }
    
}