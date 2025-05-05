const express = require('express');
const Task = require('../models/task-model');
const auth = require('../app/middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate('user', 'username');
    res.send(tasks);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const task = new Task(req.body);
    task.user = req.user.id;
    await task.save();
    res.send(task);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete({ _id: req.params.id });
    if (result) {
      res.send({ message: 'Task deleted succefully' });
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// router.put('/:id', auth, async (req, res) => {
//   try {
//     const updatedTask = await Task.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id },
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updatedTask) {
//       return res.status(404).send({ message: 'Task not found or not authorized' });
//     }

//     res.send(updatedTask);
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// });

module.exports = router;
