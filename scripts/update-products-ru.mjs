/**
 * Script to update existing products with Russian names (nameRU)
 * Run with: node scripts/update-products-ru.mjs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapping of English product names to Russian names
const productNameMapping = {
  // Chili peppers / Ớt
  'Chili Pepper': 'Острый перец',
  'Red Chili': 'Красный острый перец',
  'Green Chili': 'Зелёный острый перец',
  'Dried Chili': 'Сушёный острый перец',
  'Fresh Chili': 'Свежий острый перец',
  'Bell Pepper': 'Болгарский перец',

  // Lemongrass / Sả
  'Lemongrass': 'Лемонграсс',
  'Fresh Lemongrass': 'Свежий лемонграсс',
  'Dried Lemongrass': 'Сушёный лемонграсс',
  'Lemongrass Tea': 'Чай из лемонграсса',

  // Ginger / Riềng
  'Ginger': 'Имбирь',
  'Fresh Ginger': 'Свежий имбирь',
  'Dried Ginger': 'Сушёный имбирь',
  'Ginger Powder': 'Порошок имбиря',

  // Fruits / Trái cây
  'Mango': 'Манго',
  'Dragon Fruit': 'Питайя',
  'Passion Fruit': 'Маракуйя',
  'Pineapple': 'Ананас',
  'Papaya': 'Папайя',
  'Coconut': 'Кокос',
  'Orange': 'Апельсин',
  'Lemon': 'Лимон',
  'Lime': 'Лайм',
  'Apple': 'Яблоко',
  'Banana': 'Банан',
  'Watermelon': 'Арбуз',

  // Vegetables / Rau
  'Tomato': 'Помидор',
  'Cucumber': 'Огурец',
  'Water Spinach': 'Амарант водный',
  'Lettuce': 'Салат латук',
  'Cabbage': 'Капуста',
  'Zucchini': 'Цукини',
  'Onion': 'Лук',
  'Garlic': 'Чеснок',

  // Rice / Cơm
  'ST25 Rice': 'Рис ST25',
  'Brown Rice': 'Коричневый рис',

  // Herbs / Rau thơm
  'Cilantro': 'Кориандр',
  'Basil': 'Базилик',

  // Generic
  'Spice': 'Специя',
  'Herb': 'Трава',
  'Seasoning': 'Приправа',
};

async function updateProductsWithRussianNames() {
  try {
    console.log('🔄 Starting to update products with Russian names...\n');

    // Get all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        nameVi: true,
        nameEn: true,
        nameRU: true,
      },
    });

    console.log(`📦 Found ${products.length} products to process\n`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      // Skip if already has Russian name
      if (product.nameRU) {
        console.log(
          `⏭️  Already has RU: ${product.nameEn} (${product.nameRU})`
        );
        skipped++;
        continue;
      }

      // Find matching Russian name
      let russianName = null;

      // Try exact match with English name
      if (productNameMapping[product.nameEn]) {
        russianName = productNameMapping[product.nameEn];
      } else {
        // Try to find partial match
        for (const [en, ru] of Object.entries(productNameMapping)) {
          if (
            product.nameEn.toLowerCase().includes(en.toLowerCase()) ||
            en.toLowerCase().includes(product.nameEn.toLowerCase())
          ) {
            russianName = ru;
            break;
          }
        }
      }

      if (russianName) {
        // Update product with Russian name
        await prisma.product.update({
          where: { id: product.id },
          data: { nameRU: russianName },
        });

        console.log(`✅ Updated: ${product.nameEn} → ${russianName}`);
        updated++;
      } else {
        // Default to transliteration or keep English
        console.log(
          `⚠️  No mapping: ${product.nameEn} (will keep English)`
        );
        // Optionally update with English name
        // await prisma.product.update({
        //   where: { id: product.id },
        //   data: { nameRU: product.nameEn },
        // });
        skipped++;
      }
    }

    console.log(
      `\n📊 Summary:\n   ✅ Updated: ${updated}\n   ⏭️  Skipped: ${skipped}\n   📈 Total: ${products.length}`
    );

    console.log('\n✨ Done! All products have been processed.');
  } catch (error) {
    console.error('❌ Error updating products:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateProductsWithRussianNames().catch(console.error);
