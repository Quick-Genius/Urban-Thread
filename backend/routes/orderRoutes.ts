import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';
import validate from '../middleware/validate';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/orderValidators';

const router = Router();

router.post('/', protect, validate(createOrderSchema), orderController.createOrder);
router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/', protect, authorize('admin'), orderController.getAllOrders);
router.get('/:id', protect, orderController.getOrder);
router.put('/:id/status', protect, authorize('admin'), validate(updateOrderStatusSchema), orderController.updateOrderStatus);

export default router;
