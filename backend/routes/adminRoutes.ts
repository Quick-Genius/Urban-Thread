import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';
import validate from '../middleware/validate';
import { createProductSchema, updateProductSchema } from '../validators/productValidators';
import { updateOrderStatusSchema } from '../validators/orderValidators';
import { updateRoleSchema } from '../validators/userValidators';

const router = Router();
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', validate(updateRoleSchema), adminController.updateUserRole);
router.put('/users/:id/status', adminController.toggleUserStatus);
router.delete('/users/:id', adminController.deleteUser);
router.get('/products', adminController.getAllProducts);
router.post('/products', validate(createProductSchema), adminController.createProduct);
router.put('/products/:id', validate(updateProductSchema), adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', validate(updateOrderStatusSchema), adminController.updateOrderStatus);
router.delete('/orders/:id', adminController.deleteOrder);

export default router;
