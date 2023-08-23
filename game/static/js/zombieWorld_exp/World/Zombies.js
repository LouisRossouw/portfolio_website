import * as THREE from "three"
import * as YUKA from "yuka"
import Experience from "../Experience.js"
import * as skeletonUtils from 'skeletonUtils'

import * as zombie_utils from "../Utils/Zombie_utils.js"


export default class Zombies extends THREE.EventDispatcher
{
    constructor()
    {
        super();

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.settings = this.experience.settings
        this.time = this.experience.time
        this.resources = this.experience.resources
        this.textureLoader = this.experience.textureLoader
        this.world_speed = this.settings.world_speed[this.settings.world_speed_value] // Get speed settings
        this.world = this.experience.world
        this.woman_entity = this.experience.world.woman.woman_entity

        // entity manager needed for ai
        this.steeringBehavior = this.experience.steeringBehavior
        this.entityManager = this.steeringBehavior.entityManager
        this.obsticle_list = this.steeringBehavior.obsticle_list

        // load zombie walkers files
        this.zombie = this.resources.items.zombie
        this.zombie_mesh = this.zombie.scene

        // load zombie crawlers files
        this.zombie_crawlers = this.resources.items.zombie_crawlers
        this.zombie_crawlers_mesh = this.zombie_crawlers.scene

        this.zombie_list = []
        this.animationActions = [] // Store the animation actions for each zombie

        this.zombies_grp = null

        this.create_zombies()
    }


    reset_zombies(is_active, distance){

        console.log("resetting zombies")

        for(let i = 0; i < this.zombie_list.length; i++){

            // Remove zombies and children from scene.
            this.zombie_list_geo[i].children = []
            this.scene.remove(this.zombie_list_geo[i])
            this.scene.remove(this.zombie_bounding_box_list[i])
            this.entityManager.remove(this.zombie_list[i])

        }
        
        // Reset all the zombies.
        this.zombie_walk_walking_animations = []
        this.zombie_walk_death_animations = []
        this.mixer = null
        this.zombie_list = []
        this.zombies_grp = null
        this.animationActions = []

        // Add fresh zombies.
        this.create_zombies()
        this.world.updateAllMaterials()

        // Random zombies spawn position and re-activate them.
        zombie_utils.reset_respawn_zombies(this.zombie_list, this.zombie_list_geo, is_active, distance)

        this.zombie_list[0].active = true
        this.zombie_list_geo[0].visible = true
        this.zombie_list[0].position.set(10, 0, 0)

    }


