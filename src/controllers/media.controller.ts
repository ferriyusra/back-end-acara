import { Response } from 'express';
import { IReqUser } from '../utils/interfaces';
import uploader from '../utils/uploader';
import response from '../utils/response';

export default {
	async single(req: IReqUser, res: Response) {
		if (!req.file) {
			return response.error(res, null, 'File not found');
		}

		try {
			const result = await uploader.uploadSingle(
				req.file as Express.Multer.File
			);
			return response.success(res, result, 'File successfully uploaded');
		} catch {
			return response.error(res, null, 'File failed to upload');
		}
	},

	async multiple(req: IReqUser, res: Response) {
		if (!req.files || req.files.length === 0) {
			return response.error(res, null, 'File are not exists');
		}

		try {
			const result = await uploader.uploadMultiple(
				req.files as Express.Multer.File[]
			);
			return response.success(res, result, 'Files successfully uploaded');
		} catch {
			return response.error(res, null, 'Files failed to upload');
		}
	},

	async remove(req: IReqUser, res: Response) {
		try {
			const { fileUrl } = req.body as { fileUrl: string };
			const result = await uploader.remove(fileUrl);
			return response.success(res, result, 'success remove file');
		} catch {
			return response.error(res, null, 'failed remove file');
		}
	},
};
