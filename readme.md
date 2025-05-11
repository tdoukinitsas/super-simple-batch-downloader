# Super Simple Batch Downloader

Super Simple Batch Downloader is a **Node.js application** that allows users to **bulk download files** from a specified URL location. The app handles:
- **Encoding and decoding filenames** to support special characters and spaces.
- **Sequential downloads** with a **progress indicator and estimated time remaining**.
- **Fallback to PowerShell** if Node.js encounters errors while downloading files.
- **Interactive CLI mode** for specifying download parameters dynamically.

## Features
- **Bulk file downloading** via HTTP requests.  
- **Automatic filename encoding/decoding** for proper URL handling.  
- **Interactive command-line input** for flexible configuration.  
- **Progress tracking** with file-specific percentage and time estimation.  
- **PowerShell fallback** to ensure downloads succeed if Node.js requests fail.  

---

## Installation
Ensure you have **Node.js** installed, then clone the repository and install dependencies:

```sh
git clone https://github.com/YOUR-USERNAME/batch-http-downloader.git
cd batch-http-downloader
npm install
```

## Dependencies:

```sh
npm install
```
## Usage

### 1. Running via Command Line
Execute the script using:

```sh
node index.js
```

You will then be prompted to enter:

1. Base URL where the files are located.

2. Output directory for saving downloaded files.

3. File names (one per line, press Enter after each).

4. Type "DONE" to start downloading.

#### Example prompt:

```
Enter the base URL: https://example.com/files
Enter the output directory: ./downloads
Enter file names (press Enter after each, then type "DONE" to finish):
file1.txt
image.png
document.pdf
DONE
```
### 2. Using the downloadFiles function directly
You can integrate the function in another Node.js script:

```javascript
const { downloadFiles } = require('./index.js');

const baseUrl = 'https://example.com/files';
const outputDir = './downloads';
const fileNames = ['file1.txt', 'image.png', 'document.pdf'];

downloadFiles(baseUrl, fileNames, outputDir);
```
### 3. PowerShell Fallback
If a download fails, the script automatically tries downloading via PowerShell (Windows only):

```sh
powershell -Command "& { $client = New-Object System.Net.WebClient; $client.DownloadFile('<file_url>', '<output_path>') }"
```

### Enhancements & Future Improvements if you want to help and contribute
- Add support for multi-threaded downloads (parallel execution).
- Support authentication headers for restricted file access.
- Expand compatibility for Linux/Mac alternatives to PowerShell fallback.

### License
This project is open-source and available for modification. Feel free to contribute! 🚀

### Notes
Coded using assistive AI
