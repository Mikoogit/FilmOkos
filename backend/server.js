import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";


dotenv.config();



const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

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
// UPDATE PROFILE LISTS (planned / favorites / seen)
// body: { list: 'planned'|'favorites'|'seen', movieId: <number|string>, action: 'add'|'remove' }
// ---------------------------------------------------------
app.post("/api/profile/:userId/list", async (req, res) => {
  const { userId } = req.params;
  const { list, movieId, action } = req.body;

  const validLists = ["planned", "favorites", "seen"];
  if (!validLists.includes(list)) return res.status(400).json({ error: "Érvénytelen lista" });
  if (!movieId) return res.status(400).json({ error: "movieId szükséges" });
  if (!["add", "remove"].includes(action)) return res.status(400).json({ error: "Érvénytelen action" });

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

    // Lekérjük a meglévő listát (service role bypass RLS)
    const { data: existing, error: fetchErr } = await supabase
      .from("profiles")
      .select(list)
      .eq("id", userId)
      .maybeSingle();

    if (fetchErr) {
      console.error("FETCH PROFILE LIST ERROR:", fetchErr);
      return res.status(400).json({ error: fetchErr.message || "Profil lekérés hiba" });
    }

    console.log('Existing profile row:', existing);

    const current = (existing && existing[list]) || [];
    const movieIdStr = String(movieId);

    let newArr;
    if (action === "add") {
      newArr = Array.from(new Set([...current.map(String), movieIdStr]));
    } else {
      newArr = current.map(String).filter((m) => m !== movieIdStr);
    }

    // The column is array type (int[] or text[]), send as-is (not JSON string)
    console.log('Updating list:', list);
    console.log('Current array:', current);
    console.log('New array:', newArr);
    console.log('Update payload:', { [list]: newArr });

    // If no profile exists, create one with UPSERT and default username
    if (!existing) {
      console.log('No profile found, creating with UPSERT...');
      const { data: upsertData, error: upsertError } = await supabase
        .from("profiles")
        .upsert({ 
          id: userId, 
          username: `User_${userId.slice(0, 8)}`,
          [list]: newArr 
        }, { onConflict: "id" })
        .select()
        .maybeSingle();

      if (upsertError) {
        console.error("PROFILE UPSERT ERROR:", upsertError);
        return res.status(400).json({ error: upsertError.message || "Profil lista mentési hiba" });
      }
      console.log('Upsert result data:', upsertData);
      return res.json({ message: "Profil lista frissítve", data: upsertData });
    }

    // If profile exists, just update the list
    const { data, error } = await supabase
      .from("profiles")
      .update({ [list]: newArr })
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("PROFILE LIST UPDATE ERROR:", error);
      return res.status(400).json({ error: error.message || "Profil lista mentési hiba" });
    }

    console.log('Update result data:', data);
    
    // If select returned null, fetch the updated profile separately
    let finalData = data;
    if (!finalData) {
      console.log('Select returned null, fetching profile separately...');
      const { data: freshData, error: freshError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      
      if (freshError) {
        console.error("FETCH FRESH PROFILE ERROR:", freshError);
      } else {
        console.log('Fresh profile data:', freshData);
        finalData = freshData;
      }
    }

    return res.json({ message: "Profil lista frissítve", data: finalData });
  } catch (err) {
    console.error("PROFILE LIST CATCH:", err);
    return res.status(500).json({ error: "Szerver hiba" });
  }
});

// ---------------------------------------------------------
// SERVER START
// ---------------------------------------------------------
app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
