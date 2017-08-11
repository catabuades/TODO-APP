const fs = require('fs')
const strftime = require('strftime')
const crypto = require('crypto')

function handlePostLogin (req, res) {
  const { email, password } = req.body
  let autentification = false

  fs.readFile('./data-db/users_txt.txt', 'utf-8', (err, data) => {
    if (err) throw err
    const usersArrEncrypted = data.split('\r\n') // (/\r?\n/)
    const usersArrDecrypted = usersArrEncrypted.map((aAuthLine) => decrypt(aAuthLine))
    console.log('------------ encrypted --------------')
    console.log(usersArrEncrypted)
    console.log('------------ decrypted --------------')
    console.log(usersArrDecrypted)
    usersArrDecrypted.forEach((user) => {
      let [emailDB, passDB] = user.split(':')
      if (emailDB === email && passDB === password) {
        autentification = true
        req.session.login = { email }
        console.log('------------ new login --------------')
        console.log('user: ' + email)
        console.log('pass: ' + password)
        console.log('logged at: ' + strftime('%F:%T', new Date()))
        console.log('-------------------------------------')
      }
    })
    if (autentification) {
      loadJSONtasks(req, res, email)
    } else res.redirect('/error')
  })
}

function loadJSONtasks (req, res, userID) {
  const dataFileName = `./data-db/users_tasks/${userID}.json`
  fs.readFile(dataFileName, 'utf-8', (err, data) => {
    if (err) throw err
    data = JSON.parse(data)
    req.session.tasks = data["tasks"]
    req.session.completed = data["completed"]
    res.redirect('/tasks/')
  })
}

function decrypt (text) {
  let decipher = crypto.createDecipher(global.algorithm, global.cryptoPass)
  let dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

module.exports = handlePostLogin
