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
  "https://github.com/AhmedHanye/Security-Plus/tree/master/Extension/dist",
  "Extension",
  (progress) => console.log(progress),
  "./"
);

```
