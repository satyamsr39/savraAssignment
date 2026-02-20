const router = require("express").Router()

const {
  verifyJWT
} = require("../middlewares/authMiddleware")

const {
  allowRoles
} = require("../middlewares/roleMiddleware")

const {
  createActivity
} = require("../controllers/activityController")

router.post(
  "/create",
  verifyJWT,
  allowRoles("teacher"),
  createActivity
)

const {getMyActivities}=require("../controllers/activityController")

router.get(
  "/my",
  verifyJWT,
  allowRoles("teacher"),
  getMyActivities
)


module.exports = router
