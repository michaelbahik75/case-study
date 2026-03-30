import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Post, Comment],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const postRepo = AppDataSource.getRepository(Post);

  let user = await userRepo.findOne({ where: { email: 'admin@blog.com' } });

  if (!user) {
    user = userRepo.create({
      username: 'admin',
      email: 'admin@blog.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin' as any,
    });
    await userRepo.save(user);
    console.log('✅ Admin user created');
  }

  const posts = [
    {
      title: 'Getting Started with NestJS',
      content: 'NestJS is a progressive Node.js framework for building efficient and scalable server-side applications. It uses TypeScript by default and combines OOP, FP, and FRP elements.',
      coverImage: 'https://picsum.photos/seed/nest/800/400',
    },
    {
      title: 'Why TypeORM is Great for SQL Databases',
      content: 'TypeORM is an ORM that supports MySQL, PostgreSQL, and more. It allows you to define entities as classes and handles relationships, migrations, and queries elegantly.',
      coverImage: 'https://picsum.photos/seed/typeorm/800/400',
    },
    {
      title: 'Building REST APIs with Express',
      content: 'Express is a minimal and flexible Node.js web application framework. It provides robust features for building web and mobile applications with ease.',
      coverImage: 'https://picsum.photos/seed/express/800/400',
    },
    {
      title: 'React Hooks You Should Know',
      content: 'React hooks like useState, useEffect, useCallback, and useMemo have transformed how we write React components. Learn how to use them effectively in your projects.',
      coverImage: 'https://picsum.photos/seed/react/800/400',
    },
    {
      title: 'Mantine UI Component Library',
      content: 'Mantine is a fully featured React component library with over 100 components. It has great TypeScript support, dark mode, and works perfectly with TailwindCSS.',
      coverImage: 'https://picsum.photos/seed/mantine/800/400',
    },
    {
      title: 'JWT Authentication Explained',
      content: 'JSON Web Tokens are a compact way to securely transmit information. Learn how to implement JWT authentication in your NestJS backend with role-based access control.',
      coverImage: 'https://picsum.photos/seed/jwt/800/400',
    },
    {
      title: 'TailwindCSS Tips and Tricks',
      content: 'TailwindCSS is a utility-first CSS framework that lets you build modern designs without leaving your HTML. Here are some tips to get the most out of it.',
      coverImage: 'https://picsum.photos/seed/tailwind/800/400',
    },
    {
      title: 'MySQL Database Design Best Practices',
      content: 'Good database design is crucial for application performance. Learn about normalization, indexing, foreign keys, and query optimization for MySQL databases.',
      coverImage: 'https://picsum.photos/seed/mysql/800/400',
    },
  ];

  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0');
  await AppDataSource.getRepository(Comment).clear();
  await postRepo.clear();
  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1');

  for (const p of posts) {
    const post = postRepo.create({ ...p, author: user });
    await postRepo.save(post);
  }

  console.log('✅ Posts seeded successfully');
  process.exit();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});