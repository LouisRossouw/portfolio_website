import * as THREE from "three";
import Experience from "./Experience.js";
import {OrbitControls} from "OrbitControls"

export default class Camera{
    constructor(){

        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.container = this.experience.container;



        this.createPerspectiveCamera();
        this.setOrbitControls();
        this.add_ornaments();
    }


    createPerspectiveCamera(){
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            10, 
            this.container.offsetWidth / this.container.offsetHeight, // = 1
            0.1, 
            1000
        );
        this.scene.add(this.perspectiveCamera)
        this.perspectiveCamera.position.z = 5;
        this.perspectiveCamera.position.y = 10;
        this.perspectiveCamera.position.x = 10;
        
    }


    setOrbitControls(){
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas)
        this.controls.enableDamping = true;
        this.controls.enableZoom = true;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.4;

    }

    resize(){
        // Updating perspective camera on resize.
        this.perspectiveCamera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.perspectiveCamera.updateProjectionMatrix();
    }

    update(){
        this.controls.update();
    }


    add_ornaments(){
        // Grid
        const size = 10;
        const divisions = 50;
        const gridHelper = new THREE.GridHelper( size, divisions );
        const material = new THREE.LineBasicMaterial({ color: "rgb(60, 60, 60)" });
        gridHelper.material = material
        this.scene.add( gridHelper );

        // Axes
        const axesHelper = new THREE.AxesHelper( 10 );
        //this.scene.add( axesHelper );
    }


}