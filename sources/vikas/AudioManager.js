/**
 * AudioManager — Web Audio API powered sound system
 * Ambient zone tracks, engine sound, UI sounds, and low-pass filter evolution.
 */

import { Experience } from './Experience.js'

export class AudioManager {
    constructor() {
        this.experience = Experience.getInstance()
        this.ctx = null
        this.started = false
        this.muted = false
        this.masterGain = null

        // Nodes
        this.engineOsc = null
        this.engineGain = null
        this.ambientOsc = null
        this.ambientGain = null
        this.filterNode = null

        // Secondary ambient oscillators for richer sound
        this.ambientOsc2 = null
        this.ambientOsc3 = null

        // UI
        this.setupMuteToggle()
    }

    setupMuteToggle() {
        const btn = document.getElementById('audio-toggle')
        const iconOn = document.getElementById('audio-icon-on')
        const iconOff = document.getElementById('audio-icon-off')

        btn?.addEventListener('click', () => {
            this.muted = !this.muted
            if (this.masterGain) {
                this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 1, this.ctx.currentTime, 0.1)
            }
            iconOn.classList.toggle('hidden', this.muted)
            iconOff.classList.toggle('hidden', !this.muted)
        })
    }

    start() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)()

            // Master gain
            this.masterGain = this.ctx.createGain()
            this.masterGain.gain.value = 1
            this.masterGain.connect(this.ctx.destination)

            // Global low-pass filter (starts muffled in 2013)
            this.filterNode = this.ctx.createBiquadFilter()
            this.filterNode.type = 'lowpass'
            this.filterNode.frequency.value = 400
            this.filterNode.Q.value = 1
            this.filterNode.connect(this.masterGain)

            // Engine sound (sawtooth osc tied to speed)
            this.engineOsc = this.ctx.createOscillator()
            this.engineOsc.type = 'sawtooth'
            this.engineOsc.frequency.value = 60
            this.engineGain = this.ctx.createGain()
            this.engineGain.gain.value = 0
            this.engineOsc.connect(this.engineGain)
            this.engineGain.connect(this.filterNode)
            this.engineOsc.start()

            // Ambient drone (base tone)
            this.ambientOsc = this.ctx.createOscillator()
            this.ambientOsc.type = 'sine'
            this.ambientOsc.frequency.value = 80
            this.ambientGain = this.ctx.createGain()
            this.ambientGain.gain.value = 0.06
            this.ambientOsc.connect(this.ambientGain)
            this.ambientGain.connect(this.filterNode)
            this.ambientOsc.start()

            // Second ambient (subtle overtone)
            this.ambientOsc2 = this.ctx.createOscillator()
            this.ambientOsc2.type = 'triangle'
            this.ambientOsc2.frequency.value = 120
            const ambGain2 = this.ctx.createGain()
            ambGain2.gain.value = 0.03
            this.ambientOsc2.connect(ambGain2)
            ambGain2.connect(this.filterNode)
            this.ambientOsc2.start()

            // Third ambient (very subtle)
            this.ambientOsc3 = this.ctx.createOscillator()
            this.ambientOsc3.type = 'sine'
            this.ambientOsc3.frequency.value = 220
            const ambGain3 = this.ctx.createGain()
            ambGain3.gain.value = 0.015
            this.ambientOsc3.connect(ambGain3)
            ambGain3.connect(this.filterNode)
            this.ambientOsc3.start()

            this.started = true
        } catch (e) {
            console.warn('AudioManager: Web Audio not available', e)
        }
    }

    playInteract() {
        if (!this.started || this.muted) return
        try {
            // Short "ping" sound
            const osc = this.ctx.createOscillator()
            osc.type = 'sine'
            osc.frequency.value = 880

            const gain = this.ctx.createGain()
            gain.gain.value = 0.15
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3)

            osc.connect(gain)
            gain.connect(this.masterGain) // skip filter for UI sounds
            osc.start()
            osc.stop(this.ctx.currentTime + 0.3)
        } catch (e) { /* silent */ }
    }

    playProximityPing() {
        if (!this.started || this.muted) return
        try {
            const osc = this.ctx.createOscillator()
            osc.type = 'sine'
            osc.frequency.value = 660

            const gain = this.ctx.createGain()
            gain.gain.value = 0.05
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15)

            osc.connect(gain)
            gain.connect(this.masterGain)
            osc.start()
            osc.stop(this.ctx.currentTime + 0.15)
        } catch (e) { /* silent */ }
    }

    update(delta, car) {
        if (!this.started) return

        const speed = Math.abs(car.speed)
        const speedRatio = speed / car.maxSpeed

        // Engine pitch + volume tied to speed
        const targetFreq = 60 + speedRatio * 180
        const targetVol = Math.min(0.12, speedRatio * 0.15)

        this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1)
        this.engineGain.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.1)

        // Low-pass filter evolution based on year zone
        const params = this.experience.yearZones.getInterpolatedParams(car.position.z)
        this.filterNode.frequency.setTargetAtTime(params.filterFrequency, this.ctx.currentTime, 0.5)

        // Ambient tone evolution — richer in later zones
        const ambientBase = 60 + params.saturation * 60
        this.ambientOsc.frequency.setTargetAtTime(ambientBase, this.ctx.currentTime, 1)
        this.ambientGain.gain.setTargetAtTime(0.04 + params.saturation * 0.04, this.ctx.currentTime, 0.5)
    }
}
