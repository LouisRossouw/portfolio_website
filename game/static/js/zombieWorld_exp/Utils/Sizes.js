import * as THREE from 'three';
import Experience from "../Experience.js";

export default class Sizes extends THREE.EventDispatcher {
    constructor() {
      super();

      this.experience = new Experience()
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.aspect = this.width / this.height;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.container = this.experience.container
  
      window.addEventListener('resize', () => {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.aspect = this.width / this.height;
        this.dispatchEvent({ type: 'resize' });
      });
    }
    
  }