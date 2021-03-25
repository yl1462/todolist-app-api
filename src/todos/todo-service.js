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

  updateFolder(knex, id, newFolderFields) {
    return knex('folders')
      .where({ id })
      .update(newFolderFields);
  }
};

module.exports = todoService;