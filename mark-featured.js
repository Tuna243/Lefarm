const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function markAsFeatured() {
  try {
    // Get all products
    const products = await prisma.product.findMany();
    
    if (products.length === 0) {
      console.log('⚠️  No products found in database!');
      return;
    }
    
    console.log(`Found ${products.length} product(s). Marking as featured...`);
    
    // Mark all products as featured
    const updated = await prisma.product.updateMany({
      data: {
        featured: true
      }
    });
    
    console.log(`✅ Successfully marked ${updated.count} product(s) as featured!`);
    
    // Verify
    const featuredProducts = await prisma.product.findMany({
      where: { featured: true }
    });
    
    console.log('\n=== FEATURED PRODUCTS ===');
    featuredProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.nameVi} | Code: ${p.productCode}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

markAsFeatured();
