import { withIronSession } from "next-iron-session";

function withSession(handler) {
  return withIronSession(handler, {
    password: process.env.SECRET_KEY,
    cookieName: "_MP_LABINTERNAL_APP_",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}

export default withSession