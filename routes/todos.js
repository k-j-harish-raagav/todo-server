const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Get all todos for user
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort('date');
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a todo
router.post('/', async (req, res) => {
  const { title, date } = req.body;
  const todo = new Todo({ user: req.user.id, title, date });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a todo
router.put('/:id', async (req, res) => {
  const { title, date, completed } = req.body;
  try {
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, date, completed },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted Todo' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
