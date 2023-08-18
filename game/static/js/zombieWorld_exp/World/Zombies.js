import * as THREE from "three";
import * as YUKA from "yuka";
import Experience from "../Experience.js";
import * as skeletonUtils from 'skeletonUtils'


export default class Zombies extends THREE.EventDispatcher
{
    constructor()
    {
        super();

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.settings = this.experience.settings
        this.time = this.experience.time;
        this.resources = this.experience.resources;
        this.textureLoader = this.experience.textureLoader;
        this.world_speed = this.settings.world_speed[this.settings.world_speed_value] // Get speed settings
        this.world = this.experience.world

        // load zombie geo
        this.zombie = this.resources.items.zombie;
        this.zombie_mesh = this.zombie.scene;

        // entity manager needed for ai
        this.steeringBehavior = this.experience.steeringBehavior
        this.entityManager = this.steeringBehavior.entityManager
        this.obsticle_list = this.steeringBehavior.obsticle_list

        this.zombie_list = []
        this.animationActions = []; // Store the animation actions for each zombie

        this.zombies_grp = null

        this.set_zombies()
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
        this.set_zombies()
        this.world.updateAllMaterials()

        // Random zombies spawn position and re-activate them.
        for(let i = 0; i < this.zombie_list.length; i++){

            const zombie_type = this.zombie_list[i].name.split("_")[1]
            
            var respawn_position_x = ((Math.random() - 0.5) * 50) + distance
            var respawn_position_z = ((Math.random() - 0.5) * 50) + distance
    
            this.zombie_list[i].position.set(respawn_position_x, 0, respawn_position_z)

            if(is_active){
                this.zombie_list[i].active = true
                this.zombie_list_geo[i].visible = true
            } else {

                this.zombie_list[i].active = false
                this.zombie_list_geo[i].visible = false

                if(zombie_type === "crawler"){
                    this.zombie_list[i].active = true
                    this.zombie_list_geo[i].visible = true   
                }
            }
        }

        this.zombie_list[0].active = true
        this.zombie_list_geo[0].visible = true
        this.zombie_list[0].position.set(10, 0, 0)
    }

    
    set_zombies(){

        // Zombie Walkers ******

        // Edit zombies material
        this.zombie_mesh.traverse(function(geo){
            if(geo.isMesh){
                geo.castShadow = false
                geo.receiveShadow = false;
                geo.material.roughness = 1
                geo.material.metalness = 0.5
            }
        })

        // Change zombie materials (this is tmp)
        this.zombie_mesh.traverse((child) => {
            if (child instanceof THREE.Mesh){
                const newmaterial = new THREE.MeshStandardMaterial({
                    color: 'rgb(70, 100, 85)',
                    roughness: 1,
                    metalness: 0.2,
                    })
                child.material = newmaterial
            }
        })

        // Sort animation clips:
        this.zombie_walk_walking_animations = []
        this.zombie_walk_death_animations = []
        
        for(let i = 0; i < this.zombie.animations.length; i++){

            const anim_clip = this.zombie.animations[i]

            var type = anim_clip.name.split("_")[2] // anim type: death / walking etc

            if(type === "walking"){
                this.zombie_walk_walking_animations.push(anim_clip)
            }
            else if(type == "death" ){
                this.zombie_walk_death_animations.push(anim_clip)
            }
        }

        this.death_animations_count = this.zombie_walk_death_animations.length


        // Zombie animations
        this.zombies_grp = new THREE.AnimationObjectGroup()
        this.mixer = new THREE.AnimationMixer(this.zombies_grp)

        const zombieCount = this.zombie_walk_walking_animations.length;

        const zombie_count = this.world_speed.zombie_count
        this.spawn_distance = this.world_speed.zombie_spawn_distance
        const devide_by = 10

        const alignmentBehavior = new YUKA.AlignmentBehavior()
        alignmentBehavior.weight = 0.5 / devide_by

        const cohesionBehaviour = new YUKA.AlignmentBehavior()
        cohesionBehaviour.weight = 0.5 / devide_by

        const seperationBehaviour = new YUKA.SeparationBehavior()
        seperationBehaviour.weight = 0.001

        const z_bounding_box_mat = new THREE.MeshBasicMaterial({ color: 'green', transparent: true, opacity: 0.5 });

        this.zombie_list_geo = []
        this.zombie_bounding_box_list = []
        this.zombieKilled = new Array(this.zombie_bounding_box_list.length).fill(false);

        // Generate zombie clones.
        for(let i = 0; i < zombie_count; i++){

            this.zombie_geo = skeletonUtils.clone(this.zombie_mesh)
            this.scene.add(this.zombie_geo)
            this.zombies_grp.add(this.zombie_geo)

            // Calculate the index of the animation clip based on the current zombie index
            const clipIndex = i % zombieCount;
            const clip = this.zombie_walk_walking_animations[clipIndex];

            // Create a separate AnimationAction for each zombie
            const action = this.mixer.clipAction(clip, this.zombie_geo);

            // Set the starting time of the animation to introduce the offset
            action.time = Math.random() * 10;

            // Play the animation
            action.play();

            // Store the action in the array for later reference
            this.animationActions.push(action);
                        
            // Zombie AI
            this.zombie_geo.matrixAutoUpdate = false

            this.zombie_entity = new YUKA.Vehicle()
            this.zombie_entity.name = `zombie_walker_${i}`
            this.zombie_entity.scale.set(10, 10, 10)
            this.zombie_entity.setRenderComponent(this.zombie_geo, this.steeringBehavior.sync)

            this.zombie_entity.smoother = new YUKA.Smoother(10)

            // // Add zombie entity (vehicle) to the entityManager
            this.entityManager.add(this.zombie_entity)

            this.wanderBehavior = new YUKA.WanderBehavior()
            this.zombie_entity.steering.add(this.wanderBehavior);

            this.wanderBehavior.weight = Math.random() / devide_by

            this.zombie_entity.updateNeighborhood = true
            this.zombie_entity.updateNeighborhood = Math.random() / devide_by
            
            this.zombie_entity.steering.add(alignmentBehavior)
            this.zombie_entity.steering.add(cohesionBehaviour)
            this.zombie_entity.steering.add(seperationBehaviour)

            // Zombie speed - slightly random
            this.zombie_entity.maxSpeed =  Math.random() * (0.9 - 0.2) + 0.1 * this.world_speed.zombie_speed;

            this.zombie_entity.position.x = (Math.random() - 0.5) * this.spawn_distance
            this.zombie_entity.position.z = (Math.random() - 0.5) * this.spawn_distance


            this.zombie_entity.rotation.fromEuler(0, 2 * Math.PI * Math.random(), 0)

            this.seekBehavior = new YUKA.SeekBehavior(this.experience.world.woman.woman_entity.position);
            this.zombie_entity.steering.add(this.seekBehavior);

            // Obstacle Avoidance
            this.zombie_entity.boundingRadius = 0.1
            this.obstacleAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior(this.obsticle_list)
            this.zombie_entity.steering.add(this.obstacleAvoidanceBehavior)

            // Create an obstacle sphere with the same radius as the bounding radius
            const z_bounding_box_geo = new THREE.SphereGeometry(this.zombie_entity.boundingRadius, 6, 6);
            this.z_bounding_box = new THREE.Mesh(z_bounding_box_geo, z_bounding_box_mat);
            this.zombie_bounding_box_list.push(this.z_bounding_box)
            // this.scene.add(this.z_bounding_box);

            this.obstacleAvoidanceBehavior.active = true

            this.obstacleAvoidanceBehavior.brakingWeight = 0.05
            this.obstacleAvoidanceBehavior.dBoxMinLength = 0.1
            // this.obstacleAvoidanceBehavior.weight = 2
    
            // Fake SHADOW
            const simpleShadow = this.textureLoader.load('/static/textures/simpleShadow.jpg')
            this.shadow_geo = new THREE.PlaneGeometry(0.07, 0.07)
            this.shadow_material = new THREE.MeshBasicMaterial({ 
                color: 'black', 
                alphaMap: simpleShadow, 
                transparent: true,
                opacity: 0.6,
                blendEquation: THREE.AdditiveBlending,
                depthWrite: false,
            }),

            this.shadow_mesh = new THREE.Mesh(this.shadow_geo, this.shadow_material)

            this.shadow_mesh.rotation.x = - Math.PI / 2
            this.shadow_mesh.position.y = 0.001

            this.zombie_geo.add(this.shadow_mesh)

            this.zombie_list.push(this.zombie_entity)
            this.zombie_list_geo.push(this.zombie_geo)

        }





        // Zombie Crawlers ******

        // load zombie crawlers
        this.zombie_crawlers = this.resources.items.zombie_crawlers;
        this.zombie_crawlers_mesh = this.zombie_crawlers.scene;

        // Edit zombies material
        this.zombie_crawlers_mesh.traverse(function(geo){
            if(geo.isMesh){
                geo.castShadow = false
                geo.receiveShadow = false;
                geo.material.roughness = 1
                geo.material.metalness = 0.5
            }
        })

        // // Change zombie materials (this is tmp)
        this.zombie_crawlers_mesh.traverse((child) => {
            if (child instanceof THREE.Mesh){
                const newmaterial = new THREE.MeshStandardMaterial({
                    color: 'rgb(70, 100, 85)',
                    roughness: 1,
                    metalness: 0.2
                    })
                child.material = newmaterial
            }
        })

        const w_clips = this.zombie_crawlers.animations

        // Zombie crawl animations
        this.w_zombies_grp = new THREE.AnimationObjectGroup()
        this.mixer_crawl = new THREE.AnimationMixer(this.w_zombies_grp)

        const w_zombieCount = w_clips.length;

        const w_zombie_count = 10
        const w_spawn_distance = 50
        const w_devide_by = 100

        const crawlers_alignmentBehavior = new YUKA.AlignmentBehavior()
        crawlers_alignmentBehavior.weight = 0.5 / w_devide_by

        const crawlers_cohesionBehaviour = new YUKA.AlignmentBehavior()
        crawlers_cohesionBehaviour.weight = 0.5 / w_devide_by

        const crawlers_seperationBehaviour = new YUKA.SeparationBehavior()
        crawlers_seperationBehaviour.weight = 0.001


        // Generate zombie clones.
        for(let i = 0; i < w_zombie_count; i++){

            this.zombie_geo = skeletonUtils.clone(this.zombie_crawlers_mesh)
            this.scene.add(this.zombie_geo)
            this.w_zombies_grp.add(this.zombie_geo)

            // Calculate the index of the animation clip based on the current zombie index
            const clipIndex = i % w_zombieCount;
            const clip = w_clips[clipIndex];

            // Create a separate AnimationAction for each zombie
            const action = this.mixer_crawl.clipAction(clip, this.zombie_geo);

            // Set the starting time of the animation to introduce the offset
            action.time = Math.random() * 10

            // // Play the animation
            action.play();

            // Store the action in the array for later reference
            this.animationActions.push(action);
                        
            // Zombie AI
            this.zombie_geo.matrixAutoUpdate = false

            this.zombie_entity = new YUKA.Vehicle()
            this.zombie_entity.name = `zombie_crawler_${i}`
            this.zombie_entity.scale.set(10, 10, 10)
            this.zombie_entity.setRenderComponent(this.zombie_geo, this.steeringBehavior.sync)

            this.zombie_entity.smoother = new YUKA.Smoother(10)

            // // Add zombie entity (vehicle) to the entityManager
            this.entityManager.add(this.zombie_entity)

            this.wanderBehavior = new YUKA.WanderBehavior()
            this.zombie_entity.steering.add(this.wanderBehavior);

            this.wanderBehavior.weight = Math.random() / w_devide_by

            this.zombie_entity.updateNeighborhood = true
            this.zombie_entity.updateNeighborhood = Math.random() / w_devide_by
            
            this.zombie_entity.steering.add(crawlers_alignmentBehavior)
            this.zombie_entity.steering.add(crawlers_cohesionBehaviour)
            this.zombie_entity.steering.add(crawlers_seperationBehaviour)

            // Zombie speed - slightly random
            this.zombie_entity.maxSpeed =  0.2

            this.zombie_entity.position.x = (Math.random() - 0.5) * w_spawn_distance
            this.zombie_entity.position.z = (Math.random() - 0.5) * w_spawn_distance

            this.zombie_entity.rotation.fromEuler(0, 2 * Math.PI * Math.random(), 0)

            this.seekBehavior = new YUKA.SeekBehavior(this.experience.world.woman.woman_entity.position);
            this.zombie_entity.steering.add(this.seekBehavior);
    
            // Obstacle Avoidance
            this.zombie_entity.boundingRadius = 0.1
            this.obstacleAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior(this.obsticle_list)
            this.zombie_entity.steering.add(this.obstacleAvoidanceBehavior)

            this.obstacleAvoidanceBehavior.active = false

            this.obstacleAvoidanceBehavior.brakingWeight = 0.05
            this.obstacleAvoidanceBehavior.dBoxMinLength = 0.1
            // this.obstacleAvoidanceBehavior.weight = 2

            // Create an obstacle sphere with the same radius as the bounding radius
            const z_bounding_box_geo = new THREE.SphereGeometry(this.zombie_entity.boundingRadius, 6, 6);
            this.z_bounding_box = new THREE.Mesh(z_bounding_box_geo, z_bounding_box_mat);
            this.zombie_bounding_box_list.push(this.z_bounding_box)
            // this.scene.add(this.z_bounding_box);

            // Fake SHADOW
            const simpleShadow = this.textureLoader.load('/static/textures/simpleShadow.jpg')
            this.shadow_geo = new THREE.PlaneGeometry(0.07, 0.07)
            this.shadow_material = new THREE.MeshBasicMaterial({ 
                color: 'black', 
                alphaMap: simpleShadow, 
                transparent: true,
                opacity: 0.6,
                blendEquation: THREE.AdditiveBlending,
                depthWrite: false,
            }),

            this.shadow_mesh = new THREE.Mesh(this.shadow_geo, this.shadow_material)

            this.shadow_mesh.rotation.x = - Math.PI / 2
            this.shadow_mesh.position.y = 0.001

            this.zombie_geo.add(this.shadow_mesh)

            this.zombie_list.push(this.zombie_entity)
            this.zombie_list_geo.push(this.zombie_geo)

        }
    }


    resize(){

    }

    update(){

        if (this.mixer) {
            this.mixer.update(this.time.delta * this.world_speed.zombie_anim_speed); // update animation mixer.
        }
        if (this.mixer_crawl) {
            this.mixer_crawl.update(this.time.delta * 0.002); // update animation mixer.
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

                    // console.log('Killed!')
                    this.zombieKilled[i] = true; // Mark the zombie as killed
                    this.dispatchEvent({ type: 'zombie_killed' }); // Dispatch

                    const kill_zombie = () => {

                        // Stop Yuka behaviour movement.
                        zombie.active = false

                        // Stop animation.
                        const action = this.animationActions[i]
                        action.stop()

                        // Play death anim.
                        const random_clip = i % this.death_animations_count
                        const death_anim = this.zombie_walk_death_animations[random_clip];
                        
                        const deathAction = this.mixer.clipAction(death_anim, zombie_geo);
                        deathAction.setLoop(THREE.LoopOnce);
                        deathAction.timeScale = 0.7;
                        deathAction.clampWhenFinished = true;
                        deathAction.play();

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
                };

                kill_zombie()
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