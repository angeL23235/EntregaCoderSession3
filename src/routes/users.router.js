const { Router } = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/users.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = Router();
router.post('/', createUser);

router.get('/', requireAuth, requireRole('admin'), getUsers);
router.get('/:uid', requireAuth, getUserById);

router.put('/:uid', requireAuth, updateUser);
router.delete('/:uid', requireAuth, deleteUser);

module.exports = router;
