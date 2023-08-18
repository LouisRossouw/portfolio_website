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

        this.setLoaders();
        this.startLoading();

    }


    setLoaders() {
        this.loaders = {};

        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.dracoLoader = new DRACOLoader();

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

    singleAssetLoaded(asset, file){
        this.items[asset.name] = file;
        this.loaded++;

        console.log(asset.name, " asset is loading")

        // console.log(this.loaded, this.queue)

        if(this.loaded === this.queue){
            console.log("all assets are done.")
            this.dispatchEvent({ type: 'ready' });
            
        }
    }

}
