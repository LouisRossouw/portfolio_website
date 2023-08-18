import * as THREE from "three";
import Experience from "../Experience.js";

import { get_time_difference } from "../Utils/utils.js";
import { calculate_user_ranking } from "../Utils/utils.js";

export default class Game{
    constructor(){

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.settings = this.experience.settings
        this.world_speed = this.settings.world_speed[this.settings.world_speed_value]
        this.time = this.experience.time
        this.camera = this.experience.camera

        this.collect_me = 0
        this.game_start_time = 0
        this.game_end_time = 0
        this.total_points = 0
        this.zombie_death_counter = 0

        // Woman
        this.woman = this.experience.world.woman
        this.woman_boundingBox = this.woman.obs_woman_reference_mesh
        this.woman_dead = false
        this.woman_lives = 3

        this.nissan = this.experience.world.nissan
        this.zombies = this.experience.world.zombies
        this.point_counter = document.getElementById('zombieland_point')
        this.game_active = false
        this.zombie_list = this.zombies.zombie_list
        this.last_value = 0

        this.is_nissan_active = false

        this.experience.addEventListener("start_game", () => {

            document.getElementById("ZL_final_rank").innerHTML = 0
            document.getElementById("ZL_final_points").innerHTML = 0
            document.getElementById("ZL_final_time").innerHTML = 0

            document.querySelector("input[name='form_points']").value = 0
            document.querySelector("input[name='form_zombie_deaths']").value = 0
            document.querySelector("input[name='form_time_elapsed']").value = 0
            document.querySelector("input[name='form_rank']").value = 0

            this.collect_me = 0
            this.game_start_time = 0
            this.game_end_time = 0
            this.total_points = 0
            this.zombie_death_counter = 0

            this.game_start_time = Date.now()

            this.nissan.nissan_anim_clip.stop()
            this.nissan.nissan_geo.visible = false
            this.nissan.nissan_geo.position.set(-25, -5, -25)

            const icons = document.querySelectorAll(".socials i");
            icons.forEach(icon => {
              icon.style.display = "none"; // Apply your styles here
            });

            document.getElementById("zombieland_rank").innerHTML = calculate_user_ranking(0)

            this.game_active = true
            this.set_collectMe()

            // Reset zombies.
            this.zombies.reset_zombies(false, 50)

            // Reset woman
            this.woman.woman_reset()

            // Reset Nissan
            this.nissan.reset_animation()

            function profileAnimate() {
  
                setTimeout(function(){document.getElementById("contact_img_01").style.display = "none"}, 450);
                setTimeout(function(){document.getElementById("contact_img_02").style.display = "block"}, 450);
            
                setTimeout(function(){document.getElementById("contact_img_01").style.display = "block"}, 900);
                setTimeout(function(){document.getElementById("contact_img_02").style.display = "none"}, 900);
            
            }
            
            this.animationInterval = setInterval(function(){profileAnimate();}, 1000)
            
        })

        this.zombies.addEventListener("zombie_killed", () => {

            if(this.game_active){
                this.zombie_death_counter += 1
                document.getElementById("ZL_zombie_meter_02").innerHTML += '<i class="fa-solid fa-skull"></i>'
                document.getElementById("zombieland_zombie_deaths").innerHTML = this.zombie_death_counter

                document.getElementById("ZL_ui_points_col_03").style.borderColor = "rgba(123, 255, 255, 0.5)"
                document.getElementById("ZL_ui_points_col_03").style.backgroundColor = "rgba(132, 0, 255, 0.1)"

                window.setTimeout(() =>{
                    document.getElementById("ZL_ui_points_col_03").style.borderColor = "rgba(107, 107, 107, 0.2)"
                    document.getElementById("ZL_ui_points_col_03").style.backgroundColor = "rgba(107, 107, 107, 0)"
                }, 50)

                window.setTimeout(() =>{
                    document.getElementById("ZL_zombie_meter_02").innerHTML = ""
                }, 3000)
            }
        })

        this.experience.world.zombies.addEventListener("woman_died", () => {

            if(this.game_active){

                // document.getElementById("ZL_play_ui").style.display = "none"
                // document.getElementById("ZL_ui_play_button").style.display = "none"
                
                const icons = document.querySelectorAll(".socials i");
                icons.forEach(icon => {
                  icon.style.display = "block"; // Apply your styles here
                });

                clearInterval(this.animationInterval)

                this.experience.reset_game()
                this.scene.remove(this.collect_me)
                this.woman.woman_died()
                this.game_active = false
                this.game_end_time = Date.now()
                
                window.setTimeout(() =>{
                    document.getElementById("ZL_glow_effect").style.display = "block"
                    document.getElementById("ZL_ui_play_button").style.display = "none"

                }, 1000)

                window.setTimeout(() =>{
                    document.getElementById("ZL_glow_effect").style.display = "none"
                    // document.getElementById("ZL_ui_play_button").style.display = "block"
                    this.camera.auto_play = true

                    // Show leaderboard
                    document.getElementById("ZL_leaderBoard_save_ui").style.display = "block"

                    // Update points
                    var ranking = calculate_user_ranking(this.total_points)
                    var time_elapsed = get_time_difference(this.game_start_time, this.game_end_time)
                    
                    document.getElementById("ZL_final_rank").innerHTML = ranking
                    document.getElementById("ZL_final_points").innerHTML = this.total_points
                    document.getElementById("ZL_final_time").innerHTML = time_elapsed

                    document.querySelector("input[name='form_points']").value = this.total_points
                    document.querySelector("input[name='form_zombie_deaths']").value = this.zombie_death_counter
                    document.querySelector("input[name='form_time_elapsed']").value = time_elapsed
                    document.querySelector("input[name='form_rank']").value = ranking

                    this.zombies.reset_zombies(true, 10)
                    this.nissan.nissan_geo.position.set(0, 0, 0)
                    this.nissan.nissan_anim_clip.play()
                    this.is_nissan_active = true

                    // Delay before spawn.
                    window.setTimeout(() =>{
                        this.nissan.nissan_geo.visible = true
                    }, 100)

                }, 8000)

            }
        })

    }


