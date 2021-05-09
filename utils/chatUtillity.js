const moment = require("moment");
function formatMessage(ID, text) {
    return {
        ID,
        text,
        time: moment().format("LT")
    };
}

module.exports = formatMessage;