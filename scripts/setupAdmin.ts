import 'dotenv/config'
import connectDB from '../lib/mongodb'
import User from '../models/User'
import bcrypt from 'bcryptjs'

async function setupAdmin() {
  try {
    await connectDB()

    const adminEmail = 'admin@earthfields.in'
    const adminPassword = 'admin123' // Change this in production

    // First, check for and remove any users with null usernames
    await User.deleteMany({ userName: null })

    const existingAdmin = await User.findOne({ email: adminEmail })
    if (existingAdmin) {
      console.log('Admin user already exists')
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      userName: 'admin'
    })

    console.log('Admin user created successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error setting up admin:', error)
    process.exit(1)
  }
}

setupAdmin() 