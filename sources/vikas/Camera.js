/**
 * Camera — Third-person follow camera with smooth interpolation
 * Optimized for distant visibility (2500 far plane).
 */

import * as THREE from 'three'
import { Experience } from './Experience.js'

export class Camera {
    constructor() {
        this.experience = Experience.getInstance()

        this.instance = new THREE.PerspectiveCamera(
            50,
            this.experience.sizes.width / this.experience.sizes.height,
            0.5, // Increased near for precision
            2500 // Increased far for milestones
        )

        // Third-person offset (camera sits behind & above car)
        this.cameraDistance = 16
        this.cameraHeight = 8
        this.lookAheadDistance = 12
        this.lookHeight = 1.5

        this.smoothedPosition = new THREE.Vector3(0, this.cameraHeight, this.cameraDistance)
        this.smoothedTarget = new THREE.Vector3(0, 0, 0)
        this.desiredPosition = new THREE.Vector3()
        this.desiredTarget = new THREE.Vector3()

        // Easing - Faster response to keep up with car
        this.positionEasing = 6.8
        this.targetEasing = 8.5

        // Slight sway
        this.swayAmount = 0.3
        this.swaySpeed = 0.5

        this.instance.position.copy(this.smoothedPosition)
        this.experience.scene.add(this.instance)
    }

    resize() {
        this.instance.aspect = this.experience.sizes.width / this.experience.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update(delta) {
        const car = this.experience.car
        if (!car) return

        const carPos = car.position
        const carRotY = car.rotation
        const speedRatio = car.speed / car.maxSpeed

        // Car's forward direction
        const forwardX = -Math.sin(carRotY)
        const forwardZ = -Math.cos(carRotY)

        // Dynamic distance and height based on speed
        const currentDist = this.cameraDistance + speedRatio * 4
        const currentHeight = this.cameraHeight - speedRatio * 1.5

        // Camera BEHIND car
        this.desiredPosition.set(
            carPos.x - forwardX * currentDist,
            carPos.y + currentHeight,
            carPos.z - forwardZ * currentDist
        )

        // Look target AHEAD of car
        this.desiredTarget.set(
            carPos.x + forwardX * this.lookAheadDistance,
            carPos.y + this.lookHeight,
            carPos.z + forwardZ * this.lookAheadDistance
        )

        // Smooth follow with delta-normalized easing
        const posLerp = 1 - Math.exp(-this.positionEasing * delta)
        this.smoothedPosition.lerp(this.desiredPosition, posLerp)

        const targetLerp = 1 - Math.exp(-this.targetEasing * delta)
        this.smoothedTarget.lerp(this.desiredTarget, targetLerp)

        // Organic sway
        const elapsed = this.experience.elapsed
        const swayX = Math.sin(elapsed * this.swaySpeed) * this.swayAmount * (1 + speedRatio)
        const swayY = Math.cos(elapsed * this.swaySpeed * 0.7) * this.swayAmount * 0.5

        // FOV Punch
        this.instance.fov = 50 + speedRatio * 15
        this.instance.updateProjectionMatrix()

        this.instance.position.set(
            this.smoothedPosition.x + swayX,
            this.smoothedPosition.y + swayY,
            this.smoothedPosition.z
        )
        this.instance.lookAt(this.smoothedTarget)
    }
}
