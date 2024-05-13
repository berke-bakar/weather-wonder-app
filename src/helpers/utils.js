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
export function fetchWeatherResourceName(weatherCode, isDay = null) {
	console.log('Called Resource with code:', weatherCode);
	let adjustedWeatherCode = weatherCode
	const adjustedIsDay = isDay === null ? true : isDay
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
		case 80:
		case 81:
		case 82:
			adjustedWeatherCode = 61
			break
		case 85:
		case 86:
			adjustedWeatherCode = 71
			break
		case 99:
			adjustedWeatherCode = 96
			break
	}
	console.log('weather code:', weatherCode, adjustedWeatherCode, adjustedIsDay);
	return `/img/weather/code${adjustedWeatherCode}_${adjustedIsDay ? 'd' : 'n'}.svg`
}

export function fetchWeatherDescription(weatherCode) {
	console.log('Called Description with code:', weatherCode);
	switch (weatherCode) {
		case 0:
			return 'Clear Sky'
		case 1:
			return 'Mainly Clear'
		case 2:
			return 'Partly Cloudy'
		case 3:
			return 'Overcast'
		case 45:
			return 'Fog'
		case 48:
			return 'Rime Fog'
		case 51:
			return 'Drizzle (Light)'
		case 53:
			return 'Drizzle (Moderate)'
		case 55:
			return 'Drizzle (Dense)'
		case 56:
			return '❄️ Drizzle (Light)'
		case 57:
			return '❄️ Drizzle (Dense)'
		case 61:
			return 'Rain (Slight)'
		case 63:
			return 'Rain (Moderate)'
		case 65:
			return 'Rain (Heavy)'
		case 66:
			return '❄️ Rain (Slight)'
		case 67:
			return '❄️ Rain (Heavy)'
		case 71:
			return 'Snow (Slight)'
		case 73:
			return 'Snow (Moderate)'
		case 75:
			return 'Snow (Heavy)'
		case 77:
			return 'Snow grains'
		case 80:
			return 'Rain Showers (Slight)'
		case 81:
			return 'Rain Showers (Moderate)'
		case 82:
			return 'Rain Showers (Heavy)'
		case 85:
			return 'Snow Showers (Slight)'
		case 86:
			return 'Snow Showers (Heavy)'
		case 95:
			return 'Thunderstorm'
		case 96:
			return 'Thunderstorm & Hail (Slight)'
		case 99:
			return 'Thunderstorm & Hail (Heavy)'
	}

}
