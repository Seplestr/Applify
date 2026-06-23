import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ParsedLyric } from '../../services/lyricsService'
import { ColorPalette } from '../../utils/colorExtraction'
import styles from './LyricsDisplay.module.css'

interface LyricsDisplayProps {
  lyrics: ParsedLyric[]
  plainLyrics: string
  currentTime: number
  duration: number
  isPlaying: boolean
  colorPalette: ColorPalette
  onSeek?: (time: number) => void
}

interface LyricLineProps {
  lyric: ParsedLyric
  isActive: boolean
  isPast: boolean
  isFuture: boolean
  colorPalette: ColorPalette
  onClick?: () => void
}

const LyricLine: React.FC<LyricLineProps> = ({ lyric, isActive, isPast, isFuture, colorPalette, onClick }) => {
  return (
    <div
      className={`${styles.lyricLine} ${isActive ? styles.active : ''} ${isPast ? styles.past : ''} ${isFuture ? styles.future : ''}`}
      onClick={onClick}
      style={{
        color: isActive ? colorPalette.text : isPast ? colorPalette.textSecondary : colorPalette.textSecondary,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {lyric.text}
    </div>
  )
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({
  lyrics,
  plainLyrics,
  currentTime,
  duration,
  isPlaying,
  colorPalette,
  onSeek,
}) => {
  const { t } = useTranslation()
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const activeLyricRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  // Function to find current lyric index
  const findCurrentLyricIndex = useCallback(
    (time: number): number => {
      if (lyrics.length === 0) return -1

      let index = -1
      for (let i = 0; i < lyrics.length; i++) {
        if (lyrics[i].time <= time) {
          index = i
        } else {
          break
        }
      }
      return index
    },
    [lyrics]
  )

  // Update current lyric index based on time
  useEffect(() => {
    const updateCurrentLyric = () => {
      const newIndex = findCurrentLyricIndex(currentTime)
      if (newIndex !== currentLyricIndex) {
        setCurrentLyricIndex(newIndex)
      }
    }

    if (isPlaying) {
      // Update more frequently when playing
      updateCurrentLyric()

      // Set up animation frame for smooth updates
      const animate = () => {
        updateCurrentLyric()
        if (isPlaying) {
          animationFrameRef.current = requestAnimationFrame(animate)
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    } else {
      // Update once when paused
      updateCurrentLyric()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [currentTime, isPlaying, currentLyricIndex, findCurrentLyricIndex])

  const [userScrolled, setUserScrolled] = useState(false)
  const userScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleContainerScroll = () => {
    setUserScrolled(true)
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current)
    }
    userScrollTimeoutRef.current = setTimeout(() => {
      setUserScrolled(false)
    }, 5000) // resume auto-scroll after 5 seconds of scroll inactivity
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current)
      }
    }
  }, [])

  // Auto-scroll to current lyric (synced lyrics)
  useEffect(() => {
    if (containerRef.current) {
      if (currentLyricIndex >= 0 && activeLyricRef.current) {
        const container = containerRef.current
        const activeLyric = activeLyricRef.current

        const containerHeight = container.clientHeight
        const activeLyricTop = activeLyric.offsetTop
        const activeLyricHeight = activeLyric.clientHeight

        const scrollPosition = activeLyricTop - containerHeight / 2.5 + activeLyricHeight / 2

        container.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: 'smooth',
        })
      } else if (currentLyricIndex === -1) {
        containerRef.current.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    }
  }, [currentLyricIndex])

  // Auto-scroll plain lyrics based on progress percentage
  useEffect(() => {
    if (lyrics.length === 0 && plainLyrics && containerRef.current && duration > 0 && !userScrolled) {
      const container = containerRef.current
      const progressPercent = currentTime / duration
      const scrollableHeight = container.scrollHeight - container.clientHeight
      if (scrollableHeight > 0) {
        container.scrollTo({
          top: scrollableHeight * progressPercent,
          behavior: 'smooth',
        })
      }
    }
  }, [currentTime, duration, lyrics.length, plainLyrics, userScrolled])

  // Handle seeking when clicking on a lyric
  const handleLyricClick = (lyric: ParsedLyric) => {
    if (onSeek) {
      onSeek(lyric.time)
    }
  }

  // Render synced lyrics
  const renderSyncedLyrics = () => {
    if (lyrics.length === 0) return null

    return (
      <div className={styles.syncedLyrics}>
        {lyrics.map((lyric, index) => (
          <div key={`${lyric.time}-${index}`} ref={index === currentLyricIndex ? activeLyricRef : undefined}>
            <LyricLine
              lyric={lyric}
              isActive={index === currentLyricIndex}
              isPast={index < currentLyricIndex}
              isFuture={index > currentLyricIndex}
              colorPalette={colorPalette}
              onClick={onSeek ? () => handleLyricClick(lyric) : undefined}
            />
          </div>
        ))}
      </div>
    )
  }

  // Render plain lyrics as fallback
  const renderPlainLyrics = () => {
    if (!plainLyrics) return null

    const lines = plainLyrics.split('\n').filter((line) => line.trim() !== '')

    return (
      <div className={styles.plainLyrics}>
        {lines.map((line, index) => (
          <div key={index} className={styles.plainLyricLine} style={{ color: colorPalette.textSecondary }}>
            {line}
          </div>
        ))}
      </div>
    )
  }

  // Show no lyrics state
  const renderNoLyricsState = () => (
    <div className={styles.noLyricsState}>
      <div className={styles.noLyricsIcon} style={{ color: colorPalette.textSecondary }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>
      <p style={{ color: colorPalette.textSecondary }}>{t('lyrics.noLyrics')}</p>
      <p style={{ color: colorPalette.textSecondary, fontSize: '0.9em', opacity: 0.7 }}>{t('lyrics.provider')}</p>
    </div>
  )

  return (
    <div
      className={styles.lyricsContainer}
      ref={containerRef}
      onScroll={handleContainerScroll}
      style={{
        backgroundColor: colorPalette.background,
      }}
    >
      <div className={styles.lyricsContent}>
        {lyrics.length > 0 ? renderSyncedLyrics() : plainLyrics ? renderPlainLyrics() : renderNoLyricsState()}
      </div>
    </div>
  )
}

export default LyricsDisplay
