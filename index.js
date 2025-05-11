const axios = require('axios');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
const { exec } = require('child_process');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function downloadFiles(baseUrl, fileNames, outputDir) {

    console.log(chalk.bgWhite.black("Super Simple Batch Downloader - written by Thomas Doukinitsas"))

    let startTime = Date.now();
    let totalFiles = fileNames.length;
    
    for (let i = 0; i < totalFiles; i++) {
        const fileName = fileNames[i];
        try {
            const encodedFileName = encodeURIComponent(fileName);
            const fileUrl = `${baseUrl}/${encodedFileName}`;
            const response = await axios.get(fileUrl, {
                responseType: 'stream',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': baseUrl
                }
            });

            const decodedFileName = decodeURIComponent(fileName);
            const filePath = path.join(outputDir, decodedFileName);
            const fileSize = response.headers['content-length'] ? parseInt(response.headers['content-length']) : null;
            let downloadedBytes = 0;

            console.log(chalk.yellow(`Downloading file ${i + 1} of ${totalFiles}: ${decodedFileName} (${fileSize ? (fileSize / 1024).toFixed(2) : 'Unknown'} KB)`));

            const writer = fs.createWriteStream(filePath);
            response.data.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                const percentFile = fileSize ? ((downloadedBytes / fileSize) * 100).toFixed(2) : 'Unknown';
                const elapsedTime = (Date.now() - startTime) / 1000;
                const speed = downloadedBytes / elapsedTime; // Bytes per second
                const timeRemainingFile = fileSize ? ((fileSize - downloadedBytes) / speed).toFixed(2) : 'Unknown';

                process.stdout.write(chalk.blue(`\rDownloading ${i + 1} of ${totalFiles}: ${percentFile}% (${(downloadedBytes / 1024).toFixed(2)} KB) - Est. time left: ${timeRemainingFile}s`));
            });

            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', () => {
                    console.log(chalk.green(`\nDownloaded: ${filePath}`));
                    resolve();
                });
                writer.on('error', err => {
                    console.error(chalk.red(`Error saving ${filePath}:`, err));
                    reject(err);
                });
            });
        } catch (error) {
            console.error(chalk.red(`Error downloading ${fileName}:`, error.message));
            await useSystemDownload(baseUrl, fileName, outputDir);
        }
    }
}



async function useSystemDownload(baseUrl, fileName, outputDir) {
    return new Promise((resolve, reject) => {
        const encodedFileName = encodeURIComponent(fileName);
        const fileUrl = `${baseUrl}/${encodedFileName}`;
        const decodedFileName = decodeURIComponent(fileName);
        const filePath = path.join(outputDir, decodedFileName);

        console.log(chalk.yellow(`WARNING: Couldn't download ${fileName} using node, attempting to download via system...`));

        const command = `powershell -Command "& { $client = New-Object System.Net.WebClient; $client.DownloadFile('${fileUrl}', '${filePath}'); Write-Host 'Download Complete' }"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`PowerShell download failed:`, error.message));
                reject(error);
            } else {
                console.log(chalk.green(`Downloaded via PowerShell: ${fileUrl}`));
                resolve();
            }
        });
    });
}

// Get base URL
rl.question('Enter the base URL: ', (baseUrl) => {
    rl.question('Enter the output directory: ', (outputDir) => {
        console.log('Enter file names (press Enter after each, then type "DONE" to finish):');

        let fileNames = [];

        rl.on('line', (input) => {
            if (input.trim().toUpperCase() === 'DONE') {
                rl.close();
                downloadFiles(baseUrl, fileNames, outputDir);
            } else {
                fileNames.push(input.trim());
            }
        });
    });
});
