/**
 * Format any date to DD/MM/YYYY
 * @param {string|Date|null} dateInput
 * @returns {string}
 */
export const formatDate = (dateInput) => {
    if (!dateInput) return '-';
    try {
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return '-';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return '-';
    }
};

/**
 * Format any date to DD/MM/YYYY HH:mm
 * @param {string|Date|null} dateInput
 * @returns {string}
 */
export const formatDateTime = (dateInput) => {
    if (!dateInput) return '-';
    try {
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return '-';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
        return '-';
    }
};

export const formatTimeArabic = (dateInput) => {
    if (!dateInput) return '';
    try {
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return '';
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? 'م' : 'ص';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
    } catch {
        return '';
    }
};
