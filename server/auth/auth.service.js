import * as authRepository from './auth.repository.js';

export async function register(email, password) {
  // TODO: hash password, check for existing user, create record
}

export async function login(email, password) {
  // TODO: look up user, verify password hash, issue session/token
}

export async function logout() {
  // TODO: invalidate session/token
}
