Meteor.subscribe("posts");
Meteor.subscribe("postUser");
Meteor.subscribe("news");

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

if(Meteor.isClient) {

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '2077837752462304',
      status     : true,
      xfbml      : true,
      version    : 'v2.10'
    });
     FB.getLoginStatus(function(response) {
        console.log(response);
    }, true);
  };
  Session.set('latitud',25.6970444);
  Session.set('longitud',-100.35713179999999);
  reverseGeocode.getLocation('25.6970444', '-100.35713179999999', function(location){
      var res = reverseGeocode.getAddrObj();
      console.log(res[3].longName);
      Session.set('ciudad',res[3].longName);
    });
}

Template.main.helpers({
});

Template.login.rendered = function() {
  if(Meteor.userId())
  {
    Router.go('/posts');
  }
  if(!Session.get('visited'))
  {
      setTimeout(function(){
        $("#myModal").modal('show');
      },3000);
      Session.set('visited', true);
  }
  if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              Session.set('latitud',position.coords.latitude);
              Session.set('longitud',position.coords.longitude);
              reverseGeocode.getLocation(position.coords.latitude, position.coords.longitude, function(location){
                var res = reverseGeocode.getAddrObj();
                console.log(res[3].longName);
                Session.set('ciudad',res[3].longName);
              });
           },function(error)
           {
                Session.set('latitud',25.6970444);
                Session.set('longitud',-100.35713179999999);
            });
  }
  else
  {
    Session.set('latitud',25.6970444);
    Session.set('longitud',-100.35713179999999);
    reverseGeocode.getLocation('25.6970444', '-100.35713179999999', function(location){
      var res = reverseGeocode.getAddrObj();
      console.log(res[3].longName);
      Session.set('ciudad',res[3].longName);
    });
  }
  //var lat = Session.get('latitud');
  //var long =Session.get('longitud');                  
}

Template.main.rendered = function() {
  if(!Meteor.userId())
  {
    Router.go('login');
  }
  else
  {
    $('#menu-topo').hide();
   var menuaberto = false;
  $('.btn-collapse').click(function(event) {
    event.preventDefault();
    $('#menu-topo').toggle('');
      if(menuaberto == true){
        menuaberto = false;
        $(".lista-collapse:nth-child(1)").removeClass('botao-lista-cima');
        $(".lista-collapse:nth-child(2)").removeClass('hidden');
        $(".lista-collapse:nth-child(3)").removeClass('botao-lista-baixo');
      }else {
        menuaberto = true;
        $(".lista-collapse:nth-child(1)").addClass('botao-lista-cima');
         $(".lista-collapse:nth-child(2)").addClass('hidden');
        $(".lista-collapse:nth-child(3)").addClass('botao-lista-baixo');
      }
  });
    Meteor.call('updatePosts', function(error, result) {
      });
  }
};

Template.login.events({
  'click .login-facebook': function(e) {
      e.preventDefault();
      FB.login(function(response) {
    if (response.authResponse) {
            console.log(response);
     console.log('Welcome!  Fetching your information.... ');
     FB.api('/me?fields=id,name,email', {fields: 'id,name,email'}, function(response) {
       console.log('Good to see you, ' + response.name + '.');
       console.log(response);
       var email;
       if(response.email != undefined && response.email != null)
       {
          email = response.email;
       }
       else
       {
          email = prompt("Confirm your email", "");
          if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)){
            //alert("La dirección de email " + valor + " es correcta!.");
          } else {
            email = prompt("Email is not valid, add another", "");
          }
       }
        var password = response.id;
        var nombre = response.name;
        var username = nombre.replace("ñ", "n");
        var facebookId = response.id;
        var cat = $('select#categoria').val();
        Session.set('category', cat);
        if(!Meteor.users.findOne({username: email}))
        {
          Accounts.createUser({
                email: email,
                username: email,
                password: password,
                profile: {
                  username: username,
                  facebookId: facebookId,
                  categoria: cat
                }
            }, function(error){
                if(error){
                    Meteor.loginWithPassword(email, password);
                    console.log(error);
                    Router.go('/posts');
                }
                else
                {
                  var lat = Session.get('latitud');
                  var long =Session.get('longitud');                  
                  var ciudad =  Session.get('ciudad');
                  console.log(ciudad); 
                    Meteor.call('newUser', Meteor.userId(), username, email, cat, lat, long, ciudad, function(error, result) {
                      if(error)
                      {
                        console.log(error);  
                      }
                      else
                      {
                        console.log('Usuario dado de alta correctamente');
                      }
                    });
                    Router.go('/posts');
                }
            });
        }
        else
        {
          Meteor.loginWithPassword(email, password);
          Router.go('/posts');
        }
       });
    } else {
     console.log('User cancelled login or did not fully authorize.');
    }
}, {
  scope: 'user_friends,public_profile,email'
});

/*
      Meteor.loginWithFacebook({
      requestPermissions: ['publish_actions','user_friends', 'user_birthday', 'email']
      }, (err) => {
        if (err) {
          console.log(err);
        } else {
          Router.go('/');
        }
      });
      */
    }
});  

