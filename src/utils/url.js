/**
 * Конвертирует относительный URL в искомый (для локальной разработки 8000 порт убираем)
 * @param url
 * @returns {string}
 * @private
 */
export function _u(url) {
   if (process.env.NODE_ENV === 'development') {
      return 'http://localhost/lv' + url;
   }

   return '/lv' + url;
}