
/**
 * Module dependencies.
 */

var express = require('express')
  , signUp = require('./routes/signUp')
  , http = require('http')
  , path = require('path')
  , home = require('./routes/home')
  , login = require('./routes/login')
  , tweet = require('./routes/tweet')
  , search = require('./routes/search')
  , follow = require('./routes/follow')
  , profile = require('./routes/profile')
  , session = require('client-sessions');

var app = express();

app.use(session({
	cookieName:"session",
	secret:"CMPE273-TWITTER-SESSION",
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000 // setting time for the session to be active when the window is open // 5 minutes set currently
}));


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/signUp',signUp.signUp);
app.post('/afterSignUp',signUp.afterSignUp);
app.get('/homepage',home.getHomePage);
app.get('/login',login.login);
app.post('/checkLogin',login.checkLogin);
app.post('/tweet',tweet.insertTweet);
app.get('/logout',home.logout);
app.post('/follow',profile.followUser);
app.post('/unfollow',profile.unfollowUser);
app.post('/retweet',tweet.doRetweet);
app.post('/deleteTweet',tweet.deleteTweet);
app.get('/editProfile',profile.editProfile);
app.post('/fetchProfileData',profile.fetchProfileData);
app.post('/updateProfileData',profile.updateProfileData);
app.get('/search',search.getSearchHomePage);
app.post('/searchHash',search.searchFromHashInput);
app.get('/follow',follow.getFollowDetails);
app.post('/getFollowing',follow.getFollowing);
app.post('/getFollower',follow.getFollower);
app.post('/getBasicUserDetails',profile.getBasicUserDetails);

app.get('/hashtags/:hash',search.searchHashTagByTag);

app.get('/:id',profile.getProfile);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
