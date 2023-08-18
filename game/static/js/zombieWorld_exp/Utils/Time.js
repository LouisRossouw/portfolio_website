import * as THREE from 'three';
import Experience from "../Experience.js";

export default class Time extends THREE.EventDispatcher {
  constructor() {
    super();

    this.experience = new Experience();

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    this.lastFrameTime = 0;
    this.zero_one = 0

    this.settings = this.experience.settings
    this.world_speed = this.settings.world_speed[this.settings.world_speed_value] // Get speed settings

    // Set the target frame rate (25 FPS)
    this.targetFPS = this.world_speed.FPS;
    this.targetInterval = 1000 / this.targetFPS;

    this.ten_start = Date.now();

    this.update();
  }


update() {

    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;


    // Check if 3 seconds have passed
    if (this.elapsed >= 3000) {
      this.dispatchEvent({ type: 'everyFiveSeconds' });

      // Reset the elapsed time to the remaining time
      this.elapsed -= 3000;
      this.start = this.current - this.elapsed;
      
    }



    this.ten_elapsed = Date.now() - this.ten_start;

    // Check if 10 seconds have passed
    if (this.ten_elapsed >= 10000) {
      this.dispatchEvent({ type: 'everyTenSeconds' });

      // Reset the elapsed time to the remaining time
      this.ten_elapsed = 0;
      this.ten_start = Date.now(); - this.ten_elapsed;
    }



    this.dispatchEvent({ type: 'update' });
    window.requestAnimationFrame(() => this.update());
  }

}



// import * as THREE from 'three';

// export default class Time extends THREE.EventDispatcher {
//     constructor() {
//       super();
  
//       this.start = Date.now();
//       this.current = this.start;
//       this.elapsed = 0;
//       this.delta = 16;
//       this.ten_seconds = 0; 
      
//       this.update();
//     }
  
//     update() {
//       const currentTime = Date.now();
//       this.delta = currentTime - this.current;
//       this.current = currentTime;
//       this.elapsed = this.current - this.start;


//       if (this.elapsed >= 10000) {
//         this.ten_seconds = 0; // Reset the counter to zero
//         this.start = this.current; // Reset the start time to the current time
//       } else {
//         this.ten_seconds = this.elapsed;
//       }

//       this.dispatchEvent({ type: 'update' });
//       window.requestAnimationFrame(() => this.update());
//     }
//   }