app.controller('registerCtrl', function ($scope, $http, $timeout) {

    $scope.user = {};
    $scope.regMessage="";
    
    $scope.createUser = function () {

        $http({
            method: 'POST',
            url: 'https://vgdbnode.appspot.com/user_registration',
            data: $scope.user
        }) .then(function (response) {
            console.log(response);
            if(response.data == 'Username already exists') {
                $scope.regMessage = "Username already exists";
                $scope.color= {
                    "color": "red"
                }

            }

            else {
            $scope.regMessage = "You have sucessfully registered a vgdb account";
            $scope.color= {
                "color": "blue"
            }

            $timeout(function () {
                window.location.reload();
              }, 2000);
            }
        })
    }

    
});