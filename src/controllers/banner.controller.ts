import { Response } from 'express';
import { IPaginationQuery, IReqUser } from '../utils/interfaces';
import response from '../utils/response';
import BannerModel, { bannerDAO, TypeBanner } from '../models/banner.model';
import { FilterQuery, isValidObjectId } from 'mongoose';

export default {
	async create(req: IReqUser, res: Response) {
		try {
			await bannerDAO.validate(req.body);
			const result = await BannerModel.create(req.body);
			response.success(res, result, 'success create banner');
		} catch (error) {
			response.error(res, error, 'failed to create banner');
		}
	},
	async findAll(req: IReqUser, res: Response) {
		try {
			const {
				page = 1,
				limit = 10,
				search,
			} = req.query as unknown as IPaginationQuery;

			const query: FilterQuery<TypeBanner> = {};
			if (search) {
				Object.assign(query, {
					...query,
					$text: {
						$search: search,
					},
				});
			}

			const result = await BannerModel.find(query)
				.limit(limit)
				.skip((page - 1) * limit)
				.sort({ createdAt: -1 })
				.exec();

			const count = await BannerModel.countDocuments(query);

			response.pagination(
				res,
				result,
				{
					total: count,
					current: page,
					totalPages: Math.ceil(count / limit),
				},
				'success find all banners'
			);
		} catch (error) {
			response.error(res, error, 'failed to find all banners');
		}
	},
	async findOne(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			if (!isValidObjectId(id)) {
				return response.notfound(res, 'banner not found');
			}

			const result = await BannerModel.findById(id);
			if (!result) {
				response.notfound(res, 'banner not found');
			}

			response.success(res, result, 'success find one banner');
		} catch (error) {
			response.error(res, error, 'failed to find one banner');
		}
	},
	async update(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			if (!isValidObjectId(id)) {
				return response.notfound(res, 'banner not found');
			}

			const result = await BannerModel.findByIdAndUpdate(id, req.body, {
				new: true,
			});
			if (!result) {
				response.notfound(res, 'banner not found');
			}

			response.success(res, result, 'success update banner');
		} catch (error) {
			response.error(res, error, 'failed to update banner');
		}
	},
	async remove(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			if (!isValidObjectId(id)) {
				return response.notfound(res, 'banner not found');
			}

			const result = await BannerModel.findByIdAndDelete(id, {
				new: true,
			});
			if (!result) {
				response.notfound(res, 'banner not found');
			}

			response.success(res, result, 'success remove banner');
		} catch (error) {
			response.error(res, error, 'failed to remove banner');
		}
	},
};
