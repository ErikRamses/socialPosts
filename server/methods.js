Meteor.methods({
  addField(fieldName, postID) {
    check(fieldName, String);
    check(postID, String);
    this.unblock();
    Posts.update(postID, {
       $rename:{nuevocampo: fieldName}
    },
    false, true);
    console.log();
  },
  deleteField(fieldName, postID) {
    check(fieldName, String);
    check(postID, String);
    this.unblock();
    var updateQuery={$unset:{}};   
	updateQuery.$unset[fieldName]=1;   
	Posts.update( {_id: postID} ,updateQuery,false,true);
  	},
  publishFacebook(id, user, titulo)
  {
    console.log('http://developer1-zurdoxtest.cs95.force.com/portalweb/generar_nuevo_post?id_ref='+id+'&usuario_id='+user+'&titulo_post='+titulo);
    Salesforce.insert({
      query: 'http://developer1-zurdoxtest.cs95.force.com/portalweb/generar_nuevo_post?id_ref='+id+'&usuario_id='+user+'&titulo_post='+titulo, 
      date: moment().format('YYYY-MM-DD'),
    });
    HTTP.call( 'GET', 'http://developer1-zurdoxtest.cs95.force.com/portalweb/generar_nuevo_post?id_ref='+id+'&usuario_id='+user+'&titulo_post='+titulo, {}, function( error, response )
    {
    if ( error ) {
      console.log( error );
      } 
      else 
      {
        console.log('No hay errores');
    }
    });
  },
  newUser(facebookId, username, email, categoria, latitud, longitud, ciudad)
  {
    check(ciudad, String);
    console.log(ciudad);
    Salesforce.insert({
      query: 'http://developer1-zurdoxtest.cs95.force.com/portalweb/advocay_nueva_cuenta?id_ref='+facebookId+'&nombre='+username+'&correo='+email+'&ubicacion='+latitud+','+longitud+'&cat='+categoria+'&ciudad='+ciudad+'', 
      date: moment().format('YYYY-MM-DD'),
    });
    console.log('http://developer1-zurdoxtest.cs95.force.com/portalweb/advocay_nueva_cuenta?id_ref='+facebookId+'&nombre='+username+'&correo='+email+'&ubicacion='+latitud+','+longitud+'&cat='+categoria+'&ciudad='+ciudad+'');
    HTTP.call( 'GET', 'http://developer1-zurdoxtest.cs95.force.com/portalweb/advocay_nueva_cuenta?id_ref='+facebookId+'&nombre='+username+'&correo='+email+'&ubicacion='+latitud+','+longitud+'&cat='+categoria+'&ciudad='+ciudad, {}, function( error, response )
    {
    if ( error ) {
      console.log( error );
      } 
      else
      {
        console.log('No hay errores');
    }
    });
  },
  getPoints(post_id, clicks, comments, likes, shares)
  {
    Salesforce.insert({
      query: 'http://developer1-zurdoxtest.cs95.force.com/portalweb/set_points?postid='+post_id+'&Clicks='+clicks+'&Comments='+comments+'&Engry=0&Fun=0&Likes='+likes+'&Love=0&Sad=0&Shares='+shares, 
      date: moment().format('YYYY-MM-DD'),
    });
    console.log('http://developer1-zurdoxtest.cs95.force.com/portalweb/set_points?postid='+post_id+'&Clicks='+clicks+'&Comments='+comments+'&Engry=0&Fun=0&Likes='+likes+'&Love=0&Sad=0&Shares='+shares);
    HTTP.call( 'GET', 'http://developer1-zurdoxtest.cs95.force.com/portalweb/set_points?postid='+post_id+'&Clicks='+clicks+'&Comments='+comments+'&Engry=0&Fun=0&Likes='+likes+'&Love=0&Sad=0&Shares='+shares, {}, function( error, response )
    {
    if ( error ) {
      console.log( error );
      return error;
      } 
      else 
      {
        console.log('No hay errores');
        return 'Success';
    }
    });
  },
  updatePosts()
  {
    HTTP.call( 'GET', 'http://developer1-zurdoxtest.cs95.force.com/portalweb/posts', {}, function( error, response )
  {
    if ( error ) {
      console.log( error );
      } else {
      var items, notas = [];
      var texto = response.content.split("||||||||||");
      //console.log(texto[1]);
      items = JSON.parse(texto[1]);
        //Posts.remove({});
      console.log(items[items.length-1]);
      if (Posts.find({ title: items[items.length-1].title}).count()===0) 
      {
        Posts.remove({});
        var i = 0;
        if (items.length > 0) {
          _.each(items, function(poll) {
            if(Posts.find({ title: poll.title}).count()===0)
            {
              poll.date = moment().format('YYYY-MM-DD');
              Posts.insert(poll);
              console.log('Alta de nota:'+poll.title);
            }
            i++;
          });
        }
      }
    }
  });
  },
  userPoints(userid)
  {
    HTTP.call( 'GET', 'http://developer1-zurdoxtest.cs95.force.com/portalweb/get_user_points?user='+userid, {}, function( error, response )
  {
    if ( error ) {
      console.log( error );
      } else {
      var items, notas = [];
      var texto = response.content.split("||||||||||");
      //console.log(texto[1]);
      items = JSON.parse(texto[1]);
        //Posts.remove({});
      console.log(items);
      Meteor.users.update({_id: userid},
      {
        $set:{'profile.points': items.puntos}
      });
    }
  });
  }
});