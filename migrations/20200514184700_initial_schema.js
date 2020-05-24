exports.up = function (knex) {
    // Using knex to create a table called users which includes the columns 
    // id, username, password, email, updated at and created at.
    return knex.schema
        .createTable('users', table => {
            table.increments('id'); // Auto increments
            table.string('username').unique().notNullable();
            table.string('password').notNullable();
            table.string('email').notNullable().unique();

            table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('users')
};