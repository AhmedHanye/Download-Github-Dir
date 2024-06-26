"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadGithubFolder = void 0;
const axios_1 = __importDefault(require("axios"));
const jszip_1 = __importDefault(require("jszip"));
/**
 * Downloads a GitHub repository folder as a ZIP file.
 * @param folderUrl URL of the GitHub repository folder.
 * @param folderName Name of the ZIP file to be generated.
 * @param progress Optional callback function to report download progress.
 * @returns A promise that resolves to a message indicating the download status.
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
        }
        catch (e) {
            reject(e);
        }
    });
};
const DownloadGithubFolder = (folderUrl_1, folderName_1, ...args_1) => __awaiter(void 0, [folderUrl_1, folderName_1, ...args_1], void 0, function* (folderUrl, folderName, progress = () => { }) {
    return new Promise((resolve, reject) => {
        const DownloadFiles = (files_1, zip_1, ...args_2) => __awaiter(void 0, [files_1, zip_1, ...args_2], void 0, function* (files, zip, parentFolder = "") {
            const downloadPromises = files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (file.type === "file" && file.download_url) {
                        const fileResponse = yield axios_1.default.get(file.download_url, { responseType: "arraybuffer" });
                        zip.file(`${parentFolder}${file.name}`, fileResponse.data);
                        progress(`${parentFolder}${file.name}`);
                    }
                    else if (file.type === "dir") {
                        const folderResponse = yield axios_1.default.get(file.url);
                        const folderFiles = folderResponse.data;
                        const newFolder = `${parentFolder}${file.name}/`;
                        yield DownloadFiles(folderFiles, zip, newFolder);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }));
            yield Promise.all(downloadPromises);
        });
        convert_url(folderUrl)
            .then((res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(res);
                const files = response.data;
                const zip = new jszip_1.default();
                yield DownloadFiles(files, zip);
                const content = yield zip.generateAsync({ type: "blob" });
                const url = window.URL.createObjectURL(content);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${folderName}.zip`;
                a.click();
                window.URL.revokeObjectURL(url); // Free memory
                resolve("Download complete!");
            }
            catch (error) {
                reject(error);
            }
        }))
            .catch((e) => {
            reject(e);
        });
    });
});
exports.DownloadGithubFolder = DownloadGithubFolder;
