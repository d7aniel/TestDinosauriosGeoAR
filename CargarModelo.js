import { GLTFLoader } from 'https://unpkg.com/three@0.122.0/examples/jsm/loaders/GLTFLoader.js';

export function cargarModelo(archivo,objetoVacio){
    var loader = new GLTFLoader();
    loader.load(archivo,function(gltf){
        /*gltf.scene.traverse( function ( child ) {
			if ( child.isMesh ) {
            //    console.log(child);
                if(child.name === "Cylinder"){
    				//console.log(child.name);
                    child.layers.enable( 1 );
                }
			}
		} );*/
        objetoVacio.add(gltf.scene);
    });
}

export function cargarModeloConAnimacion(archivo,objetoVacio,mixer){
    var loader = new GLTFLoader();
    loader.load(archivo,function(gltf){

        gltf.scene.traverse( function ( child ) {
			if ( child.isMesh ) {

               child.scale.set(0.001,0.001,0.001);
               console.log(child);
            /*    if(child.name === "Cylinder"){
    				//console.log(child.name);
                    child.layers.enable( 1 );
                }*/
			}
		} );



					//const clip = animations[ i ];
                /*    mixer = new THREE.AnimationMixer( gltf.scene );
					const action = mixer.clipAction( gltf.animations[0] );
                    action.play();*/

                    //actions[ clip.name ] = action;

                    //console.log(gltf.animations[0]);
                objetoVacio.add(gltf.scene);
            });
        }
