// Deletes the user table before creating a new in 001._users.js seed.
exports.seed = function(knex) {
  // Inserts seed entries
    return knex('users').del();
};