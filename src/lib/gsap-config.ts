// Improvement 1: Plugin registration at import time — any component that imports from here gets ScrollTrigger automatically registered, no per-component register call needed
// Improvement 2: lagSmoothing(0) disables GSAP's default frame-drop recovery — prevents GSAP from trying to "catch up" when it runs behind the Lenis-driven tick

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Disable lag compensation — Lenis drives the tick, GSAP must not compensate for perceived drops
gsap.ticker.lagSmoothing(0)

export { gsap, ScrollTrigger }
