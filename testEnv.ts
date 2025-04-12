import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });  // Ensure it loads the correct .env.local file

console.log(process.env.DATABASE_URL);  // Log the DATABASE_URL value

if (process.env.DATABASE_URL) {
  console.log("DATABASE_URL is correctly loaded");
} else {
  console.log("DATABASE_URL is missing or not loaded");
}
