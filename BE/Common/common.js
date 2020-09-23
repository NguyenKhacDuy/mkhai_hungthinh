function removeSpaces(input) {
    if (typeof input === 'string' || input instanceof String) {
        return input.replace(/\s/g, '')
    } else {
        return ''
    }
}

function separateTimeToUnit(date) {
    const d = date.getDate()
    const m = date.getMonth() + 1
    return ({
        d: d / 10 >= 1 ? d : `0${d}`,
        m: m / 10 >= 1 ? m : `0${m}`,
        y: date.getFullYear()
    })
}

module.exports = {
    removeSpaces: removeSpaces,
    separateTimeToUnit: separateTimeToUnit
}