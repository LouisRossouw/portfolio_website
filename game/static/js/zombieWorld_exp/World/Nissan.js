import * as THREE from "three";
import * as YUKA from "yuka";
import Experience from "../Experience.js";




export default class Nissan{
    constructor(){

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.settings = this.experience.settings
        this.time = this.experience.time;
        this.resources = this.experience.resources;
        this.world_speed = this.settings.world_speed[this.settings.world_speed_value]
        this.textureLoader = this.experience.textureLoader;

        this.zombies = this.experience.world.zombies;

        // entity manager needed for ai
        this.steeringBehavior = this.experience.steeringBehavior
        this.entityManager = this.steeringBehavior.entityManager
        this.obsticle_list = this.steeringBehavior.obsticle_list

        // CAST A RAY for selection
        this.raycaster = this.experience.camera.raycaster
        this.cursor = this.experience.camera.cursor
        this.camera = this.experience.camera
        this.currentIntersect = null

        // load nissan geo
        this.nissan = this.resources.items.nissan;
        this.nissan_geo = this.nissan.scene;

        this.nissan_light_active = false

        this.bonnet_bone = null
        this.body_bone = null

        this.assign_bones(); // asign bones to variables.
        this.create_nissan_geo();
        this.create_nissan_bounding();
        this.create_nissan_lights();
        this.play_animation(); //play the next anim clip that is random.

        // Listen for if the car has hit a zombie! then perform an action
        this.zombies.addEventListener('zombie_killed', () => {
            this.car_light_front.intensity = 7
            window.setTimeout(() =>{
                this.car_light_front.intensity = 15
            }, 100)
        });

    }


    reset_animation(){

        this.nissan_anim_clip.reset()

    }


    play_animation(){

        this.anim_nissan_mixer = new THREE.AnimationMixer(this.nissan_geo);

        //anim clip 01
        this.nissan_anim_clip = this.anim_nissan_mixer.clipAction(this.nissan.animations[0]);
        // this.nissan_anim_clip.loop = THREE.LoopOnce;
        this.nissan_anim_clip.play();

    }

