const router = require("express").Router()
const {
  register,
  login,
  createPrincipal
} = require("../controllers/authController")

router.post("/register", register)
router.post("/login", login)

router.post(
  "/create-principal",
  createPrincipal
)


module.exports = router
