import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';

export class ObjetoModelo{

    constructor(geo,mat){
        this.velMax = 0.4;
        this.pos = new THREE.Vector2(this.random(-10,10),this.random(-10,10));
        this.vel = new THREE.Vector2(this.random(-this.velMax,this.velMax),this.random(-this.velMax,this.velMax));
        this.modelo = new THREE.Object3D();
        this.sinModelo = true;
        this.rot = 0;
        //this.modelo =  new THREE.Mesh( geo,mat );

    }

    alejar(vec, radio) {
      var desiredseparation = radio;
      var d = vec.distanceTo(this.pos);

      if (d!=0 && d < desiredseparation) {
          var diff = new THREE.Vector2();
          diff.subVectors(this.pos, vec);
          diff.normalize();
          diff.divideScalar(d);
          diff.normalize();
          diff.sub(this.vel);
          diff.clampLength(-this.velMax,this.velMax);
          return diff;
      }else{
          return new THREE.Vector2(0,0);
      }
    }
    actualizar(){
        if(this.modelo!=undefined){
            this.rot = THREE.MathUtils.lerp(this.rot,Math.atan2(this.vel.y,this.vel.x),0.02);
            this.modelo.rotation.set(0,this.rot,0);
            this.modelo.position.set(this.pos.x,0,this.pos.y);
        }
    }

    acercar(vec,radio) {
      var neighbordist = radio;
      var diff = new THREE.Vector2();
      var d = vec.distanceTo(this.pos);
      if (d > neighbordist) {
        diff.subVectors(vec,this.pos);
        diff.normalize();
        diff.multiplyScalar(this.velMax);
        var steer = new THREE.Vector2();
        steer.subVectors(diff, this.vel);
        return steer.clampLength(-this.velMax,this.velMax);
      } else {
        return new THREE.Vector2();
      }
    }

    random(min,max){
        return min+Math.random()*(max-min)
    }

}
