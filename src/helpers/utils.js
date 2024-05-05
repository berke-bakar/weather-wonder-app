export function latLngToCartesian(lat, lng, globeRadius = 100) {
    // Converting lattitude and longitude to radians
    const phi = ((90 - lat) * Math.PI) / 180
    const theta = ((90 - lng) * Math.PI) / 180
    // Converting polar coordinates to Cartesian
    const x = (globeRadius + 0.5) * Math.sin(phi) * Math.cos(theta)
    const y = (globeRadius + 0.5) * Math.cos(phi)
    const z = (globeRadius + 0.5) * Math.sin(phi) * Math.sin(theta)

    return [x, y, z]
}

export function latLngToSpherical(lat, lng) {
    const phi = ((90 - lat) * Math.PI) / 180
    const theta = ((90 - lng) * Math.PI) / 180

    return [phi, theta]
}
