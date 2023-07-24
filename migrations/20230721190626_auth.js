export const up = (knex) => {
	return knex.schema
		.createTable('User', (table) => {
			table.text('email');
			table.text('password').notNullable();
			table.primary('email');
		})
		.createTable('Session', (table) => {
			table.uuid('id');
			table.text('userEmail').notNullable();
			table.timestamp('expires').notNullable();
			table.primary('id');
			table.foreign('userEmail').references('email').on('User');
		});
};

export const down = (knex) => {
	return knex.schema.dropTable('Session').dropTable('User');
};
