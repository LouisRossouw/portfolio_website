import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { DRACOLoader } from 'DRACOLoader';

import Experience from "../Experience.js";



export default class Resources extends THREE.EventDispatcher{
    constructor(assets){
        super()

        this.experience = new Experience();
        this.renderer = this.experience.renderer;
        this.assets = assets;

        this.items = {};
        this.queue = this.assets.length;
        this.loaded = 0;

        this.ZL_loading_p = document.getElementById('ZL_loading_p')
        this.ZL_loadbar = document.getElementById('ZL_loadbar')

        this.loadingManager = new THREE.LoadingManager(
            // Loaded
            () =>
            {
                document.getElementById("ZL_loadbar").style.backgroundColor = "aqua"
                document.getElementById("ZL_loading_h").innerHTML = "READY"
                document.querySelector('.navbar_header').style.display = 'flex'
                // document.getElementById("audioPlayer").play()
            },
            // Progress
            (itemUrl, itemsLoaded, itemsTotal) =>
            {
                const progress = (itemsLoaded / itemsTotal)
                ZL_loadbar.style.transform = `scaleX(${progress})`
                this.ZL_loading_p.innerHTML = `${Number(itemsLoaded / itemsTotal * 100).toFixed(0)}%`
            }
        )


        this.setLoaders();
        this.startLoading();

    }


    setLoaders() {
        this.loaders = {};

        this.loaders.gltfLoader = new GLTFLoader(this.loadingManager);
        this.loaders.dracoLoader = new DRACOLoader(this.loadingManager);

        // Set static path to draco.
        this.loaders.dracoLoader.setDecoderPath('/static/three/examples/jsm/libs/draco/');
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
    }


    startLoading(){
        for(const asset of this.assets){

            // Load glb models.
            if (asset.type === "glbModel"){
                this.loaders.gltfLoader.load(asset.path, (file)=>{
                    this.singleAssetLoaded(asset, file);
                });

            // Load and play video textures if they exist.
            } else if (asset.type === "videoTexture"){

                this.video = {};
                this.videoTexture = {};

                this.video[asset.name] = document.createElement("video");
                this.video[asset.name].src = asset.path;
                this.video[asset.name].playsInline = true;
                this.video[asset.name].autoplay = true;
                this.video[asset.name].loop = true;
                this.video[asset.name].muted = true;
                this.video[asset.name].play();

                this.videoTexture[asset.name] = new THREE.VideoTexture(this.video[asset.name]);
                this.videoTexture[asset.name].flipY = true;
                this.videoTexture[asset.name].minFilter = THREE.NearestFilter;
                this.videoTexture[asset.name].magFilter = THREE.NearestFilter;
                this.videoTexture[asset.name].generateMipmaps = false;
                this.videoTexture[asset.name].encoding = THREE.SRGBColorSpace;

                this.singleAssetLoaded(asset, this.videoTexture[asset.name]);
            }   
        }
    }

    ready(){

        this.dispatchEvent({ type: 'ready' });
        document.querySelector(".ZL_loadScreen").style.display = "none"
        document.querySelector(".ZL_loadScreen_02").style.display = "none"
        document.getElementById("audioPlayer").play()
        sessionStorage.setItem('loaded_before', 'True');
        this.experience.autoplay = true


    }


    singleAssetLoaded(asset, file){
        this.items[asset.name] = file;
        this.loaded++;

        console.log(asset.name, " asset is loading")

        if(this.loaded === this.queue){

            window.setTimeout(() => {

                var loading_first_time = sessionStorage.getItem('loaded_before');
                console.log(loading_first_time); // Output: Hello from global variable!

                console.log("all assets are done.")
                // document.querySelector(".ZL_loadScreen").style.display = "none"
                // this.dispatchEvent({ type: 'ready' });

                if(loading_first_time === null){

                    console.log('loading first time')
                    document.querySelector(".ZL_loadScreen").style.display = "none"
                    document.querySelector(".ZL_loadScreen_02").style.display = "block"
                    document.getElementById("audioPlayer").play()


    
                } else if (loading_first_time === 'True') {
    
                    this.dispatchEvent({ type: 'ready' });
                    document.querySelector(".ZL_loadScreen").style.display = "none"
                    document.querySelector(".ZL_loadScreen_02").style.display = "none"
                    document.getElementById("audioPlayer").play()
                    console.log('loaded before')

    
                }

            }, 1000)





        }
    }
}
