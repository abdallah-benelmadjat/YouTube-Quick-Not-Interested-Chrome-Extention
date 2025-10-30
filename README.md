# YouTube Quick Not Interested

A lightweight Chrome extension that adds a **Not Interested** button to every YouTube thumbnail, giving you full control over the videos that appear in your feed.

---

## Table of Contents
1. [Features](#features)  
2. [Installation](#installation)  
3. [Usage](#usage)  
4. [Configuration](#configuration)  
5. [Permissions](#permissions)  
6. [Development](#development)  
7. [Contributing](#contributing)  
8. [Changelog](#changelog)  
9. [License](#license)

---

## Features

| Feature                | Details                                                                                         |
|------------------------|-------------------------------------------------------------------------------------------------|
| One-click dismissal    | Hover over any thumbnail and click the red **×** to hide the video instantly.                   |
| Selectable feedback    | Choose the reason YouTube records (e.g., “Don’t like this video” or “Already watched”).         |
| Infinite-scroll ready  | Buttons attach to all thumbnails, including those loaded dynamically as you scroll.             |
| Resilient to UI changes| A mutation observer re-attaches buttons if YouTube updates its markup.                          |
| Privacy-first design   | Requires only minimal permissions and never collects or transmits personal data.                |

---

## Installation

### Developer Mode

1. **Clone** or **download** this repository.  
2. Open **`chrome://extensions/`** in Chrome.  
3. Enable **Developer mode** (top-right toggle).  
4. Click **Load unpacked** and select the project folder.  
5. Pin the extension icon for quick access (optional).

---

## Usage

1. Go to **YouTube**.  
2. Hover over any video thumbnail— a red **×** appears in the top-right corner.  
3. Click the **×** to mark the video as *Not Interested*.  
4. Change the default feedback reason via **Options** (right-click the toolbar icon → *Options*).

---

## Configuration

| Option              | Description                                                                                           |
|---------------------|-------------------------------------------------------------------------------------------------------|
| Dismissal reason    | Default feedback sent to YouTube (*I don’t like this video*, *I’ve already watched this video*, etc.).|
| Feedback submission | Choose silent submission or display YouTube’s native confirmation dialog.                             |

---

## Permissions

| Permission                  | Purpose                                                     |
|-----------------------------|-------------------------------------------------------------|
| `activeTab`                 | Inject content scripts into the current YouTube tab.        |
| `https://www.youtube.com/*` | Run on all YouTube pages to add the dismissal buttons.      |

No analytics, tracking, or external requests are performed.

---

## Development

\`\`\`bash
# Install dependencies (if a build tool is added in the future)
npm install

# Build scripts or assets (not required for vanilla JS/CSS)
npm run build
\`\`\`

- Source files live in `src/`.  
- Content script: `content.js`  
- Stylesheet: `styles.css`

Pull requests are welcome—see [Contributing](#contributing).

---

## Contributing

1. Fork the repo.  
2. Create a feature branch:  
   \`\`\`bash
   git checkout -b feature/my-feature
   \`\`\`  
3. Commit your changes with clear messages.  
4. Push to your branch and open a pull request.  

Please match the existing code style and include relevant tests or demo notes.

---

## Changelog

| Version | Date       | Notes                                                         |
|---------|------------|---------------------------------------------------------------|
| 1.0.1   | 2025-10-30 | Added Options page, improved error handling, manifest updates |
| 1.0.0   | 2025-10-28 | Initial release with one-click dismissal                      |

---

## License

Distributed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
