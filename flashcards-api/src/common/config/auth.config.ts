import dotenv from 'dotenv';

dotenv.config();

export interface AuthConfig {
  jwt: {
    secret: string;
  };
}

export const getAuthConfig = (): AuthConfig => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  return {
    jwt: { secret },
  };
};
