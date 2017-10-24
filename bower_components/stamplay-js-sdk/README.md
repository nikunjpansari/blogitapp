<img src="https://editor.stamplay.com/img/logo-robot-no-neck.png" align="left" width="170px" height="160px"/>
<img align="left" width="0" height="160px" hspace="10"/>

> #Stamplay JavaScript SDK

[![Build Status](https://travis-ci.org/Stamplay/stamplay-js-sdk.svg?branch=master)](https://travis-ci.org/Stamplay/stamplay-js-sdk)
[![Production version](http://img.shields.io/badge/download-47%20kB-blue.svg)](https://raw.githubusercontent.com/Stamplay/stamplay-js-sdk/master/dist/stamplay.min.js)
[![Bower version](https://badge.fury.io/bo/stamplay-js-sdk.svg)](http://badge.fury.io/bo/stamplay-js-sdk)
[![Code Climate](https://codeclimate.com/github/Stamplay/stamplay-js-sdk/badges/gpa.svg)](https://codeclimate.com/github/Stamplay/stamplay-js-sdk)

This library  gives you access to the powerful Stamplay cloud platform from your JavaScript app. For more info on Stamplay and its features, see the <a href="https://stamplay.com">website</a> or the JavaScript guide
<br>

##Getting Started
The SDK is available for download on our website, on Bower and on our CDN. To get started import the library in your project and initialize it by calling `init` function with your `appId`
```HTML
<script src="https://drrjhlchpvi7e.cloudfront.net/libs/stamplay-js-sdk/2.0.3/stamplay.min.js"></script>
<script> Stamplay.init("APPID"); </script>
```

##How to use it
Register a new user:
```javascript
var data = {
	"email":"john@stamplay.com",
	"password":"john123"
}
Stamplay.User.signup(data, function(error, result){
	//manage the result and the error
})
```
Store data using Objects:
```javascript
var data = {
	"description":"A description",
	"title":"New title"
}
Stamplay.Object('foo').save(data, function(error, result){
	//manage the result and the error
})
```
Skip the callback to get a promise back
```javascript
var data = {
	"description":"A description",
	"title":"New title"
}
Stamplay.Object('foo').save(data).then(function(result){
	//manage the result
},function(error){
	//manage the error
})
```

##Available components
This JavaScript SDK expose the following components:
 
* [User](#user)
	* <code>save(data, [callback])</code>
  * <code>get(data, [callback])</code>
  * <code>remove(id, [callback])</code>
  * <code>update(id, data, [callback] )</code>
  * <code>currentUser([callback])</code>
  * <code>login(data, [callback])</code>
  * <code>socialLogin(provider)</code>
  * <code>signup(data, [callback])</code>
  * <code>logout()</code>
  * <code>resetPassword(data, [callback])</code>
  * <code>getRoles([callback])</code>
  * <code>getRole(id, [callback])</code>
  * <code>follow(id, [callback])</code>
  * <code>unfollow(id, [callback])</code>
  * <code>followedBy(id, [callback])</code>
  * <code>following(id, [callback])</code>
  * <code>activities(id, [callback])</code>
* [Object](#custom-object)
	* <code>save(data, [callback])</code>
	* <code>get(data, [callback])</code>
	* <code>remove(id, [callback])</code>
	* <code>update(id, data, [callback])</code>
	* <code>patch(id, data, [callback])</code>
	* <code>findByCurrentUser([attr], [callback])</code>
	* <code>upVote(id, [callback])</code>
	* <code>downVote(id, [callback])</code>
	* <code>rate(id, rate, [callback])</code>
	* <code>comment(id, text, [callback])</code>
	* <code>push(id, attribute, data, [callback])</code>
* [Code Block](#codeblock)
	* <code>run(data, queryParams, [callback])</code> 
* [Webhook](#webhook)
	* <code>post(data, [callback])</code> 
* [Stripe](#stripe)
	* <code>charge(userId, token, amount, currency, [callback])</code> 
	* <code>createCreditCard(userId, token, [callback])</code> 
	* <code>createCustomer(userId, [callback])</code> 
	* <code>createSubscriptionuserId, planId, [callback])</code> 
	* <code>deleteSubscription(userId, subscriptionId, options, [callback])</code> 
	* <code>getCreditCard(userId, [callback])</code> 
	* <code>getSubscription(userId, subscriptionId, [callback])</code> 
	* <code>getSubscriptions(userId, options, [callback])</code> 
	* <code>updateCreditCard(userId, token, [callback])</code> 
	* <code>updateSubscription(userId, subscriptionId, options, [callback])</code> 


Also this components the sdk have some support objects to help you in common operation:

* [Query](#query)
	* <code>greaterThan(attr, value)</code> 
	* <code>greaterThanOrEqual(attr, value)</code> 
	* <code>lessThan(attr, value)</code> 
	* <code>lessThanOrEqual(attr, value)</code> 
	* <code>pagination(page, per_page)</code>
	* <code>between(attr, value1, value2)</code>
	* <code>equalTo(attr, value)</code> 
	* <code>exists(attr)</code> 
	* <code>notExists(attr)</code> 
	* <code>sortAscending(attr)</code> 
	* <code>sortDescending(attr)</code>
	* <code>populate()</code>
	* <code>populateOwner()</code>
	* <code>select(attr,...)</code>
	* <code>regex(attr, regex, options)</code>
	* <code>near(type, coordinates, maxDistance, minDistance)</code>
	* <code>nearSphere(type, coordinates, maxDistance, minDistance)</code>
	* <code>geoIntersects(type, coordinates)</code>
	* <code>geoWithinGeometry(type, coordinates)</code>
	* <code>geoWithinCenterSphere(coordinates, radius)</code>
	* <code>or(query,..)</code> 
	* <code>exec([callback])</code> 

-------------------------------------------------------

# Build
To build a production ready library you need to have NPM and Bower installed and then run those two commands:

```bash
npm install && bower install
grunt build
```
You can also download this project and using all the precompiled files in src folder


## Contributing

1. Fork it ( https://github.com/[my-github-username]/stamplay-js-sdk/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request


## One more thing
Go to [API Reference](https://stamplay.com/docs/jssdk/v2/reference) to see a lot of examples.
Enjoy!
<img align="right" src="https://editor.stamplay.com/img/logo-robot-no-neck.png" height=60>

