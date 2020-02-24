const streamToPromise = require('stream-to-promise')

const scrapeTwitter = require('../src')

const {
  TimelineStream,
  LikeStream,
  ConnectionStream,
  ConversationStream,
  TweetStream,
  ListStream,
  getUserProfile
} = scrapeTwitter

test.skip('TimelineStream should emit a particular set of tweets', () => {
  const expectedTweetIds = ['509087583348195329']
  const expectedTweet = {
    screenName: 'peterthiel',
    id: '509087583348195329',
    text: expect.stringMatching('from zero to one'),
    time: '2014-09-08T21:15:12.000Z',
    userMentions: [],
    hashtags: [],
    images: [],
    urls: [
      // url-regex is sometimes matching words in front of a url as the url... This needs to be fixed.
      {
        indices: [expect.any(Number), expect.any(Number)],
        url: expect.any(String)
      }
    ],
    isPinned: false,
    isReplyTo: false,
    isRetweet: false,
    replyCount: expect.any(Number),
    retweetCount: expect.any(Number),
    favoriteCount: expect.any(Number)
  }
  const timelineStream = new TimelineStream('peterthiel')
  return streamToPromise(timelineStream).then(tweets => {
    const tweetIds = tweets.map(tweet => tweet.id)
    expect(tweetIds).toEqual(expectedTweetIds)
    expect(tweets[0]).toMatchObject(expectedTweet)
  })
})

test.skip('LikeStream should emit a particular set of tweets', () => {
  const expectedTweetIds = [
    '453896154439499776',
    '448460333808877568',
    '444111658508898304',
    '443801915756138497',
    '443749290717241344',
    '443683376764317696',
    '443077086786633728',
    '442030176873238528',
    '441937334221950976',
    '441871397091291136'
  ]
  const expectedTweet = {
    id: '453896154439499776',
    screenName: 'bemomentum',
    text: expect.stringMatching('8 tips for creating the perfect pitch deck'),
    time: '2014-04-09T14:04:10.000Z',
    isPinned: false,
    isReplyTo: false,
    isRetweet: false,
    userMentions: [],
    urls: [{ indices: [75, 97], url: 'http://buff.ly/1qq7VRw' }],
    hashtags: [],
    images: [],
    favoriteCount: expect.any(Number),
    replyCount: expect.any(Number),
    retweetCount: expect.any(Number)
  }

  const env = {
    TWITTER_USERNAME: 'bemomentum',
    TWITTER_PASSWORD: 'forawhile',
    TWITTER_KDT: 'AG5Cw6jJDktHfiQFF9mdEqz4c4NJ29rvvHTaIi9w'
  }
  const likeStream = new LikeStream('bemomentum', { env, count: 10 })
  return streamToPromise(likeStream).then(tweets => {
    const tweetIds = tweets.map(tweet => tweet.id)
    expect(tweetIds).toEqual(expectedTweetIds)
    expect(tweets[0]).toEqual(expectedTweet)
  })
})

test.skip('ConnectionStream should emit a particular set of connections', () => {
  const expectedConnection = {
    screenName: 'TableCrowd',
    profileImage:
      'https://pbs.twimg.com/profile_images/2448165667/8gb38sxoeypx8p800knw_bigger.png',
    name: 'TableCrowd',
    bio: expect.any(String),
    urls: expect.any(Array),
    hashtags: expect.any(Array),
    userMentions: expect.any(Array)
  }

  const env = {
    TWITTER_USERNAME: 'bemomentum',
    TWITTER_PASSWORD: 'forawhile',
    TWITTER_KDT: 'AG5Cw6jJDktHfiQFF9mdEqz4c4NJ29rvvHTaIi9w'
  }
  const connectionStream = new ConnectionStream('bemomentum', 'following', env)
  return streamToPromise(connectionStream).then(connections => {
    expect(connections[0]).toEqual(expectedConnection)
  })
})

