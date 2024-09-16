import express from 'express';
const router = express.Router();

router.route('/').get((req, res) => {
  res.status(200).send('Sign up page');
});

export const signupRoutes = router;
