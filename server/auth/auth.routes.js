import { Router } from "express";
import * as authService from "./auth.service.js";
import { authenticate } from "./auth.middleware.js";
import passport from "../auth/passport.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);

    // use Cookies for authentication (stores token in cookie)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // false for development, true for production with HTTPS
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get("/me", authenticate, (req, res) => {
  res.json({ id: req.user.sub, email: req.user.email });
});

// kick off Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// Google redirects back here
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  (req, res) => {
    const { token } = req.user;

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // false for development, true for production with HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.redirect("http://localhost:5173/");
  },
);

// kick off GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
);

// GitHub redirects back here
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  (req, res) => {
    const { token } = req.user;

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // false for development, true for production with HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    res.redirect("http://localhost:5173/");
  },
);

// Forgot password
router.post("/forgot-password", async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: "A reset link has been sent to your email." });
  } catch (error) {
    next(err);
  }
});

// Reset password
router.post("/reset-password", async (req, res, next) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    res.json({ message: "Password reset successfully!" });
  } catch (error) {
    next(error);
  }
});

export default router;
