import * as THREE from "three"
import * as YUKA from "yuka"
import Experience from "../Experience.js"


        


export default class Woman
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.settings = this.experience.settings
        this.time = this.experience.time
        this.resources = this.experience.resources
        this.textureLoader = this.experience.textureLoader
        this.world_speed = this.settings.world_speed[this.settings.world_speed_value] // Get speed settings

        // entity manager needed for ai
        this.steeringBehavior = this.experience.steeringBehavior
        this.entityManager = this.steeringBehavior.entityManager
        this.obsticle_list = this.steeringBehavior.obsticle_list

        // load woman geo
        this.woman = this.resources.items.woman
        this.woman_geo = this.woman.scene
        this.set_woman()

        // Animation
        this.current_animation_playing = null
        this.anim_woman_mixer = new THREE.AnimationMixer(this.woman_geo)

        // Run animation list.
        this.woman_run_anims = []
        this.woman_random_anims = []
        this.woman_point_anims = []
        this.woman_death_anims = []

        this.sort_animation_clips()

    }

    sort_animation_clips(){

        for(let i = 0; i < this.woman.animations.length; i++){

            const anim_clip = this.woman.animations[i]
            var type = anim_clip.name.split("_")[1] // anim type: death / run etc

            if(type === "run"){
                this.woman_run_anims.push(anim_clip)
            }
            else if(type == "death" ){
                this.woman_death_anims.push(anim_clip)
            }
            else if(type == "point"){
                this.woman_point_anims.push(anim_clip)
            }
            else if(type == "random"){
                this.woman_random_anims.push(anim_clip)
            }
        }

        this.death_animations_count = this.woman_death_anims.length
        this.woman_anim_clip = this.anim_woman_mixer.clipAction(this.woman_run_anims[1])
        this.woman_anim_clip.timeScale = 0.8
    
        this.woman_anim_clip.play();

    }


    reset(){
        // Reset animation.

        this.woman_anim_clip.reset()
        this.woman_entity.active = true
        this.woman_entity.position.set(0, 0, 0)

    }


    play_death_anim(){
        // Play death animation.
        
        // Stop Yuka behaviour movement and animations.
        this.woman_entity.active = false
        this.woman_anim_clip.stop()

        // Play death anim.
        const random_clip = Math.floor(Math.random() * this.woman_death_anims.length)
        const death_anim = this.woman_death_anims[random_clip]

        const deathAction = this.anim_woman_mixer.clipAction(death_anim, this.woman_geo)
        deathAction.setLoop(THREE.LoopOnce)
        deathAction.timeScale = 0.7
        deathAction.clampWhenFinished = true
        deathAction.play()

        // Delay before respawn.
        window.setTimeout(() =>{

            var respawn_position_x = (Math.random() - 0.5) * 5
            var respawn_position_z = (Math.random() - 0.5) * 5

            this.woman_entity.position.set(respawn_position_x, 0, respawn_position_z)

            // Re-activate Yuka behaviour movement
            deathAction.stop()
            deathAction.reset()
            this.woman_anim_clip.reset()
            this.woman_anim_clip.play()
            this.woman_entity.active = true

        }, 5000)

    }


    play_point_anim(){
        // Play celebrate when collecting a point.

        // Stop the current animation
        this.woman_anim_clip.stop();

        // Play the celebrate animation
        const random_clip = Math.floor(Math.random() * this.woman_point_anims.length)
        const point_anim = this.woman_point_anims[random_clip]

        const pointAction = this.anim_woman_mixer.clipAction(point_anim, this.woman_geo)
        pointAction.setLoop(THREE.LoopOnce)
        pointAction.timeScale = 0.8
        pointAction.clampWhenFinished = true

        pointAction.play()

        this.anim_woman_mixer.addEventListener("finished", (event) => {

            const clipName = event.action.getClip().name
            this.animation_on_completion(clipName, pointAction)

        });
        
    }


    animation_on_completion = (clipName, Action) => {

        var type = clipName.split("_")[1] // Run / point / death

        if(type === "death"){

            Action.stop()
            Action.reset()
        }

        else {

            Action.stop()
            Action.reset()
            
            this.woman_anim_clip.stop()
            this.woman_anim_clip = this.anim_woman_mixer.clipAction(this.woman_run_anims[1]) // set to run anim clip
            
            this.woman_anim_clip.reset()
            this.woman_anim_clip.play()

        }
    }


    play_random_run_anim(){
        // Play random run animation every 10 seconds.

        // Stop the current animation
        this.woman_anim_clip.stop();

        // Play the celebrate animation
        const random_clip = Math.floor(Math.random() * this.woman_random_anims.length);
        const random_anim = this.woman_random_anims[random_clip];

        const randomAction = this.anim_woman_mixer.clipAction(random_anim, this.woman_geo);
        randomAction.setLoop(THREE.LoopOnce);
        randomAction.timeScale = 0.7;
        randomAction.clampWhenFinished = true;
        this.current_animation_playing = "point";
        randomAction.play();

        this.anim_woman_mixer.addEventListener("finished", (event) => {

            const clipName = event.action.getClip().name
            this.animation_on_completion(clipName, randomAction)

        });

    }


    set_woman(){
        // Sets woman geo / yuka behaviour etc..

        // Woman Geo
        this.woman_geo.scale.set(10, 10, 10)
        this.woman_geo.position.set(-1, 0, 0)
        this.woman_geo.receiveShadow = false
        this.woman_geo.castShadow = false
        this.scene.add(this.woman_geo)

        this.woman_geo.traverse( (child) => {
            if ( child instanceof THREE.Mesh ) {
                child.geometry.computeBoundingSphere();
                this.lady_bbb = child.geometry.boundingSphere.radius
            }
        });

        // Fake Shadow
        const simpleShadow = this.textureLoader.load('/static/textures/simpleShadow.jpg')
        this.shadow_geo = new THREE.PlaneGeometry(0.07, 0.07)
        this.shadow_material = new THREE.MeshBasicMaterial({ 
            color: 'black', 
            alphaMap: simpleShadow, 
            transparent: true,
            blendEquation: THREE.AdditiveBlending,
            depthWrite: false,
        }),


        // Woman AI setup *****

        // Add Woman geo to yuka ai vehicle
        this.woman_geo.matrixAutoUpdate = false;
        this.woman_entity = new YUKA.Vehicle()
        this.woman_entity.setRenderComponent(this.woman_geo, this.steeringBehavior.sync);
        this.woman_entity.position.set(-6, 0, -2);
        this.woman_entity.scale.set(9, 9, 9)

        // Add Woman entity (vehicle) to the entityManager
        this.entityManager.add(this.woman_entity);
        this.woman_entity.maxSpeed = this.world_speed.woman_speed

        // Woman entity behaviour will seek the target position.
        this.seekBehavior = new YUKA.SeekBehavior(this.steeringBehavior.target.position);
        this.woman_entity.steering.add(this.seekBehavior);

        this.woman_entity.boundingRadius = 0.2
        this.obstacleAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior(this.obsticle_list)
        this.woman_entity.steering.add(this.obstacleAvoidanceBehavior)

        // Create an obstacle sphere with the same radius as the bounding radius
        const obs_woman_reference_geo = new THREE.SphereGeometry(this.woman_entity.boundingRadius, 8, 8);
        const obs_woman_reference_mat = new THREE.MeshBasicMaterial({ color: 'green', transparent: true, opacity: 0.5 });
        this.obs_woman_reference_mesh = new THREE.Mesh(obs_woman_reference_geo, obs_woman_reference_mat);

        // Add the obstacle sphere to the scene
        this.obs_woman_reference_mesh.visible = false
        this.scene.add(this.obs_woman_reference_mesh)

        this.obstacleAvoidanceBehavior.active = false

        this.obstacleAvoidanceBehavior.dBoxMinLength = 0.1
        // this.obstacleAvoidanceBehavior.brakingWeight = 0.05
        // this.obstacleAvoidanceBehavior.weight = 2

        this.woman_entity.smoother = new YUKA.Smoother(10)
        
        this.shadow_mesh = new THREE.Mesh(this.shadow_geo, this.shadow_material)

        this.shadow_mesh.rotation.x = - Math.PI / 2
        this.shadow_mesh.position.y = 0.001

        this.woman_geo.add(this.shadow_mesh)

    }


    resize(){

    }

    update(){

        if (this.anim_woman_mixer) {

            this.anim_woman_mixer.update(this.time.delta * this.world_speed.woman_anim_speed); // update animation mixer.

        }

        if(this.time.ten_elapsed === 0){

            this.play_random_run_anim()

        }

        // Position the obstacle sphere at the same position as the obstacle entity
        this.obs_woman_reference_mesh.position.copy(this.woman_entity.position);

    }

}