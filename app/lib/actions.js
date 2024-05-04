'use server';

import axios from "axios";

export async function searchCity(prevState, formData) {
    try {
        const data = await getCityData(formData.get('city-input'))
        //TODO: Eliminate unnecessary fields
        console.log();
        return {
            results: data,
            error: ''
        }
    } catch {
        return {
            results: [],
            error: 'Error happened while getting city information.'
        }
    }
}

async function getCityData(cityName) {
    return await axios.get('https://nominatim.openstreetmap.org/search',
        {
            params: {
                city: `${cityName}`,
                format: 'jsonv2',
                limit: 10,
                featureType: 'city'
            }
        })
        .then((data) => {
            return data.data
        })
}

