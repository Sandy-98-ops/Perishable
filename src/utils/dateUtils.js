/**
 * Formats a Date object to a string in the format dd-mm-yyyy.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
export function formatDateToDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}


export function formatDatetoDBDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
}