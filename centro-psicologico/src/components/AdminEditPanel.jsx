import { useState, useEffect } from "react";

export default function AdminEditPanel({ token, onLogout }) {
  const [profiles, setProfiles] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Carga todos los perfiles al montar
  useEffect(() => {
    if (!token) return;
    Promise.all([1, 2, 3].map(id =>
      fetch(
        `https://shiny-engine-pjvvrg5xqjx3xvr-4000.app.github.dev/api/profesionales/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
        .then(res => res.json())
        .then(data => ({ ...data, id }))
    )).then(setProfiles);
  }, [token]);

  const handleSelect = id => {
    setSelectedId(id);
    const pf = profiles.find(p => p.id === Number(id));
    if (pf) setProfile({ ...pf });
    setSuccess("");
    setError("");
  };

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = e => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");
    fetch(
      `https://shiny-engine-pjvvrg5xqjx3xvr-4000.app.github.dev/api/profesionales/${selectedId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      }
    )
      .then(res => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then(data => {
        setSuccess("¡Guardado con éxito!");
        setProfile(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setSaving(false));
  };

  return (
    <div className="admin-edit-panel">
      <button onClick={onLogout} style={{ float: "right" }}>Cerrar sesión</button>
      <h2>Edita un perfil</h2>
      <select value={selectedId} onChange={e => handleSelect(e.target.value)}>
        <option value="">Selecciona un perfil...</option>
        {profiles.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {profile && (
        <form className="edit-form" onSubmit={handleSave}>
          <label>Nombre completo</label>
          <input name="name" value={profile.name || ""} onChange={handleChange} />

          <label>Bio</label>
          <textarea name="bio" value={profile.bio || ""} onChange={handleChange} />

          <label>Horarios</label>
          <input name="scheduleLabel" value={profile.scheduleLabel || ""} onChange={handleChange} />

          <label>Especialidades</label>
          <input
            name="specialties"
            value={Array.isArray(profile.specialties) ? profile.specialties.join(", ") : ""}
            onChange={e =>
              setProfile({
                ...profile,
                specialties: e.target.value.split(",").map(s => s.trim()),
              })
            }
          />

          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          {success && <p style={{ color: "green" }}>{success}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}

      <style>{`
        .admin-edit-panel {
          max-width: 420px;
          margin: 60px auto;
          background: #fff;
          padding: 26px 32px 32px 32px;
          border-radius: 14px;
          box-shadow: 0 4px 24px 0 #ccc4, 0 1.5px 14px #d9ccb366;
          font-family: 'Inter', Arial, sans-serif;
        }
        h2 {
          margin-top: 0;
          text-align: center;
          color: #286672;
          letter-spacing: 1.5px;
        }
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 24px;
        }
        .edit-form input, .edit-form textarea, select {
          font-size: 1rem;
          padding: 8px 10px;
          border: 1px solid #c5e3dc;
          border-radius: 8px;
          background: #f8fdfa;
          outline: none;
          margin-top: 2px;
          transition: border .2s;
        }
        .edit-form input:focus, .edit-form textarea:focus, select:focus {
          border: 1.5px solid #82bfa4;
        }
        button[type=submit] {
          margin-top: 12px;
          background: #82bfa4;
          border: none;
          color: #fff;
          padding: 10px 0;
          border-radius: 7px;
          font-size: 1.1rem;
          letter-spacing: .7px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px #c5e3dc55;
        }
        button[type=submit]:hover {
          background: #6ea08a;
        }
      `}</style>
    </div>
  );
}
