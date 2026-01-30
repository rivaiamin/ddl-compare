/**
 * Utility Functions
 * These functions are used globally across the application via script tags
 */
/* eslint-disable no-unused-vars */

/**
 * Read a file as text
 * @param {File} file - The file to read
 * @returns {Promise<string>} The file content as text
 */
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate SQL file content
 * @param {string} content - SQL content to validate
 * @returns {Object} { valid: boolean, error: string|null }
 */
function validateSqlFile(content) {
    if (!content || content.trim().length === 0) {
        return { valid: false, error: 'File is empty' };
    }

    // Basic check for SQL-like content
    const sqlKeywords = /CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE/i;
    if (!sqlKeywords.test(content)) {
        return { valid: false, error: 'File does not appear to contain SQL DDL statements' };
    }

    return { valid: true, error: null };
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', or 'info'
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300`;

    if (type === 'success') {
        toast.classList.add('bg-green-600');
    } else if (type === 'error') {
        toast.classList.add('bg-red-600');
    } else {
        toast.classList.add('bg-blue-600');
    }

    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.add('translate-x-0', 'opacity-100');
        toast.classList.remove('-translate-x-full', 'opacity-0');
    }, 10);

    // Remove after duration
    setTimeout(() => {
        toast.classList.add('-translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Show error message inline
 * @param {HTMLElement} container - Container element to show error in
 * @param {string} message - Error message
 */
function showError(container, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message mt-2 text-xs text-red-600 bg-red-50 p-2 rounded';
    errorDiv.textContent = message;

    // Remove existing error
    const existingError = container.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    container.appendChild(errorDiv);
}

/**
 * Clear error message
 * @param {HTMLElement} container - Container element
 */
function clearError(container) {
    const error = container.querySelector('.error-message');
    if (error) {
        error.remove();
    }
}

/**
 * Set loading state
 * @param {boolean} isLoading - Whether to show loading state
 */
function setLoadingState(isLoading) {
    const button = document.querySelector('#generateBtn');
    const spinner = document.querySelector('#loadingSpinner');

    if (isLoading) {
        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
        if (spinner) {
            spinner.classList.remove('hidden');
        }
    } else {
        button.disabled = false;
        button.classList.remove('opacity-50', 'cursor-not-allowed');
        if (spinner) {
            spinner.classList.add('hidden');
        }
    }
}
