import "./App.css";
import RemoteControlAmazon from "./RemoteAmazon";
import RemoteControlLG from "./RemoteLG";
import RemoteControlRoku from "./RemoteRoku";
import { useState } from "react";

function App() {
  const [selectedControl, setSelectedControl] = useState("");

  const handleSelection = (option) => {
    setSelectedControl(option);
  };

  const handleBack = () => {
    setSelectedControl("");
  };

  return (
    <div className="App">
      <header style={{ padding: 20, backgroundColor: "#222", color: "#fff" }}>
        <h1>🎮 Painel de Controle de TVs</h1>
      </header>

      {selectedControl === "" && (
        <main style={{ padding: 40 }}>
          <h2>Selecione o dispositivo:</h2>
          <div
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <button
              style={{
                backgroundColor: "#000",
              }}
              onClick={() => handleSelection("roku")}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Roku_logo.svg/960px-Roku_logo.svg.png"
                alt="Roku"
                width={70}
                height={20}
              />
            </button>
            <button onClick={() => handleSelection("lg")}>
              <img
                src="https://images.icon-icons.com/2699/PNG/512/lg_logo_icon_170264.png"
                alt="LG"
                width={35}
                height={30}
              />
            </button>
            <button onClick={() => handleSelection("amazon")}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                alt="Amazon"
                width={65}
                height={30}
              />
            </button>
          </div>
        </main>
      )}

      {selectedControl === "roku" && (
        <div style={{ padding: 20 }}>
          <button onClick={handleBack} style={{margin:10, padding:10}}>Voltar</button>
          <RemoteControlRoku />
        </div>
      )}

      {selectedControl === "lg" && (
        <div style={{ padding: 20 }}>
          <button onClick={handleBack} style={{margin:10, padding:10}}>Voltar</button>
          <RemoteControlLG />
        </div>
      )}

      {selectedControl === "amazon" && (
        <div style={{ padding: 20 }}>
          <button onClick={handleBack} style={{margin:10, padding:10}}>Voltar</button>
          <RemoteControlAmazon />
        </div>
      )}

      <footer style={{ padding: 10, backgroundColor: "#eee", marginTop: 20 }}>
        <small>Desenvolvido por Joadison • {new Date().getFullYear()}</small>
      </footer>
    </div>
  );
}

export default App;
