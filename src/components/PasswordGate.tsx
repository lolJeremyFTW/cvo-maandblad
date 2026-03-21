"use client";
import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const AUTH_KEY = "cvo_auth_v1";
const CORRECT_PASSWORD = "jaapproject";

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = loading
  const [attempt, setAttempt] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      setAuthed(stored === "ok");
    } catch {
      setAuthed(false);
    }
  }, []);

  function submit() {
    if (attempt === CORRECT_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "ok");
      setAuthed(true);
    } else {
      setError(true);
      setShake(true);
      setAttempt("");
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
    }
  }

  // Still loading auth state — render nothing to avoid flash
  if (authed === null) return null;

  // Authenticated — show the app
  if (authed) return <>{children}</>;

  // Password gate screen
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#1A1A1A",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "sans-serif",
      zIndex: 99999,
    }}>
      <div style={{
        width: 360,
        transform: shake ? "translateX(-8px)" : "none",
        transition: "transform 0.08s ease",
      }}>
        {/* Logo / brand */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-block",
            background: "#F15B2B",
            color: "white",
            fontWeight: 900,
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "6px 16px",
            marginBottom: 12,
          }}>
            CLUBvanONS
          </div>
          <p style={{ color: "#71717a", fontSize: 12, margin: 0 }}>Magazine Editor</p>
        </div>

        {/* Card */}
        <div style={{
          background: "#27272a",
          border: `2px solid ${error ? "#ef4444" : "#3f3f46"}`,
          padding: "28px 28px 24px",
          transition: "border-color 0.2s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Lock size={16} color="#F15B2B" />
            <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>Toegangsbeveiliging</span>
          </div>

          <p style={{ color: "#a1a1aa", fontSize: 12, marginBottom: 16, lineHeight: 1.5 }}>
            Voer het wachtwoord in om de editor te openen.
          </p>

          <div style={{ position: "relative", marginBottom: 16 }}>
            <input
              autoFocus
              type={showPw ? "text" : "password"}
              value={attempt}
              onChange={(e) => { setAttempt(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Wachtwoord"
              style={{
                width: "100%",
                background: "#18181b",
                border: `1px solid ${error ? "#ef4444" : "#3f3f46"}`,
                borderRadius: 6,
                padding: "10px 40px 10px 12px",
                color: "white",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
            />
            <button
              onClick={() => setShowPw(p => !p)}
              style={{
                position: "absolute", right: 10, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "#71717a", padding: 0,
              }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p style={{ color: "#ef4444", fontSize: 11, marginBottom: 12, marginTop: -8 }}>
              Onjuist wachtwoord. Probeer opnieuw.
            </p>
          )}

          <button
            onClick={submit}
            style={{
              width: "100%",
              background: "#F15B2B",
              border: "none",
              borderRadius: 6,
              padding: "11px",
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Inloggen
          </button>
        </div>

        <p style={{ color: "#52525b", fontSize: 10, textAlign: "center", marginTop: 16 }}>
          CLUBvanONS Magazine Editor — Breda
        </p>
      </div>
    </div>
  );
}
