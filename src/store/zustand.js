import { create } from 'zustand'

export const useCoordinateStore = create((set) => ({
    coordinates: { lat: null, lng: null },
    setCoordinates: (lat, lng) => set((state) => ({ coordinates: { lat: lat, lng: lng } })),
}));