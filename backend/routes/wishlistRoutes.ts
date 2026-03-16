import { Router } from 'express';
import * as wishlistController from '../controllers/wishlistController';
import { protect } from '../middleware/auth';

const router = Router();
router.use(protect);

router.get('/', wishlistController.getWishlist);
router.post('/:productId', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

export default router;
