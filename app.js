var app = angular.module('myApp', ['ui.router','ngToast','textAngular']);

app.run(function($rootScope, AuthService, $state, $transitions){
    // $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    //     if(toState.authenticate == true)
    //     {
    //         AuthService.isAuthenticated()
    //         .then(function(res){
    //             console.log(res);
    //             if(res == false)
    //             {
    //                 $state.go('login');
    //             }
    //         });
    //     }
    // })
    
    $transitions.onStart({}, function(transition){
        if(transition.$to().self.authenticate == true){
            AuthService.isAuthenticated()
            .then(function(res){
                console.log(res);
                if(res == false)
                {
                    $state.go('login');
                }
            });
        }
    })
});

app.factory('AuthService', function($q, $rootScope){
    return {
        isAuthenticated : function(){
            var defer = $q.defer();
            
            Stamplay.User.currentUser(function(err, res){
                if(err){
                    defer.resolve(false);
                    $rootScope.loggedIn = false;
                }
                
                if(res.user){
                    defer.resolve(true);
                    $rootScope.loggedIn = true;
                }
                else{
                    defer.resolve(false);
                    $rootScope.loggedIn = false;
                }
            });
            
            return defer.promise;
            
        }
    }
});

app.config(function($stateProvider, $urlRouterProvider){
    Stamplay.init("blogit");
    
    localStorage.removeItem('https://blogit-samarthagarwal.c9users.io-jwt');
    
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'templates/home.html',
            controller: "HomeCtrl"
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: "LoginCtrl"
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'templates/signup.html',
            controller: "SignUpCtrl"
        })
        .state('MyBlogs', {
            url: '/myBlogs',
            templateUrl: 'templates/myBlogs.html',
            controller: 'MyBlogsCtrl',
            authenticate: true
        })
        .state('Create', {
            url: '/create',
            templateUrl: 'templates/create.html',
            controller: 'CreateCtrl',
            authenticate: true
        })
        .state('Edit', {
            url: '/edit/:id',
            templateUrl: 'templates/edit.html',
            controller: 'EditCtrl',
            authenticate: true
        })
        .state('View', {
            url: '/view/:id',
            templateUrl: 'templates/view.html',
            controller: 'ViewCtrl'
        });
        
        $urlRouterProvider.otherwise("/");
});


app.filter('htmlToPlainText', function(){
    return function(text){
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }
})

app.controller('ViewCtrl', function($scope, $stateParams, $timeout, $state, ngToast){
    $scope.upVoteCount = 10;
    $scope.downVoteCount = 5;
    
    Stamplay.Object("blogs").get({_id: $stateParams.id})
    .then(function(response){
        console.log(response);
        $scope.blog = response.data[0];
        $scope.upVoteCount = $scope.blog.actions.votes.users_upvote.length;
        $scope.downVoteCount = $scope.blog.actions.votes.users_downvote.length;
        $scope.$apply();
        
    }, function(error){
        console.log(error);   
    })
    
    $scope.postComment = function(){
      Stamplay.Object("blogs").comment($stateParams.id, $scope.comment)
      .then(function(res){
        console.log(res);
        $scope.blog = res;
        $scope.comment = "";
        $scope.$apply();
      }, function(err){
        console.log(err);
        if(err.code == 403){
          console.log("Login first!");
          $timeout(function(){
            ngToast.create('<a href="#/login" class="">Please login before posting comments!.</a>');
          });
        }
      })
    }
    
    
    $scope.upVote = function(){
      Stamplay.Object("blogs").upVote($stateParams.id)
      .then(function(res){
        console.log(res);
        $scope.blog = res;
        $scope.comment = "";
        $scope.upVoteCount = $scope.blog.actions.votes.users_upvote.length;
        $scope.downVoteCount = $scope.blog.actions.votes.users_downvote.length;
        $scope.$apply();
      }, function(err){
        console.log(err);
        if(err.code == 403){
          console.log("Login first!");
          $timeout(function(){
            ngToast.create('<a href="#/login" class="">Please login before voting.</a>');
          });
        }
        if(err.code == 406){
          console.log("Already Voted!");
          $timeout(function(){
            ngToast.create('You have already voted on this Post.');
          });
        }
      })
    }
    
    $scope.downVote = function(){
      Stamplay.Object("blogs").downVote($stateParams.id)
      .then(function(res){
        console.log(res);
        $scope.blog = res;
        $scope.comment = "";
        $scope.upVoteCount = $scope.blog.actions.votes.users_upvote.length;
        $scope.downVoteCount = $scope.blog.actions.votes.users_downvote.length;
        $scope.$apply();
      }, function(err){
        console.log(err);
        if(err.code == 403){
          console.log("Login first!");
          $timeout(function(){
            ngToast.create('<a href="#/login" class="">Please login before voting.</a>');
          });
        }
        if(err.code == 406){
          console.log("Already Voted!");
          $timeout(function(){
            ngToast.create('You have already voted on this Post.');
          });
        }
      })
    }
})

