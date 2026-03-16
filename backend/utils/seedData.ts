import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const sellerId = process.env.SELLER_ID;

if (!sellerId) {
  console.error('Error: SELLER_ID environment variable is required.');
  console.error('Usage: SELLER_ID=<prisma_user_id> npm run seed');
  process.exit(1);
}

const products = [
  { name: 'Marvel Avengers Graphic Tee', description: 'Show your love for the Avengers with this premium graphic tee.', price: 899, originalPrice: 1299, category: 'men' as const, sizes: ['S', 'M', 'L', 'XL', 'XXL'], sku: 'MEN-MARVEL-001', images: ['https://images.unsplash.com/photo-1643387848945-da63360662f4?w=800'], stock: 245, sold: 234, rating: 4.5, numReviews: 234, features: ['100% Premium Cotton', 'Vibrant Print', 'Regular Fit', 'Machine Washable'], sellerId },
  { name: 'Anime Collection Hoodie', description: 'Premium quality hoodie featuring exclusive anime designs.', price: 1499, originalPrice: 1999, category: 'men' as const, sizes: ['M', 'L', 'XL', 'XXL'], sku: 'MEN-HOODIE-001', images: ['https://images.unsplash.com/photo-1760509370980-d201b9bc327e?w=800'], stock: 143, sold: 189, rating: 4.8, numReviews: 189, features: ['Premium Fabric', 'Comfortable Fit', 'Durable Print'], sellerId },
  { name: 'Urban Streetwear Jacket', description: 'Stylish streetwear jacket for urban fashion enthusiasts.', price: 1999, originalPrice: 2999, category: 'men' as const, sizes: ['S', 'M', 'L'], sku: 'MEN-JACKET-001', images: ['https://images.unsplash.com/photo-1716827172706-9f4c36b039eb?w=800'], stock: 89, sold: 156, rating: 4.7, numReviews: 156, features: ['Water Resistant', 'Multiple Pockets', 'Premium Quality'], sellerId },
  { name: 'Casual Oversized Tee', description: 'Comfortable oversized t-shirt for a relaxed casual look.', price: 799, originalPrice: 1099, category: 'men' as const, sizes: ['S', 'M', 'L', 'XL', 'XXL'], sku: 'MEN-OVERSIZED-001', images: ['https://images.unsplash.com/photo-1516442443906-71605254b628?w=800'], stock: 312, sold: 312, rating: 4.6, numReviews: 312, features: ['Oversized Fit', 'Soft Cotton', 'Breathable'], sellerId },
  { name: 'Women Trendy Top', description: 'Fashionable top for modern women.', price: 999, originalPrice: 1499, category: 'women' as const, sizes: ['XS', 'S', 'M', 'L'], sku: 'WMN-TOP-001', images: ['https://images.unsplash.com/photo-1702678839327-761d359c3c7d?w=800'], stock: 198, sold: 198, rating: 4.4, numReviews: 198, features: ['Trendy Design', 'Comfortable Fabric', 'Easy Care'], sellerId },
  { name: 'Kids Playful Tee', description: 'Fun and colorful t-shirt for kids.', price: 599, originalPrice: 899, category: 'kids' as const, sizes: ['4-6Y', '6-8Y', '8-10Y'], sku: 'KDS-TEE-001', images: ['https://images.unsplash.com/photo-1759313560190-d160c3567170?w=800'], stock: 267, sold: 267, rating: 4.9, numReviews: 267, features: ['Soft Fabric', 'Vibrant Colors', 'Durable'], sellerId },
];

const seed = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL');
    await prisma.product.deleteMany();
    console.log('Cleared existing products');
    const created = await prisma.product.createMany({ data: products });
    console.log(`Seeded ${created.count} products`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', (err as Error).message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
