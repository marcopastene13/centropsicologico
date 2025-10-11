import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("https://shiny-engine-pjvvrg5xqjx3xvr-4000.app.github.dev/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Credenciales inválidas");
      const data = await res.json();
      onLogin(data.token);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        placeholder="Usuario" 
        value={username} 
        onChange={e => setUsername(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Contraseña" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        required 
      />
      <button type="submit">Ingresar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
