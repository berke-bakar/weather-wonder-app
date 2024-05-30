import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import styles from './CounterDaySelection.module.css'

export default function CounterDaySelection({ days, selectedTab, notify }) {
  const dayNames = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  }

  const currentDay =
    selectedTab === 0 || selectedTab === 1 ? (selectedTab === 0 ? 'Today' : 'Tomorrow') : dayNames[days[selectedTab]]
  return (
    <div className={`${styles['day__counter--container']}`}>
      <div
        id={0}
        className={`${styles['day__counter--item']}`}
        onClick={() => (selectedTab !== 0 ? notify((((selectedTab - 1) % 7) + 7) % 7) : null)}
        style={{ color: selectedTab === 0 ? 'gray' : 'white' }}
      >
        <FaChevronLeft size={16} />
      </div>
      <div id={1} className={`${styles['day__counter--item']}`}>
        {currentDay}
      </div>
      <div
        id={2}
        className={`${styles['day__counter--item']}`}
        onClick={() => (selectedTab !== days.length - 1 ? notify((selectedTab + 1) % 7) : null)}
        style={{ color: selectedTab === days.length - 1 ? 'gray' : 'white' }}
      >
        <FaChevronRight size={16} />
      </div>
    </div>
  )
}
