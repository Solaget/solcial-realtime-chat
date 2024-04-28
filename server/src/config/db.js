import mongoose from "mongoose";

async function connectToDB() {
  try {
    await mongoose.connect(process.env._DB_URI);
    console.log("Connected To MonogoDB Successfully".america);
  } catch (error) {
    console.log(error)
    process.exit(1);
  }
}

export default connectToDB;