    create_zombies(){

        // General Setup.

        this.zombie_list_geo = []
        this.zombie_bounding_box_list = []
        this.zombieKilled = new Array(this.zombie_bounding_box_list.length).fill(false)

        const z_bounding_box_mat = new THREE.MeshBasicMaterial({ 
            color: 'green', 
            transparent: true, 
            opacity: 0.5 
        })

        // Create a zombie shadow using a plane geo and texture with alpha.
        const textureLoader = new THREE.TextureLoader();
        const simpleShadow = textureLoader.load('/static/textures/simpleShadow.jpg');
        const shadow_geo = new THREE.PlaneGeometry(0.07, 0.07);
        const shadow_material = new THREE.MeshBasicMaterial({ 
            color: 'black', 
            alphaMap: simpleShadow, 
            transparent: true,
            opacity: 0.6,
            blendEquation: THREE.AdditiveBlending,
            depthWrite: false,
        });

        // Mesh and Material setup for zombies.
        zombie_utils.set_zombie_mesh(this.zombie_mesh)
        
        // Sort zombie walk and death animation clips into seperate arrays.
        this.zombie_animation_clips = zombie_utils.sort_animation_clips(this.zombie.animations)
        
        // ************
        //
        //
        // 01 *** Zombie Walkers ******

        // Animation Mixer and zombie object groups.
        this.zombies_grp = new THREE.AnimationObjectGroup()
        this.mixer = new THREE.AnimationMixer(this.zombies_grp)

        const zombie_count = this.world_speed.zombie_count
        const spawn_distance = this.world_speed.zombie_spawn_distance

        // Set settings for general yuka behaviour, returns a dict to apply to each zombie in set_yuka_entity_behaviour().
        const yuka_behaviors_settings = zombie_utils.set_yuka_walker_behaviour(zombie_count, spawn_distance)

        // Generate zombie clones.
        for(let i = 0; i < zombie_count; i++){

            this.zombie_geo = skeletonUtils.clone(this.zombie_mesh)
            this.zombie_geo.matrixAutoUpdate = false

            // Set Animation clip to a zombie.
            const action = zombie_utils.set_zombie_animation(
                i, 
                this.mixer, 
                this.zombie_animation_clips.walkingAnimations, 
                this.zombie_geo
            )

            // ****** Zombie Yuka behaviour **********

            // Set Yuka behaviour to a zombie.
            this.zombie_entity = zombie_utils.set_yuka_entity_behaviour(
                i, 
                yuka_behaviors_settings, 
                this.woman_entity, 
                this.obsticle_list,
                true,
                "walker"
            )

            // Add zombie entity (vehicle) to the entityManager and rendercomponent
            this.entityManager.add(this.zombie_entity)
            this.zombie_entity.setRenderComponent(this.zombie_geo, this.steeringBehavior.sync)

            // Create an obstacle sphere with the same radius as the bounding radius
            this.z_bounding_box = zombie_utils.set_bounding_box(this.zombie_entity, z_bounding_box_mat)

            // Set Zombie speed - slightly random
            zombie_utils.set_zombie_attributes(
                this.zombie_entity, 
                this.world_speed.zombie_speed, 
                spawn_distance
            )

            // Add shadow - Clone / instance.
            const shadow_mesh = zombie_utils.instance_zombie_shadow(shadow_geo, shadow_material)

            // Add to:
            this.scene.add(this.zombie_geo)
            // this.scene.add(this.z_bounding_box)
            this.zombie_geo.add(shadow_mesh)
            this.zombies_grp.add(this.zombie_geo)
            this.animationActions.push(action)
            this.zombie_list.push(this.zombie_entity)
            this.zombie_list_geo.push(this.zombie_geo)
            this.zombie_bounding_box_list.push(this.z_bounding_box)

        }

        // ************
        //
        //
        // 02 *** Zombie Crawlers ******
        
        // Mesh and Material setup for crawler zombies.
        zombie_utils.set_zombie_mesh(this.zombie_crawlers_mesh)

        // Zombie crawl animations
        this.w_zombies_grp = new THREE.AnimationObjectGroup()
        this.mixer_crawl = new THREE.AnimationMixer(this.w_zombies_grp)

        const w_zombie_count = 10
        const w_spawn_distance = 50

        // Set settings for general yuka behaviour, returns a dict to apply to each zombie in set_yuka_entity_behaviour().
        const yuka_behaviors_settings_crawlers = zombie_utils.set_yuka_crawler_behaviour(w_zombie_count, w_spawn_distance)

        // Generate zombie clones.
        for(let i = 0; i < w_zombie_count; i++){

            this.zombie_geo = skeletonUtils.clone(this.zombie_crawlers_mesh)
            this.zombie_geo.matrixAutoUpdate = false

            // Animation.
            const action = zombie_utils.set_zombie_animation(
                i, 
                this.mixer_crawl, 
                this.zombie_crawlers.animations, 
                this.zombie_geo
            )
                        
            // ****** Zombie AI **********

            // Yuka behaviour setup.
            this.zombie_entity = zombie_utils.set_yuka_entity_behaviour(
                i, 
                yuka_behaviors_settings_crawlers, 
                this.woman_entity, 
                this.obsticle_list,
                false,
                "crawler"
            )

            // Add zombie entity (vehicle) to the entityManager and rendercomponent
            this.entityManager.add(this.zombie_entity)
            this.zombie_entity.setRenderComponent(this.zombie_geo, this.steeringBehavior.sync)

            // Create an obstacle sphere with the same radius as the bounding radius
            this.z_bounding_box = zombie_utils.set_bounding_box(this.zombie_entity, z_bounding_box_mat)

            // Set Zombie speed - slightly random
            zombie_utils.set_zombie_attributes(
                this.zombie_entity, 
                this.world_speed.zombie_speed, 
                w_spawn_distance
            )

            // Overide to slower.
            this.zombie_entity.maxSpeed =  0.2

            // Add shadow - Clone / instance.
            const shadow_mesh = zombie_utils.instance_zombie_shadow(shadow_geo, shadow_material)

            // Add to:
            this.zombie_geo.add(shadow_mesh)
            // this.scene.add(this.z_bounding_box)
            this.zombie_bounding_box_list.push(this.z_bounding_box)
            this.scene.add(this.zombie_geo)
            this.w_zombies_grp.add(this.zombie_geo)
            this.zombie_list.push(this.zombie_entity)
            this.zombie_list_geo.push(this.zombie_geo)
            this.animationActions.push(action)

        }
    }


