function showLogin (req, res) {
  // console.log('current LOGIN cookie:', req.session.login)
  req.session.login ? res.redirect('/home/') : res.render('pages/login')
}

module.exports = showLogin
