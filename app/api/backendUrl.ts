let backendUrl = 'http://127.0.0.1:8000'

const isElectron = () => {
  try {
    return typeof window !== 'undefined' && Boolean((window as any).electron)
  } catch (e) {
    return false
  }
}

export const getBackendUrl = () => {
  const storedUrl = localStorage.getItem('backendUrl')
  if (storedUrl) {
    backendUrl = storedUrl
    console.log('[backendUrl] Using stored URL:', backendUrl)
    return backendUrl
  }

  // On web/mobile builds, default to same origin so dev server or static host works
  if (!isElectron() && typeof window !== 'undefined' && window.location && window.location.origin) {
    backendUrl = window.location.origin
    console.log('[backendUrl] Using window.location.origin:', backendUrl)
    return backendUrl
  }

  console.log('[backendUrl] Using default URL:', backendUrl)
  return backendUrl
}

export const setBackendUrl = (url: string) => {
  backendUrl = url
  console.log('[backendUrl] Setting backend URL:', url)
  try {
    localStorage.setItem('backendUrl', url)
  } catch (e) {
    // ignore storage errors on restricted environments
  }
}
