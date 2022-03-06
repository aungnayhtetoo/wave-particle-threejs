import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const starParticle = textureLoader.load('/textures/particles/2.png')

/**
 * Particles
 */
// Particles
const dustGeometry = new THREE.SphereBufferGeometry(1, 32, 32)

const bufferGeometry = new THREE.BufferGeometry()

const vertices = new Float32Array([
    0, 0, 0,
    0.15, 0.25, 0.15,
    0.20, 0.50, 0.20,
    0.25, 1, 0.25,
    0.30, 1.5, 0.30,
    0.35, 2, 0.35,
    
])

const count = 20000
const randomVertices = new Float32Array(count * 3)
const randomColor = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i ++) {
    randomVertices[i] = (Math.random() - 0.5) * 20
    randomColor[i] = Math.random()
}
console.log(randomColor);


bufferGeometry.setAttribute('position', new THREE.BufferAttribute(randomVertices, 3))
bufferGeometry.setAttribute('color', new THREE.BufferAttribute(randomColor, 3))


// Material
const dustMaterial = new THREE.PointsMaterial({

    size: 0.1,
    sizeAttenuation: true,
})

dustMaterial.alphaMap = starParticle
dustMaterial.transparent = true;
// dustMaterial.color = new THREE.Color('pink')
// dustMaterial.alphaTest = 0.001
// dustMaterial.depthTest = false
dustMaterial.depthWrite = false
dustMaterial.blending = THREE.AdditiveBlending
dustMaterial.vertexColors = true

// Points
const dustParticles = new THREE.Points(bufferGeometry, dustMaterial)
scene.add(dustParticles)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()


const randomWave = [-2, 2, 1, 0, -1, -2.5, .25]
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    // dustParticles.rotation.y = elapsedTime * 0.2

    for(let j = 0; j < count; j++) {
        const i3 = j * 3
        const x =  bufferGeometry.attributes.position.array[i3+0] * 3
        const z =  Math.cos(bufferGeometry.attributes.position.array[i3+2] * 2) 
        bufferGeometry.attributes.position.array[i3+1] = Math.sin(elapsedTime + x) + z
        // bufferGeometry.attributes.position.array[i3+2] = Math.cos(elapsedTime)
    }

    bufferGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()