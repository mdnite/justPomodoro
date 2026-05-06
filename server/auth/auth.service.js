import * as authRepository from './auth.repository.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function register(email, password) {
  const userExist = await authRepository.findByEmail(email);
  if (userExist) {
    const err = new Error('User already exists');
    err.status = 409;
    throw err;
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await authRepository.create(email, hashedPassword);
  return user;
}

export async function login(email, password) {
  const user = await authRepository.findByEmail(email);

  const hashedPassword = user?.password_hash;
  const isValid = await bcrypt.compare(password, hashedPassword)
  
  if (!user || !isValid) {
    const err = new Error('Invalid email or password')
    err.status = 401;
    throw err;
  }

  // issue token
  return signJwtAndReturnUser(user);
}

export async function logout() {
  // nothing on the server-side - cookie is cleared in the router
}


export async function findOrCreateGoogleUser(profile) {
    const email = profile.emails?.[0]?.value;
    const googleId = profile.id;

    if(!email) throw new Error('No email returned from Google');

    // check if user exists
    let user = await authRepository.findByGoogleId(googleId)
    if (user) { return signJwtAndReturnUser(user) } // issue token

    // check if email already registered
    user = await authRepository.findByEmail(email);
    if (user) {
      // link google_id to existing account
      await authRepository.linkGoogleId(user.id, googleId);
      return signJwtAndReturnUser({...user, google_id: googleId});
    }

    // create new user
    user = await authRepository.createGoogleUser(email, googleId);
    return signJwtAndReturnUser(user);
}

export async function findOrCreateGithubUser(profile) {
    const email = profile.emails?.[0]?.value;
    const githubId = profile.id;

    if(!email) throw new Error('No email returned from Github');

    // check if user exists
    let user = await authRepository.findByGithubId(githubId)
    if (user) { return signJwtAndReturnUser(user) } // issue token

    // check if email already registered
    user = await authRepository.findByEmail(email);
    if (user) {
      // link github_id to existing account
      await authRepository.linkGithubId(user.id, githubId);
      return signJwtAndReturnUser({...user, github_id: githubId});
    }

    // create new user
    user = await authRepository.createGithubUser(email, githubId);
    return signJwtAndReturnUser(user);
}


// helper function to sign JWT and return user
function signJwtAndReturnUser(user) {
    const token = jwt.sign(
        {id: user.id, email: user.email},
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return { token, user }
}

