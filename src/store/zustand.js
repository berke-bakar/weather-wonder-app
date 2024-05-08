import { create } from 'zustand'

export const useCoordinateStore = create((set) => ({
    coordinates: { lat: null, lng: null },
    placeName: '',
    setCoordinates: (lat, lng) => set((state) => ({ ...state, coordinates: { lat: lat, lng: lng } })),
    setPlaceName: (name) => set((state) => { return { ...state, placeName: name } })
}));