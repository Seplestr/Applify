<h1 align="center">🎵 Applify</h1>
<p align="center">
  <em>A music exploration and discovery tool — <strong>Not</strong> a streaming service</em>
</p>

# What is Applify?

Applify is a **music discovery and exploration platform**—a sophisticated client for searching, discovering, and analyzing music from peer-to-peer networks. Think of it as Google for music exploration, not Spotify. 

This is **not** a music streaming subscription service. We don't host, stream, or provide any music ourselves. Instead, Applify is a powerful discovery tool that helps you explore vast music libraries, search across networks, manage your music collection, and analyze track metadata—all while maintaining complete control over your music experience.

> **TL;DR:** This is a music explorer's playground, not a replacement for streaming services.

---

# Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Frontend** | TypeScript, React, Electron, Material-UI (MUI) |
| **Backend** | Python, Flask/FastAPI, Asyncio |
| **Desktop** | Electron with Vite for bundling |
| **State Management** | React Context API, Custom Hooks |
| **Styling** | CSS Modules, Global CSS, MUI5 theming |
| **Build Tools** | Vite, electron-builder, npm, pip |
| **OS Support** | Windows |

</div>

---

# Features

## 🔍 Discovery & Search
- **Full-text search** across peer-to-peer music networks
- **Advanced filtering** by artist, album, year, and metadata
- **Real-time search results** with instant UI updates
- **Search history** and recently played tracks

## 🎼 Music Management
- **Library management** — organize and manage your music collection
- **Playlist creation & editing** — build custom playlists
- **Metadata editing** — view and modify track information
- **Cover art extraction** and caching for visual browsing

## 🎵 Playback & Control
- **Full playback control** — play, pause, skip, seek through tracks
- **Playback queue management** — organize next tracks to play
- **Playlist-based playback** — dedicated playback for playlists
- **Playback history** — track what you've recently listened to

## 🎤 Lyrics & Information
- **Integrated lyrics display** — view song lyrics while playing
- **Song details sidebar** — comprehensive track information
- **Artist and album information** — explore metadata
- **Metadata modal** — detailed view of all track information

## 📱 User Experience
- **Dark/Light theme support** — customizable interface themes
- **Multi-language support** — i18n ready for global users
- **Responsive design** — optimized for Windows desktop
- **Status indicator** — system and connection status monitoring
- **Recently played section** — quick access to your listening history

## 💾 Advanced Features
- **Local session caching** — faster loading and offline browsing
- **Cover cache system** — efficient image management
- **Download management** — track and manage downloads
- **Context menus** — right-click options for songs and playlists
- **Popover information** — quick info popups without page navigation

---

---

# Getting Started

#### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended) and npm
- [Python](https://www.python.org/downloads/) (v3.9+ recommended) and pip

#### Installation Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Seplestr/Applify.git
    cd Applify
    ```

2.  **Install Node.js dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the Python backend:**

    ```bash
    # Create a virtual environment
    python -m venv backend/venv

    # Activate the virtual environment
    backend\venv\Scripts\activate

    # Install Python dependencies
    pip install -r backend/requirements.txt
    ```

#### Running the Application

To run Applify, you need to start both the backend and frontend services. This is easily done by running the same command in two separate terminals.

**Why two terminals?**
Applify has two main parts:
1.  **The Python Backend**: Handles all the logic for searching, downloading, and managing music.
2.  **The Electron Frontend**: The user interface you interact with.

You need to run `npm run dev` in two separate terminals from the project root:

*   **Terminal 1**: The first time you run `npm run dev`, it will start the Python backend server.
*   **Terminal 2**: The second time you run `npm run dev`, it will start the Electron frontend application, which will then connect to the backend.

```bash
# In your first terminal
npm run dev

# In your second terminal
npm run dev
```

> **Note on Data Location**: By default, Applify stores all its data (like your music library and settings) in a folder named `ApplifyData` inside your user's `Documents` directory. You can change this location later in the application's settings.

# Legal Notice

### The Nature of the Tool

> It is important to note—this application is not a content service providing you with files, but a **tool**—a simple client for accessing peer-to-peer networks.

> It is not a curated library filled by us—but a **gateway** to a vast, user-driven ecosystem filled by others.

> I do not host, provide, or endorse any of the content you may find—this is not a repository holding data, but merely a **conduit**—connecting you to it.

### The Burden of the User

> As a result—the responsibility for your actions does not lie with the developers, but rests solely and entirely upon **YOU**—and you alone.

> This application is not a shield from copyright law—but a powerful instrument that demands _your_ own strict legal compliance within _your_ jurisdiction.

> I am not the arbiters of your downloads—but you are the final and only judge of your own conduct. Every search, every download, every share—is not our decision, but yours.

### The Conclusion

> In the event of any consequence—legal or otherwise—liability is not a shared concept that I partake in, but a personal burden you accept in full by using this software.

> In conclusion—this is not an invitation to act without thought, but an explicit **demand** that you act with full awareness of your own responsibilities.

---

<p align="center">
  Made with ❤️ by duru
</p>
