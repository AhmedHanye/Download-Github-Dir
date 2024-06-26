# GitHub Folder Downloader

A utility to download GitHub folders as zip files. (Node Version)

## Installation

```bash
npm i github-folder-downloader
```

## Usage

```bash
const DownloadGithubFolder = require("github-folder-downloader");

DownloadGithubFolder(
  "https://api.github.com/repos/AhmedHanye/Security-Plus/contents/Extension/dist",
  "downloaded-folder",
  (p) => {
    console.log(p);
  }
);
```
