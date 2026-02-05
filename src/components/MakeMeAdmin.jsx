import { supabase } from "../db/supaBaseClient";

export default function MakeAdmin() {
  const makeAdmin = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { role: "admin" }
    });

    if (error) {
      console.error(error);
      alert("Hiba történt");
    } else {
      alert("Admin szerepkör beállítva!");
    }
  };

  return <button className="admin-gomb" onClick={makeAdmin}>Admin felvétele</button>;
}
