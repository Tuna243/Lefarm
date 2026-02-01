import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding admin user...')

  const email = 'nhtuan.job@gmail.com'
  const password = 'Tuan.24032002'
  const name = 'Admin Lefarm'

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log('✅ User already exists:', email)
    
    // Update password if needed
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: { email },
      data: { 
        password: hashedPassword,
        name,
      },
    })
    console.log('🔄 Password updated successfully')
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create admin user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'admin',
    },
  })

  console.log('✅ Admin user created successfully:')
  console.log('   Email:', user.email)
  console.log('   Name:', user.name)
  console.log('   Role:', user.role)
  console.log('\n🔐 Login credentials:')
  console.log('   Email:', email)
  console.log('   Password:', password)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
