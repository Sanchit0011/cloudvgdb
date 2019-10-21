app.controller('visualCtrl', function($scope, $http) {

    $scope.username = localStorage.getItem('username');
    $scope.visualdata = [];
    $scope.visualdata2 = [];
    $http.get("https://vgdbnode.appspot.com/visualize/")
    .then(function (response) {
      for (data in response.data) {
        $scope.visualdata.push(response.data[data]);
    }

      for(vd in $scope.visualdata) {
          $scope.visualdata[vd].value = parseInt($scope.visualdata[vd].value);
      }

      $scope.options = {
        chart: {
            type: 'discreteBarChart',
            height: 320,
            margin : {
                top: 10,
                right: 20,
                bottom: 50,
                left: 55
            },
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.1f')(d);
            },
            duration: 500,
            xAxis: {
            },
            yAxis: {
                axisLabel: 'Number of games marked as favorite',
                axisLabelDistance: -10
            }
        }
    };

    $scope.data = [
        {
            key: "Cumulative Return",
            values: $scope.visualdata
        }
    ]

    

    });


    $http.get("https://vgdbnode.appspot.com/visualize2")
    .then(function (response) {
      for (data in response.data) {
        $scope.visualdata2.push(response.data[data]);
      }

      for(vd2 in $scope.visualdata2) {
        $scope.visualdata2[vd2].value = parseInt($scope.visualdata2[vd2].value);
    }

      $scope.options2 = {
        chart: {
            type: 'discreteBarChart',
            height: 320,
            margin : {
                top: 10,
                right: 20,
                bottom: 50,
                left: 55
            },
            
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.1f')(d);
            },
            duration: 500,
            xAxis: {
            },
            yAxis: {
                axisLabel: 'Number of users who marked game as favorite',
                axisLabelDistance: -10
            }
        }
    };

    $scope.data2 = [
        {
            key: "Cumulative Return",
            values: $scope.visualdata2
        }
    ]

 });

 

//  $scope.vizExists = function() {
//      if($scope.visualdata.length)
//  }
    
//  $scope.isLoggedIn = function () {
//     if (localStorage.length > 0) {
//         return true;
//     } else {
//         return false;
//     }
// }


});