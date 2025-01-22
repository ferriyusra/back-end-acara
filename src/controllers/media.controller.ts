import { Response } from 'express';
import { IReqUser } from '../utils/interfaces';
import uploader from '../utils/uploader';

export default {
	async single(req: IReqUser, res: Response) {
		if (!req.file) {
			return res.status(400).json({
				message: 'File is not exists',
				data: null,
			});
		}

		try {
			const result = await uploader.uploadSingle(
				req.file as Express.Multer.File
			);

			res.status(200).json({
				message: 'File successfully uploaded',
				data: result,
			});
		} catch {
			res.status(500).json({
				message: 'File failed to upload',
				data: null,
			});
		}
	},

	async multiple(req: IReqUser, res: Response) {
		if (!req.files || req.files.length === 0) {
			return res.status(400).json({
				message: 'File are not exists',
				data: null,
			});
		}

		try {
			const result = await uploader.uploadMultiple(
				req.files as Express.Multer.File[]
			);

			res.status(200).json({
				message: 'Files successfully uploaded',
				data: result,
			});
		} catch {
			res.status(500).json({
				message: 'Files failed to upload',
				data: null,
			});
		}
	},

	async remove(req: IReqUser, res: Response) {
		try {
			const { fileUrl } = req.body as { fileUrl: string };
			const result = await uploader.remove(fileUrl);

			res.status(200).json({
				data: result,
				message: 'success remove file',
			});
		} catch {
			res.status(500).json({
				data: null,
				message: 'failed remove file',
			});
		}
	},
};
