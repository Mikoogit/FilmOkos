import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- SUPABASE CLIENT ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,   
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

console.log("SERVICE ROLE KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "OK" : "MISSING");


// ---------------------------------------------------------
//  REGISTER
// ---------------------------------------------------------
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email és jelszó kötelező" });

  try {
    // 1) USER LÉTREHOZÁSA
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: null,
        data: { role: "user" }
      }
    });

    if (error) {
      console.error("REGISTER ERROR:", error);
      return res.status(400).json({ error: error.message });
    }

    const user = data.user;

    // 2) EMAIL AUTOMATIKUS MEGERŐSÍTÉSE
    await supabase.auth.admin.updateUserById(user.id, {
      email_confirm: true
    });

    // 3) VÁLASZ A FRONTENDNEK
    return res.json({
      token: data.session?.access_token ?? null,
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role ?? "user"
      }
    });

  } catch (err) {
    console.error("REGISTER CATCH ERROR:", err);
    return res.status(500).json({ error: "Szerver hiba" });
  }
});


// ---------------------------------------------------------
//  LOGIN
// ---------------------------------------------------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email és jelszó kötelező" });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("LOGIN ERROR:", error);
      return res.status(400).json({ error: error.message });
    }

    const user = data.user;

    return res.json({
      token: data.session.access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role ?? "user"
      }
    });

  } catch (err) {
    console.error("LOGIN CATCH ERROR:", err);
    return res.status(500).json({ error: "Szerver hiba" });
  }
});


// ---------------------------------------------------------
//  SERVER START
// ---------------------------------------------------------
app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
