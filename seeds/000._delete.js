exports.seed = function(knex) {
  // Inserts seed entries
    return knex('users').del();
};