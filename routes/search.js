var mysql=require("./mysql");
var hash = require('hashtags');

exports.getSearchHomePage = function(req,res)
{
	res.render('search',req.session.username);
}


exports.searchHashTagByTag = function(req,res)
{
	var hashtag = req.param("hash");
	console.log(hashtag);

}


exports.searchFromHashInput = function(req,res)
{
	var textToSearch = req.param("searchInput");
	
	var searchQuery =" SELECT "
    +" TWITTER_HANDLE,FIRST_NAME,LAST_NAME,TWEET,date_format(time_Stamp,\"%M %d,%Y %r\") as time_Stamp_formatted,HASHTAG "
    +" FROM "
    +" hashtags "
    +"    JOIN "
    +" hashtags_used used ON used.hashtag_id = hashtags.HASHTAG_ID "
    +" JOIN "
    +" tweets ON tweets.tweet_id = used.TWEET_ID "
    +" JOIN "
    +" users ON users.user_id = tweets.user_id "
    +" WHERE "
    +" hashtag = '"+textToSearch+"' ORDER BY time_Stamp_formatted DESC";
	
	
	mysql.fetchData(function(err,results) {
		if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}
		else
		{
			if(results.length>0)
			{	
				var tweets = results;
				for(var i=0;i<tweets.length;i++)
				{
					var hashArray = [];
					hashArray = hash(tweets[i].TWEET);
					if(hashArray)
					{
						for(var j=0;j<hashArray.length;j++)
						{
							tweets[i].TWEET = tweets[i].TWEET.replace(hashArray[j]
							, "<a href=\\\'\\../hashtags/"+hashArray[j]+"\\\'"+"><b>"+hashArray[j]+"</b></a>");
							console.log(tweets[i].TWEET);
						}
					}
				}
				json_responses = {"statusCode" : 200,"results":tweets};
				res.send(json_responses);
			}
			else
			{
				json_responses = {"statusCode" : 204};
				res.send(json_responses);
			}
		
		}
	},searchQuery);
}