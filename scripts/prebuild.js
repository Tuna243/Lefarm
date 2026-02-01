#!/usr/bin/env node

/**
 * Pre-build script - Generate Prisma Client
 * This ensures Prisma Client is generated before build
 */

const { execSync } = require('child_process');

console.log('🔨 Generating Prisma Client...');

try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated successfully!');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client');
  process.exit(1);
}
