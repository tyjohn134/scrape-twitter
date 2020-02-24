const streamToPromise = require('stream-to-promise')
const Moment = require('moment')
const scrapeTwitter = require('../src')
const MomentRange = require('moment-range')
const moment = MomentRange.extendMoment(Moment)
const {
  TweetStream
} = scrapeTwitter
let since = moment('2020-01-03').unix()
const range = moment.range('2020-01-04', '2020-01-28')
let promises = []
const daterange = Array.from(range.by('day')).map(date => date.unix())
async function main() {
    for(let until of daterange){
        const timelineStream = new TweetStream(`https://www.businessinsider.com/us-allies-response-trump-iran-qasem-soleimani-attack-alone-world-2020-1 since:${since} until:${until} exclude:nativeretweets exclude:retweets`, 'latest', {
          count: 100
        })
       let promise =  streamToPromise(timelineStream)
       promises.push(promise)
       since = until
    }
   let results = await Promise.all(promises)
   let dupArray = results.flat(2).map(tweet => tweet.screenName)
   let finalArray = new Set(results.flat(2).map(tweet => tweet.screenName))
   console.log([...finalArray])
   console.log(`set array: ${[...finalArray].length}`)
   console.log(`dup array: ${dupArray.length}`)
}

main()
