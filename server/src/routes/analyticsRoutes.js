const router = require("express").Router()
const {
  teacherSummary,
  weeklyTrends,
  teacherDetails,
  getTeachers,
  classBreakdown,
  subjectBreakdown
} = require("../controllers/analyticsController")


const {
  verifyJWT
} = require("../middlewares/authMiddleware")

const {
  allowRoles
} = require("../middlewares/roleMiddleware")

// const {
//   teacherSummary,
//   weeklyTrends,
//   teacherDetail
// } = require("../controllers/analyticsController")

router.get(
  "/teacher-summary",
  verifyJWT,
  allowRoles("principal"),
  teacherSummary
)

router.get(
  "/weekly-trends",
  verifyJWT,
  allowRoles("principal"),
  weeklyTrends
)

// router.get(
//   "/teacher/:id",
//   verifyJWT,
//   allowRoles("principal"),
//   teacherDetail
// )

router.get(
  "/teacher-details/:id",
  verifyJWT,
  allowRoles("principal"),
  teacherDetails
)


router.get(
  "/teachers",
  verifyJWT,
  allowRoles("principal"),
  getTeachers
)

router.get(
  "/subject/:id",
  verifyJWT,
  allowRoles("principal"),
  subjectBreakdown
)

router.get(
  "/class/:id",
  verifyJWT,
  allowRoles("principal"),
  classBreakdown
)

router.get(
  "/weekly/:id",
  verifyJWT,
  allowRoles("principal"),
  weeklyTrends
)

const {enhancedWeeklyTrend}=require("../controllers/analyticsController")
router.get(
  "/weekly-enhanced",
  verifyJWT,
  allowRoles("principal"),
  enhancedWeeklyTrend
)

const {weeklyAIInsight}=require("../controllers/analyticsController")
router.get(
  "/weekly-ai",
  verifyJWT,
  allowRoles("principal"),
  weeklyAIInsight
)




module.exports = router
