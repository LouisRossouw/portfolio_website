import * as THREE from "three";
import * as YUKA from "yuka";



export function set_zombie_mesh(zombie_mesh){
    // Mesh and Material setup for zombies.

    // Edit zombies material.
    zombie_mesh.traverse(function(geo){
        if(geo.isMesh){
            geo.castShadow = false
            geo.receiveShadow = false;
            geo.material.roughness = 1
            geo.material.metalness = 0.5
        }
    })

    // Change zombie materials.
    zombie_mesh.traverse((child) => {
        if (child instanceof THREE.Mesh){
            const newmaterial = new THREE.MeshStandardMaterial({
                color: 'rgb(70, 100, 85)',
                roughness: 1,
                metalness: 0.2,
                })
            child.material = newmaterial
        }
    })

}


export function reset_respawn_zombies(zombie_list, zombie_list_geo, is_active, distance){
    
    for(let i = 0; i < zombie_list.length; i++){

        const zombie_type = zombie_list[i].name.split("_")[1]
        
        var respawn_position_x = ((Math.random() - 0.5) * 50) + distance
        var respawn_position_z = ((Math.random() - 0.5) * 50) + distance

        zombie_list[i].position.set(respawn_position_x, 0, respawn_position_z)

        if(is_active){
            zombie_list[i].active = true
            zombie_list_geo[i].visible = true
        } else {

            zombie_list[i].active = false
            zombie_list_geo[i].visible = false

            if(zombie_type === "crawler"){
                zombie_list[i].active = true
                zombie_list_geo[i].visible = true   
            }
        }
    }

}


export function set_zombie_attributes(zombie_entity, zombie_speed, spawn_distance){
    // Random position and rotate zombie, set its speed, slightly random speed.

    zombie_entity.maxSpeed =  Math.random() * (0.9 - 0.2) + 0.1 * zombie_speed;

    zombie_entity.position.x = (Math.random() - 0.5) * spawn_distance
    zombie_entity.position.z = (Math.random() - 0.5) * spawn_distance

    zombie_entity.rotation.fromEuler(0, 2 * Math.PI * Math.random(), 0)

}


export function instance_zombie_shadow(shadow_geo, shadow_material){
    // Create an intance of a plane and a shadow material.

    const clonedGeo = shadow_geo.clone();
    const clonedMat = shadow_material.clone();
    
    const shadow_mesh = new THREE.Mesh(clonedGeo, clonedMat);

    shadow_mesh.rotation.x = -Math.PI / 2;
    shadow_mesh.position.y = 0.001;

    return shadow_mesh

}


export function set_yuka_entity_behaviour(i, yuka_behaviors_settings, woman_entity, obsticle_list, obstacle_active, type){
    // Set Yuka behaviour to the infividual zombie.

    const zombie_entity = new YUKA.Vehicle()
    zombie_entity.name = `zombie_${type}_${i}`
    zombie_entity.scale.set(10, 10, 10)

    zombie_entity.smoother = new YUKA.Smoother(10)

    const wanderBehavior = new YUKA.WanderBehavior()
    zombie_entity.steering.add(wanderBehavior)

    wanderBehavior.weight = Math.random() / yuka_behaviors_settings.devide_by

    zombie_entity.updateNeighborhood = true
    zombie_entity.updateNeighborhood = Math.random() / yuka_behaviors_settings.devide_by
    
    zombie_entity.steering.add(yuka_behaviors_settings.alignmentBehavior)
    zombie_entity.steering.add(yuka_behaviors_settings.cohesionBehaviour)
    zombie_entity.steering.add(yuka_behaviors_settings.seperationBehaviour)

    const seekBehavior = new YUKA.SeekBehavior(woman_entity.position)
    zombie_entity.steering.add(seekBehavior)

    // Obstacle Avoidance
    zombie_entity.boundingRadius = 0.1
    const obstacleAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior(obsticle_list)
    obstacleAvoidanceBehavior.active = obstacle_active
    obstacleAvoidanceBehavior.brakingWeight = 0.05
    obstacleAvoidanceBehavior.dBoxMinLength = 0.1
    // obstacleAvoidanceBehavior.weight = 2
    zombie_entity.steering.add(obstacleAvoidanceBehavior)

    return zombie_entity

}


