import * as THREE from "three";
import Experience from "../Experience.js";

import Env from "./Env.js";

export default class World{
    constructor(){
        
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;

        this.set_lighting();

        this.resources.addEventListener("ready", () =>{
            this.env = new Env();
            console.log("created 3D World")
        })

    }

    set_lighting(){

        this.light_01 = new THREE.PointLight("white", 25);
        this.light_01.castShadow = true;
        this.light_01.shadow.camera.far = 20;
        this.light_01.shadow.mapSize.set(1024, 1024);
        this.light_01.shadow.normalBias = 0.05;
        this.light_01.position.set(0, 2, 0);
        this.scene.add(this.light_01);

        this.light_02 = new THREE.DirectionalLight("white", 0.2);
        this.light_02.castShadow = true;
        this.light_02.shadow.camera.far = 20;
        this.light_02.shadow.mapSize.set(1024, 1024);
        this.light_02.shadow.normalBias = 0.05;
        this.light_02.position.set(2, 5, 5);
        this.scene.add(this.light_02);
    }


    resize(){
    }

    update(){
    }

}