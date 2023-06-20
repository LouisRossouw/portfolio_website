import * as THREE from "three";
import Experience from "./Experience.js";


export default class Renderer{
    constructor(){
        
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.container = this.experience.container;
        this.camera = this.experience.camera;

        this.setRenderer();
    }

    setRenderer(){
        this.renderer = new THREE.WebGL1Renderer({
            canvas: this.canvas,
            antialias: true,
        });

        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace; // .outputEncoding is depreciated.
        this.renderer.toneMapping = THREE.CineonToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // this.renderer.setSize(this.sizes.width, this.sizes.height);
        // this.renderer.setPixelRatio(this.sizes.setPixelRatio); 

        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

    }


    resize(){
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        // this.renderer.setPixelRatio(this.sizes.setPixelRatio);
    }

    update(){
        this.renderer.render(this.scene, this.camera.perspectiveCamera);
    }


}