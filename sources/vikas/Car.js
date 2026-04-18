/**
 * Car — "Vikas ka Vahan" using GLTF model.
 * Fixes: Orientation and Banner positioning.
 */

import * as THREE from 'three'
import { Experience } from './Experience.js'

export class Car {
    constructor() {
        this.experience = Experience.getInstance()
        this.resources = this.experience.resources

        this.position = new THREE.Vector3(0, 0, 10)
        this.rotation = 0
        this.speed = 0
        this.steerAngle = 0

        this.maxSpeed = 20 // Slower for better reading of milestones
        this.acceleration = 10
        this.brakeForce = 18
        this.friction = 6
        this.steerSpeed = 2.4
        this.steerReturn = 3.5
        this.maxSteerAngle = Math.PI * 0.18
        this.turnRate = 1.4
        this.roadHalfWidth = 7
        
        this.group = new THREE.Group()
        this.experience.scene.add(this.group)

        this.setModel()
        this.createBanner()
    }

    setModel() {
        if (!this.resources.items.carModel) return

        this.model = this.resources.items.carModel.scene.clone()
        this.model.scale.setScalar(1.6)
        this.model.rotation.y = Math.PI / 2
        this.group.add(this.model)

        this.wheels = []
        const wheelPositions = [
            { x: 0.75, z: -0.90 }, // Front Right
            { x: -0.75, z: -0.90 }, // Front Left
            { x: 0.75, z: 0.90 },  // Back Right
            { x: -0.75, z: 0.90 }   // Back Left
        ]

        let wheelContainer = null
        this.model.traverse((child) => {
            if (child.name.toLowerCase().includes('wheelcontainer')) {
                wheelContainer = child
                wheelContainer.visible = false // Hide original template
            }
            if (child.isMesh) {
                child.castShadow = false
                child.receiveShadow = false
                if (child.material) child.material.side = THREE.DoubleSide
            }
        })

        if (wheelContainer) {
            for (let i = 0; i < 4; i++) {
                const wheel = wheelContainer.clone(true)
                wheel.visible = true
                wheel.position.set(wheelPositions[i].x, 0, wheelPositions[i].z)
                
                // Flip left side wheels
                if (i === 1 || i === 3) wheel.rotation.y = Math.PI
                
                this.model.add(wheel)
                
                // Find the cylinder inside for rotation
                let cylinder = null
                wheel.traverse(c => { if (c.name.toLowerCase().includes('cylinder')) cylinder = c })
                this.wheels.push({ container: wheel, cylinder: cylinder })
            }
        }
    }

    createBanner() {
        const canvas = document.createElement('canvas')
        canvas.width = 1024
        canvas.height = 256
        const ctx = canvas.getContext('2d')
        
        ctx.fillStyle = '#111111' // Dark charcoal
        ctx.roundRect(0, 0, 1024, 256, 40)
        ctx.fill()
        
        ctx.strokeStyle = '#FF9933' // Saffron border
        ctx.lineWidth = 14
        ctx.roundRect(10, 10, 1004, 236, 32)
        ctx.stroke()

        ctx.font = 'bold 88px "Outfit", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#FF9933' // Saffron
        ctx.fillText('VIKAS KA VAHAN', 512, 128)

        const texture = new THREE.CanvasTexture(canvas)
        texture.minFilter = THREE.LinearFilter
        
        const bannerGeo = new THREE.PlaneGeometry(2.8, 0.7)
        const bannerMat = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            side: THREE.DoubleSide
        })
        this.banner = new THREE.Mesh(bannerGeo, bannerMat)
        
        // Positioned higher to avoid overlap
        this.banner.position.y = 3.2
        this.banner.position.z = 0
        this.group.add(this.banner)
    }

    update(delta, elapsed) {
        const controls = this.experience.controls
        if (!controls) return
        const keys = controls.keys

        if (keys.forward) {
            this.speed += this.acceleration * delta
        } else if (keys.backward) {
            this.speed -= this.brakeForce * delta
        } else {
            if (Math.abs(this.speed) > 0.1) {
                this.speed -= Math.sign(this.speed) * this.friction * delta
            } else {
                this.speed = 0
            }
        }
        this.speed = Math.max(-this.maxSpeed * 0.4, Math.min(this.maxSpeed, this.speed))

        if (keys.left) {
            this.steerAngle += this.steerSpeed * delta
        } else if (keys.right) {
            this.steerAngle -= this.steerSpeed * delta
        } else {
            if (Math.abs(this.steerAngle) > 0.01) {
                this.steerAngle -= Math.sign(this.steerAngle) * this.steerReturn * delta
            } else {
                this.steerAngle = 0
            }
        }
        this.steerAngle = Math.max(-this.maxSteerAngle, Math.min(this.maxSteerAngle, this.steerAngle))

        const speedRatio = this.speed / this.maxSpeed
        this.rotation += this.steerAngle * this.turnRate * speedRatio * delta

        this.position.x += -Math.sin(this.rotation) * this.speed * delta
        this.position.z += -Math.cos(this.rotation) * this.speed * delta

        this.position.x = Math.max(-this.roadHalfWidth, Math.min(this.roadHalfWidth, this.position.x))
        
        const yearZones = this.experience.yearZones
        if (yearZones) {
            const zones = yearZones.zones
            this.position.z = Math.max(
                zones[zones.length - 1].zEnd - 10,
                Math.min(zones[0].zStart + 30, this.position.z)
            )
        }

        this.group.position.set(this.position.x, 0.45, this.position.z)
        this.group.rotation.y = this.rotation

        // Wheels update
        const rotationDelta = this.speed * delta * 2.6
        for (let i = 0; i < this.wheels.length; i++) {
            const wheel = this.wheels[i]
            if (wheel.cylinder) {
                // Exact axle rotation from folio-2025:
                if (i === 0 || i === 2) wheel.cylinder.rotation.z += rotationDelta
                else wheel.cylinder.rotation.z -= rotationDelta
            }
            
            // Steering rotation for front wheels
            if (i < 2) {
                wheel.container.rotation.y = (i === 1 ? Math.PI : 0) + this.steerAngle * 0.8
            }
        }

        // Banner hover animation - higher to avoid overlap
        this.banner.position.y = 3.5 + Math.sin(elapsed * 2) * 0.06
    }
}
