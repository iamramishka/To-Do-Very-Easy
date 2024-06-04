# Advanced To-Do List Chrome Extension

This is a Chrome extension that provides an advanced to-do list with both basic and advanced modes. The extension allows users to manage tasks, set due dates, priorities, and recurring tasks, switch between light and dark themes, and import/export tasks to/from Excel and text files.

## Features

- Basic and Advanced Modes
- Light and Dark Themes
- Task Management (Add, Edit, Delete, Complete)
- Due Dates and Times
- Task Priorities
- Recurring Tasks
- Search Functionality
- Import/Export Tasks to/from Excel and Text Files

## Installation

1. **Clone or download this repository:**
    ```sh
    git clone https://github.com/yourusername/advanced-todo-list-chrome-extension.git
    ```
    Or download the ZIP file and extract it.

2. **Navigate to `chrome://extensions/` in your Chrome browser.**

3. **Enable "Developer mode"** by toggling the switch in the top right corner.

4. **Click "Load unpacked"** and select the directory where you cloned or extracted this repository.

## Directory Structure

advanced-todo-list-chrome-extension/
├── manifest.json
├── popup.html
├── popup.js
├── style.css
├── background.js
├── icons/
│ ├── icon16.png
│ ├── icon48.png
│ └── icon128.png
└── scripts/
└── xlsx.full.min.js


## Usage

### Basic Mode

In basic mode, you can:

- Add new tasks
- Edit tasks
- Delete tasks
- Mark tasks as complete

### Advanced Mode

In advanced mode, you have additional features such as:

- Setting due dates and times
- Setting task priorities
- Setting task recurrence (daily, weekly, monthly)

### Switching Modes

- **Toggle between basic and advanced modes** using the switch labeled "Switch Mode" in the top left corner of the popup.

### Themes

- **Toggle between light and dark themes** using the switch labeled "Switch Theme" in the top right corner of the popup.

### Import/Export Tasks

- **Export tasks** to an Excel file by clicking the "Export Tasks" button.
- **Import tasks** from an Excel or text file by clicking the "Import Tasks" button and selecting the appropriate file.

## File Descriptions

### `manifest.json`

Defines the extension's properties, permissions, and resources.

### `popup.html`

The main HTML file for the extension's popup UI.

### `popup.js`

The JavaScript file that handles the logic for task management, theme switching, mode toggling, and import/export functionality.

### `style.css`

The CSS file that styles the extension's popup UI.

### `background.js`

The background script for handling background tasks and notifications.

### `icons/`

Directory containing the icons for the extension.

### `scripts/`

Directory containing the `xlsx.full.min.js` library for handling Excel file operations.

## Contributing

Feel free to contribute to this project by submitting issues or pull requests. Any improvements or suggestions are welcome!

## License

This project is licensed under the MIT License - see the LICENSE file for details.



