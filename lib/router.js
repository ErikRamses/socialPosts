Router.configure({
  layoutTemplate: 'main',
});

Router.route('/', {
  name: 'posts',
  where: 'client'
});