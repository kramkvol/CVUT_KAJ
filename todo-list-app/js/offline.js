/**
 * ==========================================
 * Network Status Indicator Utility
 * ==========================================
 * 
 * This function displays a temporary banner to notify the user
 * whether they are currently online or offline.
 * 
 * It uses the `navigator.onLine` property to detect the status,
 * and listens to "online" and "offline" events from the browser.
 * 
 * Expected HTML element:
 * - A div with ID "networkStatus" must exist on the page
 *   (usually placed near the top of the <body>)
 * 
 * Behavior:
 * - Shows a green banner when online
 * - Shows a red banner when offline
 * - Automatically hides the banner after 3 seconds
 */

window.App = window.App || {};

App.checkNetworkStatus = function() {
    const statusDiv = document.getElementById("networkStatus");

    function update() {
        if (navigator.onLine) {
            statusDiv.textContent = "You are online";
            statusDiv.style.backgroundColor = "lightgreen";
        } else {
            statusDiv.textContent = "You are offline";
            statusDiv.style.backgroundColor = "lightcoral";
        }
        statusDiv.style.display = "block";
        setTimeout(() => statusDiv.style.display = "none", 3000);
    }

    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    update();
};
