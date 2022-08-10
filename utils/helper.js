const moment = require('moment');

const { DATE_FORMAT } = require('./constants');

const isValidDate = (date) => moment(date, DATE_FORMAT, true).isValid();
const getTodaysDate = () => moment().format(DATE_FORMAT);

module.exports = {
    isValidDate,
    getTodaysDate,
};
