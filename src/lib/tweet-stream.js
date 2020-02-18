const Readable = require('readable-stream/readable')
const debug = require('debug')('scrape-twitter:tweet-stream')
const perf = require('execution-time')()
const twitterQuery = require('./twitter-query')

class TweetStream extends Readable {
  isLocked = false
  _numberOfTweetsRead = 0
  _maxPosition = '-1'
  _hasMoreTweets = 'true'
  constructor (query, type, { count } = {}) {
    super({ objectMode: true })
    this.query = query
    this.type = type === 'latest' ? 'tweets' : 'top'
    this.count = count
    debug(`TweetStream for "${this.query}" and type ${type} created`)
  }

  _read () {
    perf.start()
    if (this.isLocked) {
      debug('TweetStream cannot be read as it is locked')
      return false
    }
    if (!!this.count && this._numberOfTweetsRead >= this.count) {
      debug('TweetStream has read up to the max count')
      this.push(null)
      return false
    }
    if (this._readableState.destroyed) {
      debug('TweetStream cannot be read as it is destroyed')
      this.push(null)
      return false
    }

    this.isLocked = true
    debug('TweetStream is now locked')

    debug(
      `TweetStream queries for tweets outside [ ${this._firstReadTweet}, ..., ${
        this._lastReadTweet
      } ]`
    )
    twitterQuery
      .queryTweets(this.query, this.type, this._maxPosition)
      .then(tweetData => {
        let tweets = tweetData.tweets
        let posData = tweetData.pos_dat

        for (const tweet of tweets) {
          this.push(tweet)
          this._numberOfTweetsRead++
          if (this._numberOfTweetsRead >= this.count) {
            debug('TweetStream has read up to the max count')
            break
          }
        }
        this._maxPosition = posData._minPosition
        const hasMoreTweets = posData._hasMoreItems
        if (hasMoreTweets === false) {
          debug('TweetStream has no more tweets:', {
            hasMoreTweets
          })
          this.push(null)
        } else {
          debug('TweetStream has more tweets:', {
            hasMoreTweets
          })
        }

        this.isLocked = false
        debug('TweetStream is now unlocked')

        if (hasMoreTweets) {
          debug('TweetStream has more tweets so calls this._read')
          this._read()
        }
      })
      .catch(err => this.emit('error', err))
    const results = perf.stop()
    debug('End of read function in tweet stream time: ' + results.time)
  }
}

module.exports = TweetStream
