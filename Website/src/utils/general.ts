export const changeTheme = () => {
  const currentTheme = document
    .querySelector("html")
    ?.classList.contains("dark");
  const saved = localStorage.getItem("theme") === "true";
  if (saved !== currentTheme) {
    if (saved) {
      document.querySelector("html")?.classList.add("dark");
    } else {
      document.querySelector("html")?.classList.remove("dark");
    }
  }
};

export const setTheme = (theme: boolean) => {
  localStorage.setItem("theme", theme.toString());
  changeTheme();
};

export const getTheme = () => {
  return localStorage.getItem("theme") === "true";
};
