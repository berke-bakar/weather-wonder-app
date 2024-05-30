import React from 'react'
import styles from './CapsuleTabSelection.module.css'
import { useMediaQuery } from 'react-responsive'

export default function CapsuleTabSelection({ tabNames, activeIndex = 0, onClickHandler = null }) {
  const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' })

  const days = {
    0: !isSmallScreen ? 'Sunday' : 'Sun',
    1: !isSmallScreen ? 'Monday' : 'Mon',
    2: !isSmallScreen ? 'Tuesday' : 'Thu',
    3: !isSmallScreen ? 'Wednesday' : 'Wed',
    4: !isSmallScreen ? 'Thursday' : 'Thu',
    5: !isSmallScreen ? 'Friday' : 'Fri',
    6: !isSmallScreen ? 'Saturday' : 'Sat',
  }

  return (
    <div className={styles['capsule__container']}>
      {tabNames.map((value, index) => {
        // eslint-disable-next-line no-var
        var idx = index
        let dayName = days[value]
        if (index === 0) {
          dayName = 'Today'
        } else if (index === 1) {
          dayName = !isSmallScreen ? 'Tomorrow' : 'Tmrw'
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
