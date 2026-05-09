/**
 * Parse query parameters from the URL
 * @returns {Object} Parsed query parameters
 */
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        backgroundColor: params.get('backgroundColor') || '#ffffff',
        fontColor: params.get('fontColor') || '#333333',
        foregroundColor: params.get('foregroundColor') || '#f5f5f5',
        buttonColor: params.get('buttonColor') || '#007bff',
        timestamp: params.get('timestamp') || new Date().toISOString()
    };
}

/**
 * Apply query parameters to the document
 */
function applyParameters() {
    const params = getQueryParams();

    // Apply background color to widget container
    document.documentElement.style.setProperty('--background-color', params.backgroundColor);

    // Apply foreground color to todo items
    document.documentElement.style.setProperty('--foreground-color', params.foregroundColor);
    
    // Apply button color to buttons
    document.documentElement.style.setProperty('--button-color', params.buttonColor);

    // Apply font color to headings and text
    document.documentElement.style.setProperty('--font-color', params.fontColor);
    document.documentElement.style.setProperty('--delete-icon', `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23${params.fontColor.substring(1)}' d='M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1'/%3E%3C/svg%3E")`);

    return params;
}

// Export functions for use in HTML
window.notionWidgetParams = {
    getQueryParams,
    applyParameters
};

// Start when DOM is ready
document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', applyParameters)
    : applyParameters();