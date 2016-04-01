var search= angular.module("search",['ngMaterial','ngMdIcons','ngMessages','ngSanitize']);

search.controller("search",['$scope','$http', '$sce',function($scope,$http,$sce){
	
	$scope.noResultsFound = false;
	$scope.resultIsBack = false;

	$scope.searchText = function()
	{
		$scope.searchHash();
//		$scope.searchTweet();
//		$scope.searchUser();
	}
	
	$scope.searchHash =function()
	{
		$scope.tweetResults =[];
		$http({
			method:"POST",
			url:"/searchHash",
			data:{
				"searchInput" : $scope.searchInput
			}
			}).success(function(data){
				
				$scope.resultIsBack = true;
				if(data.statusCode==401)
					{
					}
				else if(data.statusCode==204)
					{
						$scope.noResultsFound = true;
					}
				else if(data.statusCode==200)
					{
					$scope.noResultsFound = false;
					
					$scope.tweetResults = data.results;
					
					}
			}).error(function(error){
			});
		
	}
	
//	$scope.searchTweet =function()
//	{
//		$http({
//			method:"POST",
//			url:"/searchHash",
//			data:{
//				"searchInput" : $scope.searchInput
//			}
//			}).success(function(data){
//				if(data.statusCode==401)
//					{
//					}
//				else
//					{
//						
//					}
//			}).error(function(error){
//			});
//		
//	}
//	
//	$scope.searchUser =function()
//	{
//		$http({
//			method:"POST",
//			url:"/searchHash",
//			data:{
//				"searchInput" : $scope.searchInput
//			}
//			}).success(function(data){
//				if(data.statusCode==401)
//					{
//					}
//				else
//					{
//						
//					}
//			}).error(function(error){
//			});
//		
//	}
	
	$scope.trustHtml = function(html) {
        // Sanitize manually if necessary. It's likely this 
        // html has already been sanitized server side 
        // before it went into your database. 
        // Don't hold me liable for XSS... never assume :~) 
        return $sce.trustAsHtml(html);
    };
	
}]);