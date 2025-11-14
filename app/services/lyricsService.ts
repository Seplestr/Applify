export interface ParsedLyric {
	time: number // seconds
	text: string
}

export interface LyricsData {
	id: number
	trackName: string
	artistName: string
	albumName: string
	duration: number
	instrumental: boolean
	plainLyrics: string
	syncedLyrics: ParsedLyric[]
	rawSyncedLyrics?: string
}

/**
 * Parse LRC-style synced lyrics into an array of {time, text} entries.
 * Handles multiple timestamps per line.
 */
export function parseSyncedLyrics(raw: string): ParsedLyric[] {
	if (!raw) return []

	const lines = raw.split(/\r?\n/)
	const entries: ParsedLyric[] = []
	const timeRegex = /\[(\d+):(\d+)(?:\.(\d+))?\]/g

	for (const line of lines) {
		let match: RegExpExecArray | null
		const timestamps: number[] = []
		// extract all timestamps
		while ((match = timeRegex.exec(line)) !== null) {
			const min = parseInt(match[1], 10)
			const sec = parseInt(match[2], 10)
			const frac = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0
			const time = min * 60 + sec + frac / 1000
			timestamps.push(time)
		}

		// remove all timestamp tags to get text
		const text = line.replace(/\[(?:\d+:\d+(?:\.\d+)?)\]/g, '').trim()

		for (const t of timestamps) {
			entries.push({ time: t, text })
		}
	}

	// sort by time
	entries.sort((a, b) => a.time - b.time)
	return entries
}

/**
 * Try to fetch lyrics from a simple public API (lyrics.ovh). Returns LyricsData or null.
 */
export async function fetchLyrics(title: string, artist: string, album?: string, duration?: number): Promise<LyricsData | null> {
	try {
		const safeArtist = encodeURIComponent(artist)
		const safeTitle = encodeURIComponent(title)
		const url = `https://api.lyrics.ovh/v1/${safeArtist}/${safeTitle}`
		const res = await fetch(url)
		if (!res.ok) return null
		const json = await res.json()
		const plain = typeof json.lyrics === 'string' ? json.lyrics : ''

		const data: LyricsData = {
			id: 0,
			trackName: title,
			artistName: artist,
			albumName: album || '',
			duration: duration || 0,
			instrumental: !plain || plain.trim().length === 0,
			plainLyrics: plain,
			syncedLyrics: [],
			rawSyncedLyrics: '',
		}
		return data
	} catch (e) {
		console.warn('lyricsService.fetchLyrics failed', e)
		return null
	}
}

export async function fetchCachedLyrics(title: string, artist: string): Promise<LyricsData | null> {
	// No local cache implemented here — return null so callers try other methods
	return null
}

const lyricsService = { parseSyncedLyrics, fetchLyrics, fetchCachedLyrics }
export { lyricsService }
