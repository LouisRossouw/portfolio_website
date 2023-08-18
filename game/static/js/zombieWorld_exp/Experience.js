
import * as THREE from 'three';
import * as dat from "dat";
import stat from "stats";

import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Resources from "./Utils/Resources.js";

import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import Settings from "./Settings.js";

import SteeringBehavior from "./World/SteeringBehavior.js";
import World from "./World/World.js";
import assets from "./Utils/assets.js";

import { start_text } from './Utils/utils.js';

export default class Experience extends THREE.EventDispatcher{

    static instance
    constructor(canvas, container){
        super()

        
        if (Experience.instance){
            return Experience.instance
        }

        Experience.instance = this
        this.canvas = canvas
        this.container = container
        this.scene = new THREE.Scene()
        this.settings = new Settings()
        // this.gui = new dat.GUI()
        this.time = new Time()
        this.sizes = new Sizes()
        this.steeringBehavior = new SteeringBehavior()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.resources = new Resources(assets)
        this.textureLoader = new THREE.TextureLoader()
        this.world = new World()

        this.game_active = false

        // this.gui.visible = false

        // Statistics FPS
        this.stats = new stat()
        this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        // document.body.appendChild(this.stats.dom)


        this.time.addEventListener("update", ()=>{
            this.update();
        })
        this.sizes.addEventListener("resize", ()=>{
            this.resize();
        })

    }

    
    show_instructions(){

        // Hide play button
        document.getElementById("ZL_ui_play_button").style.display = "none"
        document.getElementById("ZL_ui_leaderboard_button").style.display = "none"    

        // Hide leaderboard
        document.getElementById("ZL_leaderBoard_ui").style.display = "none"

        // Show instructions and start button.
        document.getElementById("start_game").style.display = "block"

        start_text("ignore_this_argument", "ZL_instructions")

    }


    start_game(){

        this.dispatchEvent({ type: 'start_game' });
        this.game_active = true

        // Hide leaderboard
        document.getElementById("ZL_leaderBoard_ui").style.display = "none"

        // Hide play button
        document.getElementById("ZL_ui_play_button").style.display = "none"
        document.getElementById("start_game").style.display = "none"

        // Show running game ui, points / timer / lives etc
        document.getElementById("ZL_ui_stats_row").style.display = "block"

    }


    reset_game(){

        this.game_active = false
        this.camera.auto_play = true

        document.getElementById("ZL_ui_stats_row").style.display = "none"
        document.getElementById('zombieland_point').innerHTML = 0

    }

    
    close_save_form(){

        document.getElementById("ZL_ui_play_button").style.display = "none"
        document.getElementById("ZL_leaderBoard_save_ui").style.display = "none"
        document.getElementById("ZL_leaderBoard_ui").style.display = "block"  


    }


    close_leaderboard(){

        document.getElementById("ZL_leaderBoard_ui").style.display = "none"

        if(this.game_active === false){
            document.getElementById("ZL_ui_play_button").style.display = "block"
            document.getElementById("ZL_ui_leaderboard_button").style.display = "block"
        } else{
            document.getElementById("ZL_ui_play_button").style.display = "none"       
            document.getElementById("ZL_ui_leaderboard_button").style.display = "none"       
        }

    }


    show_leaderboard(){

        document.getElementById("ZL_leaderBoard_ui").style.display = "block" 
        document.getElementById("ZL_ui_play_button").style.display = "none"
        document.getElementById("ZL_ui_leaderboard_button").style.display = "none"

    }


    resize(){

        this.steeringBehavior.update()
        this.world.update();
        this.camera.resize();
        this.renderer.resize();

    }


    update(){

        this.stats.begin()
        this.steeringBehavior.update()
        this.world.update();
        this.camera.update();
        this.renderer.update();
        this.stats.end()

    }

}




