import React, { useState } from "react";

function RemoteControlRoku() {
  const [status, setStatus] = useState("");
  const [rokuIp, setRokuIp] = useState("");
  const [textInput, setTextInput] = useState("");
  const [apps, setApps] = useState([]);

  async function send(command) {
    if (!rokuIp) {
      setStatus("Erro: IP da Roku não definido");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_PROD}/roku/${rokuIp}/keypress/${command}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setStatus(`${command}: ${res.status}`);
    } catch (error) {
      setStatus(`Erro em ${command}: ${error.message}`);
      console.error("Detalhes do erro:", error);
    }
  }

  async function launch(appId) {
    if (!rokuIp) {
      setStatus("Erro: IP da Roku não definido");
      return;
    }
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_PROD}/roku/launch/${appId}`);
      setStatus(`App ${appId} iniciado!`);
    } catch (error) {
      setStatus(`Erro na rede: ${error.message}`);
    }
  }

  async function sendText() {
    if (!rokuIp || !textInput) {
      setStatus("Erro: IP ou texto não definido");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_PROD}/roku/input?text=${encodeURIComponent(
          textInput
        )}`
      );

      setStatus(`Texto enviado: "${textInput}" (Status: ${res.status})`);
    } catch (error) {
      setStatus(`Erro ao enviar texto: ${error.message}`);
    }
  }

  async function fetchApps() {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_PROD}/roku/query/apps`);
      console.log(res);
      const xml = await res.text();
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      const appElems = Array.from(doc.querySelectorAll("app"));
      const parsedApps = appElems.map((el) => ({
        id: el.getAttribute("id"),
        name: el.textContent,
        type: el.getAttribute("type"),
      }));
      setApps(parsedApps);
      setStatus(`Apps encontrados: ${parsedApps.length}`);
    } catch (err) {
      setStatus(`Erro ao buscar apps: ${err.message}`);
    }
  }

  async function scanRoku() {
    const baseIp = "192.168.40.";
    const promises = [];

    for (let i = 1; i <= 254; i++) {
      const ip = baseIp + i;
      const url = `http://${ip}:8060/query/device-info`;

      const p = fetch(url, { method: "GET" })
        .then((res) => {
          if (res.ok) {
            console.log(`✅ Encontrado: ${ip}`);
            setRokuIp(ip);
            setStatus(`Roku encontrada no IP: ${ip}`);
          }
        })
        .catch(() => {});

      promises.push(p);
    }

    await Promise.all(promises);
    setStatus("Busca concluída");
  }

  return (
    <div className="container">
      <h1>Controle Roku</h1>
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <button className="down" onClick={() => scanRoku()}>
          Procurar IP ROKU
        </button>
      </div>

      <label style={{ marginTop: 10, marginBottom: 10 }}>
        IP da Roku:{" "}
        <input
          type="text"
          value={rokuIp}
          onChange={(e) => setRokuIp(e.target.value)}
          placeholder="192.168.0.xxx"
        />
      </label>

      <div className="remote">
        <button className="poweroff" onClick={() => send("poweroff")}>
          💔
        </button>
        <div className="remote-grid">
          <button className="home" onClick={() => send("Home")}>
            🏠
          </button>
          <button className="up" onClick={() => send("Up")}>
            🔼
          </button>
          <button className="left" onClick={() => send("Left")}>
            ◀️
          </button>
          <button className="select" onClick={() => send("Select")}>
            ✅
          </button>
          <button className="right" onClick={() => send("Right")}>
            ▶️
          </button>
          <button className="down" onClick={() => send("Down")}>
            🔽
          </button>
          <button className="back" onClick={() => send("Back")}>
            ↩️
          </button>
        </div>
      </div>

      <button style={{ marginTop: 20 }} onClick={fetchApps}>
        🔍 Listar Apps
      </button>

      <ul style={{ marginTop: 20 }}>
        {apps.map((app) => (
          <li key={app.id} style={{ marginBottom: 8 }}>
            {app.name} <button onClick={() => launch(app.id)}>▶️ Abrir</button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "20px" }}>
        <label>
          Digite um texto:{" "}
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Ex: Hello World"
          />
        </label>
        <button onClick={sendText}>Enviar Texto</button>
      </div>

      <p>Status: {status}</p>
    </div>
  );
}

export default RemoteControlRoku;
