import { Router } from 'express';
import * as addressController from '../controllers/addressController';
import { protect } from '../middleware/auth';
import validate from '../middleware/validate';
import { createAddressSchema, updateAddressSchema } from '../validators/addressValidators';

const router = Router();
router.use(protect);

router.get('/', addressController.getAddresses);
router.post('/', validate(createAddressSchema), addressController.createAddress);
router.put('/:id', validate(updateAddressSchema), addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

export default router;
