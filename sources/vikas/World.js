/**
 * World — Bright, colorful late-afternoon environment
 * ALL MeshLambertMaterial (cheapest lit material), NO shadows, minimal draw calls.
 */

import * as THREE from 'three'
import { Experience } from './Experience.js'

export class World {
    constructor() {
        this.experience = Experience.getInstance()

        this.createSky()
        this.createLighting()
        this.createGround()
        this.createRoad()
        this.createEnvironment()

        this.experience.yearZones.onZoneChange((zone, index) => {
            this.onZoneChanged(zone, index)
        })
    }

    createSky() {
        // Big bright gradient sky
        const skyGeo = new THREE.SphereGeometry(300, 16, 12)
        this.skyUniforms = {
            topColor: { value: new THREE.Color(0x4A90D9) },     // warm blue
            bottomColor: { value: new THREE.Color(0xFFF0D4) },   // warm cream/golden horizon
            offset: { value: 10 },
            exponent: { value: 0.4 },
        }

        const skyMat = new THREE.ShaderMaterial({
            uniforms: this.skyUniforms,
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 wp = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = wp.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide,
            depthWrite: false,
        })

        this.sky = new THREE.Mesh(skyGeo, skyMat)
        this.experience.scene.add(this.sky)
    }

    createLighting() {
        // Bright warm ambient
        this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.9)
        this.experience.scene.add(this.ambientLight)

        // Golden afternoon sun - high intensity for 'pretty' look
        this.sunLight = new THREE.DirectionalLight(0xFFF4E0, 1.5)
        this.sunLight.position.set(40, 60, 30)
        this.experience.scene.add(this.sunLight)

