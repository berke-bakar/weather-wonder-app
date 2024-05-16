import styles from './FavoriteStar.module.css'
import { FaStar } from 'react-icons/fa'

const DEFAULT_COLOR = '#FFC700'
const random = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const generateSparkle = (color) => {
  const sparkle = {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    color,
    size: random(10, 20),
    style: {
      top: random(-50, 50) + '%',
      left: random(-50, 50) + '%',
    },
  }
  return sparkle
}

const FavoriteStar = ({ color = DEFAULT_COLOR, showSparkles, sparkleCount = 3, children, ...delegated }) => {
  return (
    <span className={styles['sparkles__container']} {...delegated}>
      {showSparkles &&
        Array(sparkleCount)
          .fill(0)
          .map((sp) => {
            const sparkle = generateSparkle(DEFAULT_COLOR)
            return <Sparkle key={sparkle.id} color={sparkle.color} size={sparkle.size} style={sparkle.style} />
          })}
      <strong className={styles['sparkles__child--wrapper']}>
        <FaStar color={color} />
      </strong>
    </span>
  )
}

const Sparkle = ({ size, color, style }) => {
  const path =
    'M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z'
  return (
    <span className={styles['sparkles__wrapper']} style={style}>
      <svg className={styles['sparkles__svg']} width={size} height={size} viewBox='0 0 68 68' fill='none'>
        <path d={path} fill={color} />
      </svg>
    </span>
  )
}

export default FavoriteStar
