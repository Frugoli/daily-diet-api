import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('session_id').index()
    table.uuid('id').notNullable().primary()
    table.text('name').notNullable(),
    table.text('description').nullable(),
    table.text('meal_interval')
    table.boolean('in_diet').defaultTo(true).notNullable(),
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.text('updated_at').nullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}


