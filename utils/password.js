import bcrypt from 'bcrypt';

export const passwordHash = async (password, saltRounds = 10) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

export const isPasswordValid = async (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};
