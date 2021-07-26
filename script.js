import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import {cargarModelo} from './CargarModelo.js';
import {ObjetoModelo} from './Particula.js';


import { EffectComposer } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/UnrealBloomPass.js';
const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
const darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
const materials = {};
const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );
const params = {
	exposure: 1,
	bloomStrength: 1.5,
	bloomThreshold: 0,
	bloomRadius: 0
};




var obj;
var modelo = new THREE.Object3D();
var cant = 15;
var radio = 70;
var usarGeoAR = false;
var lista = [
    {lt:-34.9275039,lg:-57.9371359}
];
var poss = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(105, 0),
  new THREE.Vector2(-105, 0),
  new THREE.Vector2(0, -105),
  new THREE.Vector2(0, 105)
];

var escena = document.querySelector('a-scene');
console.log(escena);



escena.renderer.toneMapping = THREE.ReinhardToneMapping;

const renderScene = new RenderPass( escena.object3D, escena.camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const bloomComposer = new EffectComposer( escena.renderer );
bloomComposer.renderToScreen = false;
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );

const finalPass = new ShaderPass(
	new THREE.ShaderMaterial( {
		uniforms: {
			baseTexture: { value: null },
			bloomTexture: { value: bloomComposer.renderTarget2.texture }
		},
		vertexShader: document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		defines: {}
	} ), "baseTexture"
);
finalPass.needsSwap = true;

const finalComposer = new EffectComposer( escena.renderer );
finalComposer.addPass( renderScene );
finalComposer.addPass( finalPass );

//sphere.layers.enable( BLOOM_SCENE );


var puntos = [];
for(var i=0;i<lista.length;i++){
    puntos[i] = document.createElement('a-entity');//document.getElementById('plaza');
    if(usarGeoAR){
        puntos[i].setAttribute('id','punto'+i);
        console.log("creando "+`latitude: ${lista[i].lt}; longitude: ${lista[i].lg};`);
        puntos[i].setAttribute('gps-entity-place', `latitude: ${lista[i].lt}; longitude: ${lista[i].lg};`);
    }
    escena.appendChild(puntos[i]);
}
//cargarModelo('./modelo/panredu.glb',modelo[i]);
//modelo[i].scale.set(15,15,15);
    //escena.appendChild(punto);

cargarModelo('./modelo/dino4.glb',modelo);
modelo.scale.set(12,12,12);
// modelo.position.set(0,0,0);

var objeto = new THREE.Object3D();
console.log("version 3 con varios puntos nuevitaaa con sistema mejorado por distancia ")
for (let i=0; i<poss.length; i++) {
    let luz1 = new THREE.PointLight( 0xffffff, 3, 100 );
    luz1.position.set(poss[i].x,50,poss[i].y);
    objeto.add( luz1 );
}

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
// const cube = new THREE.Mesh( geometry, material );
// cube.position.set(0,0,-4);
// escena.object3D.add( cube );

// escena.sceneEl


//let ambiental = new THREE.AmbientLight( 0x404040 ); // soft white light
//objeto.add( ambiental );
// for (let i=0; i<cant; i++) {
obj = new ObjetoModelo();
objeto.add(obj.modelo);
// }


var texto =  document.createElement("div");
var titulo = document.createElement("h1");
var subtitulo = document.createElement("h2");
texto.style.position = "absolute";
texto.style.top = "10px";
texto.style.left = "50%";
texto.style.transform= "translate(-50%,0%)";

titulo.style.color = "#ffffff";
subtitulo.style.color = "#ffffff";
titulo.style.textAlign = "center";
subtitulo.style.textAlign = "center";

titulo.innerText = "Espere un momento";
subtitulo.innerText = "Cargando ubicacion"


texto.append(titulo);
texto.append(subtitulo);
document.body.append(texto);

var imprimirD = true;
function animar(){
    requestAnimationFrame(animar);
    if(modelo.children.length > 0){
        for (let i=0; i<cant; i++) {
            if(obj.sinModelo){
                obj.modelo.add(modelo.clone());
                obj.sinModelo = false;
            }
        }
    }
    if(imprimirD){
        var imprimir = true;
        if(usarGeoAR){
            for(var i=0;i<puntos.length;i++){
                if(puntos[i].getAttribute('distance')==undefined){
                    imprimir=false;
                }
            }
        }
        if(imprimir){
            //var menor = parseFloat(puntos[0].getAttribute('distance'))
            var indice = 0;
            /*for(var i=1;i<puntos.length;i++){
                console.log(puntos[i].getAttribute('distance'));
                if(parseFloat(puntos[i].getAttribute('distance'))<menor){
                    indice = i
                    menor = parseFloat(puntos[i].getAttribute('distance'));
                }
            }*/
            console.log(puntos[indice]);
            puntos[indice].object3D.add( objeto );
            texto.remove();
            imprimirD = false;
        }
    }

    renderBloom(true);
	//composer.render();
    finalComposer.render();
    //mover();
}

function renderBloom( mask ) {
	if ( mask === true ) {
		escena.object3D.traverse( darkenNonBloomed );
		bloomComposer.render();
		escena.object3D.traverse( restoreMaterial );
	} else {
		escena.camera.layers.set( BLOOM_SCENE );
		bloomComposer.render();
		escena.camera.layers.set( ENTIRE_SCENE );
	}
}

function darkenNonBloomed( obj ) {
	if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {
		materials[ obj.uuid ] = obj.material;
		obj.material = darkMaterial;
	}
}

function restoreMaterial( obj ) {
	if ( materials[ obj.uuid ] ) {
		obj.material = materials[ obj.uuid ];
		delete materials[ obj.uuid ];
	}
}

animar();

/*
function mover() {
  for (let i=0; i<particulas.length; i++) {
    let acc =  particulas[i].alejar(poss[0], 30);
    let acc2 =  particulas[i].acercar(poss[0], 140);
    particulas[i].vel.add(acc);
    particulas[i].vel.add(acc2);
    for (let j=0; j<cant; j++) {
      if (i!=j) {
        let acc3 =  particulas[i].alejar(particulas[j].pos, 15);
        particulas[i].vel.add(acc3);
      }
    }
    particulas[i].vel.clampLength(-particulas[i].velMax,particulas[i].velMax);
    particulas[i].pos.add(particulas[i].vel);
    particulas[i].actualizar();
  }
}*/
