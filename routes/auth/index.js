const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const db = require('../../modules/db');

const router = express.Router();

const secret = process.env.MOT_SECRET;

/*
 * Pour tester:
   curl -X POST -H "Content-Type: application/json" -d "{\"password\": \"12345\", \"email\": \"dacruz@email.com\"}" http://localhost:3000/auth/create-token
 */
router.post('/create-token/', async (request, response) => {
  const { email, password } = request.body;
  // Debug
  console.log('DEBUG:routes/auth {request.body} = ', request.body);
  //console.log(`create token avec: ${JSON.stringify(request.body, null, 4)}`);

  const user = await db('utilisateur').where('email', email).first();
  if (!user) {
    return response.status(401).json({ message: 'Vous n\'êtes pas autorisé' });
  }

  const result = await bcrypt.compare(password, user.motdepasse);
  if (!result) {
    return response.status(401).json({ message: 'Vous n\'êtes pas autorisé' });
  }

  // définir les informations à encoder dans le jeton
  const claims = {
    userid: user.userid,
    name: user.nom,
    email: user.email,
  };

  // 4. Si oui aux deux dernières questions, je vais créer le token et l'envoyer à l'utilisateur.
  const token = jwt.sign(claims, secret);

  return response.status(200).json({ token });
});
module.exports = router;
