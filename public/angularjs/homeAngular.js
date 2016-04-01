var home= angular.module("home",['ngMaterial','ngMdIcons','ngSanitize'])
.config(function($sceProvider) {
	  // Completely disable SCE.  For demonstration purposes only!
	  // Do not use in new projects.
	  $sceProvider.enabled(false);
	});

home.controller("home",['$scope','$http', '$sce',function($scope,$http,$sce){
	
	$scope.isTweetButtonDisabled = false;
	$scope.tweetTextArea = "";

//	$scope.tweetsList = '<%=tweets%>';
	if($scope.tweetTextArea.length)
	{
		$scope.isTweetButtonDisabled = false;
	}

	$scope.tweet= function(){
		$http({
			method:"POST",
			url:"/tweet",
			data:{
				"tweet":$scope.tweetTextArea
			}
		}).success(function(data){
			if(data.statusCode==401)
			{

			}
			else
			{
				window.location.assign("/homepage");
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
	
	

	$scope.deleteTweet= function(tweetId)
	{
		console.log("clicked :"+tweetId);
		
		$http({
			method:"POST",
			url:"/deleteTweet",
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
	
//	$scope.editProfile = function()
//	{
//		
//	}
	
	 $scope.trustHtml = function(html) {
         // Sanitize manually if necessary. It's likely this 
         // html has already been sanitized server side 
         // before it went into your database. 
         // Don't hold me liable for XSS... never assume :~) 
         return $sce.trustAsHtml(html);
     };

}



]);