    kill_zombie(i, zombie, zombie_geo){
        // Kills a zombie when hit by the vehicle entity.

        // Stop Yuka behaviour movement.
        zombie.active = false

        // Stop animation.
        const action = this.animationActions[i]
        action.stop()

        // Play death anim.
        const random_clip = i % this.zombie_animation_clips.deathAnimations.length
        const death_anim = this.zombie_animation_clips.deathAnimations[random_clip]
        
        const deathAction = this.mixer.clipAction(death_anim, zombie_geo)
        deathAction.setLoop(THREE.LoopOnce)
        deathAction.timeScale = 0.7
        deathAction.clampWhenFinished = true
        deathAction.play()

        // Delay before zombie respawn.
        window.setTimeout(() =>{

            var min_value = 50
            var max_value = 100
            var respawn_position_x = min_value + (Math.random() - 0.5) * (max_value - min_value)
            var respawn_position_z = min_value + (Math.random() - 0.5) * (max_value - min_value)

            this.zombie_list[i].position.set(respawn_position_x, 0, respawn_position_z)

            // Re-activate Yuka behaviour movement
            deathAction.stop()
            deathAction.reset()
            this.animationActions[i].play()
            zombie.active = true

            this.zombieKilled[i] = false

        }, 2000)


    }


    resize(){

    }

    update(){

        if (this.mixer) {
            this.mixer.update(this.time.delta * this.world_speed.zombie_anim_speed) // Zombie Walker mixer
        }
        if (this.mixer_crawl) {
            this.mixer_crawl.update(this.time.delta * 0.002) // Zombie Crawler mixer
        }


        const nissan_collisionBox = this.experience.world.nissan.collision_box
        this.z_bounding_box.position.copy(this.zombie_list[0].position);

        // Iterate over each zombie, calc distance to car and woman.
        for (let i = 0; i < this.zombie_bounding_box_list.length; i++) {
   
            const zombie = this.zombie_list[i]
            const zombie_geo = this.zombie_list_geo[i]
            const boundingBox = this.zombie_bounding_box_list[i]

            boundingBox.position.copy(zombie.position)
    
            // Calculate the distance between bounding spheres' centers
            const distance = boundingBox.position.distanceTo(nissan_collisionBox.position);
    
            // If the bounding spheres are intersecting, meaning the zombie is touching the obstacle - handle collision behavior here
            if (distance < boundingBox.geometry.parameters.radius + nissan_collisionBox.geometry.parameters.radius) {

                if(this.zombieKilled[i] !== true){

                    // Mark the zombie as killed
                    this.zombieKilled[i] = true 
                    this.dispatchEvent({ type: 'zombie_killed' })
                    this.kill_zombie(i, zombie, zombie_geo)
                }
            }

            const woman_boundingBox = this.experience.world.woman.obs_woman_reference_mesh
                
            // Distance between each zombie and woman.
            const distance_to_woman = boundingBox.position.distanceTo(woman_boundingBox.position)

            if (distance_to_woman < boundingBox.geometry.parameters.radius + woman_boundingBox.geometry.parameters.radius) {
                this.dispatchEvent({ type: 'woman_died' });
            }
        }
    }

}