test.skip('ConversationStream should emit a particular set of tweets', () => {
  const expectedTweetIds = [
    '837640713672196096',
    '837641720082935810',
    '837646055713951745'
  ]
  const expectedTweet = {
    id: '837641720082935810',
    screenName: 'sebinsua',
    text: `I will unpack these thoughts since they are important but probably look like trivialities:`,
    time: '2017-03-03T12:32:03.000Z',
    isPinned: false,
    isReplyTo: true,
    isReplyToId: '837640713672196096',
    isRetweet: false,
    userMentions: [],
    urls: [],
    hashtags: [],
    images: [],
    favoriteCount: expect.any(Number),
    replyCount: expect.any(Number),
    retweetCount: expect.any(Number)
  }

  const conversationStream = new ConversationStream(
    'sebinsua',
    '837640713672196096',
    {}
  )
  return streamToPromise(conversationStream).then(tweets => {
    const tweetIds = tweets.map(tweet => tweet.id)
    expect(tweetIds).toEqual(expectedTweetIds)
    expect(tweets[1]).toMatchObject(expectedTweet)
  })
})

test('TweetStream should emit a particular set of tweets', () => {
  const expectedTweetIds = [
    '453896154439499776',
    '448460333808877568',
    '444111658508898304',
    '443801915756138497',
    '443749290717241344',
    '443683376764317696',
    '443077086786633728',
    '442030176873238528',
    '441937334221950976',
    '441871397091291136'
  ]
  const expectedTweet = {
    id: '453896154439499776',
    screenName: 'bemomentum',
    text: expect.stringMatching('8 tips for creating the perfect pitch deck'),
    time: '2014-04-09T14:04:10.000Z',
    isPinned: false,
    isReplyTo: false,
    isRetweet: false,
    userMentions: [],
    urls: [{ indices: [75, 97], url: 'http://buff.ly/1qq7VRw' }],
    hashtags: [],
    images: [],
    favoriteCount: expect.any(Number),
    replyCount: expect.any(Number),
    retweetCount: expect.any(Number)
  }

  const timelineStream = new TweetStream('from:bemomentum', 'latest', {
    count: 10
  })
  return streamToPromise(timelineStream).then(tweets => {
    const tweetIds = tweets.map(tweet => tweet.id)
    expect(tweetIds).toEqual(expectedTweetIds)
    expect(tweets[0]).toEqual(expectedTweet)
  })
})

test.skip('ListStream should emit a particular set of tweets', () => {
  const expectedTweet = {
    id: expect.any(String),
    screenName: expect.any(String),
    text: expect.any(String),
    time: expect.any(String),
    isPinned: expect.any(Boolean),
    isReplyTo: expect.any(Boolean),
    isRetweet: expect.any(Boolean),
    quote: expect.any(Object),
    userMentions: expect.any(Array),
    urls: expect.any(Array),
    hashtags: expect.any(Array),
    images: expect.any(Array),
    favoriteCount: expect.any(Number),
    replyCount: expect.any(Number),
    retweetCount: expect.any(Number),
    userId: expect.any(String)
  }

  const listStream = new ListStream('nouswaves', 'list', { count: 5 })
  return streamToPromise(listStream).then(tweets => {
    expect(tweets).toHaveLength(5)
    expect(tweets[0]).toEqual(expectedTweet)
  })
})

test.skip('getUserProfile() should return my account', () => {
  const expectedUserProfile = {
    screenName: 'sebinsua',
    name: 'Seb Insua',
    profileImage:
      'https://pbs.twimg.com/profile_images/1219399718909988865/TF2mw1ca_400x400.jpg',
    backgroundImage: 'https://pbs.twimg.com/profile_banners/3653733377/1579562628/1500x500',
    bio: '→ @nouswaves',
    location: 'London, England',
    url: 'http://sebinsua.com',
    joinDate: '2015-09-01T00:00:00.000Z',
    urls: [],
    hashtags: [],
    userMentions: [
      {
        screenName: 'nouswaves',
        indices: [2, 12]
      }
    ],
    followingCount: expect.any(Number),
    followerCount: expect.any(Number),
    likeCount: expect.any(Number),
    tweetCount: expect.any(Number),
    userID: '3653733377'
  }
  return getUserProfile('sebinsua').then(userProfile => {
    expect(userProfile).toMatchObject(expectedUserProfile)
  })
})