    create_nissan_bounding(){

        this.obsticale = new YUKA.GameEntity()
        this.obsticale.boundingRadius = 2

        // Create an obstacle sphere with the same radius as the bounding radius
        const obstacleSphereGeometry = new THREE.SphereGeometry(this.obsticale.boundingRadius, 8, 8);
        const obstacleSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.1 });
        this.obstacleSphereMesh = new THREE.Mesh(obstacleSphereGeometry, obstacleSphereMaterial);

        // Position the obstacle sphere at the same position as the obstacle entity
        this.obstacleSphereMesh.position.copy(this.obsticale.position);
        this.obstacleSphereMesh.visible = false

        // Add the obstacle sphere to the scene
        this.scene.add(this.obstacleSphereMesh)
        
        this.entityManager.add(this.obsticale)
        this.obsticle_list.push(this.obsticale)

        const collision_box_geo = new THREE.SphereGeometry(0.75, 8, 8)
        const collision_box_mat = new THREE.MeshBasicMaterial({ color: 'blue', transparent: true, opacity: 0.5 })
        this.collision_box = new THREE.Mesh(collision_box_geo, collision_box_mat)
        this.collision_box.visible = false
        this.scene.add(this.collision_box)

    }

    
    create_nissan_geo(){
    
        // set nissan geo
        this.nissan_geo.scale.set(10,10,10)
        this.nissan_geo.position.set(0,0,0)
        this.nissan_geo.receiveShadow = false;
        this.nissan_geo.castShadow = false;
        this.nissan_geo.rotation.y = 4
        this.scene.add(this.nissan_geo);

        this.nissan_geo.traverse(function(geo){
            if(geo.isMesh){
                geo.castShadow = false
                geo.receiveShadow = false;
                geo.frustumCulled = false; // So the geo doesnt dissapear when out of viewport

                if(geo.name === "charZombie_geo"){
                    const newmaterial = new THREE.MeshStandardMaterial({
                        color: 'rgb(70, 100, 85)',
                        roughness: 1,
                        metalness: 0.2,
                        })
                    geo.material = newmaterial
                }
            }
        })

        const simpleShadow = this.textureLoader.load('/static/textures/simpleShadow.jpg')

        this.shadow_geo = new THREE.PlaneGeometry(0.2, 0.25)
        this.shadow_material = new THREE.MeshBasicMaterial({ 
            color: 'black', 
            alphaMap: simpleShadow, 
            transparent: true,
            blendEquation: THREE.AdditiveBlending,
            depthWrite: false,
        }),

        this.shadow_mesh = new THREE.Mesh(this.shadow_geo, this.shadow_material)
        this.shadow_mesh.position.set(0, -0.035, -0.08)
        this.shadow_mesh.rotation.x = - Math.PI / 2

    }


    assign_bones(){

        // asign bones to variables so that the update() can monitor the bones in 
        // realtime and perform actions based on what the bones are doing. 
        
        // Get headlight bone to contrain lights to the car.
        this.nissan_geo.traverse( (object) => {
        if (object.isBone && object.name === "vehheadlights") {
            this.headlight_bone = object;
            return; // Stop traversing further
          }
        });

        // Get the world position of the nissan_geo
        this.nissanWorldPosition = new THREE.Vector3();

        // Get bones that will be used to determine if certain car features are activated.
        this.nissan_geo.traverse( (object) => {
            if (object.isBone && object.name === "vehheadlights_active") {
              this.headlight_active_jnt = object;
              return; // Stop traversing further
            }
          });

        this.nissan_geo.traverse( (object) => {
            if (object.isBone && object.name === "vehbreaklights_active") {
            this.breaklights_active_jnt = object;
            return; // Stop traversing further
            }
        });

        this.nissan_geo.traverse( (object) => {
            if (object.isBone && object.name === "vehreverselights_jnt") {
                this.reverselight_active_jnt = object;
                return; // Stop traversing further
            }
        });

        this.nissan_geo.traverse( (object) => {
            if (object.isBone && object.name === "vehbonnet_jnt") {
                this.bonnet_bone = object;
                return; // Stop traversing further
              }
        });

        this.nissan_geo.traverse( (object) => {
            if (object.isBone && object.name === "vehbody_jnt1") {
                this.body_bone = object;
                return; // Stop traversing further
              }
        });
    }


    create_nissan_lights(){

        // Front Car lights.
        this.car_light_front = new THREE.SpotLight("rgb(255, 238, 160)", 15)

        this.car_light_front.castShadow = false
        this.car_light_front.position.set(0, 0, 0)

        this.car_light_front.target.position.set(0, 0, 2)
        this.car_light_front.angle = Math.PI / 2
        this.car_light_front.penumbra = 1 
        this.car_light_front.target.updateMatrixWorld()

        // Back Car lights.
        this.car_light_back = new THREE.SpotLight("red", 1)
        
        this.car_light_back.castShadow = false
        this.car_light_back.position.set(0, 0.04, -0.15)

        this.car_light_back.target.position.set(0, 0, -2)
        this.car_light_back.angle = Math.PI / 2
        this.car_light_back.penumbra = 0.5 
        this.car_light_back.target.updateMatrixWorld()

        // parent lights to selected bone.
        this.headlight_bone.add(this.car_light_front);
        this.headlight_bone.add(this.car_light_front.target);

        this.headlight_bone.add(this.car_light_back);
        this.headlight_bone.add(this.car_light_back.target);

        this.headlight_bone.add(this.shadow_mesh)

    }


    resize(){
        
    }

    update(){


        if (this.anim_nissan_mixer) {
            this.anim_nissan_mixer.update(this.time.delta * this.world_speed.world_speed); // update animation mixer.

        }

        // Check if car lights are on or off based on bones position, if below -0 then disable the light.
        // This gives me control in Maya to toggle the light (in runtime) on and off.
        if (this.headlight_active_jnt.rotation.x === 0){
            if (this.nissan_light_active === false){
                this.nissan_light_active = true
                this.car_light_front.intensity = 15
                this.car_light_back.intensity = 1
            }
        } else {
            if (this.nissan_light_active === true) {
                this.nissan_light_active = false
                this.car_light_front.intensity = 0
                this.car_light_back.intensity = 0
            }
        }

        // Activate break lights.
        if (this.breaklights_active_jnt.rotation.x === 0){
                this.car_light_back.intensity = 5;
        } else {
            this.car_light_back.intensity = 1;
        }

        // For collision and world position.
        this.breaklights_active_jnt.getWorldPosition(this.nissanWorldPosition);
        this.obsticale.position.copy(this.nissanWorldPosition)
        this.obstacleSphereMesh.position.copy(this.nissanWorldPosition);
        this.collision_box.position.copy(this.nissanWorldPosition);


    }


}