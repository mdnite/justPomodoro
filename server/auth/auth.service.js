import * as sessionServices from '../sessions/sessions.service.js';
import * as authRepository from './auth.repository.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function register(email, password) {
  // TODO: hash password, check for existing user, create record
  const userExist = await authRepository.findByEmail(email);
  if (userExist) {
    throw new Error("User already exists")
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await authRepository.create(email, hashedPassword);
  return user;
}

export async function login(email, password) {
  // TODO: look up user, verify password hash, issue session/token
  const user = await authRepository.findByEmail(email);

  const hashedPassword = user?.password_hash;
  const isValid = await bcrypt.compare(password, hashedPassword)
  
  if (!user || !isValid) {
    throw new Error('Invalid email or password');
  }

  // issue token
  const token = jwt.sign(
    {sub: user.id, email: user.email},
    process.env.JWT_SECRET, 
    {expiresIn: '1d'} // should expires in 1 day instead
  );

  return {
    token, 
    user: { 
      id: user.id, 
      email: user.email
    } 
  };
}

export async function logout() {
  // TODO: invalidate session/token
  // nothing on the server-side - cookie is cleared in the router
}
