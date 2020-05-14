exports.seed = function(knex) {

  return knex('users').insert([
    {username: 'admin', password: 'password', email: 'admin@email.com'},
    {username: 'firstuser', password: 'firstuserpassword', email: 'firstuser@email.com'},
    {username: 'seconduser', password: 'seconduserpassword', email: 'seconduser@email.com'}    
  ]);
};
