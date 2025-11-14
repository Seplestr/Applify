<div align="center">
  <img src="assets/readme/Banner.png" width="100%">
</div>
<p align="center">
  <img src="https://img.shields.io/github/downloads/DIOR/Applify/total">
  <a href="https://discord.gg/Np7YYEVPhR"><img src="https://img.shields.io/discord/1411737769675329558"></a>
</p>

<h3 align="center"><b>🎵 Discover, Explore, Archive & Analyze Music</b></h3>
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
| **Internationalization** | i18n with multi-language support |
| **Build Tools** | Vite, electron-builder, npm, pip |
| **OS Support** | Windows, macOS, Linux |

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
- **Responsive design** — works on desktop across Windows, macOS, and Linux
- **Status indicator** — system and connection status monitoring
- **Recently played section** — quick access to your listening history

## 💾 Advanced Features
- **Local session caching** — faster loading and offline browsing
- **Cover cache system** — efficient image management
- **Download management** — track and manage downloads
- **Context menus** — right-click options for songs and playlists
- **Popover information** — quick info popups without page navigation

---

# Build From Source

<details>
  <summary>But I hate Electron</summary>

### Running without Electron (Web UI)

1. **Run the backend:**

   ```bash
   python backend/src/main.py or run the backend exec
   ```

2. Open your browser and go to [applify.dior.com](http://applify.dior.com), I have tested on four browsers - Edge, Chrome support it and Safari, Brave don't
3. Enjoy, and please don't spam about framework
</details>

# Screenshots

The interface provides a comprehensive music analysis and discovery experience with detailed metadata visualization, search capabilities, and library management.

<div align="center">
  <img src="assets/readme/analysis.png" alt="Analysis" width="600" style="box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
</div>

---

#### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended) and npm
- [Python](https://www.python.org/downloads/) (v3.9+ recommended) and pip

#### Installation & Running

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/DIOR/Applify.git
    cd Applify
    ```

2.  **Install frontend dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the Python backend:**

    ```bash
    # Create and activate a virtual environment (recommended)
    python -m venv backend/venv

    # On macOS/Linux:
    source backend/venv/bin/activate

    # On Windows:
    backend\venv\Scripts\activate

    # Install backend dependencies
    pip install -r backend/requirements.txt
    ```

4.  **Run the backend:**

    ```bash
    python backend/src/main.py
    ```

5.  **Run the frontend:**
    ```bash
    npm run dev
    ```

# Download

<div align="center">
<table>
  <tr>
    <td align="center"><a href="https://github.com/DIOR/Applify/releases/latest/download/Applify-setup.exe"><img src="assets/readme/win.png" alt="Windows Download" width="400"></a></td>
    <td align="center"><a href="https://github.com/DIOR/Applify/releases/latest/download/Applify.dmg"><img src="assets/readme/mac.png" alt="macOS Download" width="400"></a></td>
    <td align="center"><a href="https://github.com/DIOR/Applify/releases/latest/download/Applify_amd64.deb"><img src="assets/readme/lin.png" alt="Linux Download" width="400"></a></td>
  </tr>
</table>
</div>

# Contributing

### Read this before contributing

- **Backend-First Approach:** All the core logic, tasks go in python backend, electron is just for UI and nothing else.

- **Safety:** Do not mention or hardcode references to specific commercial music services in the code, UI text, or documentation except the ones I did (I'll remove it later anyways). The application should remain a generic music discovery and management tool.

- **UI & UX Consistency:** This is a very familiar UI, so you already know where to take the designs from.

- **Code Quality:** Follow the existing coding style and conventions. Use TypeScript for the frontend and Python type hints for the backend to maintain code quality and clarity. Add comments for any complex logic.

<div align="center">
  <img src="assets/readme/dis.png" width="100%">
</div>
<p align="center">
  Let's Dive Deep.
</p>

---

### `I.` — The Nature of the Tool

> It is important to note—this application is not a content service providing you with files, but a **tool**—a simple client for accessing peer-to-peer networks.

> It is not a curated library filled by us—but a **gateway** to a vast, user-driven ecosystem filled by others.

> I do not host, provide, or endorse any of the content you may find—this is not a repository holding data, but merely a **conduit**—connecting you to it.

---

### `II.` — The Burden of the User

> As a result—the responsibility for your actions does not lie with the developers, but rests solely and entirely upon **YOU**—and you alone.

> This application is not a shield from copyright law—but a powerful instrument that demands _your_ own strict legal compliance within _your_ jurisdiction.

> I am not the arbiters of your downloads—but you are the final and only judge of your own conduct. Every search, every download, every share—is not our decision, but yours.

---

### `III.` — The Inevitable Conclusion

> In the event of any consequence—legal or otherwise—liability is not a shared concept that I partake in, but a personal burden you accept in full by using this software.

> In conclusion—this is not an invitation to act without thought, but an explicit **demand** that you act with full awareness of your own responsibilities.

---

<p align="center">
  <em>— Proceed Accordingly. —</em>
</p>
