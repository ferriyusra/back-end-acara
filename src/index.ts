import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/api';
import db from './utils/database';
import docs from './docs/route';
import cors from 'cors';

async function init() {
	try {
		const result = await db();
		console.log('database status: ', result);

		const app = express();
		const PORT = 9852;

		app.use(cors());
		app.use(bodyParser.json());

		app.get('/', (req, res) => {
			res.status(200).json({ message: 'Server is running!', data: null });
		});

		app.use('/api', router);
		docs(app);

		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.log('Error Starting Server:', error);
	}
}

init();
