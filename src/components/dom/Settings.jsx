import { IconContext } from 'react-icons'
import { GoGear } from 'react-icons/go'
import React, { useState } from 'react'
import { useWeatherStore } from '@/store/zustand'

export default function Settings() {
  const [showSettings, setShowSettings] = useState(false)
  const setTempUnit = useWeatherStore((state) => state.setTempUnit)
  const tempUnit = useWeatherStore((state) => state.tempUnit)
  const setWindUnit = useWeatherStore((state) => state.setWindUnit)
  const windUnit = useWeatherStore((state) => state.windUnit)
  const unitData = [
    {
      title: 'Temperature Unit:',
      names: ['Celsius (°C)', 'Fahrenheit (°F)'],
      params: ['celsius', 'fahrenheit'],
      type: 'temp',
    },
    {
      title: 'Wind Speed Unit:',
      names: ['km/h', 'm/s', 'mph', 'Knots'],
      params: ['kmh', 'ms', 'mph', 'kn'],
      type: 'wind',
    },
  ]

  return (
    <div className='settings-container'>
      <div className='settings__icon' onClick={() => setShowSettings(!showSettings)}>
        <IconContext.Provider value={{ size: '2rem', color: 'inherit' }}>
          <GoGear />
        </IconContext.Provider>
      </div>
      {showSettings && (
        <div className='settings__selection'>
          {unitData.map((value, index) => {
            return (
              <div key={index} className='settings__unit'>
                <h1 className='settings__unit-title'>{value.title}</h1>
                <div className='settings__unit-container'>
                  {value.names.map((innerValue, innerIndex) => {
                    const isActive = value.type === 'temp' ? tempUnit.name === innerValue : windUnit.name === innerValue
                    return (
                      <div
                        key={innerIndex}
                        className={`settings__unit-item ${isActive ? 'settings__unit-item-active' : ''}`}
                        onClick={() => {
                          return value.type === 'temp'
                            ? setTempUnit(value.params[innerIndex], innerValue)
                            : setWindUnit(value.params[innerIndex], innerValue)
                        }}
                      >
                        {innerValue}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