Template.menu.events({
  'click a.logout': function(event, template) 
  {
    event.preventDefault();
    console.log('logout');
    Meteor.logout(function(error, result){
      FB.logout(function(response) {
        // user is now logged out
      });
      Router.go('login');
    });
  }
});

Template.profile.events({
  'click a.getPoints': function(event, template) 
  {
    event.preventDefault();
    var postid = this.post_id;
    console.log(postid);
      FB.api(
    "/"+postid+"?fields=likes,comments",
    function (response) {
      if (response && !response.error) {
        /* handle the result */
        console.log(response.likes.count);
        console.log(response.comments.count);
        Meteor.call('getPoints', postid, 0, response.comments.count, response.likes.count, 0, function(error, result) {
              if(error)
              {
                console.log(error);  
              }
              else
              {
                console.log('Puntos obtenidos correctamente');
              }
          });
      }
      else
      {
        console.log('no hay respuesta');
      }
    }
);
  Meteor.call('userPoints', Meteor.userId(), function(error, result) {});
  }
});

Template.posts.events({
	'click a.crearPost': function(event, template) 
  	{
  		event.preventDefault();
      	var id = Posts.find().count();
      	var ordenes = Posts.insert({
          numPosts: id, 
          ciudad: 'Monterrey',
          estado: 'Nuevo León',
          direccion: 'Colonia centro 1342',
          titulo: 'Titulo de ejemplo',  
          contenido: 'Descripción de ejemplo del post',  
          date: moment().format('YYYY-MM-DD'),
          imagen: 'http://via.placeholder.com/370x275'
      });
      alert('Orden creada correctamente');
    },
    'click a.addField': function(event, template) 
  	{
  		event.preventDefault();
  		var nuevocampo = 'campodeEjemplo';
      	Posts.update(this._id, {
           $set: { nuevocampo: 'Texto ejemplo'}
        });
        Meteor.call('addField', nuevocampo, this._id, function(error, result) {
		});
      	alert('Campo cambiado correctamente');
    },
    'click a.deleteField': function(event, template) 
  	{
  		event.preventDefault();
  		var nuevocampo = 'campodeEjemplo';
        Meteor.call('deleteField', nuevocampo, this._id, function(error, result) {
		});
      	alert('Campo eliminado correctamente');
    }
});

Template.posts.helpers({
	listaPosts: function() {
      if(Session.get('category'))
      {
        return Posts.find({categoria: user.profile.categoria}, { sort: { date: -1 } });
      } 
      else
      {
        return Posts.find({categoria: 'BASEBALL'}, { sort: { date: -1 } });
      }
  }
});

Template.profile.helpers({
  postInfo: function() {
      return PostUser.find({}, { sort: { date: -1 } });
  }
});

Template.news.helpers({
  listaNoticias: function() {
      return News.find({}, { sort: { date: -1 } });
  }
});

Template.topten.helpers({
  listaTop: function() {
      return Top.find({}, { sort: { date: -1 } });
  }
});

Template.nota.helpers({
  postUnico: function() {
      return Posts.findOne({_id: Router.current().params._id});
  }
});

Template.posts.events({
  'click a.publishFb': function(event, template)
  {
    event.preventDefault();
    var titulo = this.title;
    var imagen = this.imagen;
    var desc = this.desc;
          FB.ui({
    method: 'share_open_graph',
    action_type: 'og.shares',
    action_properties: JSON.stringify({
        object: {
            'og:url': this.Target_url,
            'og:title': this.title,
            'og:description': this.desc,
            'og:image': this.imagen
        }
    })
        },
        function (response) {
          console.log(titulo); 
          var post = PostUser.insert({
            post_id: response.post_id,
            title: titulo,
            imagen: imagen,
            descripcion: desc,
            date: moment().format('YYYY-MM-DD'),
            likes: 0
          });
            Meteor.call('publishFacebook', response.post_id, Meteor.userId(), titulo, function(error, result) {
                if(error)
                {
                  console.log(error);  
                }
                else
                {
                  console.log('FacebookPost publicado correctamente');
                }
            });
        });

  }
})