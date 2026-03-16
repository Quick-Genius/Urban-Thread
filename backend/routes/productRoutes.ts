import { Router } from 'express';
import * as productController from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';
import validate from '../middleware/validate';
import { getProductsSchema, createProductSchema, updateProductSchema } from '../validators/productValidators';

const router = Router();

router.get('/', validate(getProductsSchema), productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', protect, authorize('seller', 'admin'), validate(createProductSchema), productController.createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), productController.deleteProduct);

export default router;
