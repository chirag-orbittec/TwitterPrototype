var profile= angular.module("profile",['ngMaterial','ngMdIcons','ngSanitize']);

profile.controller("profile",['$scope','$http', '$sce','profileId','isExistingFollower',
                      		'follower_count',
                      		function($scope,$http,$sce,profileId,isExistingFollower,follower_count){
	
	
	$scope.followShow = true;
	$scope.followerCount = follower_count;
	
	
	console.log(isExistingFollower);
	if(isExistingFollower>0)
		{
		$scope.followShow= false;
		console.log("in >0"+$scope.followShow);
		}
	
	$scope.profileId = profileId;
	
	$scope.follow= function(){
	console.log(isExistingFollower);
		$http({
			method:"POST",
			url:"/follow",
			data:{
				"profileId":profileId,
			}
			}).success(function(data){
				if(data.statusCode==401)
					{
					
					}
				else
					{
					$scope.followShow = false;
					$scope.followerCount +=1;  
					}
			}).error(function(error){
				
			});
		}
	
	$scope.unfollow= function(){
		
		$http({
			method:"POST",
			url:"/unfollow",
			data:{
				"profileId":profileId,
			}
			}).success(function(data){
				if(data.statusCode==401)
					{
					
					}
				else
					{
					$scope.followShow = true;
					$scope.followerCount -=1;
					}
			}).error(function(error){
				
			});
		}
	
	$scope.retweet= function(tweetId)
	{
		console.log("clicked :"+tweetId);
		
		$http({
			method:"POST",
			url:"/retweet",
			data:{
				"tweetId":tweetId,
			}
			}).success(function(data){
				if(data.statusCode==401)
					{
					
					}
				else
					{
						
					}
			}).error(function(error){
				
			});
	}
	
	$scope.trustHtml = function(html) {
        // Sanitize manually if necessary. It's likely this 
        // html has already been sanitized server side 
        // before it went into your database. 
        // Don't hold me liable for XSS... never assume :~) 
        return $sce.trustAsHtml(html);
    };
	
}]);