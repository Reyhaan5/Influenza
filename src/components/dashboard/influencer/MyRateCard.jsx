// src/components/dashboard/influencer/MyRateCard.jsx
import axios from "axios";
import ReceiptPrinter from "../../pricing/ReceiptPrinter";

const API_URL = "http://localhost:5000/api";

export default function MyRateCard({ profile }) {
  const primaryAccount = profile.socialAccounts?.[0];

  const initialAnswers = primaryAccount
    ? { handle: primaryAccount.handle, followers: String(primaryAccount.followers), avgLikes: "", avgComments: "", nicheId: "", marketId: "" }
    : undefined;

  const handleComplete = async (finalAnswers) => {
    try {
      await axios.post(`${API_URL}/influencer/rate-cards`, finalAnswers, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (err) {
      console.error("Couldn't save rate card:", err);
    }
  };

  return <ReceiptPrinter initialAnswers={initialAnswers} onComplete={handleComplete} />;
}