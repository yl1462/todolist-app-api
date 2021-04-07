const todoService = {
  //display all to do
  getAllToDos(knex) {
    return knex.select('*').from('todos');
  },
  //add new to do
  insertToDo(knex, newToDo) {
    return knex
      .insert(newToDo)
      .into('todos')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  //getting into selected to do
  getById(knex, id) {
    return knex
      .from('todos')
      .select('*')
      .where({ id })
      .first();
  },

  //delete selected to do
  deleteToDo(knex, id) {
    console.log(id)
    return knex('todos').where({ id }).delete();
  },

  //edit selected to do
  editToDo(knex, id, editedToDo) {
    return knex('todos')
      .where({ id })
      .update(editedToDo);
  }
};

module.exports = todoService;