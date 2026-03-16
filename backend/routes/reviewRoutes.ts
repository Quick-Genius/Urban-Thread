import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { protect } from '../middleware/auth';
import validate from '../middleware/validate';
import { createReviewSchema, updateReviewSchema } from '../validators/reviewValidators';

const router = Router();

router.get('/:productId', reviewController.getProductReviews);
router.post('/:productId', protect, validate(createReviewSchema), reviewController.createReview);
router.put('/:id', protect, validate(updateReviewSchema), reviewController.updateReview);
router.delete('/:id', protect, reviewController.deleteReview);

export default router;
