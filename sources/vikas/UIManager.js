/**
 * UIManager — HUD updates, timeline, zone name transitions
 */

import { Experience } from './Experience.js'

export class UIManager {
    constructor() {
        this.experience = Experience.getInstance()

        this.yearEl = document.getElementById('current-year')
        this.yearProgressEl = document.getElementById('year-progress')
        this.speedEl = document.getElementById('speed-value')
        this.timelineFill = document.getElementById('timeline-fill')
        this.zoneNameDisplay = document.getElementById('zone-name-display')
        this.zoneNameText = document.getElementById('zone-name-text')

        this.lastDisplayedYear = 2013
        this.lastZoneIndex = -1
        this.zoneNameTimeout = null

        this.setupTimeline()

        // Listen for zone changes
        this.experience.yearZones.onZoneChange((zone, index) => {
            this.showZoneName(zone)
            this.updateTimelineMarkers(index)
        })
    }

    setupTimeline() {
        const zones = this.experience.yearZones.zones
        const labelsContainer = document.getElementById('timeline-labels')

        if (!labelsContainer) return

        for (let i = 0; i < zones.length; i++) {
            const span = document.createElement('span')
            span.textContent = zones[i].yearStart
            span.dataset.index = i
            if (i === 0) span.classList.add('active')
            labelsContainer.appendChild(span)
        }
    }

    updateTimelineMarkers(activeIndex) {
        const labels = document.querySelectorAll('#timeline-labels span')
        labels.forEach((span) => {
            const idx = parseInt(span.dataset.index)
            span.classList.toggle('active', idx <= activeIndex)
        })
    }

    showZoneName(zone) {
        if (!this.zoneNameDisplay || !this.zoneNameText) return

        // Clear any existing timeout
        if (this.zoneNameTimeout) {
            clearTimeout(this.zoneNameTimeout)
        }

        this.zoneNameText.textContent = zone.label
        // Force reflow to restart animation
        this.zoneNameText.style.animation = 'none'
        this.zoneNameText.offsetHeight
        this.zoneNameText.style.animation = 'zoneNameFade 3s ease forwards'

        this.zoneNameDisplay.classList.remove('hidden')

        this.zoneNameTimeout = setTimeout(() => {
            this.zoneNameDisplay.classList.add('hidden')
        }, 3200)

        // Play proximity ping
        this.experience.audioManager?.playProximityPing()
    }

    update(delta) {
        const yearZones = this.experience.yearZones
        const car = this.experience.car

        // Year display
        const params = yearZones.getInterpolatedParams(car.position.z)
        const displayYear = params.yearStart + Math.floor((params.yearEnd - params.yearStart) * params.zoneProgress)
        const yearToShow = Math.max(params.yearStart, Math.min(params.yearEnd, displayYear))

        if (this.yearEl) {
            this.yearEl.textContent = yearToShow || params.yearStart
        }

        // Year progress within zone
        if (this.yearProgressEl) {
            this.yearProgressEl.style.width = (params.zoneProgress * 100) + '%'
        }

        // Speed display
        if (this.speedEl) {
            const displaySpeed = Math.abs(Math.round(car.speed * 2.5))
            this.speedEl.textContent = displaySpeed
        }

        // Timeline progress
        if (this.timelineFill) {
            this.timelineFill.style.width = (yearZones.progress * 100) + '%'
        }
    }
}
