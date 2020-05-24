// Saves a user to the users table. Its possible to save more than one user in here.
exports.seed = function (knex) {
  return knex('users').insert([{
    username: 'admin',
    password: '$2b$12$ivRBaGRMAc5VSV68QVkBsel8Im6xv6ybGZU55QTRNN8W3ufmPG8da', // Password = password
    email: 'admin@email.com'
  }]);
};