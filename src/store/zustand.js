import { create } from 'zustand'

export const useWeatherStore = create((set) => ({
    coordinates: { lat: null, lng: null },
    placeInfo: null,
    tempUnit: {
        param: 'celsius', name: 'Celsius (°C)'
    },
    windUnit: {
        param: 'kmh', name: 'km/h'
    },
    setTempUnit: (param, name) => set(state => ({ ...state, tempUnit: { param: param, name: name } })),
    setWindUnit: (param, name) => set(state => ({ ...state, windUnit: { param: param, name: name } })),
    setCoordinates: (lat, lng) => set((state) => ({ ...state, coordinates: { lat: lat, lng: lng } })),
    setPlaceInfo: (info) => set(state => ({ ...state, placeInfo: info }))
}));