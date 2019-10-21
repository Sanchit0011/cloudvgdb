app.controller('simulatorCtrl', function($scope, $http) {
    
  $scope.simulatorGames = [];
  $scope.favorites = [];
  $scope.gameData = [];
  $scope.username = localStorage.getItem('username');

  if ($scope.username !== null) {
  $http.get("https://vgdbnode.appspot.com/getfavorites/" + $scope.username)
    .then(function (response) {
      for (data in response.data) {
        $scope.favorites.push(response.data[data].game_id);
      }
  });
  }
  $http.get("https://vgdbnode.appspot.com/getdata/13")
  .then(function(response) {
      for(data in response.data) {
      $scope.simulatorGames.push(response.data[data]);
    }
  });
    
    $scope.identifyGenre = function(genreid) {
      if(genreid == 13) {
        return "Simulator"; 
      }
  
      else if(genreid == 4) {
        return "Fighting";
      }
  
      else if(genreid == 15) {
        return "Strategy";
      }
  
      else if(genreid == 31) {
        return "Adventure";
      }
  
      else if(genreid == 5) {
        return "Shooter";
      }
    }

    $scope.getGameData = function(game_id) {
      $scope.gameData=[];
      $http.get("https://vgdbnode.appspot.com/getGameData/" + game_id)
      .then(function(response) {
        for(data in response.data) {
          $scope.gameData.push(response.data[data]);
        }
      });
  
      // console.log($scope.gameData)
  }

  $scope.markfavorite = function (userfavoritegame) {

    $http({

      method: 'POST',
      url: 'https://vgdbnode.appspot.com/markasfavorite',
      data: {
        game_id: userfavoritegame.id,
        game_name: userfavoritegame.name,
        genre: $scope.identifyGenre(userfavoritegame.genres[0]),
        username: $scope.username
      }

    }).then(function (response) {

        $http.get("https://vgdbnode.appspot.com/getfavorites/" + $scope.username)
          .then(function (response) {
            for (data in response.data) {
              $scope.favorites = [];
              $scope.favorites.push(response.data[data].game_id);
            }
            window.location.reload();
          });
      },

      function (response) { // optional
        console.log("Failed");
      });
  }

  $scope.unmarkfavorite = function (notfavoritegame) {

    $http({

      method: 'DELETE',
      url: 'https://vgdbnode.appspot.com/unmarkfavorite/' + notfavoritegame.name + '/' + $scope.username,
      data: {
        game_name: notfavoritegame.name,
        username: $scope.username
      }

    }).then(function (response) {

        $http.get("https://vgdbnode.appspot.com/getfavorites/" + $scope.username)
          .then(function (response) {
              var index = $scope.favorites.indexOf(notfavoritegame.id);
              if (index > -1) {
                $scope.favorites.splice(index, 1);
              }
            window.location.reload();
          });
      },

      function (response) { // optional
        console.log("Failed");
      });

      // location.reload();
  }

//   $scope.isLoggedIn = function () {
//     if (localStorage.length > 0) {
//         return true;
//     } else {
//         return false;
//     }
// }
  });