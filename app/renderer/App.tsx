import { Route, Routes, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef } from 'react'
import { ThemeProvider } from '../providers/ThemeProvider'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import Playlists from '../pages/Playlists/Playlists'
import PlaylistDetail from '../pages/PlaylistDetail/PlaylistDetail'
import StickyHeader from '../components/StickyHeader/StickyHeader'
import { PlaybackProvider } from '../providers/PlaybackProvider'
import { songDataService } from '../services/songDataService'
import styles from './app.module.css'
import '../styles/buttons.global.css'
import Sidebar from '../components/Sidebar/Sidebar'
import Library from '../pages/Library/Library'
import Settings from '../pages/Settings/Settings'
import Search from '../pages/Search/Search'
import LyricsPage from '../pages/Lyrics/LyricsPage'
import Footer from '../components/footer/Footer'
import SongDetailSidebar from '../components/SongDetailSidebar/SongDetailSidebar'
import { SongDetailSidebarProvider, useSongDetailSidebar } from '../providers/SongDetailSidebarProvider'

const AppContent = () => {
  const location = useLocation()
  const { selectedSong, setSelectedSong, searchAbortController, setSearchAbortController } = useSongDetailSidebar()
  const nodeRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const [, setRefreshSidebarTriggerValue] = useState(false)

  const refreshSidebarData = () => {
    setTimeout(() => {
      setRefreshSidebarTriggerValue((state) => !state)
    }, 500)
  }

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [_isAutoCollapsed, setIsAutoCollapsed] = useState(false)

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev)
    setIsAutoCollapsed(false)
  }

  const closeSidebar = () => {
    if (selectedSong) {
      if (searchAbortController) {
        searchAbortController.abort()
        setSearchAbortController(null)
      }
      setSelectedSong(null)
    }
  }

  useEffect(() => {
    let prevWidth = window.innerWidth

    const handleResize = () => {
      const windowWidth = window.innerWidth
      const wasMobile = prevWidth < 1000
      const isMobile = windowWidth < 1000

      if (wasMobile !== isMobile) {
        if (isMobile) {
          setIsSidebarCollapsed(true)
          setIsAutoCollapsed(true)
        } else {
          setIsSidebarCollapsed(false)
          setIsAutoCollapsed(false)
        }
      }
      prevWidth = windowWidth
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    songDataService.initialize()

    const cacheCleanupInterval = setInterval(
      () => {
        songDataService.clearExpired()
      },
      1000 * 60 * 30
    )

    return () => {
      clearInterval(cacheCleanupInterval)
    }
  }, [])

  return (
    <div className={`App d-flex flex-column ${styles.appBackground}`}>
      <StickyHeader closeSidebar={closeSidebar} />

      <div className={`${styles.layoutContainer} ${selectedSong ? styles.withRightSidebar : ''}`}>
        {/* Always show the left sidebar for "Your Library" */}
        <div className={`${styles.leftSidebar} ${isSidebarCollapsed ? styles.collapsed : styles.expanded}`}>
          <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
        </div>

        <div
          className={styles.mainContentWrapper}
          style={{
            marginRight: selectedSong ? 'calc(var(--sidebar-width) + 8px)' : '0',
          }}
        >
          <SwitchTransition mode="out-in">
            <CSSTransition key={location.pathname} classNames="fade" timeout={300} unmountOnExit nodeRef={nodeRef}>
              <div className={styles.pageTransition} ref={nodeRef}>
                <Routes location={location}>
                  <Route path="/playlist/:id" element={<PlaylistDetail refreshSidebarData={refreshSidebarData} />} />
                  <Route path="/playlists" element={<Playlists refreshSidebarData={refreshSidebarData} />} />
                  <Route
                    path="/playlist-detail/:id"
                    element={<PlaylistDetail refreshSidebarData={refreshSidebarData} />}
                  />
                  <Route path="/settings" element={<Settings refreshSidebarData={refreshSidebarData} />} />
                  <Route path="/" element={<Library />} />
                  {/* Add the Library route */}
                  <Route path="/library" element={<Library />} />
                  {/* Add the Search route */}
                  <Route path="/search" element={<Search />} />
                  {/* Lyrics page */}
                  <Route path="/lyrics" element={<LyricsPage />} />
                  <Route path="*" element={<Library />} />
                </Routes>
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>

        {/* Show song detail sidebar on the right when a song is selected */}
        <CSSTransition
          in={!!selectedSong}
          timeout={300}
          classNames={{
            enter: styles.fadeEnter,
            enterActive: styles.fadeEnterActive,
            exit: styles.fadeExit,
            exitActive: styles.fadeExitActive,
          }}
          unmountOnExit
          nodeRef={nodeRef}
        >
          <div className={styles.rightSidebar} ref={nodeRef}>
            <SongDetailSidebar />
          </div>
        </CSSTransition>
      </div>
      <Footer />
    </div>
  )
}

function isElectronAvailable(): boolean {
  try {
    // window.electron is injected by the preload script in Electron builds
    return typeof window !== 'undefined' && Boolean((window as any).electron && (window as any).electron.ipcRenderer)
  } catch (e) {
    return false
  }
}

function App() {
  const { t } = useTranslation()
  const [updateReady, setUpdateReady] = useState(false)

  useEffect(() => {
    songDataService.initialize()

    const cacheCleanupInterval = setInterval(
      () => {
        songDataService.clearExpired()
      },
      1000 * 60 * 30
    )

    const handleUpdateReady = () => setUpdateReady(true)
    if (isElectronAvailable()) {
      ;(window as any).electron.ipcRenderer.on('update-ready', handleUpdateReady)
    }

    return () => {
      clearInterval(cacheCleanupInterval)
      if (isElectronAvailable()) {
        ;(window as any).electron.ipcRenderer.removeListener('update-ready', handleUpdateReady)
      }
    }
  }, [])

  return (
    <>
      <ThemeProvider>
        <SongDetailSidebarProvider>
          <PlaybackProvider>
            <AppContent />
          </PlaybackProvider>
        </SongDetailSidebarProvider>
      </ThemeProvider>
      {updateReady && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            background: '#333',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 10000,
          }}
        >
          <p>{t('app.updateReady')}</p>
          <button
            onClick={() => {
              if (isElectronAvailable()) {
                ;(window as any).electron.ipcRenderer.sendMessage('install-update')
              } else {
                // no-op on web/mobile builds
                console.info('install-update called: not running in Electron')
              }
            }}
          >
            {t('app.restartAndInstall')}
          </button>
        </div>
      )}
    </>
  )
}

export default App
