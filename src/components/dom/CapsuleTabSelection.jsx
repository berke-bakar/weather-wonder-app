import React, { useEffect } from 'react'
import styles from './CapsuleTabSelection.module.css'

export default function CapsuleTabSelection({ tabNames, activeIndex = 0, onClickHandler = null }) {
  const days = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  }

  //   useEffect(() => {
  // console.log(onClickHandler);
  //   }, [])

  return (
    <div className={styles['capsule__container']}>
      {tabNames.map((value, index) => {
        // eslint-disable-next-line no-var
        var idx = index
        let dayName = days[value]
        if (index === 0) {
          dayName = 'Today'
        } else if (index === 1) {
          dayName = 'Tomorrow'
        }
        return (
          <div
            key={value}
            className={`${styles['capsule__item']} ${index === activeIndex ? styles['capsule__item--active'] : ''}`}
            onClick={
              onClickHandler
                ? () => {
                    onClickHandler(idx)
                  }
                : null
            }
          >
            {dayName}
          </div>
        )
      })}
    </div>
  )
}
