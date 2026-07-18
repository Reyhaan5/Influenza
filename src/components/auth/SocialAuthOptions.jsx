import React from "react";
import { Box, Divider, Typography, Stack } from "@mui/material";
import SocialButton from "./SocialButton";

// Inline brand SVGs preserved
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4c-7.4 0-13.7 4.2-17.7 10.7z" />
    <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.3 26.9 36 24 36c-5.2 0-9.7-3.4-11.3-8l-6.6 5.1C9.9 39.6 16.4 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.6 5.4C41.5 35.9 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z" />
  </svg>
);

export default function SocialAuthOptions({ themeTokens }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Divider sx={{ flex: 1, borderColor: "#EDEDED" }} />
        <Typography sx={{ fontSize: "0.75rem", color: themeTokens.muted, fontWeight: 500 }}>
          or
        </Typography>
        <Divider sx={{ flex: 1, borderColor: "#EDEDED" }} />
      </Box>

      <Stack direction="row" spacing={1.5}>
        <SocialButton themeTokens={themeTokens} icon={<GoogleIcon />}>Google</SocialButton>
        <SocialButton themeTokens={themeTokens} icon={<FacebookIcon />}>Facebook</SocialButton>
      </Stack>
    </Box>
  );
}