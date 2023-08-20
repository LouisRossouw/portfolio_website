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
    this.zero_one = 0;

    this.settings = this.experience.settings;
    this.world_speed = this.settings.world_speed[this.settings.world_speed_value]; // Get speed settings

    // Try to limit to 60 FPS
    this.maxFPS = 120;
    this.targetInterval = 1000 / this.maxFPS;
    this.ten_start = Date.now();

    this.update();

  }


  update(timestamp) {

    // Calculate time elapsed since the last frame
    const deltaTime = timestamp - this.lastFrameTime;

    // Check if enough time has passed to update
    if (deltaTime >= this.targetInterval) {
      this.lastFrameTime = timestamp;

      const currentTime = Date.now();
      this.delta = currentTime - this.current;
      this.current = currentTime;
      this.elapsed = this.current - this.start;

      // Check if 3 seconds have passed
      if (this.elapsed >= 3000) {

        this.dispatchEvent({ type: 'everyFiveSeconds' })
        this.elapsed -= 3000;
        this.start = this.current - this.elapsed

      }

      this.ten_elapsed = Date.now() - this.ten_start

      // Check if 10 seconds have passed
      if (this.ten_elapsed >= 10000) {

        this.dispatchEvent({ type: 'everyTenSeconds' })
        this.ten_elapsed = 0
        this.ten_start = Date.now() - this.ten_elapsed

      }
      this.dispatchEvent({ type: 'update' })
    }

    window.requestAnimationFrame((timestamp) => this.update(timestamp))
  }
}



