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

// Some weather codes are very similar to each other, in order to not use different icons
// for each we are adjusting them to use the same icons as 'adjusted' weather code
export function fetchWeatherResourceName(weatherCode, isDay) {
    let adjustedWeatherCode = weatherCode
    switch (weatherCode) {
        case 3:
            adjustedWeatherCode = 2
            break;
        case 48:
            adjustedWeatherCode = 45
            break;
        case 53:
        case 55:
            adjustedWeatherCode = 51
            break
        case 57:
            adjustedWeatherCode = 56
            break
        case 63:
        case 65:
            adjustedWeatherCode = 61
            break
        case 67:
            adjustedWeatherCode = 66
            break
        case 73:
        case 75:
            adjustedWeatherCode = 71
            break
        case 81:
        case 82:
            adjustedWeatherCode = 80
            break
        case 85:
        case 86:
            adjustedWeatherCode = 71
            break
        case 99:
            adjustedWeatherCode = 96
            break
    }
    return `/img/weather/code${adjustedWeatherCode}_${isDay ? 'd' : 'n'}.svg`
}
