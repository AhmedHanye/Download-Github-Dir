import axios, { AxiosResponse } from "axios";
import JSZip from "jszip";

/**
 * Downloads a GitHub repository folder as a ZIP file.
 * @param folderUrl URL of the GitHub repository folder.
 * @param folderName Name of the ZIP file to be generated.
 * @param progress Optional callback function to report download progress.
 */
const convert_url = (url: string): Promise<string> => {
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
interface GitHubFile {
  type: string;
  name: string;
  download_url: string;
  url: string;
}

export const DownloadGithubFolder = async (
  folderUrl: string,
  folderName: string,
  progress: (message: string) => void = () => {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const DownloadFiles = async (
      files: GitHubFile[],
      zip: JSZip,
      parentFolder: string = ""
    ): Promise<void> => {
      const downloadPromises = files.map(async (file: GitHubFile) => {
        try {
          if (file.type === "file" && file.download_url) {
            const fileResponse: AxiosResponse<ArrayBuffer> = await axios.get(
              file.download_url,
              { responseType: "arraybuffer" }
            );
            zip.file(`${parentFolder}${file.name}`, fileResponse.data);
            progress(`${parentFolder}${file.name}`);
          } else if (file.type === "dir") {
            const folderResponse: AxiosResponse<GitHubFile[]> = await axios.get(
              file.url
            );
            const folderFiles = folderResponse.data;
            const newFolder = `${parentFolder}${file.name}/`;
            await DownloadFiles(folderFiles, zip, newFolder);
          }
        } catch (error) {
          reject(error);
        }
      });

      await Promise.all(downloadPromises);
    };

    convert_url(folderUrl)
      .then(async (res) => {
        try {
          const response: AxiosResponse<GitHubFile[]> = await axios.get(res);
          const files: any = response.data;
          const zip = new JSZip();
          await DownloadFiles(files, zip);
          const content = await zip.generateAsync({ type: "blob" });
          const url = window.URL.createObjectURL(content);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${folderName}.zip`;
          a.click();
          window.URL.revokeObjectURL(url); // Free memory
          resolve("Download complete!");
        } catch (error) {
          reject(error);
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
};
