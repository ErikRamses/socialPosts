Meteor.subscribe("posts");

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

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
});

Template.posts.helpers({
	listaPosts: function() {
      return Posts.find({}, { sort: { date: -1 } });
  }
});