        // Vibrant blue fill
        this.hemiLight = new THREE.HemisphereLight(0x00BFFF, 0x32CD32, 0.6)
        this.experience.scene.add(this.hemiLight)
    }

    createGround() {
        // Vibrant fresh green
        const groundGeo = new THREE.PlaneGeometry(600, 3200)
        const groundMat = new THREE.MeshLambertMaterial({ color: 0x32CD32 }) 
        this.ground = new THREE.Mesh(groundGeo, groundMat)
        this.ground.rotation.x = -Math.PI / 2
        this.ground.position.set(0, -0.1, -1400)
        this.experience.scene.add(this.ground)
    }

    createRoad() {
        const zones = this.experience.yearZones.zones
        const startZ = zones[0].zStart + 30
        const endZ = zones[zones.length - 1].zEnd - 30
        const roadLength = startZ - endZ
        const roadCenter = startZ - roadLength / 2

        // Main road — warm grey asphalt
        const roadGeo = new THREE.PlaneGeometry(16, roadLength)
        this.roadMat = new THREE.MeshLambertMaterial({ color: 0x666666 })
        this.road = new THREE.Mesh(roadGeo, this.roadMat)
        this.road.rotation.x = -Math.PI / 2
        this.road.position.set(0, 0.01, roadCenter)
        this.experience.scene.add(this.road)

        // Center dashed line
        const markMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
        const markGeo = new THREE.PlaneGeometry(0.2, 3)
        for (let z = startZ; z > endZ; z -= 20) {
            const mark = new THREE.Mesh(markGeo, markMat)
            mark.rotation.x = -Math.PI / 2
            mark.position.set(0, 0.02, z)
            this.experience.scene.add(mark)
        }

        // Orange edge lines
        const edgeMat = new THREE.MeshBasicMaterial({ color: 0xFF8C00 })
        const edgeGeo = new THREE.PlaneGeometry(0.2, roadLength)
        for (const xPos of [-7.8, 7.8]) {
            const edge = new THREE.Mesh(edgeGeo, edgeMat)
            edge.rotation.x = -Math.PI / 2
            edge.position.set(xPos, 0.02, roadCenter)
            this.experience.scene.add(edge)
        }

        // Sidewalks (warm beige)
        const sideGeo = new THREE.BoxGeometry(4, 0.25, roadLength)
        const sideMat = new THREE.MeshLambertMaterial({ color: 0xD2B48C })
        for (const xPos of [-10, 10]) {
            const side = new THREE.Mesh(sideGeo, sideMat)
            side.position.set(xPos, 0.12, roadCenter)
            this.experience.scene.add(side)
        }
    }

    createEnvironment() {
        const zones = this.experience.yearZones.zones
        const startZ = zones[0].zStart + 20
        const endZ = zones[zones.length - 1].zEnd - 20

        // ---- TREES (shared geos, Lambert material, spaced out) ----
        const trunkGeo = new THREE.CylinderGeometry(0.15, 0.25, 2.5, 5)
        const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 })
        const foliageGeo = new THREE.IcosahedronGeometry(1.5, 0)
        const foliageMats = [
            new THREE.MeshLambertMaterial({ color: 0x228B22 }),
            new THREE.MeshLambertMaterial({ color: 0x32CD32 }),
            new THREE.MeshLambertMaterial({ color: 0x006400 }),
        ]

        for (let z = startZ; z > endZ; z -= (25 + Math.random() * 20)) {
            for (const side of [-1, 1]) {
                if (Math.random() > 0.6) continue // skip some
                const xDist = 14 + Math.random() * 30

                const tree = new THREE.Group()
                const trunk = new THREE.Mesh(trunkGeo, trunkMat)
                trunk.position.y = 1.25
                tree.add(trunk)

                const foliage = new THREE.Mesh(foliageGeo, foliageMats[Math.floor(Math.random() * 3)])
                const scale = 0.8 + Math.random() * 0.7
                foliage.scale.setScalar(scale)
                foliage.position.y = 3.0 + scale * 0.5
                foliage.rotation.y = Math.random() * Math.PI
                tree.add(foliage)

                tree.position.set(side * xDist, 0, z)
                this.experience.scene.add(tree)
            }
        }

        // ---- LAMP POSTS (emissive orb only, very sparse) ----
        const poleMat = new THREE.MeshLambertMaterial({ color: 0x888888 })
        const poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 5, 4)
        const orbGeo = new THREE.SphereGeometry(0.2, 6, 6)
        const orbMat = new THREE.MeshBasicMaterial({ color: 0xFFDD88 })

        for (let z = startZ; z > endZ; z -= 80) {
            for (const side of [-1, 1]) {
                const post = new THREE.Group()
                const pole = new THREE.Mesh(poleGeo, poleMat)
                pole.position.y = 2.5
                post.add(pole)
                const orb = new THREE.Mesh(orbGeo, orbMat)
                orb.position.y = 5.2
                post.add(orb)
                post.position.set(side * 9, 0, z)
                this.experience.scene.add(post)
            }
        }

        // ---- ZONE ARCH MARKERS ----
        for (const zone of zones) {
            const marker = this.createZoneMarker(zone)
            marker.position.set(0, 0, zone.zStart)
            this.experience.scene.add(marker)
        }

        // ---- BUILDINGS (sparse, colorful, Lambert) ----
        const buildColors = [0x4A90D9, 0xE8A87C, 0xD4A5A5, 0x95E1D3, 0xF38181, 0xAA96DA, 0xFCBF49]
        for (let i = 0; i < zones.length; i++) {
            const zone = zones[i]
            const count = Math.floor(1 + i * 1.2)
            const zRange = zone.zStart - zone.zEnd
            for (let b = 0; b < count; b++) {
                const z = zone.zStart - (b / count) * zRange - Math.random() * 10
                const side = Math.random() > 0.5 ? 1 : -1
                const xDist = 28 + Math.random() * 35
                const height = 4 + i * 2 + Math.random() * (i * 1.5)
                const width = 2.5 + Math.random() * 3
                const depth = 2.5 + Math.random() * 3

                const buildGeo = new THREE.BoxGeometry(width, height, depth)
                const buildMat = new THREE.MeshLambertMaterial({
                    color: buildColors[(i + b) % buildColors.length]
                })
                const building = new THREE.Mesh(buildGeo, buildMat)
                building.position.set(side * xDist, height / 2, z)
                this.experience.scene.add(building)
            }
        }
    }

    createZoneMarker(zone) {
        const group = new THREE.Group()

        const archMat = new THREE.MeshLambertMaterial({ color: 0xFF6B2B })

        const pillarGeo = new THREE.BoxGeometry(0.5, 6, 0.5)
        const lp = new THREE.Mesh(pillarGeo, archMat)
        lp.position.set(-8.5, 3, 0)
        group.add(lp)
        const rp = new THREE.Mesh(pillarGeo, archMat)
        rp.position.set(8.5, 3, 0)
        group.add(rp)

        const beamGeo = new THREE.BoxGeometry(18, 0.5, 0.5)
        const beam = new THREE.Mesh(beamGeo, archMat)
        beam.position.set(0, 6.2, 0)
        group.add(beam)

        // Year label
        const canvas = document.createElement('canvas')
        canvas.width = 1024
        canvas.height = 256
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, 1024, 256)

        ctx.font = 'bold 80px "Outfit", sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#FFFFFF'
        ctx.shadowColor = 'rgba(255, 107, 43, 0.7)'
        ctx.shadowBlur = 14

        const yearText = zone.yearStart === zone.yearEnd
            ? `${zone.yearStart}`
            : `${zone.yearStart}–${zone.yearEnd}`
        ctx.fillText(yearText, 512, 110)

        ctx.font = '34px "Outfit", sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        ctx.shadowBlur = 0
        const subtitle = zone.label.split('—')[1]?.trim() || ''
        ctx.fillText(subtitle, 512, 180)

        const texture = new THREE.CanvasTexture(canvas)
        texture.minFilter = THREE.LinearFilter
        const labelMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
        })
        const label = new THREE.Mesh(new THREE.PlaneGeometry(12, 3), labelMat)
        label.position.set(0, 5, 0.3)
        group.add(label)

        return group
    }

    onZoneChanged(zone, index) {
        if (!this.experience.scene.fog) return

        // Smooth fog color transition
        this.animateColor(this.experience.scene.fog.color, zone.fogColor || 0xC8E6FF, 2)

        // Sky evolves per zone
        if (this.skyUniforms && zone.skyTop) this.animateColor(this.skyUniforms.topColor.value, zone.skyTop, 2)
        if (this.skyUniforms && zone.skyBottom) this.animateColor(this.skyUniforms.bottomColor.value, zone.skyBottom, 2)

        // Lighting intensity
        if (this.ambientLight) this.animateValue(this.ambientLight, 'intensity', zone.ambientIntensity || 0.8, 1.5)
        if (this.sunLight) this.animateValue(this.sunLight, 'intensity', zone.sunIntensity || 1.2, 1.5)

        // Road color evolves
        if (this.roadMat && zone.roadColor) this.animateColor(this.roadMat.color, zone.roadColor, 2)
    }

    animateValue(obj, prop, target, duration) {
        if (!obj || obj[prop] === undefined) return
        const start = obj[prop]
        const startTime = performance.now()
        const animate = () => {
            if (!this.experience.started) return
            const t = Math.min(1, (performance.now() - startTime) / 1000 / duration)
            obj[prop] = start + (target - start) * t * (2 - t)
            if (t < 1) requestAnimationFrame(animate)
        }
        animate()
    }

    animateColor(colorObj, targetHex, duration) {
        const target = new THREE.Color(targetHex)
        const sR = colorObj.r, sG = colorObj.g, sB = colorObj.b
        const startTime = performance.now()
        const animate = () => {
            const t = Math.min(1, (performance.now() - startTime) / 1000 / duration)
            const e = t * (2 - t)
            colorObj.r = sR + (target.r - sR) * e
            colorObj.g = sG + (target.g - sG) * e
            colorObj.b = sB + (target.b - sB) * e
            if (t < 1) requestAnimationFrame(animate)
        }
        animate()
    }

    update(delta, elapsed) {
        const carZ = this.experience.car.position.z
        this.sunLight.position.z = carZ + 20
        this.sky.position.z = carZ
        this.ground.position.z = carZ
    }
}
