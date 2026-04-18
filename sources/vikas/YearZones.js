/**
 * YearZones — Data model for year-based narrative zones
 * VIBRANT COLORS — progressing from golden afternoon to high-saturation daylight.
 */

export class YearZones {
    constructor() {
        this.currentZoneIndex = 0
        this.currentYear = 2013
        this.progress = 0
        this.zoneProgress = 0

        this.totalRoadLength = 2800
        this.startZ = 20

        this.zones = [
            {
                id: 'zone-2013',
                label: '2013 — Policy Paralysis',
                yearStart: 2013, yearEnd: 2013,
                zStart: 20, zEnd: -380,
                fogColor: 0xCFE8FF,
                ambientIntensity: 0.7,
                sunIntensity: 1.0,
                skyTop: 0x4A90D9, 
                skyBottom: 0xFFD39B, 
                roadColor: 0x606060,
                saturation: 0.6,
                filterFrequency: 450,
                billboards: [
                    { text: '2013: Policy Paralysis', stat: 'Governance at a Standstill', desc: 'A period of systemic stagnation where critical reforms were stalled for years, leaving India ranked among the "Fragile Five" global economies.', icon: '⛓️', side: 'left', offset: 0.2 },
                    { text: 'Double-Digit Inflation', stat: 'Cost of living: 10%+', desc: 'Soaring food and fuel prices cripped household budgets, with inflation persistently staying in the double digits.', icon: '📉', side: 'right', offset: 0.5 },
                    { text: 'Infrastructure Stagnation', stat: '$400B+ Stalled Capital', desc: 'Over ₹18 Lakh Crore worth of vital infrastructure projects were trapped in regulatory limbo and corruption scandals.', icon: '🚧', side: 'left', offset: 0.8 },
                ]
            },
            {
                id: 'zone-2014',
                label: '2014 — New Beginning',
                yearStart: 2014, yearEnd: 2014,
                zStart: -380, zEnd: -780,
                fogColor: 0xD6EFFF,
                ambientIntensity: 0.75,
                sunIntensity: 1.1,
                skyTop: 0x3A8EE6,
                skyBottom: 0xFFE4B5,
                roadColor: 0x656565,
                saturation: 0.7,
                filterFrequency: 900,
                billboards: [
                    { text: '2014: New Leadership Begins', stat: 'Historic mandate: 282 seats', desc: 'India elected a new government signaling the beginning of reform-driven governance.', icon: '🏛️', side: 'right', offset: 0.15 },
                    { text: 'From Inertia to Action', stat: 'First 100 days: 100+ decisions', desc: 'Swift executive action on pending decisions and clearances for stalled projects.', icon: '⚡', side: 'left', offset: 0.5 },
                    { text: 'Jan Andolan Begins', stat: '1.3 billion citizens mobilized', desc: 'People\'s movements like Swachh Bharat and Make in India created mass citizen participation.', icon: '🇮🇳', side: 'right', offset: 0.85 },
                ]
            },
            {
                id: 'zone-2015-16',
                label: '2015–2016 — Inclusion & Cleanup',
                yearStart: 2015, yearEnd: 2016,
                zStart: -780, zEnd: -1280,
                fogColor: 0xDEF1FF,
                ambientIntensity: 0.8,
                sunIntensity: 1.2,
                skyTop: 0x2E85E0,
                skyBottom: 0xFFF5E1,
                roadColor: 0x6A6A6A,
                saturation: 0.8,
                filterFrequency: 1800,
                billboards: [
                    { text: '56+ Crore Jan Dhan Accounts', stat: '₹2.3 lakh crore deposits', desc: 'The world\'s largest financial inclusion drive brought 560 million unbanked citizens into formal banking.', icon: '💳', side: 'left', offset: 0.1 },
                    { text: 'Financial Inclusion for All', stat: 'Insurance for ₹1/day', desc: 'PMJJBY and PMSBY provided life and accident insurance at nominal premiums.', icon: '🛡️', side: 'right', offset: 0.35 },
                    { text: 'Swachh Bharat: 11+ Crore Toilets', stat: '100% ODF villages', desc: 'Over 11 crore toilets built, eliminating open defecation.', icon: '🚽', side: 'left', offset: 0.55 },
                    { text: 'Digital Payments Rise', stat: 'UPI launched in 2016', desc: 'The Unified Payments Interface revolutionized India\'s digital payments landscape.', icon: '📱', side: 'right', offset: 0.8 },
                ]
            },
            {
                id: 'zone-2017-19',
                label: '2017–2019 — System Reforms',
                yearStart: 2017, yearEnd: 2019,
                zStart: -1280, zEnd: -1780,
                fogColor: 0xE5F4FF,
                ambientIntensity: 0.85,
                sunIntensity: 1.3,
                skyTop: 0x1E90FF,
                skyBottom: 0xFFFACD,
                roadColor: 0x707070,
                saturation: 0.9,
                filterFrequency: 4000,
                billboards: [
                    { text: '₹2.5 Lakh Crore Saved via DBT', stat: '₹2,73,000 crore saved', desc: 'Direct Benefit Transfer eliminated middlemen ensuring subsidies reach citizens directly.', icon: '💰', side: 'right', offset: 0.1 },
                    { text: 'GST: One Nation, One Market', stat: '₹1.87 lakh crore monthly', desc: 'GST unified India\'s fragmented indirect tax system into a single market.', icon: '📊', side: 'left', offset: 0.35 },
                    { text: 'IBC Strengthens Banking', stat: '₹3.16 lakh crore resolved', desc: 'The Insolvency and Bankruptcy Code transformed India\'s credit culture.', icon: '🏦', side: 'right', offset: 0.6 },
                    { text: '35 km Highways Built Daily', stat: '1.46 lakh km total', desc: 'India built highways at record pace transforming connectivity.', icon: '🛣️', side: 'left', offset: 0.85 },
                ]
            },
            {
                id: 'zone-2019-22',
                label: '2019–2022 — Crisis & Resilience',
                yearStart: 2019, yearEnd: 2022,
                zStart: -1780, zEnd: -2180,
                fogColor: 0xE8F6FF,
                ambientIntensity: 0.8,
                sunIntensity: 1.2,
                skyTop: 0x4169E1,
                skyBottom: 0xFFEFD5,
                roadColor: 0x757575,
                saturation: 0.85,
                filterFrequency: 3000,
                billboards: [
                    { text: '80+ Crore Got Free Ration', stat: '80 crore beneficiaries', desc: 'World\'s largest food security program during COVID-19.', icon: '🌾', side: 'left', offset: 0.1 },
                    { text: '₹3 Lakh Crore+ Support', stat: '₹3,07,000 crore direct', desc: 'Cash transfers provided immediate relief during the pandemic.', icon: '💸', side: 'right', offset: 0.3 },
                    { text: 'Atmanirbhar Bharat', stat: '₹20 lakh crore package', desc: 'A major package to make India self-reliant in critical sectors.', icon: '🏭', side: 'left', offset: 0.55 },
                    { text: 'PLI Boosts Manufacturing', stat: '₹1.97 lakh crore allocated', desc: 'Incentive schemes attracted global investments to India.', icon: '⚙️', side: 'right', offset: 0.8 },
                ]
            },
            {
                id: 'zone-2022-24',
                label: '2022–2024 — Infra & Digital Scale',
                yearStart: 2022, yearEnd: 2024,
                zStart: -2180, zEnd: -2530,
                fogColor: 0xECF8FF,
                ambientIntensity: 0.9,
                sunIntensity: 1.4,
                skyTop: 0x1E90FF,
                skyBottom: 0xFFF8DC,
                roadColor: 0x808080,
                saturation: 0.95,
                filterFrequency: 8000,
                billboards: [
                    { text: 'UPI Revolution', stat: '14B+ monthly txns', desc: 'India\'s UPI — the world\'s largest real-time digital payment system.', icon: '📲', side: 'right', offset: 0.15 },
                    { text: 'Mobile Manufacturing Hub', stat: '#2 global manufacturer', desc: 'India became the world\'s second-largest mobile manufacturer.', icon: '📱', side: 'left', offset: 0.4 },
                    { text: 'Expressways & Corridors', stat: '6 new expressways', desc: 'Major expressways transformed India\'s logistics backbone.', icon: '🛤️', side: 'right', offset: 0.65 },
                    { text: 'Exports Reach $820B+', stat: '$820 billion in 2024', desc: 'Growth in competitive trade and diversification.', icon: '🌍', side: 'left', offset: 0.9 },
                ]
            },
            {
                id: 'zone-2024-26',
                label: '2024–2026 — Aspirational India',
                yearStart: 2024, yearEnd: 2026,
                zStart: -2530, zEnd: -2820,
                fogColor: 0xF0F9FF,
                ambientIntensity: 1.0,
                sunIntensity: 1.6,
                skyTop: 0x00BFFF,
                skyBottom: 0xFFFAF0,
                roadColor: 0x888888,
                saturation: 1.0,
                filterFrequency: 16000,
                billboards: [
                    { text: '1 Lakh+ Startups, 100+ Unicorns', stat: '3rd largest globally', desc: 'India\'s startup ecosystem exploded with 100+ unicorns.', icon: '🚀', side: 'left', offset: 0.1 },
                    { text: 'Semiconductor Mission', stat: '₹76,000 crore investment', desc: 'Aiming to become a global chip manufacturing hub.', icon: '🔬', side: 'right', offset: 0.3 },
                    { text: 'Nari Shakti: 33% Representation', stat: 'Parliamentary seats', desc: 'Women\'s Reservation Bill ensuring stronger political voice.', icon: '👩‍💼', side: 'left', offset: 0.55 },
                    { text: 'India as Global Leader', stat: 'G20 & Defence Exports', desc: 'Tech leadership and defence exports positioning India as a global power.', icon: '🌐', side: 'right', offset: 0.75 },
                    { text: 'Aspirational Bharat 🇮🇳', stat: 'Top 3 economy target', desc: 'Journey continues towards a developed nation by 2047.', icon: '🇮🇳', side: 'left', offset: 0.95 },
                ]
            },
        ]

        this.listeners = []
    }

