module.exports = {
  getLocation: (req, res) => {
    console.log(req.query);
    res.send('You reached "Get Location"');
  },
  postLocation: (req, res) => {
    console.log(req.body);
    res.send('You reached "Post Location"');
  },
};
