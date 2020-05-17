exports.seed = function (knex) {

  return knex('users').insert([{
    username: 'admin',
    password: 'password',
    email: 'admin@email.com'
  }]);
};