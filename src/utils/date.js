import moment from 'moment';

/**
 * Форматирует js дату в наш формат
 * @param date
 * @returns {string}
 */
export function formatWithTime(date) {
    if (!date) {
        return date;
    }

    date = moment(new Date(date));
    return date.format("DD.MM.YYYY HH:mm:ss");
}