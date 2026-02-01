import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
const JWT_SECRET = new TextEncoder().encode(SECRET_KEY)

export interface JWTPayload {
  userId: string
  email: string
  name: string
  role: string
}

// Generate JWT token
export async function generateToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token expires in 7 days
    .sign(JWT_SECRET)

  return token
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