    set_collectMe(){
        
        this.collect_me = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 20, 20), 
            new THREE.MeshBasicMaterial({color : 'aqua'})
            )

        this.scene.add(this.collect_me)

        // Randomly position the ball within the scene
        const translate_x = (Math.random() - 0.5) * 10
        const translate_y = 0.1
        const translate_z = (Math.random() - 0.5) * 10

        this.collect_me.position.set(translate_x, translate_y, translate_z)
    }


    resize(){
        // Re-generate ball position if resized.
    }

    update(){

        if(this.game_active){

            document.getElementById("zombieland_time_elapsed").innerHTML = get_time_difference(this.game_start_time, Date.now())

            // Calculate the distance between bounding spheres' centers
            const distance = this.collect_me.position.distanceTo(this.woman_boundingBox.position);

            this.collect_me.material.color.set(distance / 10, 70, distance / 10)

            if (distance < this.collect_me.geometry.parameters.radius + this.woman_boundingBox.geometry.parameters.radius) {
                // If the bounding spheres are intersecting, meaning the zombie is touching the obstacle - handle collision behavior here

                this.woman.woman_point()

                // Randomly position the ball within the scene
                const translate_x = (Math.random() - 0.5) * 25
                const translate_y = 0.1
                const translate_z = (Math.random() - 0.5) * 25

                this.collect_me.position.set(translate_x, translate_y, translate_z)

                // Update / increment current points by 1
                var current_points = this.point_counter.innerHTML
                this.total_points += 1

                // Awaken a new zombie.
                if (this.total_points <= (this.world_speed.zombie_count + 10)){

                    console.log('awaken zombie: ', this.total_points, this.world_speed.zombie_count + 10)
                    this.experience.world.zombies.zombie_list[parseInt(this.total_points)].active = true
                    this.experience.world.zombies.zombie_list_geo[parseInt(this.total_points)].visible = true

                }


                // Only activate nissan after 50 points. 
                if(this.is_nissan_active !== true){
                    if(this.total_points > 50){

                        // this.nissan.anim_nissan_mixer.play()
                        this.nissan.nissan_geo.position.set(0, 0, 0)
                        this.nissan.nissan_anim_clip.play()
                        this.is_nissan_active = true

                        // Delay before spawn.
                        window.setTimeout(() =>{
                            this.nissan.nissan_geo.visible = true

                        }, 100)

                    }
                }

            
                document.getElementById('zombieland_point').innerHTML = parseInt(current_points) + 1

                document.getElementById("ZL_ui_points_col_02").style.borderColor = "rgba(123, 255, 255, 0.5)"
                document.getElementById("ZL_ui_points_col_02").style.backgroundColor = "rgba(132, 0, 255, 0.1)"

                window.setTimeout(() =>{
                    document.getElementById("ZL_ui_points_col_02").style.borderColor = "rgba(107, 107, 107, 0.2)"
                    document.getElementById("ZL_ui_points_col_02").style.backgroundColor = "rgba(107, 107, 107, 0)"
                }, 50)

                document.getElementById("zombieland_rank").innerHTML = calculate_user_ranking(this.total_points)

            }
        }
    }
}