const { withIronSession } = require("next-iron-session");

const axios = require("axios");
const { createAPIHeader, createAPIHeaderWithBearerToken } = require('../../common/service-helper')

const url = `${process.env.BACKEND_URL}/internal/api`
 
async function handler(req, res, session) {

  console.log();

  const param = JSON.parse(req.body);
  const data = {
    username: param.username, 
    password: param.password
  }

  const options = {
    method: 'POST',
    url: `${url}/login`,
    headers: createAPIHeader(),
    data: JSON.stringify(data)
  };

  await axios(options).then(async loginRes => {

    if (loginRes.status === 200)
    {
      const dat = loginRes.data

      const auth = {
        isLoggedIn: true,
        id: dat.user.accountName,
        username: dat.user.accountName,
        user: dat.user.accountName,
        email: dat.user.email,
        token: dat.token
      }

      await req.session.set('auth', auth)   
      await req.session.save()

      res.status(200);
      res.json(auth);
      res.send();
    } else {
      res.status(404);
      res.send();
    }

  }) .catch((error) => {
    console.log(error)
    res.status(500);
    res.send();
  })
  
}
 
export default withIronSession(handler, {
  password: process.env.SECRET_KEY,
  cookieName: process.env.COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});