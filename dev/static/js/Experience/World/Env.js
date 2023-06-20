import * as THREE from "three";
import Experience from "../Experience.js";



export default class Env{
    constructor(){

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.floor = this.resources.items.floor;
        this.actual_floor = this.floor.scene;

        this.setModel();
    }

    setModel(){
        this.actual_floor.scale.set(0.1,0.1,0.1)
        this.actual_floor.receiveShadow = true;
        this.actual_floor.castShadow = true;
        this.scene.add(this.actual_floor);

        this.actual_floor.traverse(function(geo){
            if(geo.isMesh){
                geo.castShadow = true
                geo.receiveShadow = true;
            }
        })


    }



    resize(){
    }

    update(){
    }


}