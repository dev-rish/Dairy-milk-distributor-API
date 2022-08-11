const moment = require('moment');

const { DATE_FORMAT } = require('./constants');

/**
 * Checks if the date is valid and per date format
 * @param {String} date
 * @returns {Boolean}
 */
const isValidDate = (date) => moment(date, DATE_FORMAT, true).isValid();

/**
 * Returns today's date as per date format
 * @returns {String}
 */
const getTodaysDate = () => moment().format(DATE_FORMAT);

module.exports = {
    isValidDate,
    getTodaysDate,
};
