# YouTube Quick Not Interested

A Chrome extension that adds a lightweight “Not Interested” button to every YouTube thumbnail, giving you full control over the videos that appear in your feed.

---

## Table of Contents
1. [Key Features](#key-features)  
2. [Demo](#demo)  
3. [Installation](#installation)  
4. [Usage](#usage)  
5. [Configuration](#configuration)  
6. [Permissions](#permissions)  
7. [Development](#development)  
8. [Contributing](#contributing)  
9. [Changelog](#changelog)  
10. [License](#license)

---

## Key Features
| Feature | Description |
|---------|-------------|
| One-click dismissal | Hover over any thumbnail and click the red × to hide it instantly. |
| Selectable feedback | Choose the dismissal reason YouTube should receive (e.g., “Don’t like” or “Already watched”). |
| Infinite-scroll support | Buttons appear on all thumbnails, including those loaded dynamically. |
| UI-change resilience | A mutation observer re-attaches buttons if YouTube’s markup changes. |
| Privacy-first design | Requires minimal permissions; never collects or transmits user data. |

---

## Demo
> **Screenshots**  
> *Replace the placeholders below with real images once available.*  

| Before | After |
|:------:|:-----:|
| ![Before](docs/before.png) | ![After](docs/after.png) |

---

## Installation

### From source (Developer Mode)

1. Clone or download this repository.  
2. Open `chrome://extensions/` in Chrome.  
3. Enable **Developer mode** in the top-right corner.  
4. Click **Load unpacked** and select the project folder.  
5. The extension icon will appear in your toolbar.

> **Tip:** Pin the icon for quick access to the Options page.

---

## Usage

1. Navigate to `youtube.com`.  
2. Hover over any video thumbnail. A red × appears in the top-right corner.  
3. Click the × to mark the video as “Not Interested.”  
4. To change the default dismissal reason, open the extension’s Options (right-click the toolbar icon → **Options**).

---

## Configuration

| Setting | Description |
|---------|-------------|
| Dismissal reason | Default feedback sent to YouTube (`I don't like this video`, `I've already watched this video`, etc.). |
| Feedback submission | Toggle whether to send feedback silently or display YouTube’s native confirmation dialog. |

---

## Permissions

| Permission | Why it’s needed |
|-
