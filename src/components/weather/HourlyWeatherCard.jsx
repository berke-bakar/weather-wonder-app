import styles from './HourlyWeatherCard.module.css'
import CapsuleTabSelection from '../dom/CapsuleTabSelection'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

export default function HourlyWeatherCard({ data, units, style, ...props }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <div className={styles['weather__hourly--flex']} style={style}>
      {data && (
        <>
          <div className={styles['weather__hourly--row']}>
            <div className={styles['weather__hourly--header']}>Time</div>
            <div className={styles['weather__hourly--header']}>Cond.</div>
            <div className={styles['weather__hourly--header']}>Temp.</div>
            <div className={styles['weather__hourly--header']}>Feels Like</div>
            <div className={styles['weather__hourly--header']}>Humidity</div>
            <div className={styles['weather__hourly--header']}>Chance of Rain</div>
            <div className={styles['weather__hourly--header']}>Wind Speed</div>
          </div>
          <div className={styles['weather__hourly--container']}>
            {Array.from({ length: 24 }).map((val, idx) => {
              return (
                <div key={idx} className={styles['weather__hourly--row']}>
                  <div className={styles['weather__hourly--item']}>
                    {new Date(0, 0, 0, idx).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className={styles['weather__hourly--item']}>
                    <Image
                      alt={data[selectedDayIndex].weather_desc[idx]}
                      src={data[selectedDayIndex].weather_img[idx]}
                      style={{ display: 'block' }}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div
                    className={styles['weather__hourly--item']}
                  >{`${data[selectedDayIndex].temperature_2m[idx]} ${units.temperature_2m}`}</div>
                  <div className={styles['weather__hourly--item']}>
                    {`${data[selectedDayIndex].apparent_temperature[idx]} ${units.apparent_temperature}`}
                  </div>
                  <div className={styles['weather__hourly--item']}>
                    {`${data[selectedDayIndex].relative_humidity_2m[idx]} ${units.relative_humidity_2m}`}
                  </div>
                  <div className={styles['weather__hourly--item']}>
                    {`${data[selectedDayIndex].precipitation_probability[idx]} ${units.precipitation_probability}`}
                  </div>
                  <div
                    className={styles['weather__hourly--item']}
                  >{`${data[selectedDayIndex].wind_speed_10m[idx]} ${units.wind_speed_10m}`}</div>
                </div>
              )
            })}
          </div>
          <CapsuleTabSelection
            tabNames={
              data
                ? data.map((value) => {
                    return value.day
                  })
                : ['No Data']
            }
            onClickHandler={setSelectedDayIndex}
            activeIndex={selectedDayIndex}
          />
        </>
      )}
    </div>
  )
}
