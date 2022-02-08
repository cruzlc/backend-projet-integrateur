const jwt = require('jsonwebtoken');
const db = require('./db');

module.exports = async function authMiddleware(request, response, next) {
  try {
    const { headers } = request;
    const authHeader = headers.authorization; // retourne => "Bearer dfgdhjfdghjfdgdhjfdghjfdgjdh"
    if (!authHeader) throw new Error('Il n\'y a pas d\'entête');
    if (!authHeader.toLowerCase().startsWith('bearer ')) throw new Error('Entête mal formée');
    const secret = process.env.MOT_SECRET;
    const token = authHeader.slice(7);

    // placer les claims du jeton dans request.user de façon à pouvoir les utiliser
    // dans les fonctions demandant l'authentification
    request.user = jwt.verify(token, secret);
    console.log('Ai reçu une requête authentifiée. Claims: ', JSON.stringify(request.user));

    // vérifier que l'utilisateur à qui ce jeton a été émis existe toujours
    const user = await db('utilisateur').where('email', request.user.email).first();
    if (!user) throw new Error('L\'utilisateur n\'existe plus.');

    return next();
  } catch (error) {
    console.log('Une erreur s\'est produite', error);
    return response.status(401)
      .send(`Not authorized. ${error.message}`);
  }
};
