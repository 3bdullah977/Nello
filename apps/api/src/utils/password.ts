import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD_PEPPER;
const saltRounds = process.env.BCRYPT_SALT_ROUNDS;

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(`${pepper}${password}`, parseInt(saltRounds));
};

export const comparePasswords = (hashed: string, password: string) => {
  const isMatched = bcrypt.compareSync(`${pepper}${password}`, hashed);
  return isMatched;
};
