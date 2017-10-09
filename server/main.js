import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
     process.env.ROOT_URL = 'http://zurdoxsocial.com/';
    
ServiceConfiguration.configurations.remove({
    service: "facebook"
});
    
//ServiceConfiguration.configurations.insert({
//    service: "facebook",
//    appId: '2077837752462304',
//    secret: '427b4ce5c5378ed308e2d111b5150d3b'
//});
ServiceConfiguration.configurations.upsert(
    { service: 'facebook' },
    {
      $set: {
        appId: '2077837752462304',
        loginStyle: 'popup',
        secret: '427b4ce5c5378ed308e2d111b5150d3b'
      }
    }
  );

 // Listen to incoming HTTP requests, can only be used on the server 
  WebApp.connectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
  });
});

var getFbPicture;

Accounts.onCreateUser(function (options, user) {
 if (options.profile) {
    user.profile = options.profile;
  } else {
    user.profile = {};
  }
    if (!user.services.facebook) {
        return user;
    }

    console.log(user.services.facebook);
    user.username = user.services.facebook.name;
    user.profile.profilePicture = getFbPicture(user.services.facebook.accessToken);
    user.profile.facebookId = user.services.facebook.id;
    user.emails = [{address: user.services.facebook.email}];
    user.profile.email = user.services.facebook.email;
    console.log('http://developer1-zurdoxtest.cs95.force.com/portalweb/advocay_nueva_cuenta?id_ref='+user.profile.facebookId+'&nombre='+user.username+'&correo='+user.services.facebook.email);
    Salesforce.insert({
      query: 'http://developer1-zurdoxtest.cs95.force.com/portalweb/advocay_nueva_cuenta?id_ref='+user.profile.facebookId+'&nombre='+user.username+'&correo='+user.services.facebook.email, 
      date: moment().format('YYYY-MM-DD'),
    });
    //HTTP.call( 'GET', 'http://developer1-zurdoxtest.cs95.force.com/portalweb/advocay_nueva_cuenta?id_ref='+user.profile.facebookId+'&nombre='+user.username+'&correo='+user.services.facebook.email, {}, function( error, response )
    //{
    //if ( error ) {
    //  console.log( error );
    //  } 
    //  else 
    //  {
    //    console.log( response );
    //}
   // });
/*
    HTTP.call( 'PUT', 'http://zurdox-test-developer-edition.na50.force.com/portalweb/advocay_nueva_cuenta', {
  		data: {
    		id_ref: user.profile.facebookId,
    		nombre: user.username,
    		correo: user.services.facebook.email
  		}
		}, function( error, response ) {
  		if ( error ) {
    		console.log( error );
  		} else {
    		console.log( statusCode );
  }
});
*/
    return user;
});

getFbPicture = function(accessToken) {
    var result;
    result = Meteor.http.get("https://graph.facebook.com/me", {
        params: {
            access_token: accessToken,
            fields: 'picture.type(large)'
        }
    });
    if (result.error) {
        throw result.error;
    }
    return result.data.picture.data.url;
};