/**
 * Billboards — Premium interactive growth metrics.
 * Now with full Modal Interaction (E / Click)
 */

import * as THREE from 'three'
import { Experience } from './Experience.js'

export class Billboards {
    constructor() {
        this.experience = Experience.getInstance()
        this.items = []
        this.focusedBillboard = null
        this.modalOpen = false

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()

        this.createAllBillboards()

        // Click Listener
        window.addEventListener('mousedown', (e) => this.onClick(e))
        
        // Modal DOM elements
        this.modal = document.getElementById('modal')
        this.modalClose = document.getElementById('modal-close')
        this.modalClose?.addEventListener('click', () => this.closeModal())
    }

    createAllBillboards() {
        if (!this.experience.yearZones) return
        const zones = this.experience.yearZones.zones
        if (!zones) return
        
        for (const zone of zones) {
            const zoneLength = zone.zStart - zone.zEnd
            for (const bb of zone.billboards) {
                const z = zone.zStart - bb.offset * zoneLength
                const x = bb.side === 'left' ? -18 : 18 
                this.items.push(this.createBillboard(bb, x, z, zone))
            }
        }
    }

    createBillboard(data, x, z, zone) {
        const group = new THREE.Group()
        group.position.set(x, 0, z)
        this.experience.scene.add(group)

        const boardWidth = 16 
        const boardHeight = 11
        const postHeight = 10

        // Robust Post - Moved behind the panel
        const postGeo = new THREE.BoxGeometry(0.8, postHeight, 0.8)
        const postMat = new THREE.MeshLambertMaterial({ color: 0x222222 })
        const post = new THREE.Mesh(postGeo, postMat)
        post.position.set(0, postHeight / 2, -0.6) 
        group.add(post)

        // Glass Frame (The Panel)
        const boardGeo = new THREE.BoxGeometry(boardWidth, boardHeight, 0.3)
        const boardMat = new THREE.MeshLambertMaterial({ color: 0x1E293B })
        const board = new THREE.Mesh(boardGeo, boardMat)
        board.position.y = postHeight
        group.add(board)

        // Canvas high-res content
        const canvas = document.createElement('canvas')
        canvas.width = 1024
        canvas.height = 1024
        const ctx = canvas.getContext('2d')

        const grad = ctx.createLinearGradient(0, 0, 0, 1024)
        grad.addColorStop(0, '#FFFFFF')
        grad.addColorStop(1, '#F1F5F9')
        ctx.fillStyle = grad
        ctx.fillRect(10, 10, 1004, 1004)

        ctx.fillStyle = '#FF9933' 
        ctx.fillRect(10, 10, 1004, 30)
        ctx.fillStyle = '#128807'
        ctx.fillRect(10, 984, 1004, 30)

        ctx.font = '220px serif'
        ctx.textAlign = 'center'
        ctx.fillText(data.icon, 512, 300)

        ctx.font = 'bold 56px "Outfit", sans-serif' // Slightly smaller for safety
        ctx.fillStyle = '#1E293B'
        const words = data.text.split(' ')
        let line = ''
        let lineY = 480
        for (const word of words) {
            const testLine = line + word + ' '
            if (ctx.measureText(testLine).width > 850 && line !== '') {
                ctx.fillText(line.trim(), 512, lineY)
                line = word + ' '
                lineY += 75
            } else {
                line = testLine
            }
        }
        ctx.fillText(line.trim(), 512, lineY)

        // STAT - Now with Wrapping & Auto-scaling
        ctx.font = 'bold 74px "Space Grotesk", sans-serif'
        ctx.fillStyle = '#EA580C' 
        const statWords = data.stat.split(' ')
        let statLine = ''
        let statY = lineY + 150
        for (const word of statWords) {
            const testLine = statLine + word + ' '
            if (ctx.measureText(testLine).width > 850 && statLine !== '') {
                ctx.fillText(statLine.trim(), 512, statY)
                statLine = word + ' '
                statY += 90
            } else {
                statLine = testLine
            }
        }
        ctx.fillText(statLine.trim(), 512, statY)

        const texture = new THREE.CanvasTexture(canvas)
        texture.minFilter = THREE.LinearFilter

        const faceGeo = new THREE.PlaneGeometry(boardWidth - 0.5, boardHeight - 0.5)
        const faceMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: true })
        const face = new THREE.Mesh(faceGeo, faceMat)
        face.position.set(0, postHeight, 0.16)
        group.add(face)

        const glowGeo = new THREE.PlaneGeometry(boardWidth + 1.5, boardHeight + 1.5)
        const glowMat = new THREE.MeshBasicMaterial({ 
            color: 0xFF9933, 
            transparent: true, 
            opacity: 0.15,
            side: THREE.BackSide
        })
        const glow = new THREE.Mesh(glowGeo, glowMat)
        glow.position.set(0, postHeight, -0.4)
        group.add(glow)

        return { group, board, face, data, glow, zone }
    }

    onClick(e) {
        if (this.modalOpen) return

        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance)
        
        const meshes = this.items.map(item => item.board)
        const intersects = this.raycaster.intersectObjects(meshes)

        if (intersects.length > 0) {
            const clickedBoard = intersects[0].object
            const item = this.items.find(i => i.board === clickedBoard)
            if (item) this.openModal(item)
        }
    }

    openModal(item) {
        if (this.modalOpen) return
        this.modalOpen = true
        
        document.getElementById('modal-icon').textContent = item.data.icon
        document.getElementById('modal-title').textContent = item.data.text
        document.getElementById('modal-stat').textContent = item.data.stat
        
        // Use the description from data, or fallback if not present
        const desc = item.data.desc || "A significant marker in India's developmental journey."
        document.getElementById('modal-description').textContent = desc

        // Special labeling for 2013 (Pre-Leadership Era)
        if (item.zone.yearStart === 2013) {
            document.getElementById('modal-substat').textContent = `State of the Nation: 2013`
        } else {
            document.getElementById('modal-substat').textContent = `Transformational Milestone: ${item.zone.yearStart}–${item.zone.yearEnd}`
        }

        this.modal.classList.remove('hidden')
        
        // Pause car
        this.experience.car.speed = 0
    }

    closeModal() {
        this.modalOpen = false
        this.modal.classList.add('hidden')
    }

    update(carZ) {
        if (this.modalOpen) {
            if (this.experience.controls.consumeInteract()) {
                this.closeModal()
            }
            return
        }

        let closestItem = null
        let minDistance = 30

        for (const item of this.items) {
            const distance = Math.abs(item.group.position.z - carZ)
            
            const focus = 1.0 - Math.min(1, distance / 25)
            const easedFocus = Math.pow(focus, 3) 

            const scale = 1.0 + easedFocus * 0.12
            item.group.scale.setScalar(scale)

            if (item.glow) {
                item.glow.material.opacity = 0.15 + easedFocus * 0.4
            }

            item.group.position.y = easedFocus * 0.5

            if (distance < minDistance) {
                minDistance = distance
                closestItem = item
            }
        }

        this.focusedBillboard = (minDistance < 15) ? closestItem : null

        if (this.focusedBillboard && this.experience.controls.consumeInteract()) {
            this.openModal(this.focusedBillboard)
        }
    }
}
