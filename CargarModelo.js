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
