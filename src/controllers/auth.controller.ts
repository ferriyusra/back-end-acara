import { Request, Response } from 'express';
import UserModel, {
	userDTO,
	userLoginDTO,
	userUpdatePasswordDTO,
} from '../models/user.model';
import { encrypt } from '../utils/encryption';
import { generateToken } from '../utils/jwt';
import { IReqUser } from '../utils/interfaces';
import response from '../utils/response';

export default {
	async updateProfile(req: IReqUser, res: Response) {
		try {
			const userId = req.user?.id;
			const { fullName, profilePicture } = req.body;

			const result = await UserModel.findByIdAndUpdate(
				userId,
				{
					fullName,
					profilePicture,
				},
				{
					new: true,
				}
			);

			if (!result) {
				return response.notfound(res, 'user not found');
			}

			response.success(res, result, 'success to update profie');
		} catch (error) {
			response.error(res, error, 'failed to update profile');
		}
	},

	async updatePassword(req: IReqUser, res: Response) {
		try {
			const userId = req.user?.id;
			const { oldPassword, password, confirmPassword } = req.body;

			await userUpdatePasswordDTO.validate({
				oldPassword,
				password,
				confirmPassword,
			});

			const user = await UserModel.findById(userId);
			if (!user || user.password !== encrypt(oldPassword)) {
				return response.notfound(res, 'user not found');
			}

			const result = await UserModel.findByIdAndUpdate(
				userId,
				{
					password: encrypt(password),
				},
				{
					new: true,
				}
			);

			response.success(res, result, 'success to update password');
		} catch (error) {
			response.error(res, error, 'failed to update password');
		}
	},

	async register(req: Request, res: Response) {
		const { fullName, username, email, password, confirmPassword } = req.body;

		try {
			await userDTO.validate({
				fullName,
				username,
				email,
				password,
				confirmPassword,
			});

			const result = await UserModel.create({
				fullName,
				email,
				username,
				password,
			});

			return response.success(res, result, 'User registered successfully');
		} catch (error) {
			return response.error(res, error, 'User failed registration');
		}
	},

	async login(req: Request, res: Response) {
		try {
			const { identifier, password } = req.body;
			await userLoginDTO.validate({
				identifier,
				password,
			});

			// ambil data user berdasarkkan "identifier" => email dan username
			const userByIdentifier = await UserModel.findOne({
				$or: [
					{
						email: identifier,
					},
					{
						username: identifier,
					},
				],
				isActive: true,
			});

			if (!userByIdentifier) {
				return response.unauthorized(res, 'User not found');
			}

			// validasi password
			const validatePassword: boolean =
				encrypt(password) === userByIdentifier.password;

			if (!validatePassword) {
				return response.unauthorized(res, 'User not found');
			}

			const token = generateToken({
				id: userByIdentifier._id,
				role: userByIdentifier.role,
			});
			return response.success(res, token, 'Login success');
		} catch (error) {
			return response.error(res, error, 'Login failed');
		}
	},

	async me(req: IReqUser, res: Response) {
		try {
			const user = req.user;

			const result = await UserModel.findById(user?.id);
			return response.success(res, result, 'Success get user profile');
		} catch (error) {
			return response.error(res, error, 'Failed get user profile');
		}
	},

	async activation(req: Request, res: Response) {
		try {
			const { code } = req.body as { code: string };

			const user = await UserModel.findOneAndUpdate(
				{
					activationCode: code,
				},
				{
					isActive: true,
				},
				{
					new: true,
				}
			);
			return response.success(res, user, 'User Successfully Activate');
		} catch (error) {
			const err = error as unknown as Error;
		}
	},
};
