import swaggerAutogen from 'swagger-autogen';

const doc = {
	info: {
		version: 'v0.0.1',
		title: 'Docs API Acara',
		description: 'Docs API Acara',
	},
	servers: [
		{
			url: 'http://localhost:9852/api',
			description: 'Local server',
		},
		{
			url: 'https://back-end-acara-lac.vercel.app/api',
			description: 'Development server',
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
			},
		},
		schemas: {
			LoginRequest: {
				identifier: 'yourname',
				password: 'yourpassword',
			},
			RegisterRequest: {
				fullName: 'yourname',
				username: 'yourusername',
				email: 'youremail@mail.com',
				password: 'yourpassword',
				confirmPassword: 'yourConfirmpassword',
			},
			UpdateProfileRequest: {
				fullName: '',
				profilePicture: '',
			},
			UpdatePasswordRequest: {
				oldPassword: '',
				password: '',
				confirmPassword: '',
			},
			ActivationRequest: {
				code: 'abcyznsqwe',
			},
			CreateCategoryRequest: {
				name: 'categoryname',
				description: 'categorydescription',
				icon: 'fa fa-icon',
			},
			CreateEventRequest: {
				name: '',
				banner: 'fileUrl',
				category: 'category objectID',
				description: '',
				startDate: 'yyyy-mm-dd hh:mm:ss',
				endDate: 'yyyy-mm-dd hh:mm:ss',
				location: {
					region: 'region id',
					coordinates: [0, 0],
					address: '',
				},
				isOnline: false,
				isFeatured: false,
				isPublish: false,
			},
			CreateTicketRequest: {
				price: 0,
				name: 'name',
				events: 'event objectID',
				description: 'ticket desc',
				quantity: 5,
			},
			CreateOrderRequest: {
				events: 'event object id',
				ticket: 'ticket object id',
				quantity: 1,
			},
			CreateBannerRequest: {
				title: 'title',
				image: 'fileUrl',
				isShow: true,
			},
			RemoveMediaRequest: {
				fileUrl: 'mediaURL',
			},
		},
	},
};
const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes/api.ts'];

swaggerAutogen({
	openapi: '3.0.0',
})(outputFile, endpointsFiles, doc);
