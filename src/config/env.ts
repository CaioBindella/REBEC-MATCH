import dotenv from 'dotenv';
dotenv.config();

export const config = {
  openAiKey: process.env.OPENAI_API_KEY,
  javaApiBaseUrl: process.env.JAVA_API_BASE_URL,
  port: process.env.PORT || 3000,
};