export function set_zombie_animation(i, mixer, zombie_animation_clips, zombie_geo){
    // Set and play animation to the zombie entity.

    // Calculate the index of the animation clip based on the current zombie index
    const clipIndex = i % zombie_animation_clips.length
    const clip = zombie_animation_clips[clipIndex]

    // Create a separate AnimationAction for each zombie
    const action = mixer.clipAction(clip, zombie_geo)

    // Set the starting time of the animation to introduce the offset
    action.time = Math.random() * 10

    // Play the animation
    action.play()

    return action

}


export function set_bounding_box(zombie_entity, z_bounding_box_mat){
    // Create a bounding Sphere to detect if collision between woman or car entity.

    const z_bounding_box_geo = new THREE.SphereGeometry(zombie_entity.boundingRadius, 6, 6)
    const z_bounding_box = new THREE.Mesh(z_bounding_box_geo, z_bounding_box_mat)

    return z_bounding_box

}


export function sort_animation_clips(animations_list){
    // Sort zombie walk and death animation clips into seperate arrays.

    const zombie_walk_walking_animations = []
    const zombie_walk_death_animations = []

    for(let i = 0; i < animations_list.length; i++){

        const anim_clip = animations_list[i]
        var type = anim_clip.name.split("_")[2] // anim type: "death" / "walking" etc

        if(type === "walking"){
           zombie_walk_walking_animations.push(anim_clip)
        }
        else if(type == "death" ){
            zombie_walk_death_animations.push(anim_clip)
        }

    }

    return {
        walkingAnimations: zombie_walk_walking_animations,
        deathAnimations: zombie_walk_death_animations
    }
}


export function set_yuka_walker_behaviour(zombie_count, spawn_distance){

    const devide_by = 10

    // instantiate Yuka behaviour.
    const alignmentBehavior = new YUKA.AlignmentBehavior()
    const cohesionBehaviour = new YUKA.CohesionBehavior()
    const seperationBehaviour = new YUKA.SeparationBehavior()

    alignmentBehavior.weight = 0.5 / devide_by
    cohesionBehaviour.weight = 0.5 / devide_by
    seperationBehaviour.weight = 0.001

    // Add to dict for later use.
    const yuka_behaviors_settings = {}

    yuka_behaviors_settings.spawn_distance = spawn_distance
    yuka_behaviors_settings.zombie_count = zombie_count
    yuka_behaviors_settings.devide_by = devide_by
    yuka_behaviors_settings.alignmentBehavior = alignmentBehavior
    yuka_behaviors_settings.cohesionBehaviour = cohesionBehaviour
    yuka_behaviors_settings.seperationBehaviour = seperationBehaviour

    return yuka_behaviors_settings
}


export function set_yuka_crawler_behaviour(zombie_count, spawn_distance){

    const w_devide_by = 100

    // instantiate Yuka behaviour.
    const crawlers_alignmentBehavior = new YUKA.AlignmentBehavior()
    const crawlers_cohesionBehaviour = new YUKA.CohesionBehavior()
    const crawlers_seperationBehaviour = new YUKA.SeparationBehavior()

    crawlers_seperationBehaviour.weight = 0.001
    crawlers_cohesionBehaviour.weight = 0.5 / w_devide_by
    crawlers_alignmentBehavior.weight = 0.5 / w_devide_by

    // Add to dict for later use.
    const yuka_behaviors_settings_crawlers = {} 

    yuka_behaviors_settings_crawlers.zombie_count = zombie_count
    yuka_behaviors_settings_crawlers.spawn_distance = spawn_distance
    yuka_behaviors_settings_crawlers.devide_by = w_devide_by
    yuka_behaviors_settings_crawlers.alignmentBehavior = crawlers_alignmentBehavior
    yuka_behaviors_settings_crawlers.cohesionBehaviour = crawlers_cohesionBehaviour
    yuka_behaviors_settings_crawlers.seperationBehaviour = crawlers_seperationBehaviour

    return yuka_behaviors_settings_crawlers
}


