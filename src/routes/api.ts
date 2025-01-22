import express, { Request, Response } from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';
import aclMiddleware from '../middlewares/acl.middleware';
import { ROLES } from '../utils/constant';
import mediaMiddleware from '../middlewares/media.middleware';
import mediaController from '../controllers/media.controller';
import categoryController from '../controllers/category.controller';
import regionController from '../controllers/region.controller';

const router = express.Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);
router.post('/auth/activation', authController.activation);

router.post(
	'/category',
	[authMiddleware, aclMiddleware([ROLES.ADMIN])],
	categoryController.create
);
router.get('/category', categoryController.findAll);
router.get('/category/:id', categoryController.findOne);
router.put(
	'/category/:id',
	[authMiddleware, aclMiddleware([ROLES.ADMIN])],
	categoryController.update
);
router.delete(
	'/category/:id',
	[authMiddleware, aclMiddleware([ROLES.ADMIN])],
	categoryController.remove
);

router.get('/regions', regionController.getAllProvinces);
router.get('/regions/:id/provinces', regionController.getProvince);
router.get('/regions/:id/regency', regionController.getRegency);
router.get('/regions/:id/distrirct', regionController.getDistrict);
router.get('/regions/:id/village', regionController.getVillage);
router.get('/regions-search', regionController.findByCity);

// router.get(
// 	'/test-acl',
// 	[authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])],
// 	(req: Request, res: Response) => {
// 		res.status(200).json({
// 			data: 'success',
// 			message: 'OK',
// 		});
// 	}
// );

router.post(
	'/media/upload-single',
	[
		authMiddleware,
		aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
		mediaMiddleware.single('file'),
	],
	mediaController.single
);
router.post(
	'/media/upload-multiple',
	[
		authMiddleware,
		aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
		mediaMiddleware.multiple('files'),
	],
	mediaController.multiple
);
router.delete(
	'/media/remove',
	[authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])],
	mediaController.remove
);

export default router;
