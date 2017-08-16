Meteor.subscribe("posts");

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
 
Meteor.startup(() => {
	//ShareIt.configure({
    //    sites: {
    //        'facebook': {
    //            'appId': 2077837752462304
    //        }
    //    }
    //});
     ShareIt.configure({
    sites: {                // nested object for extra configurations
        'facebook': {
            'appId': 2077837752462304	// use sharer.php when it's null, otherwise use share dialog
        },
        'twitter': {},
        'googleplus': {},
        'pinterest': {}
    },
    classes: "large btn", // string (default: 'large btn')
                          // The classes that will be placed on the sharing buttons, bootstrap by default.
    iconOnly: false,      // boolean (default: false)
                          // Don't put text on the sharing buttons
    applyColors: true,     // boolean (default: true)
                          // apply classes to inherit each social networks background color
    faSize: '',            // font awesome size
    faClass: ''		  // font awesome classes like square
  	});
});


Template.main.helpers({
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
      return Posts.find({}, { sort: { date: -1 } });
  }
});