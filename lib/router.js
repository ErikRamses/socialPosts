Router.configure({
  layoutTemplate: 'main',
});

Router.route('/posts', {
  name: 'posts',
  where: 'client'
});

Router.route('/news', {
  name: 'news',
  where: 'client'
});

Router.route('/topten', {
  name: 'topten',
  where: 'client'
});

Router.route('/profile', {
  name: 'profile',
  where: 'client'
});

Router.route('/login', {
  name: 'login',
  layoutTemplate: 'login',
  where: 'client'
});

Router.route('/sospets', {
  name: 'sospets',
  layoutTemplate: 'sospets',
  where: 'client'
});

Router.route('/', {
  name: 'landing',
  layoutTemplate: 'landing',
  where: 'client'
});

Router.route('/privacy', {
  name: 'privacy',
  where: 'client'
});

Router.route('/nota/:_id', {
  name: 'nota',
  where: 'client'
});