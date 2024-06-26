# GitHub Folder Downloader

A utility to download GitHub folders as zip files. (Browser Version)

## Installation

```bash
npm i browser-github-folder-downloader
```

## Usage

```bash
import { DownloadGithubFolder } from "browser-github-folder-downloader";

DownloadGithubFolder(
  "https://api.github.com/repos/AhmedHanye/Security-Plus/contents/Extension/dist",
  "downloaded-folder",
  (p) => {
    console.log(p);
  }
);
```
