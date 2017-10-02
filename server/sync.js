Meteor.startup(function() {
  if (Posts.find({}).count()===0) 
  {
    HTTP.call( 'GET', 'http://developer1-zurdoxtest.cs95.force.com/portalweb/posts', {}, function( error, response )
  {
    if ( error ) {
      console.log( error );
      } 
      else 
      {
      var items, notas = [];
      var texto = response.content.split("||||||||||");

      items = JSON.parse(texto[1]);
      console.log(items[items.length-1]);
      if (Posts.find({ title: items[items.length-1].title}).count()===0) 
      {
        Posts.remove({});
        var i = 0;
        if (items.length > 0) {
          _.each(items, function(poll) {
            if(Posts.find({ title: items[i].title}).count()===0)
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
  }
  });
  var everyHour = new Cron(function() {
    HTTP.call( 'GET', 'http://developer1-zurdoxtest.cs95.force.com/portalweb/posts', {}, function( error, response )
  {
    if ( error ) {
      console.log( error );
      } 
      else 
      {
      var items, notas = [];
      var texto = response.content.split("||||||||||");

      items = JSON.parse(texto[1]);
      console.log(items[items.length-1]);
      if (Posts.find({ title: items[items.length-1].title}).count()===0) 
      {
        Posts.remove({});
        var i = 0;
        if (items.length > 0) {
          _.each(items, function(poll) {
            if(Posts.find({ title: items[i].title}).count()===0)
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
  }, {
  });