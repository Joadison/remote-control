import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  House,
  LoaderPinwheel,
  Tv,
  Undo2,
} from "lucide-react";
import { useEffect, useState } from "react";

function RemoteControlAmazon() {
  const [status, setStatus] = useState("");
  const [ip, setIp] = useState("");
  const [textInput, setTextInput] = useState("");
  const [fireTvApps, setFireTvApps] = useState([]);

  useEffect(() => {
    const savedIp = localStorage.getItem("amazon_ip");
    if (savedIp) setIp(savedIp);
  }, []);

  useEffect(() => {
    if (ip) {
      localStorage.setItem("amazon_ip", ip);
    }
  }, [ip]);

  async function connect() {
    if (!ip) {
      setStatus("Erro: IP da TV Amazon não definido");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_PROD}/firetv/${ip}/connect`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error(`Erro de conexão com a TV`);
      const resapps = await fetch(
        `${process.env.REACT_APP_BACKEND_PROD}/firetv/${ip}/apps`
      );
      const data = await resapps.json();
      setFireTvApps(data);
      setStatus("Conectado à LG");
    } catch (error) {
      setStatus(`Erro: ${error.message}`);
    }
  }

  async function send(command) {
    if (!ip) {
      setStatus("Erro: IP da TV não definido");
      return;
    }
    try {
      const res = await fetch(
        `${
          process.env.REACT_APP_BACKEND_PROD
        }/firetv/${ip}/keypress/${command.toLowerCase()}`,
        {
          method: "POST",
        }
      );
      setStatus(`${command}: ${res.status}`);
    } catch (error) {
      setStatus(`Erro em ${command}: ${error.message}`);
    }
  }

  async function sendText() {
    if (!ip || !textInput) {
      setStatus("Erro: IP ou texto não definido");
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_PROD}/lg/toast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textInput }),
      });

      setStatus(`Texto enviado: "${textInput}" (Status: ${res.status})`);
    } catch (error) {
      setStatus(`Erro ao enviar texto: ${error.message}`);
    }
  }

  async function launchFireTvApp(packageName) {
    if (!ip) {
      setStatus("Erro: IP da TV Amazon não definido");
      return;
    }
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_PROD}/firetv/${ip}/launch/${packageName}`,
        {
          method: "POST",
        }
      );
      setStatus(`App ${packageName} iniciado na Fire TV`);
    } catch (err) {
      setStatus(`Erro ao iniciar app: ${err.message}`);
    }
  }

  return (
    <div className="container">
      <h1>Controle Amazon</h1>
      <label style={{ marginTop: 10, marginBottom: 10 }}>
        IP da Amazon:{" "}
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="192.168.0.xxx"
        />
      </label>

      <div className="remote">
        <button
          className="Conecnt"
          onClick={() => connect()}
          style={{ margin: 10, padding: 15 }}
        >
          <Tv />
        </button>
        <div className="remote-grid">
          <button className="home" onClick={() => send("home")}>
            <House />
          </button>
          <button className="up" onClick={() => send("up")}>
            <ChevronUp />
          </button>
          <button className="left" onClick={() => send("left")}>
            <ChevronLeft />
          </button>
          <button className="select" onClick={() => send("select")}>
            <LoaderPinwheel />
          </button>
          <button className="right" onClick={() => send("right")}>
            <ChevronRight />
          </button>
          <button className="down" onClick={() => send("down")}>
            <ChevronDown />
          </button>
          <button className="back" onClick={() => send("back")}>
            <Undo2 />
          </button>
        </div>
      </div>

      {Array.isArray(fireTvApps) && fireTvApps.length > 0 ? (
        <ul style={{ marginTop: 10 }}>
          {fireTvApps.map((app) => (
            <li
              key={app.package}
              style={{
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {app.icon ? (
                <img
                  src={app.icon}
                  alt={app.package}
                  width={32}
                  height={32}
                  style={{ borderRadius: 4 }}
                />
              ) : (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#ccc",
                    borderRadius: 4,
                  }}
                />
              )}
              {/* <span style={{ flex: 1 }}>{app.package}</span> */}
              <button onClick={() => launchFireTvApp(app.package)}>
                ▶️ Abrir
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum app encontrado ou ainda carregando...</p>
      )}

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

export default RemoteControlAmazon;
