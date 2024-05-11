import React from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import styles from './MoreButton.module.css'

export default function MoreButton({ onClick = null, clicked = false }) {
  return (
    <div onClick={onClick} className={styles['more__button']}>
      <p>{clicked ? 'Less' : 'More'}</p>
      {clicked ? <FaChevronUp /> : <FaChevronDown />}
    </div>
  )
}
