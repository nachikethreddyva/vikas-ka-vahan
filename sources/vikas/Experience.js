/**
 * Experience — Master controller
 * NO SHADOWS, bright scene, fast rendering.
 */

import * as THREE from 'three'
import { Camera } from './Camera.js'
import { Controls } from './Controls.js'
import { Car } from './Car.js'
import { World } from './World.js'
import { Billboards } from './Billboards.js'
import { AudioManager } from './AudioManager.js'
import { UIManager } from './UIManager.js'
import { YearZones } from './YearZones.js'
import { Resources } from './Resources.js'

export class Experience {
    static instance = null
    static getInstance() { return Experience.instance }

    constructor() {
        if (Experience.instance) return Experience.instance
        Experience.instance = this

        this.canvas = document.getElementById('game-canvas')
        this.scene = new THREE.Scene()
        this.clock = new THREE.Clock()
        this.delta = 0
        this.elapsed = 0
        this.started = false

        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: Math.min(window.devicePixelRatio, 1.5)
        }

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        })
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(this.sizes.pixelRatio)
        this.renderer.shadowMap.enabled = false
        this.renderer.toneMapping = THREE.NoToneMapping
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.renderer.setClearColor(0x87CEEB)

        // Light fog
        this.scene.fog = new THREE.Fog(0xC8E6FF, 80, 350)

        // Resources
        this.resources = new Resources()
        this.resources.addEventListener('ready', () => {
            console.log('Resources ready!')
            this.init()
        })
        
        this.simulateLoading()
    }

    init() {
        try {
            this.yearZones = new YearZones()
            this.world = new World()
            this.car = new Car()
            this.camera = new Camera()
            this.controls = new Controls()
            this.billboards = new Billboards()
            this.audioManager = new AudioManager()
            this.uiManager = new UIManager()

            window.addEventListener('resize', () => this.resize())
            console.log('Subsystems initialized successfully')
        } catch (error) {
            console.error('Error during subsystem initialization:', error)
        }
    }

    simulateLoading() {
        const bar = document.getElementById('loading-bar')
        const status = document.getElementById('loading-status')
        const steps = [
            { p: 20, t: 'Building road...' },
            { p: 50, t: 'Placing billboards...' },
            { p: 80, t: 'Preparing Vikas ka Vahan...' },
            { p: 100, t: 'Ready!' },
        ]
        let i = 0
        const advance = () => {
            if (i >= steps.length) { 
                // Final check before showing start screen
                if (this.resources.loaded >= this.resources.toLoad) {
                    console.log('Showing start screen')
                    this.showStartScreen()
                } else {
                    console.log('Waiting for resources...', this.resources.loaded, '/', this.resources.toLoad)
                    setTimeout(advance, 500)
                }
                return 
            }
            bar.style.width = steps[i].p + '%'
            status.textContent = steps[i].t
            i++
            setTimeout(advance, 300)
        }
        setTimeout(advance, 400)
    }

    showStartScreen() {
        const loadingScreen = document.getElementById('loading-screen')
        const startScreen = document.getElementById('start-screen')
        
        loadingScreen.classList.add('fade-out')
        setTimeout(() => {
            loadingScreen.classList.add('hidden')
            startScreen.classList.remove('hidden')
            document.getElementById('start-button')?.addEventListener('click', () => this.startGame())
        }, 800)
    }

    startGame() {
        document.getElementById('start-screen').classList.add('fade-out')
        setTimeout(() => {
            document.getElementById('start-screen').classList.add('hidden')
            document.getElementById('hud').classList.remove('hidden')
            document.getElementById('timeline-bar').classList.remove('hidden')
            document.getElementById('audio-toggle').classList.remove('hidden')
            this.started = true
            this.audioManager?.start()
            this.tick()
        }, 600)
    }

    resize() {
        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        if (this.camera) this.camera.resize()
    }

    tick() {
        if (!this.started) return
        this.delta = Math.min(this.clock.getDelta(), 0.05)
        this.elapsed = this.clock.getElapsedTime()

        if (this.controls) this.controls.update(this.delta)
        if (this.car) this.car.update(this.delta, this.elapsed)
        if (this.camera) this.camera.update(this.delta)
        if (this.world) this.world.update(this.delta, this.elapsed)
        if (this.billboards) this.billboards.update(this.car.position.z)
        if (this.yearZones) this.yearZones.update(this.car.position.z)
        if (this.audioManager) this.audioManager.update(this.delta, this.car)
        if (this.uiManager) this.uiManager.update(this.delta)

        // DETECT END OF ROAD
        if (this.car.position.z < -2750 && !this.ended) {
            this.showEndScreen()
        }

        this.renderer.render(this.scene, this.camera.instance)
        requestAnimationFrame(() => this.tick())
    }

    showEndScreen() {
        this.ended = true
        document.getElementById('end-screen')?.classList.remove('hidden')
        document.getElementById('hud')?.classList.add('fade-out')
        document.getElementById('timeline-bar')?.classList.add('fade-out')
        
        // Disable driving
        this.car.maxSpeed = 0
        this.car.speed *= 0.1

        document.getElementById('restart-button')?.addEventListener('click', () => {
            window.location.reload()
        })
    }
}
