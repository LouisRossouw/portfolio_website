import Experience from './zombieWorld_exp/Experience.js';

var canvas = document.querySelector(".experience-canvas");
var container = document.getElementById("zombieland_container");

const experience = new Experience(canvas, container)

// Experience class available on global scope.
window.experience = experience;