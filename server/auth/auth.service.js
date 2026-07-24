import * as authRepository from "./auth.repository.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Connection } from "mysql2";
import nodemailer from "nodemailer";

export async function register(email, password) {
  const userExist = await authRepository.findByEmail(email);
  if (userExist) {
    const err = new Error("User already exists");
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

  // Safeguard when an account exists by created via OAuth - no password set
  if(user && !user.password_hash) {
    const err = new Error("This account already exists. To set a password, click the \"Forgot Password \" link");
    err.status = 401;
    throw err;
  }

  const hashedPassword = user?.password_hash;
  const isValid = await bcrypt.compare(password, hashedPassword);

  if (!user || !isValid) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  // issue token
  return signJwtAndReturnUser(user);
}

export async function logout() {
  // nothing on the server-side - cookie is cleared in the router
}

export async function sendEmail(email, subject, html) {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.MY_EMAIL_SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: email,
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.log(error, "Email not sent");
  }
}

export async function forgotPassword(email) {
  const user = await authRepository.findByEmail(email);

  if (!user) {
    return;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const resetLink = `<a href="${resetURL}">Reset password</a>`;

  await sendEmail(
    email,
    "Reset your justPomodoro password",
    resetLink,
  );
}

export async function resetPassword(token, newPassword) {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const error = new Error("Invalid or expired reset link");
    error.status = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await authRepository.updatePassword(payload.id, passwordHash);
}

export async function findOrCreateGoogleUser(profile) {
  const email = profile.emails?.[0]?.value;
  const googleId = profile.id;

  if (!email) throw new Error("No email returned from Google");

  // check if user exists
  let user = await authRepository.findByGoogleId(googleId);
  if (user) {
    return signJwtAndReturnUser(user);
  } // issue token

  // check if email already registered
  user = await authRepository.findByEmail(email);
  if (user) {
    // link google_id to existing account
    await authRepository.linkGoogleId(user.id, googleId);
    return signJwtAndReturnUser({ ...user, google_id: googleId });
  }

  // create new user
  user = await authRepository.createGoogleUser(email, googleId);
  return signJwtAndReturnUser(user);
}

export async function findOrCreateGithubUser(profile) {
  const email = profile.emails?.[0]?.value;
  const githubId = String(profile.id);

  // if the github user set their email as private, use a placeholder derived from their Github username
  const resolvedEmail = email || `github_${githubId}@noemail.com`;

  // check if user exists
  let user = await authRepository.findByGithubId(githubId);
  if (user) {
    return signJwtAndReturnUser(user);
  } // issue token

  // check if email already registered
  user = email ? await authRepository.findByEmail(resolvedEmail) : null;
  if (user) {
    // link github_id to existing account
    await authRepository.linkGithubId(user.id, githubId);
    return signJwtAndReturnUser({ ...user, github_id: githubId });
  }

  // create new user (if email is private then use resolved email)
  user = await authRepository.createGithubUser(resolvedEmail, githubId);
  return signJwtAndReturnUser(user);
}

// helper function to sign JWT and return user
function signJwtAndReturnUser(user) {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return { token, user };
}
