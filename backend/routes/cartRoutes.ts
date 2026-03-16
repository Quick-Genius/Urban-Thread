import { Router } from 'express';
import * as cartController from '../controllers/cartController';
import { protect } from '../middleware/auth';
import validate from '../middleware/validate';
import { addToCartSchema, updateCartItemSchema } from '../validators/cartValidators';

const router = Router();
router.use(protect);

router.get('/', cartController.getCart);
router.post('/', validate(addToCartSchema), cartController.addToCart);
router.put('/:itemId', validate(updateCartItemSchema), cartController.updateCartItem);
router.delete('/:itemId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
