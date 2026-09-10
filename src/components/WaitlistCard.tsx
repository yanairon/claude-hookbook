"use client";

import { useState } from "react";

// The endpoint is intentionally env-driven: v1 ships without a backend.
// Set NEXT_PUBLIC_WAITLIST_ENDPOINT to any form endpoint (Buttondown,
// Formspree, your own API) and the form posts there; otherwise the card
// stays in its dormant state.
const ENDPOINT = process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT;

export default function WaitlistCard() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sent">("idle");

  if (state === "sent") {
    return <div className="card"><p>You are on the list. No newsletter - one email when the Pro Pack exists.</p></div>;
  }

  return (
    <div className="card" style={{ marginTop: 34 }}>
      <h3>Pro Pack (later)</h3>
      <p>
        Framework bundles, cross-platform scripts, tested blocking policies,
        and a test harness. Free recipes and the generator stay free.
      </p>
      {ENDPOINT ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await fetch(ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            setState("sent");
          }}
          style={{ display: "flex", gap: 8 }}
        >
          <input
            type="email" required value={email} placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn small" type="submit">Join the Pro Pack waitlist</button>
        </form>
      ) : (
        <p style={{ fontSize: 13 }}>Waitlist opens soon.</p>
      )}
    </div>
  );
}
