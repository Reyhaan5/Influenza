import { getDashboardStats } from "../controllers/dashboardController.js";
import { saveRateCard, getMyRateCards } from "../controllers/rateCardController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, requireRole("influencer"), getMyProfile);
router.put("/profile", protect, requireRole("influencer"), updateMyProfile);
router.get("/dashboard", protect, requireRole("influencer"), getDashboardStats);

router.post("/social-accounts", protect, requireRole("influencer"), addSocialAccount);
router.delete("/social-accounts/:platform", protect, requireRole("influencer"), removeSocialAccount);

router.post("/rate-cards", protect, requireRole("influencer"), saveRateCard);
router.get("/rate-cards", protect, requireRole("influencer"), getMyRateCards);

export default router;