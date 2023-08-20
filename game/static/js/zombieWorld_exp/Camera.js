import * as THREE from "three";
import Experience from "./Experience.js";
import {OrbitControls} from "OrbitControls"


export default class Camera{
    
    constructor(){

        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.time = this.experience.time;
        this.scene = this.experience.scene;
        this.settings = this.experience.settings
        this.canvas = this.experience.canvas;
        this.container = this.experience.container;
        this.steeringBehavior = this.experience.steeringBehavior
        this.world_speed = this.settings.world_speed[this.settings.world_speed_value] // Get speed settings

        this.mouse_last_moved = null
        this.auto_play = true
        this.auto_play_updated = false

        /** Cursor */
        this.cursor = {}
        this.cursor.x = 0
        this.cursor.y = 0

        /** Raycaster */
        this.raycaster = new THREE.Raycaster()
        
        this.createPerspectiveCamera()
        this.setOrbitControls()
        this.set_mouseMove()

        this.play_ui = document.getElementById("ZL_play_ui")

        // Listen for the 'everyFiveSeconds' event
        this.time.addEventListener('everyFiveSeconds', () => {

            this.auto_play_updated = false
            this.mouse_moving = false

            if(this.auto_play){
                this.play_ui.style.display = "none"

                if(this.auto_play_updated === false){

                    const x = (Math.random() - 0.5) * 25;
                    const y = Math.random() * 0;
                    const z = (Math.random() - 0.5) * 25;
            
                    this.steeringBehavior.target.position.set(x, y, z);
                    this.auto_play_updated = true
                }
            }

        });

    }



    set_mouseMove(){

        window.addEventListener('mousemove', (event) =>{

            this.mouse_last_moved = Date.now();
            this.auto_play = false
            this.auto_play_updated = true

            this.play_ui.style.display = "block"

            this.cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.cursor.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.cursor, this.perspectiveCamera);

            // Raycast / check intersects floor.
            const intersects = this.raycaster.intersectObject(this.experience.world.floorMesh);

            if (intersects.length > 0) {
                const intersectionPoint = intersects[0].point;

                const ball_x = intersectionPoint.x
                const ball_y = 0
                const ball_z = intersectionPoint.z
                
                // Target follows user mouse - entity(woman) follows target.
                this.steeringBehavior.target.position.copy({x: ball_x, y: ball_y, z: ball_z});
              }
        })
    }


    createPerspectiveCamera(){

        this.camera_group = new THREE.Group()
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            18, 
            this.container.offsetWidth / this.container.offsetHeight, // = 1
            10, 
            200
        );

        this.perspectiveCamera.position.z = 45;
        this.perspectiveCamera.position.y = 45;
        this.perspectiveCamera.position.x = 45;
     
        this.camera_group.add(this.perspectiveCamera)
        this.scene.add(this.camera_group)
        this.camera_group.rotation.set(0, 0.7, 0)

    }


    setOrbitControls(){

        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas)
        this.controls.enabled = false;
        this.controls.enableDamping = false;
        this.controls.enableZoom = false;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = this.world_speed.cam_speed;
        this.controls.enablePan = false;

    }


    resize(){

        // Updating perspective camera on resize.
        this.perspectiveCamera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.perspectiveCamera.updateProjectionMatrix();

    }


    update(){

        this.controls.update();

        // Mouse paralax
        const parallax_x = this.cursor.x
        const parallax_y = - this.cursor.y
        this.camera_group.position.x += (parallax_x - this.camera_group.position.x) * 0.5 * 0.1
        this.camera_group.position.y += (parallax_y - this.camera_group.position.y) * 0.5 * 0.2

        if(this.experience.game_active === false){

            const currentTime = Date.now();
            const elapsy = currentTime - this.mouse_last_moved

            if(elapsy >= 5000 ){
                // Set autoplay to True
                this.auto_play = true

                console.log("autoplaying")

                this.elapsy = 0;
                this.mouse_last_moved = currentTime
            }
        }

    }
}