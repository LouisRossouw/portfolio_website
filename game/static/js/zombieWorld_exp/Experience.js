
import * as THREE from 'three';
import * as dat from "dat";
import stat from "stats";

import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Resources from "./Utils/Resources.js";

import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import Settings from "./Settings.js";
import Debug from "./Debug.js";

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

        this.isMobile = window.innerWidth <= 800

        Experience.instance = this
        this.canvas = canvas
        this.container = container
        this.scene = new THREE.Scene()
        this.settings = new Settings()

        this.time = new Time()
        this.sizes = new Sizes()
        this.steeringBehavior = new SteeringBehavior()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.resources = new Resources(assets)
        this.textureLoader = new THREE.TextureLoader()
        this.world = new World()
        this.gui = new Debug()
        this.game_active = false
        this.music_active = true


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


        // instructions
        this.start_game_element = document.getElementById("start_game")

        this.ZL_ui_play_button = document.getElementById("ZL_ui_play_button")

        // Leaderboard
        this.ZL_leaderBoard_ui = document.getElementById("ZL_leaderBoard_ui")
        this.ZL_leaderBoard_save_ui = document.getElementById("ZL_leaderBoard_save_ui")
        this.ZL_ui_leaderboard_button = document.getElementById("ZL_ui_leaderboard_button")

        // points UI / stats
        this.ZL_ui_stats_row = document.getElementById("ZL_ui_stats_row")
        this.zombieland_point = document.getElementById('zombieland_point')

        // Music
        this.musicInfo = document.getElementById('musicInfo')
        this.musicPlay = document.getElementById('musicPlay')
        this.audio = document.getElementById("audioPlayer")
        this.musicPlay_icon_active = document.getElementById("musicPlay_icon_active")
        this.musicPlay_icon_inactive = document.getElementById("musicPlay_icon_inactive")
    }

    
    show_instructions(){

        this.ZL_ui_play_button.style.display = "none"
        this.ZL_ui_leaderboard_button.style.display = "none"    
        this.ZL_leaderBoard_ui.style.display = "none"
        this.musicPlay.style.display = "none"
        this.musicInfo.style.display = "none"
        this.start_game_element.style.display = "block"

        // Animated text that appears after clicking the play button.
        start_text("ignore_this_argument", "ZL_instructions")

    }


    start_game(){

        this.dispatchEvent({ type: 'start_game' });

        this.game_active = true
        this.ZL_leaderBoard_ui.style.display = "none"
        this.ZL_ui_play_button.style.display = "none"
        this.musicPlay.style.display = "none"
        this.musicInfo.style.display = "none"
        this.start_game_element.style.display = "none"
        this.ZL_ui_stats_row.style.display = "block"

    }


    reset_game(){

        this.game_active = false
        this.camera.auto_play = true
        this.ZL_ui_stats_row.style.display = "none"
        this.zombieland_point.innerHTML = 0

    }

    
    close_save_form(){

        this.ZL_ui_play_button.style.display = "none"
        this.ZL_leaderBoard_save_ui.style.display = "none"
        this.musicPlay.style.display = "none"
        this.musicInfo.style.display = "none"
        this.ZL_leaderBoard_ui.style.display = "block"  

    }


    close_leaderboard(){

        this.ZL_leaderBoard_ui.style.display = "none"

        if(this.game_active === false){
            this.ZL_ui_play_button.style.display = "block"
            this.ZL_ui_leaderboard_button.style.display = "block"
            this.musicPlay.style.display = "block"

        } else{
            this.ZL_ui_play_button.style.display = "none"       
            this.ZL_ui_leaderboard_button.style.display = "none"      
            this.musicPlay.style.display = "none"
            this.musicInfo.style.display = "none"
 
        }

    }


    show_leaderboard(){

        this.ZL_leaderBoard_ui.style.display = "block" 
        this.ZL_ui_play_button.style.display = "none"
        this.ZL_ui_leaderboard_button.style.display = "none"
        this.musicPlay.style.display = "none"
        this.musicInfo.style.display = "none"

    }


    set_music(){
        
        if(this.music_active){
            this.audio.pause()
            this.music_active = false
            this.musicPlay_icon_active.style.display = "none"
            this.musicPlay_icon_inactive.style.display = "block"
            this.musicInfo.style.display = "block"
        } else {
            this.audio.play()
            this.music_active = true
            this.musicPlay_icon_active.style.display = "block"
            this.musicPlay_icon_inactive.style.display = "none"
            this.musicInfo.style.display = "block"
        }

    }

    display_music_info(){

        this.musicInfo.style.display = "block"

    }
    
    hide_music_info(){

        window.setTimeout(() => {
            this.musicInfo.style.display = "none"
        }, 5000)

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




