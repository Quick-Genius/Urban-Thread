import { Router } from 'express';
import * as userController from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';
import validate from '../middleware/validate';
import { updateProfileSchema } from '../validators/userValidators';

const router = Router();

router.get('/', protect, authorize('admin'), userController.getUsers);
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, validate(updateProfileSchema), userController.updateUserProfile);
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);

export default router;
