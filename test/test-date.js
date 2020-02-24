const Moment = require('moment')
const MomentRange = require('moment-range')

const moment = MomentRange.extendMoment(Moment)

const range = moment.range('2020-01-01', '2020-02-01')

const dates = Array.from(range.by('day')).map(date => date.unix())

console.log(dates)
