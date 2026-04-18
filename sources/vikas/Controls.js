/**
 * Controls — Keyboard input handler for car movement
 * WASD / Arrow keys with smooth acceleration and friction.
 */

import { Experience } from './Experience.js'

export class Controls {
    constructor() {
        this.experience = Experience.getInstance()

        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            interact: false,
        }

        this.interactPressed = false // one-shot

        window.addEventListener('keydown', (e) => this.onKeyDown(e))
        window.addEventListener('keyup', (e) => this.onKeyUp(e))

        // Touch controls for mobile
        this.setupTouchControls()
    }

    onKeyDown(e) {
        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.keys.forward = true; break
            case 'KeyS':
            case 'ArrowDown':
                this.keys.backward = true; break
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = true; break
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = true; break
            case 'KeyE':
                if (!this.keys.interact) {
                    this.keys.interact = true
                    this.interactPressed = true
                }
                break
        }
    }

    onKeyUp(e) {
        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.keys.forward = false; break
            case 'KeyS':
            case 'ArrowDown':
                this.keys.backward = false; break
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = false; break
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = false; break
            case 'KeyE':
                this.keys.interact = false; break
        }
    }

    consumeInteract() {
        if (this.interactPressed) {
            this.interactPressed = false
            return true
        }
        return false
    }

    setupTouchControls() {
        // Simple touch: tap left = steer left, tap right = steer right
        // Hold bottom = forward, swipe down = backward
        let touchActive = false
        let touchStartX = 0
        let touchStartY = 0

        this.canvas = this.experience.canvas

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault()
            touchActive = true
            const touch = e.touches[0]
            touchStartX = touch.clientX
            touchStartY = touch.clientY

            // Auto forward on touch
            this.keys.forward = true
        }, { passive: false })

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault()
            if (!touchActive) return
            const touch = e.touches[0]
            const dx = touch.clientX - touchStartX
            const halfWidth = window.innerWidth * 0.15

            this.keys.left = dx < -halfWidth
            this.keys.right = dx > halfWidth
        }, { passive: false })

        this.canvas.addEventListener('touchend', (e) => {
            touchActive = false
            this.keys.forward = false
            this.keys.left = false
            this.keys.right = false
        })
    }

    update(delta) {
        // Controls state is consumed by Car.update
    }
}
