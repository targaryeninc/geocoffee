const pool = require('../db.js');

module.exports = {
  getUser: (req, res, next) => {
    res.send('You reached "Get user"');
  },

  postUser: async (req, res, next) => {
    const {
      type, login, password, fn, ln,
    } = req.body;

    if (!login || !type) {
      return res.status(356).send('Must send login and user type');
    }

    const query = {
      name: 'postUser',
      text:
        'INSERT INTO users ( user_type, user_login, user_password, user_fn, user_ln) VALUES ($1, $2,$3,$4,$5) RETURNING user_id,user_login,user_password',
      values: [type, login, password, fn, ln],
    };

    await pool
      .query(query)
      .then(result => (res.locals.result = result.rows[0]))
      .then(() => next())
      .catch((err) => {
        console.error(err);
        return res
          .status(356)
          .send(err.code == 23505 ? 'Login name is taken.' : 'Something went wrong.');
      });
  },
};
