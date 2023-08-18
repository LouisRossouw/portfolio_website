import * as THREE from "three";
import * as TWEEN from "tween";
import Experience from "../Experience.js";
import { RGBELoader } from 'RGBELoader'

import Nissan from "./Nissan.js";
import Zombies from "./Zombies.js";
import Woman from "./Woman.js";
import Game from "./Game.js";

export default class World{
    constructor(){
        
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.settings = this.experience.settings
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.time = this.experience.time;
        this.resources = this.experience.resources;
        // this.gui = this.experience.gui;
        this.textureLoader = this.experience.textureLoader;


        this.grid_color = 'white'
        this.grid_color_origin_lines = 'aqua'
        this.static_grid_opacity = 0;
        this.moving_grid_opacity = 0.2;

        this.set_env();
        this.set_lighting();
        this.set_fog();
        // this.set_debug();
        this.particles();
        this.simple_cloud()

        this.resources.addEventListener("ready", () =>{

            this.woman = new Woman();
            this.zombies = new Zombies();
            this.nissan = new Nissan();
            this.game = new Game()

            this.ground_ = this.resources.items.ground;
            this.ground_geo = this.ground_.scene;
            this.ground_geo.scale.set(10, 10, 10)

            this.scene.add(this.ground_geo)

            console.log("created 3D World")
            this.updateAllMaterials()
        })
    }


    simple_cloud(){

        var cloud_texture_01 = this.textureLoader.load('/static/textures/cloud.jpg')
        var cloud_texture_02 = this.textureLoader.load('/static/textures/cloud_02.jpg')

        let test = [cloud_texture_01, cloud_texture_02]

        this.clouds_all = new THREE.Group()

        this.cloud_mat = new THREE.MeshStandardMaterial({ 
            color: 'rgb(50, 80, 80)',
            opacity: 0.4,
            map: cloud_texture_01,
            transparent: true,
            alphaMap: cloud_texture_01,
            depthWrite: false,
        })

        var distance = -100

        // Generate clouds.
        for(let i = 0; i < 50; i++){
            
            distance += 10 + (Math.random() * 20)
            var random_index = Math.floor(Math.random() * test.length);
            let cloud_mesh = new THREE.Mesh(new THREE.PlaneGeometry(17, 12), this.cloud_mat)

            cloud_mesh.rotation.x = - Math.PI / 2
            cloud_mesh.position.set(((Math.random() - 0.5) * 100), (Math.random() * 40) + 5, ((Math.random() - 0.5) * 100))
            cloud_mesh.material.map = test[random_index]
            cloud_mesh.material.alphaMap = test[random_index]
            this.clouds_all.add(cloud_mesh)

        }

        this.scene.add(this.clouds_all)

    }


    particles(){
        
        this.particles_geo = new THREE.BufferGeometry()
        this.particles_count = 5000

        this.position = new Float32Array(this.particles_count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)
        this.colors = new Float32Array(this.particles_count * 3)

        // Generate particles.
        for(let i = 0; i < this.particles_count; i++){

            const i3 = i * 3
            this.position[i3 + 0] = (Math.random() - 0.5) * 100
            this.position[i3 + 1] = Math.random() * 50
            this.position[i3 + 2] = (Math.random() - 0.5) * 100

            this.colors[i3 + 0] = Math.random() * 1
            this.colors[i3 + 1] = Math.random() * 1
            this.colors[i3 + 2] = Math.random() * 10
        }

        // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
        this.particles_geo.setAttribute('position', new THREE.BufferAttribute(this.position, 3))
        this.particles_geo.setAttribute('color', new THREE.BufferAttribute(this.colors, 3))

        // Materiial
        this.particles_material = new THREE.PointsMaterial({
            color: 'orange',
            size: 0.1,
            sizeAttenuation: true,
            vertexColors: true
        })

        // Points
        this.particles_env = new THREE.Points(this.particles_geo, this.particles_material)
        this.scene.add(this.particles_env)

    }


    set_env(){

        // Create the floor geometry
        this.floorGeometry = new THREE.PlaneGeometry(50, 50); // Specify the width and height of the floor
        this.floorMaterial = new THREE.MeshStandardMaterial({ color: "rgb(10,10,10)", roughness: 1, metalness: 0 }); // Set the desired color or material for the floor
        this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
        this.floorMesh.rotation.x = -Math.PI / 2; // Rotate the floor to make it horizontal
        this.floorMesh.position.y = 0; // Set the desired height position of the floor
        this.scene.add(this.floorMesh);
        this.floorMesh.receiveShadow = false
        this.floorMesh.visible = false

    }


    set_fog(){
        this.scene.fog = new THREE.Fog( "rgb(49, 0, 95)", 62, 150);
    }


