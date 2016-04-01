var editProfile= angular.module("editProfile",['ngMaterial','ngMdIcons','ngMessages']);

editProfile.controller("editProfile",function($scope,$http){

	
	$scope.fetchData= function(){
			$http({
				method:"POST",
				url:"/fetchProfileData",
				data:{
					
				}
				}).success(function(data){
					if(data.statusCode==401)
						{
						}
					else
						{
							$scope.twitterHandle = data.result.TWITTER_HANDLE;
							$scope.firstName = data.result.FIRST_NAME;
							$scope.lastName = data.result.LAST_NAME;
							$scope.dateOfBirth = new Date(data.result.DOB);;
							$scope.email = data.result.EMAIL;
							$scope.location = data.result.LOCATION;
							$scope.phoneNumber = data.result.PHONE_NUMBER;
//							$scope. = result.;
						}
				}).error(function(error){
				});
			}
		
	$scope.fetchData();
	
	
	$scope.updateData= function(){
		$http({
			method:"POST",
			url:"/updateProfileData",
			data:{
				"FIRST_NAME" : $scope.firstName, 
				"LAST_NAME" : $scope.lastName, 
				"DOB" : $scope.dateOfBirth, 
				"EMAIL" : $scope.email, 
				"LOCATION" : $scope.location, 
				"PHONE_NUMBER" : $scope.phoneNumber 
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
	
	
	
});
	