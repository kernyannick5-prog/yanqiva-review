// Animations-Features von framer-motion (m-Komponenten) kommen als eigener Chunk nach dem ersten Paint; Hero und Prerender brauchen sie nicht.
export const loadMotionFeatures = () => import('./motionFeatures').then((m) => m.default)
