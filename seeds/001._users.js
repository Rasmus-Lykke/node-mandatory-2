exports.seed = function (knex) {

  return knex('users').insert([{
    username: 'admin',
    password: '$2b$12$ivRBaGRMAc5VSV68QVkBsel8Im6xv6ybGZU55QTRNN8W3ufmPG8da',
    email: 'admin@email.com'
  }]);
};