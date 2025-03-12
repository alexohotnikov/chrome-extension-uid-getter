function detectTheme() {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    console.log(`Theme detected: ${isDarkMode ? "Dark Mode" : "Light Mode"}`);
    
    return isDarkMode ? "dark" : "light";
}

// Listen for theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    console.log("Theme changed:", e.matches ? "Dark Mode" : "Light Mode");
    updateIcon(e.matches);
});

// Function to update the extension icon
function updateIcon(isDarkMode) {
    const iconPath = isDarkMode ? "icons/icon_white.png" : "icons/icon_black.png";
    chrome.action.setIcon({ path: iconPath });
}

// Run detection on startup
chrome.runtime.onStartup.addListener(() => {
    updateIcon(detectTheme() === "dark");
});

// Run detection when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    updateIcon(detectTheme() === "dark");
});