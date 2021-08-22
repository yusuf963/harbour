const expressJwt = require('express-jwt');

function authJwt() {
  const secret = process.env.SECRET_KEY;
  return expressJwt({ secret, algorithms: ['HS256'],
  isRevoked: isRevoked
}).unless({
    path: [
      { url: /\items(.*)/, methods: ['GET', 'OPTION'] },
      '/users/login',
      '/users/register',
    ],
  });
}


//admin only can post delete and update 
async function isRevoked(req, payload, done) {
  if(!payload.isAdmin){
    done(null,true)
  }
  done()
}
module.exports = authJwt;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjIxZTA0ZDE3YmEwNDQ5OGY2NTFjZSIsImlhdCI6MTYyOTYyODM0NywiZXhwIjoxNjI5NzE0NzQ3fQ.mcbFGHjtG9EIbtYYG5PRcaYusPK4EbEfBviS8LJBedw
