import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  House,
  LoaderPinwheel,
  Tv,
  Undo2,
  Volume1,
  Volume2,
  VolumeOff,
} from "lucide-react";
import React, { useEffect, useState } from "react";

function RemoteControlLG() {
  const [status, setStatus] = useState("");
  const [ip, setIp] = useState("");
  const [textInput, setTextInput] = useState("");
  //const [appId, setAppId] = useState("");
  //const [appsList, setAppsList] = useState([]);
  //const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const savedIp = localStorage.getItem("lg_ip");
    if (savedIp) setIp(savedIp);
  }, []);

  useEffect(() => {
    if (ip) {
      localStorage.setItem("lg_ip", ip);
    }
  }, [ip]);

  async function connect() {
    if (!ip) {
      setStatus("Erro: IP da TV LG não definido");
      return;
    }
    try {
      const res = await fetch(`https://back-rcontrol.vercel.app/lg/connect`, {
        method: "POST",
        body: JSON.stringify({
          ip,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Erro de conexão com a TV`);
      setStatus("Conectado à LG");
    } catch (error) {
      setStatus(`Erro: ${error.message}`);
    }
  }

  async function send(command) {
    if (!ip) {
      setStatus("Erro: Não conectado à TV");
      return;
    }
    try {
      const endpoint =
        command === "power"
          ? "/lg/command/power"
          : `/lg/command/${command.toLowerCase()}`;

      const res = await fetch(`https://back-rcontrol.vercel.app${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Erro de conexão com a TV`);
      setStatus(`${command} enviado`);
    } catch (error) {
      setStatus(`Erro em ${command}: ${error.message}`);
    }
  }

  async function sendText() {
    if (!ip || !textInput) {
      setStatus("Erro: Não conectado ou texto vazio");
      return;
    }
    try {
      const res = await fetch(`https://back-rcontrol.vercel.app/lg/toast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textInput }),
      });
      if (!res.ok) throw new Error(`Erro de conexão com a TV`);
      setStatus(`Notificação enviada: "${textInput}"`);
      setTextInput("");
    } catch (error) {
      setStatus(`Erro ao enviar texto: ${error.message}`);
    }
  }

  /* async function launchApp() {
    if (!ip || !appId) {
      setStatus("Erro: Não conectado ou app não selecionado");
      return;
    }
    try {
      const res = await fetch(
        `https://back-rcontrol.vercel.app/lg/launch/${appId}`,
        {
          method: "POST",
        }
      );
      setStatus(`App ${appId} iniciado`);
    } catch (error) {
      setStatus(`Erro ao iniciar app: ${error.message}`);
    }
  } */

  /* async function handlePointerMove(direction) {
    if (!ip) return;

    // Calcula nova posição baseada na direção
    let newX = pointerPosition.x;
    let newY = pointerPosition.y;
    const step = 50;

    switch (direction) {
      case "up":
        newY -= step;
        break;
      case "down":
        newY += step;
        break;
      case "left":
        newX -= step;
        break;
      case "right":
        newX += step;
        break;
      default:
        break;
    }

    // Limita aos limites da tela (ajuste conforme necessário)
    newX = Math.max(0, Math.min(newX, 1920));
    newY = Math.max(0, Math.min(newY, 1080));

    setPointerPosition({ x: newX, y: newY });

    try {
      await fetch(`https://back-rcontrol.vercel.app/lg/pointer/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x: newX, y: newY }),
      });
    } catch (error) {
      console.error("Erro ao mover ponteiro:", error);
    }
  }

  function handlePointerClick() {
    if (!ip) return;
    send("click");
  } */

  return (
    <div className="container">
      <h1>Controle LG</h1>
      <label style={{ marginTop: 10, marginBottom: 10 }}>
        IP da LG:{" "}
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
        {/* <button className="OFFON" onClick={() => send("power")}>
          🆗
        </button> */}
        <div className="remote-grid">
          <button onClick={() => send("volumedown")}>
            <Volume1 />
          </button>
          <button onClick={() => send("volumeup")}>
            <Volume2 />
          </button>
          <button onClick={() => send("mute")}>
            <VolumeOff />
          </button>
        </div>
        {/* <div className="remote-grid">
          <button onClick={() => send("play")}>
            <Play />
          </button>
          <button onClick={() => send("pause")}>
            <Pause />
          </button>
        </div> */}
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

      {/*  <div className="remote-control">
        <div className="pointer-control">
          <h3>Controle de Ponteiro</h3>
          <div className="pointer-grid">
            <button onClick={() => handlePointerMove("up")}>↑</button>
            <button onClick={() => handlePointerMove("left")}>←</button>
            <button onClick={handlePointerClick}>Click</button>
            <button onClick={() => handlePointerMove("right")}>→</button>
            <button onClick={() => handlePointerMove("down")}>↓</button>
          </div>
          <div>
            Posição: X: {pointerPosition.x}, Y: {pointerPosition.y}
          </div>
        </div>
      </div> */}

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Digite uma mensagem para a TV"
        />
        <button onClick={sendText}>Enviar Notificação</button>
      </div>

      {/* {appsList.length > 0 && (
        <div className="app-launcher">
          <h3>Lançar Aplicativo</h3>
          <select value={appId} onChange={(e) => setAppId(e.target.value)}>
            <option value="">Selecione um app</option>
            {appsList.map((app) => (
              <option key={app.id} value={app.id}>
                {app.title} ({app.id})
              </option>
            ))}
          </select>
          <button onClick={launchApp}>Abrir App</button>
        </div>
      )} */}

      <p>Status: {status}</p>
    </div>
  );
}

export default RemoteControlLG;
