import * as THREE from 'three';


export default class Sizes extends THREE.EventDispatcher {
    constructor() {
      super();


      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.aspect = this.width / this.height;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
  
      window.addEventListener('resize', () => {
        var container = document.getElementById("test_container");

        this.width = container.offsetWidth;
        this.height = container.offsetHeight;
        this.aspect = this.width / this.height;
        this.dispatchEvent({ type: 'resize' });
      });
    }
  }