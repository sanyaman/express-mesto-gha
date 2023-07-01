const router = require('express').Router();
const {
  getUsers,
  createUser,
  getUserById,
  setAvatar,
  setUserInfo
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.patch('/me/avatar', setAvatar);
router.patch('/me', setUserInfo);

module.exports = router;