const { withIronSession } = require("next-iron-session");
 
function handler(req, res, session) {
  req.session.destroy();
  res.status(200);
  res.send();
}
 
export default withIronSession(handler, {
  password: process.env.SECRET_KEY,
  cookieName: process.env.COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});