    set_lighting(){

        // ENV Map
        this.global = {}

        // GlobaL intensity
        this.global.envMapIntensity = 2.8

        // Update all materials
        this.updateAllMaterials = () =>{
            this.scene.traverse((child) => {
                if(child.isMesh && child.material.isMeshStandardMaterial){
                    child.material.envMapIntensity = this.global.envMapIntensity
                    
                }
            })
        }

        const environmentMap = this.textureLoader.load('/static/environmentMaps/gengen_synthwave.jpg')
        environmentMap.mapping = THREE.EquirectangularReflectionMapping
        environmentMap.colorSpace = THREE.SRGBColorSpace

        this.scene.backgroundBlurriness = 1
        this.scene.backgroundIntensity = 0
        this.scene.environment = environmentMap
        this.scene.background = environmentMap

        // Directional Light
        this.light_01 = new THREE.DirectionalLight("white", 1.36);
        this.light_01.castShadow = false;
        this.light_01.shadow.camera.far = 20;
        this.light_01.shadow.mapSize.set(1024, 1024);
        this.light_01.shadow.normalBias = 0.05;
        this.light_01.position.set(1.89, 10, -5.44);
        // this.scene.add(this.light_01);

        this.light_02 = new THREE.DirectionalLight("red", 0.6);
        this.light_02.castShadow = false;
        this.light_02.shadow.camera.far = 20;
        this.light_02.shadow.mapSize.set(1024, 1024);
        this.light_02.shadow.normalBias = 0.05;
        this.light_02.position.set(-8.85, 7.64, -10);
        this.scene.add(this.light_02);

        // this.light = new THREE.HemisphereLight( 'rgb(255, 0, 149)', 'aqua', 1 );
        // this.light.position.set(10, 2, -10)
        // this.scene.add( this.light );

    }



    resize(){

    }


    update(){

        TWEEN.update();
    
        if(this.nissan){
            this.nissan.update()
        }
        if(this.zombies){
            this.zombies.update()
        }
        if(this.woman){
            this.woman.update()
        }
        if(this.game){
            this.game.update()
        }

    }

    
    set_debug(){

        // NB: make a seperate .js file for debug.

        // Debug
        this.gui.close()

        // Env Map
        const env_folder_gui = this.gui.addFolder('EnvMap')
        env_folder_gui.add(this.global, 'envMapIntensity').min(0).max(10).step(0.001).onChange(this.updateAllMaterials)
        env_folder_gui.add(this.scene, 'backgroundBlurriness').min(0).max(1).step(0.001)
        env_folder_gui.add(this.scene, 'backgroundIntensity').min(0).max(1).step(0.001)
        env_folder_gui.close();

        // Floor
        const floor_folder_gui = this.gui.addFolder('Floor')
        floor_folder_gui.addColor(this.floorMaterial, 'color').name('Color')
        floor_folder_gui.close()

        // Grid
        const grid_folder_gui = this.gui.addFolder('Grid')
        grid_folder_gui.add(this.grid.material, 'opacity').min(0).max(1).step(0.001).name('static grid opacity')
        grid_folder_gui.addColor(this.grid.material, 'color').name('static grid Color')
        grid_folder_gui.close();

        // Lights menu
        const lightMenu = this.gui.addFolder('Lights')
        lightMenu.close();
        
        // Light 01
        const DirectLight_01 = lightMenu.addFolder('DirectionalLight_01')
        DirectLight_01.add(this.light_01, 'visible').name('Visible')
        DirectLight_01.add(this.light_01.position, 'x').min(-10).max(10).step(0.01).name('translate X')
        DirectLight_01.add(this.light_01.position, 'y').min(0).max(10).step(0.01).name('translate Y')
        DirectLight_01.add(this.light_01.position, 'z').min(-10).max(10).step(0.01).name('translate Z')
        DirectLight_01.add(this.light_01, 'intensity', 0, 10).name('Intensity')
        DirectLight_01.addColor(this.light_01, 'color').name('Color')

        // Light 02
        const DirectLight_02 = lightMenu.addFolder('DirectionalLight_02')
        DirectLight_02.add(this.light_02, 'visible').name('Visible')
        DirectLight_02.add(this.light_02.position, 'x').min(-10).max(10).step(0.01).name('translate X')
        DirectLight_02.add(this.light_02.position, 'y').min(0).max(10).step(0.01).name('translate Y')
        DirectLight_02.add(this.light_02.position, 'z').min(-10).max(10).step(0.01).name('translate Z')
        DirectLight_02.add(this.light_02, 'intensity', 0, 10).name('Intensity')
        DirectLight_02.addColor(this.light_02, 'color').name('Color')

        // Couds

        const clouds_gui = this.gui.addFolder('Clouds')
        clouds_gui.close()

        // cloud 01
        clouds_gui.add(this.cloud_mesh_01.position, 'x').min(0).max(50).step(0.001)
        clouds_gui.add(this.cloud_mesh_01.position, 'y').min(0).max(50).step(0.001)
        clouds_gui.add(this.cloud_mesh_01.position, 'z').min(0).max(50).step(0.001)

        clouds_gui.add(this.cloud_mat_01, 'opacity').name('opacity').min(0).max(1).step(0.001)
        clouds_gui.addColor(this.cloud_mat_01, 'color').name('color')

        clouds_gui.add(this.cloud_mesh_01, 'visible').name('visible')
        
        // cloud 02
        clouds_gui.add(this.cloud_mesh_02.position, 'x').min(-50).max(50).step(0.1)
        clouds_gui.add(this.cloud_mesh_02.position, 'y').min(-50).max(50).step(0.1)
        clouds_gui.add(this.cloud_mesh_02.position, 'z').min(-50).max(50).step(0.1)

        clouds_gui.add(this.cloud_mesh_02.rotation, 'x').min(-10).max(10).step(0.1)
        clouds_gui.add(this.cloud_mesh_02.rotation, 'y').min(-10).max(10).step(0.1)
        clouds_gui.add(this.cloud_mesh_02.rotation, 'z').min(-10).max(10).step(0.1)

        clouds_gui.add(this.cloud_mat_02, 'opacity').name('opacity').min(0).max(1).step(0.001)
        clouds_gui.addColor(this.cloud_mat_02, 'color').name('color')

        clouds_gui.add(this.cloud_mesh_02, 'visible').name('visible')

    }

}