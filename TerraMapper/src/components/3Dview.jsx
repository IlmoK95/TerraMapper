import React, { useEffect, useRef, useState, useContext } from 'react';
import Delaunator from 'delaunator'
import * as THREE from 'three'
import textureService from '../sources/GETtexture'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { VisibilityContext } from '../contexts/VisibilityContext';


const ThreeD_view =(props)=>{

    const TextureRef = useRef(new THREE.TextureLoader().load('../textures/placeHolder.jpg' ))
    const modelRef = useRef(null)
    const renderer = useRef(null)
    const camera = useRef(null)
    const scene = useRef(null)
    const aspect = useRef(null)
    const orbitControl = useRef(null)
    const UV_vals = useRef(null)
    const textureMessage = useRef(' ')
    const bufferGeometry = useRef(null)

    const [res, setRes] = useState(null)

    const visibility = useContext(VisibilityContext)
    

    

    const fov = 20

 
    useEffect( ()=>{

        scene.current = new THREE.Scene();
        const Ambientlight = new THREE.AmbientLight( 0x404040, 12 );
        scene.current.add( Ambientlight )

        const axesHelper = new THREE.AxesHelper( 1000000);
        scene.current.add( axesHelper )

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 4.5 );
        directionalLight.castShadow = true
        scene.current.add( directionalLight )

        aspect.current = (window.innerWidth) / (window.innerHeight)
        camera.current = new THREE.PerspectiveCamera( fov, (window.innerWidth) / (window.innerHeight), 1000, 10000000 );
        camera.current.aspect = window.innerWidth / window.innerHeight

        renderer.current =  new THREE.WebGLRenderer({ alpha: true })
        renderer.current.setClearColor( 0xffffff, 0.1 )
        renderer.current.shadowMap.enabled = true;
        renderer.current.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.current.setSize( window.innerWidth, window.innerHeight );

        const domStyle = renderer.current.domElement.style
        const newDiv = document.createElement("div")
        newDiv.style.size = '100vw 100vh'
        newDiv.style.overflow = 'hidden'

        domStyle.backgroundImage = 'linear-gradient(#11161a, #11161a, #11161a,  #11161a, #343670, #86a7c2, #f2f7fa)'
        domStyle.backgroundImage = 'linear-gradient(180deg, rgba(0,0,0,0) 80%, rgba(95, 87, 161,0.80) 95%), url(../textures/space.jpg)'
        domStyle.backgroundSize = '100vw 100vh' 
        domStyle.backgroundRepeat = 'no-repeat'
        domStyle.position = "absolute" 
        domStyle.height = '100vh'
        domStyle.width = '100vw'

        newDiv.appendChild( renderer.current.domElement )
        document.body.appendChild( newDiv )


    }, [] )



    animate()
    function animate(){
     
        if(modelRef.current  && visibility.show3D){

            requestAnimationFrame( animate ); 
	        renderer.current.render( scene.current, camera.current );
        }
    }


    useEffect(()=>{

        if(props.NewMod){
            
            props.showNewModFunc()
            setRes(props.modRes)
            
            

            let X_vals = []
            let Y_vals = []
            let Z_vals = []
    
            let X_vals_UV = []
            let Y_vals_UV = []

            if(scene.current.children){
                scene.current.children.forEach( child =>{
                    
                    if(child.isMesh) scene.current.remove(child)
                    

                })
            }
    
            props.coordinates.forEach(( coord )=>{
                Y_vals.push(coord.lat)
                X_vals.push(coord.lng)
                Z_vals.push(coord.elevation)

                Y_vals_UV.push(coord.lat)
                X_vals_UV.push(coord.lng)

            })

            let Y_min = Math.min(...Y_vals)
            let Y_max = Math.max(...Y_vals)
            
            let X_min = Math.min(...X_vals)
            let X_max = Math.max(...X_vals)

            Y_vals = Y_vals.map(val =>{
                return MapToRange(val, Y_min, Y_max, 0, props.dimensionY)
            })
            
            X_vals = X_vals.map(val =>{
               return MapToRange(val, X_min, X_max, 0, props.dimensionX)
            })

            Y_vals_UV = Y_vals_UV.map(val =>{
                return MapToRangePercentage(val, Y_min, Y_max, 0, props.dimensionY)
            })

            X_vals_UV = X_vals_UV.map(val =>{
                return MapToRangePercentage(val, X_min, X_max, 0, props.dimensionX)
            }) 


            getTexture(X_vals, Y_vals, Z_vals, X_vals_UV, Y_vals_UV)
            
        }

    })


    const MapToRange=(val, sourceMin, sourceMax, targetMin, targetMax)=>{

        return targetMin + (val - sourceMin)/ (sourceMax - sourceMin) * (targetMax - targetMin) * 1000

    }

    const MapToRangePercentage=(val, sourceMin, sourceMax, targetMin, targetMax)=>{
        

        return (targetMin + (val - sourceMin) / (sourceMax - sourceMin) * (targetMax - targetMin)) / targetMax

    }


    const getTexture=(X_vals, Y_vals, Z_vals, X_vals_UV, Y_vals_UV)=>{

        props.setTexture(null)
        textureService
                    .GetTexture(props.TopLeft.lng, props.BottomRight.lat, props.BottomRight.lng, props.TopLeft.lat, props.dims.w, props.dims.h, props.apikey)
                    .then(response =>{
               
                            var jpgBlolb = new Blob([response.data], {type : "image/jpeg"})
                            var blobURL = window.URL.createObjectURL(jpgBlolb)
                            TextureRef.current = new THREE.TextureLoader().load(blobURL)   
                            props.setTexture(jpgBlolb)
                            textureMessage.current = '✅ get texture file'
                            
                    }).catch(error => {

                        textureMessage.current = `❌ Loading texture file failed: ${error.message}`
                        TextureRef.current = new THREE.TextureLoader().load('../textures/placeHolder.jpg' ) 

                    }).finally(
                        ()=>{

                            CreateMesh(X_vals, Y_vals, Z_vals, X_vals_UV, Y_vals_UV)
                        }
                    )
    }


    const CreateMesh = (X, Y, Z, X_uv, Y_uv) =>{

            const coordsForDelanay = []
            const vertices = [] 
            UV_vals.current = []

            for(let i=0; i<X.length; i++){

                coordsForDelanay.push(Y[i], X[i])
                vertices.push(X[i], Y[i], Z[i])
                UV_vals.current.push(new THREE.Vector2(X_uv[i], Y_uv[i]))
               
            }

            const delaunay = new Delaunator(coordsForDelanay)
            const indicesUInt32 = delaunay.triangles

            const indices = []
    
            indicesUInt32.forEach(i => {
                indices.push(i)   
            })


            const geometry = new THREE.BufferGeometry()
            geometry.setIndex(indices)
            geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(vertices), 3 ) )
            geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array(vertices), 2 ) ) 

            var uvAttribute = geometry.getAttribute('uv');

            UV_vals.current.forEach((uv, i) =>{
                uvAttribute.setXY(i, uv.x, uv.y)
            })

            bufferGeometry.current = geometry

            const material2 = new THREE.MeshStandardMaterial({
                map: TextureRef.current,
  
            });
            material2.side = THREE.DoubleSide
            material2.flatShading = false
            material2.castShadow = true
            material2.receiveShadow = true

            const mesh = new THREE.Mesh( bufferGeometry.current, material2 );
            mesh.geometry.computeVertexNormals()
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        
            var geom= mesh.geometry
            geom.computeBoundingSphere()
            const v = new THREE.Vector3( -geom.boundingSphere.center.x, -geom.boundingSphere.center.y, 0 )
            mesh.position.add(v)
            modelRef.current = mesh
            FitToScreen()
            
            scene.current.add(modelRef.current)
            props.SetTopoMod(scene.current)
            props.setThreeDReady(true)
            props.setMessage( [`${textureMessage.current},\n✅ 3D model created`])

    }

    useEffect(()=>{
        if (props.FitToScreen){
            FitToScreen()
            props.ThreeDfitToScreen()
        }
    })

    useEffect(()=>{
        if(modelRef.current){
            var Shading = props.ModType==='.obj' ? true : false
            var texture = props.ModType==='.obj' ? null : TextureRef.current
            modelRef.current.material.flatShading = Shading
            modelRef.current.material.map = texture
            modelRef.current.material.needsUpdate = true
        }
             
    },[props.ModType])



    const FitToScreen=()=>{
 
        var geom= modelRef.current.geometry
        geom.computeBoundingSphere()
        var rad = geom.boundingSphere.radius
        var rad_fov = fov * Math.PI/180
        var z = rad / Math.sin(rad_fov / 2)
        camera.current.position.z = z
        camera.current.position.x = 0
        camera.current.position.y = 0
        camera.current.updateProjectionMatrix()
        orbitControl.current = new OrbitControls(camera.current, renderer.current.domElement )  
     
    }

    const resize3DView=()=>{

        renderer.current.setSize(window.innerWidth, window.innerHeight );
        camera.current.aspect = (window.innerWidth ) / (window.innerHeight )
        camera.current.updateProjectionMatrix()

    }

    useEffect(()=>{
        if(bufferGeometry.current){

            var memoryUsage
            var bytes = BufferGeometryUtils.estimateBytesUsed(bufferGeometry.current)

            if (bytes < 1000){
                memoryUsage = `~${bytes} b`
            }else if (bytes >= 1000 && bytes < 1000000){
                memoryUsage = `~${Math.floor(bytes * 0.01)} kb`
            }else {
                memoryUsage = `~${Math.floor(bytes * 0.00001)} mb`
            }

            props.setMemUsed(memoryUsage)
            props.setModRes(res.toFixed(3))
            props.setModPointAmount(`${bufferGeometry.current.getAttribute('position').count}`)
            
        }
  
    }, [bufferGeometry.current, res])


    useEffect(()=>{
        window.addEventListener('resize', resize3DView) 
        return ()=> window.removeEventListener('resize', resize3DView)
    })

    return (
        <div ></div>
    )

}
export default ThreeD_view