'use client'
import React, { useState } from 'react'
import CapsuleTabSelection from '../dom/CapsuleTabSelection'
import { IoRainyOutline, IoSunnyOutline } from 'react-icons/io5'
import thermometerIcon from '/public/img/weather/thermometer.svg'
import windsockIcon from '/public/img/weather/windsock.svg'
import sunriseIcon from '/public/img/weather/sunrise.svg'
import sunsetIcon from '/public/img/weather/sunset.svg'

import Image from 'next/image'
import styles from './DailyWeatherCard.module.css'
import CounterDaySelection from '../dom/CounterDaySelection'
import { useMediaQuery } from 'react-responsive'

export default function DailyWeatherCard({ data, units, style }) {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const iconSize = isTabletOrMobile ? 32 : 50
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)

  return (
    <div className={styles['weather__daily-container']} style={style}>
      <div>
        {data !== null && (
          <div className={styles['weather__daily--container']} style={style}>
            <div className={styles['weather__daily--status']}>
              <div className={styles['weather__daily--img']}>
                <Image
                  alt='Icon representing the daily weather'
                  src={data[selectedDayIndex].weatherImg}
                  objectFit='contain'
                  layout='fill'
                />
              </div>
              <div className={styles['weather__daily--status-container']}>
                <div className={styles['weather__daily--temp-container']}>
                  <p className={styles['weather__daily--temp']}>{data[selectedDayIndex].temperature_2m_max}</p>
                  <hr />
                  <p className={styles['weather__daily--desc']}>{data[selectedDayIndex].weatherDesc}</p>
                </div>
                <span className={styles['weather__daily--unit']}>{units.temperature_2m_max}</span>
              </div>
            </div>
            <div className={styles['weather__daily--misc-container']}>
              <div className={styles['weather__daily--misc-item']}>
                <div className={styles['weather__daily--misc-title']}>
                  <Image
                    className={styles['weather__daily--misc-icon']}
                    src={thermometerIcon}
                    width={iconSize}
                    height={iconSize}
                    alt='Thermometer icon'
                  />
                  <strong>Temp: </strong>
                </div>
                <p className={styles['weather__daily--misc-value']}>
                  {`${data[selectedDayIndex].temperature_2m_max} ${units.temperature_2m_max} / ${data[selectedDayIndex].temperature_2m_min} ${units.temperature_2m_min}`}
                </p>
              </div>
              <div className={styles['weather__daily--misc-item']}>
                <div className={styles['weather__daily--misc-title']}>
                  <Image
                    className={styles['weather__daily--misc-icon']}
                    src={windsockIcon}
                    width={iconSize}
                    height={iconSize}
                    alt='Windsok image for wind speed illustration'
                  />
                  <strong className={styles['weather__daily--misc-bold']}> Wind:</strong>
                </div>
                <p
                  className={styles['weather__daily--misc-value']}
                >{`${data[selectedDayIndex].wind_speed_10m_max} ${units.wind_speed_10m_max}`}</p>
              </div>
              <div className={styles['weather__daily--misc-item']}>
                <div className={styles['weather__daily--misc-title']}>
                  <IoRainyOutline className={styles['weather__daily--misc-icon']} size={iconSize} />
                  <strong className={styles['weather__daily--misc-bold']}> Chance of rain:</strong>
                </div>
                <p
                  className={styles['weather__daily--misc-value']}
                >{`${data[selectedDayIndex].chance_of_rain} ${units.precipitation_probability_max} `}</p>
              </div>
              <div className={styles['weather__daily--misc-item']}>
                <div className={styles['weather__daily--misc-title']}>
                  <IoSunnyOutline className={styles['weather__daily--misc-icon']} size={iconSize} />
                  <strong className={styles['weather__daily--misc-bold']}> UV Index: </strong>
                </div>
                <p className={styles['weather__daily--misc-value']}>
                  {`${data[selectedDayIndex].uv_index_max} ${units.uv_index_max}`}
                </p>
              </div>
              <div className={styles['weather__daily--misc-item']}>
                <div className={styles['weather__daily--misc-title']}>
                  <Image
                    className={styles['weather__daily--misc-icon']}
                    src={sunriseIcon}
                    width={iconSize}
                    height={iconSize}
                    alt='Sunrise icon'
                  />
                  <strong className={styles['weather__daily--misc-bold']}> Sunrise:</strong>
                </div>
                <p
                  className={styles['weather__daily--misc-value']}
                >{`${new Date(data[selectedDayIndex].sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</p>
              </div>
              <div className={styles['weather__daily--misc-item']}>
                <div className={styles['weather__daily--misc-title']}>
                  <Image
                    className={styles['weather__daily--misc-icon']}
                    src={sunsetIcon}
                    width={iconSize}
                    height={50}
                    alt='Sunset icon'
                  />
                  <strong className={styles['weather__daily--misc-bold']}> Sunset:</strong>
                </div>
                <p
                  className={styles['weather__daily--misc-value']}
                >{`${new Date(data[selectedDayIndex].sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</p>
              </div>
            </div>
          </div>
        )}
        {data === null && <div>No data available</div>}
      </div>
      <CapsuleTabSelection
        tabNames={
          data
            ? data.map((value) => {
                return value.date.getDay()
              })
            : ['No Data']
        }
        onClickHandler={setSelectedDayIndex}
        activeIndex={selectedDayIndex}
      />
      <CounterDaySelection
        days={
          data
            ? data.map((value) => {
                return value.date.getDay()
              })
            : ['No data']
        }
        selectedTab={selectedDayIndex}
        notify={setSelectedDayIndex}
      />
    </div>
  )
}
