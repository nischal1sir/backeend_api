import ConnectDb from "./config/datbase";
import app from "./app"
import dotenv from "dotenv"
import seedAdminUser from "./config/seedAdmin";

dotenv.config()

const PORT=process.env.PORT || 8000

const startServer = async (): Promise<void> => {
	try {
		await ConnectDb();
		const seedResult = await seedAdminUser();
		console.log(JSON.stringify(seedResult));

		app.listen(PORT,()=>{
			console.log(`Server Start:${PORT}`)
		})
	} catch (error) {
		console.error("Failed to start server", error);
		process.exit(1);
	}
};

void startServer();