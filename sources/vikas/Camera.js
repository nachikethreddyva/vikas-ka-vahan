/**
 * Camera — Third-person follow camera with smooth interpolation
 * Optimized for distant visibility (2500 far plane).
 * STICKY: Fixed distance lag and car "running away" issue.
 */

import * as THREE from 'three'
import { Experience } from './Experience.js'

export class Camera {
    constructor() {
        this.experience = Experience.getInstance()

        this.instance = new THREE.PerspectiveCamera(
            50,
            this.experience.sizes.width / this.experience.sizes.height,
            0.5, 
            2500 
        )

        // TIGHTER Offset - Closer to car to prevent "running away"
        this.cameraDistance = 12
        this.cameraHeight = 5
        this.lookAheadDistance = 10
        this.lookHeight = 1.0

        this.smoothedPosition = new THREE.Vector3(0, this.cameraHeight, this.cameraDistance)
        this.smoothedTarget = new THREE.Vector3(0, 0, 0)
        this.desiredPosition = new THREE.Vector3()
        this.desiredTarget = new THREE.Vector3()

        // HIGH AGGRESSIVE EASING: Eliminates lag
        this.positionEasing = 9.0
        this.targetEasing = 12.0

        // Subtle organic sway
        this.swayAmount = 0.2
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

        // Clamped distance: it won't pull back too far even at speed
        const currentDist = this.cameraDistance + speedRatio * 3
        const currentHeight = this.cameraHeight - speedRatio * 1.0

        // POSITION: Fixed tight follow
        this.desiredPosition.set(
            carPos.x - forwardX * currentDist,
            carPos.y + currentHeight,
            carPos.z - forwardZ * currentDist
        )

        // TARGET: Look slightly ahead
        this.desiredTarget.set(
            carPos.x + forwardX * this.lookAheadDistance,
            carPos.y + this.lookHeight,
            carPos.z + forwardZ * this.lookAheadDistance
        )

        // Apply high-speed easing for zero lag
        const posLerp = 1 - Math.exp(-this.positionEasing * delta)
        this.smoothedPosition.lerp(this.desiredPosition, posLerp)

        const targetLerp = 1 - Math.exp(-this.targetEasing * delta)
        this.smoothedTarget.lerp(this.desiredTarget, targetLerp)

        // Sway
        const elapsed = this.experience.elapsed
        const swayX = Math.sin(elapsed * this.swaySpeed) * this.swayAmount * (1 + speedRatio)
        const swayY = Math.cos(elapsed * this.swaySpeed * 0.7) * this.swayAmount * 0.5

        // Speed FOV Punch (subtle)
        this.instance.fov = 50 + speedRatio * 10
        this.instance.updateProjectionMatrix()

        this.instance.position.set(
            this.smoothedPosition.x + swayX,
            this.smoothedPosition.y + swayY,
            this.smoothedPosition.z
        )
        this.instance.lookAt(this.smoothedTarget)
    }
}
