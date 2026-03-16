import { Router } from 'express';
import * as uploadController from '../controllers/uploadController';
import { protect } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimiter';
import validate from '../middleware/validate';
import { uploadImageSchema, uploadMultipleSchema } from '../validators/uploadValidators';

const router = Router();
router.use(protect);
router.use(uploadLimiter);

router.get('/auth', uploadController.getAuthParams);
router.post('/', validate(uploadImageSchema), uploadController.uploadImage);
router.post('/multiple', validate(uploadMultipleSchema), uploadController.uploadMultipleImages);
router.delete('/:fileId', uploadController.deleteImage);

export default router;
