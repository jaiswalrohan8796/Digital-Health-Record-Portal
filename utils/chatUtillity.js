function formatMessage(ID, text) {
    var date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}`;
    return {
        ID,
        text,
        time: time,
    };
}

module.exports = formatMessage;
