'use client'
import React from 'react'
import styles from './CurrentWeatherCard.module.css'
import Image from 'next/image'
import humidityIcon from '/public/img/weather/humidity.svg'
import pressureIcon from '/public/img/weather/barometer.svg'
import windsockIcon from '/public/img/weather/windsock.svg'
import { FcCalendar, FcClock, FcGlobe } from 'react-icons/fc'
import { useMediaQuery } from 'react-responsive'

export default function CurrentWeatherCard({ data, timezone, units, style }) {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const iconSize = isTabletOrMobile ? 32 : 50
  return (
    <>
      {data !== null && data.current !== null && (
        <div className={styles['weather__current--container']} style={style}>
          <div className={styles['weather__current--status']}>
            <div className={styles['weather__current--img']}>
              <Image
                alt='Icon representing the current weather'
                src={data.weatherImg}
                objectFit='contain'
                layout='fill'
                style={{ display: 'block' }}
              />
            </div>
            <div className={styles['weather__current--status-container']}>
              <div className={styles['weather__current--temp-container']}>
                <p className={styles['weather__current--temp']}>{data.current.temperature_2m}</p>
                <hr />
                <p className={styles['weather__current--apptemp']}>Feels like {data.current.apparent_temperature}°</p>
                <hr />
                <p className={styles['weather__current--apptemp']}>{data.weatherDesc}</p>
              </div>
              <span className={styles['weather__current--unit']}>{units.temperature_2m}</span>
            </div>
          </div>
          <div className={styles['weather__current--misc-container']}>
            <div className={styles['weather__current--misc-item']}>
              <div className={styles['weather__current--misc-title']}>
                <Image
                  className={styles['weather__current--misc-icon']}
                  src={humidityIcon}
                  width={iconSize}
                  height={iconSize}
                  alt='Drop of water icon represents humidity'
                />
                <strong>Humidity:</strong>
              </div>
              <p className={styles['weather__current--misc-value']}>
                {`${data.current.relative_humidity_2m} ${units.relative_humidity_2m}`}
              </p>
            </div>
            <div className={styles['weather__current--misc-item']}>
              <div className={styles['weather__current--misc-title']}>
                <Image
                  className={styles['weather__current--misc-icon']}
                  src={pressureIcon}
                  width={iconSize}
                  height={iconSize}
                  alt='Barometer icon to represent pressure'
                />
                <strong className={styles['weather__current--misc-bold']}> Pressure:</strong>
              </div>
              <p
                className={styles['weather__current--misc-value']}
              >{`${data.current.pressure_msl} ${units.pressure_msl}`}</p>
            </div>
            <div className={styles['weather__current--misc-item']}>
              <div className={styles['weather__current--misc-title']}>
                <Image
                  className={styles['weather__current--misc-icon']}
                  src={windsockIcon}
                  width={iconSize}
                  height={iconSize}
                  alt='Windsok image for wind speed illustration'
                />
                <strong className={styles['weather__current--misc-bold']}> Wind:</strong>
              </div>
              <p
                className={styles['weather__current--misc-value']}
              >{`${data.current.wind_speed_10m} ${units.wind_speed_10m}`}</p>
            </div>
            <div className={styles['weather__current--misc-item']}>
              <div className={styles['weather__current--misc-title']}>
                <FcCalendar className={styles['weather__current--misc-icon']} size={iconSize} />
                <strong className={styles['weather__current--misc-bold']}> Local Date:</strong>
              </div>
              <p
                className={styles['weather__current--misc-value']}
              >{`${new Date(data.current.time).toLocaleDateString()}`}</p>
            </div>
            <div className={styles['weather__current--misc-item']}>
              <div className={styles['weather__current--misc-title']}>
                <FcClock className={styles['weather__current--misc-icon']} size={iconSize} />
                <strong className={styles['weather__current--misc-bold']}> Time: </strong>
              </div>
              <p className={styles['weather__current--misc-value']}>
                Apprx. {`${new Date(data.current.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </p>
            </div>
            <div className={styles['weather__current--misc-item']}>
              <div className={styles['weather__current--misc-title']}>
                <FcGlobe className={styles['weather__current--misc-icon']} size={iconSize} />
                <strong className={styles['weather__current--misc-bold']}> TZ:</strong>
              </div>
              <p
                className={styles['weather__current--misc-value']}
              >{`${timezone.replace('/', ' / ').replace('_', ' ')}`}</p>
            </div>
          </div>
        </div>
      )}
      {data === null && <div>No data available</div>}
    </>
  )
}
