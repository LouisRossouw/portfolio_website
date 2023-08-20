import * as THREE from "three"
import Experience from "./Experience.js"
import * as dat from "dat"



export default class Debug{

    static instance
    constructor(){

        this.experience = new Experience();
        this.scene = this.experience.scene
        this.settings = this.experience.settings
        this.world_settings = this.settings.world_speed[this.settings.world_speed_value] // Get speed settings
        this.world = this.experience.world
        this.woman = this.experience.woman

        if (this.world_settings.gui){
            this.gui = new dat.GUI()
            this.gui.close()
        }



        this.add_word_gui()

    }

    add_word_gui(){

        if (this.world_settings.gui){

            // Env Map
            const env_folder_gui = this.gui.addFolder('EnvMap')
            env_folder_gui.add(this.world.global, 'envMapIntensity').min(0).max(10).step(0.001).onChange(this.updateAllMaterials)
            env_folder_gui.add(this.scene, 'backgroundBlurriness').min(0).max(1).step(0.001)
            env_folder_gui.add(this.scene, 'backgroundIntensity').min(0).max(1).step(0.001)
            env_folder_gui.close();

            // Floor
            const floor_folder_gui = this.gui.addFolder('Floor')
            floor_folder_gui.addColor(this.world.floorMaterial, 'color').name('Color')
            floor_folder_gui.close()
        
            // Lights menu
            const lightMenu = this.gui.addFolder('Lights')
            lightMenu.close();
            
            // Light 01
            const DirectLight_01 = lightMenu.addFolder('DirectionalLight_01')
            DirectLight_01.add(this.world.light_01, 'visible').name('Visible')
            DirectLight_01.add(this.world.light_01.position, 'x').min(-10).max(10).step(0.01).name('translate X')
            DirectLight_01.add(this.world.light_01.position, 'y').min(0).max(10).step(0.01).name('translate Y')
            DirectLight_01.add(this.world.light_01.position, 'z').min(-10).max(10).step(0.01).name('translate Z')
            DirectLight_01.add(this.world.light_01, 'intensity', 0, 10).name('Intensity')
            DirectLight_01.addColor(this.world.light_01, 'color').name('Color')

            
            // Couds
            const clouds_gui = this.gui.addFolder('Clouds')
            clouds_gui.close()

            clouds_gui.add(this.world.cloud_mat, 'opacity').name('opacity').min(0).max(1).step(0.001)
            clouds_gui.add(this.world.clouds_all, 'visible').name('visible')
        }

    }

    add_woman_gui(woman){

        if (this.world_settings.gui){

            // Woman
            const woman_gui = this.gui.addFolder('Woman')

            woman_gui.add(woman.woman_geo, 'visible').name('char_visible')
            woman_gui.add(woman.obs_woman_reference_mesh, 'visible').name('boundingBox_visible')
            woman_gui.add(woman.woman_entity, 'boundingRadius').min(0.1).max(5).step(0.01).name('boundingRadius')

            woman_gui.add(woman.obstacleAvoidanceBehavior, 'active').name('obs_avoidance active')
            woman_gui.add(woman.obstacleAvoidanceBehavior, 'dBoxMinLength').min(0.0).max(5).step(0.01).name('obs_avoidance dBoxMinLength')
        }

    }

    add_nissan_gui(nissan){

        if (this.world_settings.gui){

            // Nissan
            const nissan_gui = this.gui.addFolder('Nissan')
            nissan_gui.add(nissan.nissan_geo, 'visible').name('geo_visible')

            nissan_gui.add(nissan.collision_box, 'visible').name('collisionBox_visible')
            nissan_gui.add(nissan.obstacleSphereMesh, 'visible').name('obsBox_visible')
            
        }
    }

}