import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { faDownload, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import Logo from "./assets/github.webp";

import { getTheme, setTheme, changeTheme } from "./utils/general";

import { DownloadGithubFolder } from "browser-github-folder-downloader";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const App = () => {
  const [theme, setThemeState] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [output, setOutput] = useState<string[]>([]);
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    setThemeState(getTheme());
  }, []);
  useEffect(() => {
    changeTheme();
  }, [theme]);
  useGSAP(() => {
    gsap.to("#card", {
      duration: 5,
      backgroundImage: "linear-gradient(0deg,#AF40FF, #5B42F3 50%,#00DDEB)",
      repeat: -1,
      ease: "ease-in-out",
      delay: 1,
    });
  }, []);

  return (
    <div
      className={
        "h-screen bg-slate-200 dark:bg-Charcoal text-black dark:text-white flex flex-col px-8 pt-1"
      }
      id="container"
    >
      <nav className="mx-auto w-full xl:w-4/5 flex items-center justify-between h-16">
        <a
          href="/"
          className="hover:brightness-125 transition-all duration-100"
        >
          <img src={Logo} width={32} height={32} alt="Logo" />
        </a>
        <button
          name="theme"
          aria-label="Toggle Theme"
          id="theme"
          className={
            "text-2xl dark:hover:shadow-shadow1 dark:hover:text-orange-500 hover:shadow-shadow2 hover:text-slate-500 transition-colors duration-100 shadow-lg rounded-full w-8 h-8"
          }
          onClick={() => {
            setTheme(!theme);
            setThemeState(!theme);
          }}
        >
          {theme ? (
            <FontAwesomeIcon icon={faSun} />
          ) : (
            <FontAwesomeIcon icon={faMoon} />
          )}
        </button>
      </nav>
      <main className="h-full py-3 overflow-hidden flex items-center justify-center">
        <div
          id="card"
          className="mx-auto h-5/6 max-sm:h-full w-full xl:w-4/5 bg-bgImage1 rounded-3xl p-1"
        >
          <div className="bg-background1 h-full w-full flex flex-col gap-5 rounded-3xl p-8 max-sm:p-5">
            <div id="action" className="flex gap-5">
              <label htmlFor="url"></label>
              <input
                id="url"
                type="text"
                className="w-full py-1.5 max-sm:py-1 rounded text-Charcoal px-2 disabled:bg-slate-300"
                disabled={downloading}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
                placeholder="Enter the URL of the GitHub repository "
              />
              <button
                name="download"
                type="button"
                className={`focus:outline-none w-48 py-1.5 max-sm:py-1 max-sm:text-xs flex gap-2 justify-center items-center transition-all duration-100 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-bold rounded-md dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 ${
                  downloading && "cursor-not-allowed"
                }`}
                onClick={() => {
                  setDownloading(true);
                  setOutput([]);
                  const urlParts = url.split("/");
                  const folderName = urlParts[urlParts.length - 1];
                  DownloadGithubFolder(url, folderName, (line) => {
                    setOutput((prev) => {
                      return [...prev, line];
                    });
                  })
                    .then(() => {
                      setDownloading(false);
                    })
                    .catch((e) => {
                      let error = e as Error;
                      if (error.message == "files.map is not a function") {
                        const newURL = url + "/archive/refs/heads/master.zip";
                        const a = document.createElement("a");
                        a.href = newURL;
                        a.click();
                        // Free memory
                        window.URL.revokeObjectURL(newURL);
                      } else {
                        setOutput((prev) => {
                          return [...prev, e.message];
                        });
                      }
                      setDownloading(false);
                    });
                }}
                disabled={downloading}
              >
                {downloading ? (
                  <>
                    <span>Downloading...</span>
                    <FontAwesomeIcon
                      className="animate-spin"
                      icon={faCircleNotch}
                    />
                  </>
                ) : (
                  <>
                    <span>Download</span>
                    <FontAwesomeIcon icon={faDownload} />
                  </>
                )}
              </button>
            </div>
            <div id="output" className="max-h-full rounded-lg overflow-auto">
              {output.map((line, index) => {
                return (
                  <p key={index} className="text-white">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
