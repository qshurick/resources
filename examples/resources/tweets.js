var tweets = [
	{ user: 1, tweet: 'Cool, I am on Tweeter' },
	{ user: 1, tweet: 'Bruce, wanna see some street magic?' },
	{ user: 2, tweet: 'No' },
	{ user: 2, tweet: 'I don\'t' },
	{ user: 2, tweet: 'I am Batman' },
	{ user: 1, tweet: 'O_o' },
];

exports.name = 'tweets';
exports.id   = 'tweetId';
exports.index = function(req, res, next) {
	if (res.locals.user) {
		res.json(tweets.filter(function(item) { return res.locals.user.id == item.user; }));
	} else {
		res.json(tweets);
	}
}
exports.attributes = {
	id: {
		description: 'Tweet\'s id'
	},
	user: {
		description: 'User who wrote the tweet'
	},
	tweet: {
		description: 'Message that was tweeted'
	}
}