# GitHub Folder Downloader

A utility to download GitHub folders as zip files. (Browser Version)

## Installation

```bash
npm i browser-github-folder-downloader
```

## Usage

```bash
import { DownloadGithubFolder } from "browser-github-folder-downloader";

const urlParts = url.split("/");
const folderName = urlParts[urlParts.length - 1];
DownloadGithubFolder(url, folderName, (line) => {
  console.log(line);
})
  .then(() => {
    console.log("Downloaded");
  })
  .catch((e) => {
    console.error(e);
});
```
