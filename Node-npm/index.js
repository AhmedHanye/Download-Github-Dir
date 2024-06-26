const axios = require("axios");
const JSZip = require("jszip");
const fs = require("fs");
const { resolve } = require("path");
const { rejects } = require("assert");

/**
 * Downloads files from a GitHub folder URL and creates a ZIP archive.
 * @param {string} folderUrl - The URL of the GitHub folder API.
 * @param {string} [folderName="downloaded-folder"] - The name for the downloaded folder and ZIP file.
 * @param {Function} [progress=() => {}] - A callback function to track download progress.
 * @param {string} [Path="./"] - The path where the ZIP file should be saved. Should end with a slash (backslash on Windows).
 * @returns {Promise<string>} - A Promise that resolves once the ZIP file has been created successfully.
 * @throws {Error} Throws an error if there is an issue fetching GitHub repository contents or creating the ZIP file.
 */

const convert_url = (url) => {
  return new Promise((resolve, reject) => {
    try {
      // Validate the input URL to start with "https://github.com/"
      const githubPrefix = "https://github.com/";
      if (!url.startsWith(githubPrefix)) {
        throw new Error("Invalid GitHub URL");
      }

      // Start the new URL with the GitHub API prefix
      let newURL = "https://api.github.com/repos/";

      // Extract the repository path and append it to the new URL
      newURL += url.slice(githubPrefix.length);

      // Replace /tree/branch_or_directory with /contents
      newURL = newURL.replace(/\/tree\/[^\/]+/, "/contents");
      resolve(newURL);
    } catch (e) {
      reject(e);
    }
  });
};

const DownloadGithubFolder = async (
  folderUrl,
  folderName = "downloaded-folder",
  progress = () => {},
  Path = "./"
) => {
  const DownloadFiles = async (files, zip, parentFolder = "") => {
    const downloadPromises = files.map(async (file) => {
      if (file.type === "file" && file.download_url) {
        const fileResponse = await axios.get(file.download_url, {
          responseType: "arraybuffer",
        });
        zip.file(`${parentFolder}${file.name}`, fileResponse.data);
        progress(`${parentFolder}${file.name}`);
      } else if (file.type === "dir") {
        const folderResponse = await axios.get(file.url);
        const folderFiles = folderResponse.data;
        const newFolder = `${parentFolder}${file.name}/`;
        await DownloadFiles(folderFiles, zip, newFolder);
      }
    });
    await Promise.all(downloadPromises);
  };

  convert_url(folderUrl)
    .then(async (res) => {
      {
        try {
          const response = await axios.get(res);
          const files = response.data;
          const zip = new JSZip();
          await DownloadFiles(files, zip);
          const content = await zip.generateAsync({ type: "nodebuffer" });
          const fullPath = `${Path}${folderName}`;
          fs.writeFileSync(`${fullPath}.zip`, content);
          resolve(`${folderName}.zip has been created successfully.`);
        } catch (error) {
          rejects(error);
        }
      }
    })
    .catch((e) => {
      rejects(e);
    });
};

module.exports = DownloadGithubFolder;