app.controller('EditCtrl', function(taOptions, $state, $stateParams, $scope, $timeout, ngToast){
    
    $scope.Post = {};
    
    taOptions.toolbar = [
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
      ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
      ['html', 'insertImage','insertLink', 'wordcount', 'charcount']
    ];
    
    Stamplay.Object("blogs").get({_id: $stateParams.id})
    .then(function(res){
        console.log(res);
        $scope.Post = res.data[0];
        $scope.$apply();
        console.log($scope.Post);
    }, function(err) {
        console.log(err);
    });
    
    $scope.update = function(){
        Stamplay.User.currentUser().then(function(res){
            
            if(res.user){
                if(res.user._id == $scope.Post.owner){
                    Stamplay.Object("blogs").update($stateParams.id, $scope.Post)
                    .then(function(response){
                        console.log(response);
                        $state.go("MyBlogs");
                    }, function(error){
                        console.log(error);
                    });
                }
                else
                    $state.go("login");
            }
            else
                $state.go("login");
        }, function(err){
            console.log(err);
        });
    }
});

app.controller('CreateCtrl', function(taOptions, $state, $scope, $timeout, ngToast){
    
    $scope.newPost = {};
    
    taOptions.toolbar = [
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
      ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
      ['html', 'insertImage','insertLink', 'wordcount', 'charcount']
    ];
    
    $scope.create = function(){
        Stamplay.User.currentUser()
        .then(function(res){
            if(res.user){
                //proceed with creation of the post
                Stamplay.Object("blogs").save($scope.newPost)
                .then(function(res){
                    $timeout(function(){
                        ngToast.create("Post Created Successfully.");
                    });
                    $state.go('MyBlogs');
                }, function(err){
                    $timeout(function(){
                        ngToast.create("An error has occurred while creating the post. Please try later.");
                    });
                    console.log(err);
                })
            }
            else{
                $state.go('login');
            }
        }, function(err){
            $timeout(function(){
                ngToast.create("An error has occurred. Please try later.");
            });
            console.log(err);
        })
    }
});

app.controller('MyBlogsCtrl', function($scope, $state){
    Stamplay.User.currentUser().then(function(res){
        if(res.user){
            Stamplay.Object("blogs").get({owner: res.user._id, sort : "-dt_create"})
            .then(function(response){
                console.log(response);
                $scope.userBlogs = response.data;
                $scope.$apply();
                console.log($scope.userBlogs);
            }, function(err){
                console.log(err);
            });
        }
        else{
            $state.go('login');    
        }
    }, function(err){
        console.log(err);
    });
});

app.controller('LoginCtrl', function($scope, $state, $timeout, $rootScope, ngToast){
    $scope.login = function(){
        Stamplay.User.currentUser()
        .then(function(res){
            console.log(res);
            if(res.user){
                $rootScope.loggedIn = true;
                $rootScope.displayName = res.user.firstName+" "+res.user.lastName;
                //user already logged in
                $timeout(function(){
                   $state.go('MyBlogs');
                });
            }
            else{
                //proceed with login
                Stamplay.User.login($scope.user)
                .then(function(res){
                    console.log(res);
                    $timeout(function(){
                        ngToast.create("Login Successful");
                    });
                    $rootScope.loggedIn = true;
                    $rootScope.displayName = res.firstName+ " "+res.lastName;
                    $timeout(function(){
                        $state.go('MyBlogs');
                    });
                }, function(err){
                    console.log(err);
                    $rootScope.loggedIn = false;
                    $timeout(function(){
                        ngToast.create("Login failed");
                    });
                })
            }
        }, function(error){
            $timeout(function(){
                ngToast.create("An error has occurred, please try later!");
            });
            console.log(error);
        });
    }
});

app.controller('SignUpCtrl', function($scope, ngToast, $timeout){
    $scope.newUser = {};
    
    $scope.signup = function(){
        $scope.newUser.displayName = $scope.newUser.firstName + " " + $scope.newUser.lastName;
        if($scope.newUser.firstName && $scope.newUser.lastName && $scope.newUser.email && $scope.newUser.password && $scope.newUser.confirmPassword){
            console.log("All fields are valid!");
            
            if($scope.newUser.password == $scope.newUser.confirmPassword){
                console.log("All good! Let's sign up!");
                Stamplay.User.signup($scope.newUser)
                .then(function(response){
                    $timeout(function(){
                        ngToast.create("Your account has been created! Please login!");
                    });
                    console.log(response);
                }, function(error){
                    $timeout(function(){
                        ngToast.create("An error has occurred, please try later.");
                    })
                    
                    console.log(error);
                });
            }
            else{
                $timeout(function(){
                    ngToast.create("Passwords do not match.");
                });
                console.log("Password do not match!");
            }
            
        }
        else{
            ngToast.create("Some fields are invalid!");
            console.log("Some fields are invalid!");
        }
    };
});

app.controller('HomeCtrl', function($scope, $http){
    Stamplay.Object("blogs").get({sort : "-dt_create"})
    .then(function(res){
          console.log(res);
          $scope.latestBlogs = res.data;
          $scope.$apply();
          console.log($scope.latestBlogs);
    }, function(err){
        console.log(err);
    });
});

app.controller('MainCtrl', function($scope, $rootScope, $timeout){
    $scope.logout = function(){
        console.log("logout called")
        localStorage.removeItem('https://angularjs-samarthagarwal.c9users.io-jwt');
        console.log("Logged out!");
          
        $timeout(function(){
            $rootScope.loggedIn = false;    
        })
    }
})