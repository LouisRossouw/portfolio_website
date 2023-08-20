import * as THREE from "three";
// import * as TWEEN from "tween";
import Experience from "../Experience.js";

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
        this.textureLoader = this.experience.textureLoader;

        this.set_env();
        this.set_lighting();
        this.set_fog();
        this.particles();
        this.simple_cloud()

        // When all assets are loaded.
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

            this.experience.gui.add_woman_gui(this.woman)
            this.experience.gui.add_nissan_gui(this.nissan)
        })
    }


    simple_cloud(){

        var cloud_texture_01 = this.textureLoader.load('/static/textures/cloud.jpg')
        var cloud_texture_02 = this.textureLoader.load('/static/textures/cloud_02.jpg')

        let cloud_array = [cloud_texture_01, cloud_texture_02]

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
            var random_index = Math.floor(Math.random() * cloud_array.length);
            let cloud_mesh = new THREE.Mesh(new THREE.PlaneGeometry(17, 12), this.cloud_mat)

            cloud_mesh.rotation.x = - Math.PI / 2
            cloud_mesh.position.set(((Math.random() - 0.5) * 100), (Math.random() * 40) + 5, ((Math.random() - 0.5) * 100))
            cloud_mesh.material.map = cloud_array[random_index]
            cloud_mesh.material.alphaMap = cloud_array[random_index]
            this.clouds_all.add(cloud_mesh)

        }

        this.scene.add(this.clouds_all)


        if(this.experience.isMobile){
            this.clouds_all.visible = false
        }

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

        // Directional Light.
        this.light_01 = new THREE.DirectionalLight("red", 0.6);
        this.light_01.castShadow = false;
        this.light_01.shadow.camera.far = 20;
        this.light_01.shadow.mapSize.set(1024, 1024);
        this.light_01.shadow.normalBias = 0.05;
        this.light_01.position.set(-8.85, 7.64, -10);
        this.scene.add(this.light_01);

    }



    resize(){

    }


    update(){
    
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

}