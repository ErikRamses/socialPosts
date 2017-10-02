Meteor.publish('posts', function () {
  return Posts.find();
});

Meteor.publish('news', function () {
  return News.find();
});

Meteor.publish('topten', function () {
  return Top.find();
});

Meteor.publish('postUser', function () {
  return PostUser.find();
});

Meteor.publish('salesforce', function () {
  return Salesforce.find();
});