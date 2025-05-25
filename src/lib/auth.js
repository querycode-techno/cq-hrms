import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb';  
import User from './models/user';
import { env } from './env';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          await connectDB();

          // Find user by email and populate role with permissions
          const user = await User.findOne({ 
            personalEmail: credentials.email.toLowerCase() 
          }).populate({
            path: 'role',
            populate: {
              path: 'permissions',
              model: 'Permission'
            }
          });

          if (!user) {
            throw new Error('No user found with this email');
          }

          // Check if user is active
          if (user.status !== 'Active') {
            throw new Error('Account is not active. Please contact administrator.');
          }

          // Verify password
          if (!user.password) {
            throw new Error('Password not set for this account. Please contact administrator.');
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password);

          if (!isValidPassword) {
            throw new Error('Invalid password');
          }

          // Return user object for session
          return {
            id: user._id.toString(),
            email: user.personalEmail,
            name: user.fullName,
            employeeId: user.employeeId,
            role: {
              id: user.role._id.toString(),
              name: user.role.name,
              permissions: user.role.permissions.map(permission => ({
                id: permission._id.toString(),
                module: permission.module,
                action: permission.action,
                resource: permission.resource,
                description: permission.description
              }))
            },
            status: user.status,
            image: user.profileImage || null
          };

        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist user data in JWT token
      if (user) {
        token.id = user.id;
        token.employeeId = user.employeeId;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id;
        session.user.employeeId = token.employeeId;
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after login
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: env.NEXTAUTH_SECRET,
  debug: env.NODE_ENV === 'development',
};

export default NextAuth(authOptions); 