// src/pages/MagicLink.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";
import { persistAuth } from "../apis/auth";

type Mode = "login" | "signup" | "notification-email";

export default function MagicLink() {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();

  const parseTokenFromHash = (h: string): string => {
    if (!h) return "";
    const raw = h.startsWith("#") ? h.slice(1) : h;
    const params = new URLSearchParams(raw);
    return params.get("token") || raw.replace(/^token=/, "").split("&")[0] || "";
  };

  // 1) 해시에서 시도 → 2) 없으면 쿼리에서 시도
  const token =
    parseTokenFromHash(hash) ||
    new URLSearchParams(search).get("token") ||
    "";

  const mode: Mode | null =
    pathname.startsWith("/login/magic") ? "login" :
    pathname.startsWith("/signup/magic") ? "signup" :
    pathname.startsWith("/settings/notification-email/magic") ? "notification-email" :
    null;

  // 이하 기존 로직 동일 (mode/token 검사, persistAuth, navigate 등)
}