    onZoneChange(callback) {
        this.listeners.push(callback)
    }

    getZoneAtZ(z) {
        for (let i = 0; i < this.zones.length; i++) {
            const zone = this.zones[i]
            if (z >= zone.zEnd && z <= zone.zStart) return { zone, index: i }
        }
        if (z > this.zones[0].zStart) return { zone: this.zones[0], index: 0 }
        const last = this.zones.length - 1
        return { zone: this.zones[last], index: last }
    }

    getInterpolatedParams(z) {
        const { zone, index } = this.getZoneAtZ(z)
        const zoneLength = zone.zStart - zone.zEnd
        const posInZone = (zone.zStart - z) / zoneLength
        const clampedPos = Math.max(0, Math.min(1, posInZone))

        const nextIndex = Math.min(index + 1, this.zones.length - 1)
        const nextZone = this.zones[nextIndex]

        const blendRegion = 0.15
        let blend = 0
        if (clampedPos > (1 - blendRegion) && index < this.zones.length - 1) {
            blend = (clampedPos - (1 - blendRegion)) / blendRegion
        }

        const lerpVal = (a, b, t) => a + (b - a) * t
        return {
            zone, index,
            zoneProgress: clampedPos,
            ambientIntensity: lerpVal(zone.ambientIntensity, nextZone.ambientIntensity, blend),
            sunIntensity: lerpVal(zone.sunIntensity, nextZone.sunIntensity, blend),
            saturation: lerpVal(zone.saturation, nextZone.saturation, blend),
            filterFrequency: lerpVal(zone.filterFrequency, nextZone.filterFrequency, blend),
            yearStart: zone.yearStart,
            yearEnd: zone.yearEnd,
        }
    }

    update(carZ) {
        const { index } = this.getZoneAtZ(carZ)
        if (index !== this.currentZoneIndex) {
            const oldIndex = this.currentZoneIndex
            this.currentZoneIndex = index
            for (const cb of this.listeners) {
                cb(this.zones[index], index, this.zones[oldIndex])
            }
        }

        const totalRange = this.zones[0].zStart - this.zones[this.zones.length - 1].zEnd
        this.progress = Math.max(0, Math.min(1, (this.zones[0].zStart - carZ) / totalRange))

        const params = this.getInterpolatedParams(carZ)
        this.currentYear = Math.floor(params.yearStart + (params.yearEnd - params.yearStart) * params.zoneProgress)
        if (this.currentYear < params.yearStart) this.currentYear = params.yearStart
    }
}
