 const streamToPromise = require('stream-to-promise')
 const Moment = require('moment')
 const scrapeTwitter = require('../src')
const {
    TimelineStream
} = scrapeTwitter
let tweets = []
const timelineStream = new TimelineStream('mom22rs', {retweets: false, replies: false, count: 200 })
streamToPromise(timelineStream).then(data => {

    const tweetIds = data.map(tweet => tweet.id)
    console.log(tweetIds)
    console.log('full data: ', tweetIds.length)
    console.log('deduped: ', Array.from(new Set(tweetIds)).length)
})

