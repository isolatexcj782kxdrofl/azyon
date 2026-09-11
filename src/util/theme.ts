import { themes } from "../themes";

function selectedTheme(): Theme {
  return themes.find((theme) => theme.id === localStorage.getItem("theme")) ?? themes.find((theme) => theme.id === "mocha")!;
}

export function getStyle(): string {
  const theme = selectedTheme();

  return `
    :root, [data-theme] {
      --bg-primary: ${theme.bgPrimary};
      --bg-secondary: ${theme.bgSecondary};
      --text-primary: ${theme.textPrimary};
      --text-secondary: ${theme.textSecondary};
      --accent-primary: ${theme.accentPrimary};
      --accent-secondary: ${theme.accentSecondary};
    }
  `.replace(/\s/g, "");
}

export function updateTheme(): void {
  document.documentElement.dataset.theme = selectedTheme().id;
  document.documentElement.classList.toggle("reduce-motion", localStorage.getItem("reduceMotion") === "true");
  document.documentElement.classList.toggle("compact-cards", localStorage.getItem("compactCards") === "true");
}

updateTheme();
window.addEventListener("storage", updateTheme);

export function getTheme(): Theme {
  return selectedTheme();
}
