const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const products = [
    { name: "Wireless Headphones", price: 2999, category: "Electronics", description: "High quality sound", imageUrl: "https://placehold.co/400x300?text=Headphones" },
    { name: "Running Shoes", price: 1999, category: "Footwear", description: "Lightweight and comfortable", imageUrl: "https://placehold.co/400x300?text=Shoes" },
    { name: "Leather Wallet", price: 799, category: "Accessories", description: "Slim leather wallet", imageUrl: "https://placehold.co/400x300?text=Wallet" },
    { name: "Coffee Mug", price: 399, category: "Kitchen", description: "Ceramic coffee mug", imageUrl: "https://placehold.co/400x300?text=Mug" },
    { name: "Sunglasses", price: 1299, category: "Accessories", description: "UV protection", imageUrl: "https://placehold.co/400x300?text=Sunglasses" },
    { name: "Backpack", price: 2499, category: "Bags", description: "Waterproof backpack", imageUrl: "https://placehold.co/400x300?text=Backpack" },
    { name: "Smartwatch", price: 4999, category: "Electronics", description: "Fitness tracking watch", imageUrl: "https://placehold.co/400x300?text=Smartwatch" },
    { name: "Desk Lamp", price: 899, category: "Home", description: "LED desk lamp", imageUrl: "https://placehold.co/400x300?text=Lamp" },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("✅ Seeded successfully");
    process.exit();
}).catch((err) => {
    console.error(err);
    process.exit(1);
});