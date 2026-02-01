const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
  try {
    const products = await prisma.product.findMany();
    console.log('=== DATABASE CHECK ===');
    console.log('Total products:', products.length);
    console.log('Featured products:', products.filter(p => p.featured).length);
    
    if (products.length > 0) {
      console.log('\n=== PRODUCTS LIST ===');
      products.forEach((p, i) => {
        console.log(`${i + 1}. ${p.nameVi} | Code: ${p.productCode} | Featured: ${p.featured}`);
      });
    } else {
      console.log('\n⚠️  No products found in database!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
