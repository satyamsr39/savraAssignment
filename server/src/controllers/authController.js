const User = require("../models/User")
const bcrypt = require("bcryptjs")
const generateToken = require("../utils/generateToken")

exports.register = async (req, res) => {
  const { name, email, password } = req.body
  const role="teacher"

  const hash = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hash,
    role
  })

  res.json(user)
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

 if (!user)
  return res.status(404).json({
    msg: "Email not registered"
  })


  const match = await bcrypt.compare(
    password,
    user.password
  )

  if (!match)
  return res.status(401).json({
    msg: "Incorrect password"
  })


  res.json({
    token: generateToken(user),
    role: user.role
  })
  console.log(user.password)
console.log(password)

}
exports.createPrincipal = async (req, res) => {

  const {
    name,
    email,
    password,
    secret
  } = req.body

  if (
    secret !==
    process.env.PRINCIPAL_SECRET
  ) {
    return res.status(403).json({
      msg: "Unauthorized access"
    })
  }

  const exists =
    await User.findOne({ email })

  if (exists)
    return res.status(400).json({
      msg: "User already exists"
    })

  const hashed =
    await require("bcryptjs")
      .hash(password, 10)

  await User.create({
    name,
    email,
    password: hashed,
    role: "principal"
  })

  res.json({
    msg: "Principal created"
  })
}

