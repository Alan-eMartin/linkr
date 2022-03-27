import bcrypt from 'bcryptjs';
import { Context } from '../../index';
import JWT from 'jsonwebtoken';
import { validateAuthInputs } from '../../utils';

interface CredentialTypes {
  email: string;
  password: string;
}

interface SignupArgs {
  credentials: CredentialTypes;
  username: string;
  name: string;
  bio?: string;
}

interface LoginArgs {
  credentials: CredentialTypes;
}

interface AuthPayloadType {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { credentials: { email, password }, username, name, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<AuthPayloadType> => {
    console.log('here');

    const errors = validateAuthInputs({
      email,
      password,
      username,
      name,
      bio: bio || '',
    });

    console.log('here 2');

    if (errors.length > 0) {
      return {
        userErrors: errors.map((error) => ({ message: error })),
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        name,
      },
    });

    await prisma.profile.create({
      data: {
        bio: bio || '',
        userId: user.id,
      },
    });

    // Generate JWT w/ userId
    const token = JWT.sign({ userId: user.id }, `${process.env.JWT_SECRET}`, {
      expiresIn: '7d',
    });

    return {
      userErrors: [],
      token: token,
    };
  },

  login: async (
    _: any,
    { credentials: { email, password } }: LoginArgs,
    { prisma }: Context
  ): Promise<AuthPayloadType> => {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        userErrors: [
          {
            message: 'Invalid login credentials',
          },
        ],
        token: null,
      };
    }

    // Check password
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return {
        userErrors: [
          {
            message: 'Invalid login credentials',
          },
        ],
        token: null,
      };
    }

    const token = JWT.sign(
      {
        userId: user.id,
      },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: '5d',
      }
    );

    return {
      userErrors: [],
      token,
    };
  },
};
