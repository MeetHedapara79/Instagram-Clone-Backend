# Instagram Clone Backend

This is the backend of a full-stack Instagram clone built with **Node.js**, **Express**, **Prisma**, **TypeScript**, and **Socket.IO**. It handles user authentication, posts, stories, comments, file uploads, and real-time messaging.

## 🚀 Features

- JWT-based user authentication  
- RESTful API for posts, stories, likes, and comments  
- Real-time messaging with Socket.IO  
- File upload using Multer and AWS S3  
- Redis integration for scalable real-time features  
- Prisma ORM with PostgreSQL  
- Input validation using Zod  
- Environment-based configuration with dotenv  

## 🛠️ Tech Stack

- Node.js  
- Express  
- TypeScript  
- Prisma  
- PostgreSQL  
- Socket.IO  
- AWS S3  
- Redis  
- Zod  

## 📦 Installation

git clone https://github.com/MeetHedapara79/Instagram-Clone-Backend.git
cd Instagram-Clone-Backend
npm install

## ⚙️ Environment Variables

DATABASE_URL="your_mysql_url"
JWT_SECRET="your_jwt_secret"
BUCKET_PATH="your_bucket_path"
BUCKET_NAME="your_bucket_name"
AWS_ACCESSKEY="your_aws_access_key"
AWS_SECRET_ACCESSKEY="your_aws_secret_key"

## 🧪 Development

npm run start

## 🏗 Production Build

npm run build
npm run start:prod

## 🗃 Prisma ORM

npx prisma generate
npx prisma migrate dev
npx prisma studio
