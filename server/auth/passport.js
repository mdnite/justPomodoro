import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import {findOrCreateGoogleUser} from './auth.service.js'



passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/api/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await findOrCreateGoogleUser(profile);
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

export default passport