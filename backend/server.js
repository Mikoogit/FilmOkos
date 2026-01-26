import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch"; // Node fetch kell a REST híváshoz

dotenv.config();

console.log("ENV CHECK ↓↓↓");
console.log("SUPABASE_URL =", process.env.SUPABASE_URL);
console.log(
  "SERVICE ROLE KEY PREFIX =",
  process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 30)
);

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

console.log("SERVICE ROLE KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "OK" : "MISSING");

// ---------------------------------------------------------
// REGISTER - REST ADMIN API használata
// ---------------------------------------------------------
// server.js
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email és jelszó kötelező" });

  try {
    // Sima felhasználó létrehozása (anon/public kulcs is működik)
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("SIGNUP ERROR:", error);
      return res.status(400).json({ error: error.message });
    }

    // Felhasználó létrehozva, most login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      console.error("LOGIN ERROR:", loginError);
      return res.status(400).json({ error: loginError.message });
    }

    const session = loginData.session ?? null;
    const user = loginData.user ?? null;

    return res.json({
      token: session?.access_token ?? null,
      user: user ? { id: user.id, email: user.email, role: user.user_metadata?.role ?? "user" } : null,
    });
  } catch (err) {
    console.error("REGISTER CATCH ERROR:", err);
    return res.status(500).json({ error: "Szerver hiba" });
  }
});


// ---------------------------------------------------------
// LOGIN
// ---------------------------------------------------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email és jelszó kötelező" });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("LOGIN ERROR:", error);
      return res.status(400).json({ error: error.message || "Bejelentkezés sikertelen" });
    }

    const session = data.session ?? null;
    const user = data.user ?? null;

    return res.json({
      token: session?.access_token ?? null,
      user: user ? { id: user.id, email: user.email, role: user.user_metadata?.role ?? "user" } : null,
    });
  } catch (err) {
    console.error("LOGIN CATCH ERROR:", err);
    return res.status(500).json({ error: "Szerver hiba" });
  }
});

// ---------------------------------------------------------
// PROFILE UPSERT
// ---------------------------------------------------------
app.put("/api/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  const { username, bio, avatar_url } = req.body;

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token hiányzik" });

  try {
    const { data: getUserData, error: getUserError } = await supabase.auth.getUser(token);
    if (getUserError) {
      console.error("AUTH CHECK ERROR:", getUserError);
      return res.status(401).json({ error: "Érvénytelen token" });
    }
    const authUser = getUserData.user;
    if (!authUser || authUser.id !== userId) {
      return res.status(403).json({ error: "Nincs jogosultságod módosítani ezt a profilt" });
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        { id: userId, username: username ?? null, bio: bio ?? null, avatar_url: avatar_url ?? null },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) {
      console.error("PROFILE UPSERT ERROR:", error);
      return res.status(400).json({ error: error.message || "Profil mentési hiba" });
    }

    return res.json({ message: "Profil sikeresen mentve", data });
  } catch (err) {
    console.error("PROFILE PUT CATCH:", err);
    return res.status(500).json({ error: "Szerver hiba" });
  }
});

// ---------------------------------------------------------
// GET PROFILE
// ---------------------------------------------------------
app.get("/api/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (error) {
      console.error("GET PROFILE ERROR:", error);
      return res.status(400).json({ error: error.message || "Profil lekérés hiba" });
    }
    return res.json({ data });
  } catch (err) {
    console.error("GET PROFILE CATCH:", err);
    return res.status(500).json({ error: "Szerver hiba" });
  }
});

// ---------------------------------------------------------
// SERVER START
// ---------------------------------------------------------
app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
