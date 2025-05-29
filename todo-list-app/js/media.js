/**
 * =====================================
 * File-to-Base64 Converter Utility
 * =====================================
 * 
 * This function reads a file (e.g. image, audio) from an <input type="file">
 * and converts it into a base64-encoded string using the FileReader API.
 * 
 * It is used to embed file content directly into the app's localStorage,
 * allowing the app to function without a server.
 * 
 * Use case example:
 * - Converting images or audio files when creating a new task
 * 
 * Returns:
 * - A Promise that resolves with the base64 string
 * - Resolves `null` if no file is provided
 */

window.App = window.App || {};

App.readFileAsBase64 = function(file) {
    return new Promise(resolve => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
};
