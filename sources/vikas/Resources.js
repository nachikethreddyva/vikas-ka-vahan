import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export class Resources extends THREE.EventDispatcher {
    constructor() {
        super()

        this.items = {}
        this.toLoad = 0
        this.loaded = 0

        this.loader = new GLTFLoader()
        const dracoLoader = new DRACOLoader()
        // Use a more stable CDN or local path if possible
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
        this.loader.setDRACOLoader(dracoLoader)

        this.queue = [
            { name: 'carModel', type: 'glb', path: '/models/car.glb' },
            { name: 'antennaModel', type: 'glb', path: '/models/antenna.glb' }
        ]

        this.startLoading()
    }

    startLoading() {
        this.toLoad = this.queue.length
        if (this.toLoad === 0) {
            this.dispatchEvent({ type: 'ready' })
            return
        }

        for (const source of this.queue) {
            console.log(`Loading: ${source.path}`)
            if (source.type === 'glb') {
                this.loader.load(
                    source.path, 
                    (file) => {
                        console.log(`Loaded: ${source.path}`)
                        this.sourceLoaded(source, file)
                    },
                    undefined,
                    (error) => {
                        console.error(`Error loading resource ${source.path}:`, error)
                        // Even on error, increment so it doesn't hang
                        this.loaded++
                        if (this.loaded === this.toLoad) {
                            this.dispatchEvent({ type: 'ready' })
                        }
                    }
                )
            }
        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file
        this.loaded++

        if (this.loaded === this.toLoad) {
            this.dispatchEvent({ type: 'ready' })
        }
    }
}
