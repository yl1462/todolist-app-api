const todoService = {
  getAllToDos(knex) {
    return knex.select('*').from('todos');
  },
  insertToDo(knex, newToDo) {
    return knex
      .insert(newToDo)
      .into('todos')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .from('todos')
      .select('*')
      .where({ id })
      .first();
  },

  deleteToDo(knex, id) {
    console.log(id)
    return knex('todos').where({ id }).delete();
  },

  editToDo(knex, id, editedToDo) {
    return knex('todos')
      .where({ id })
      .update(editedToDo);
  }
};

module.exports = todoService;