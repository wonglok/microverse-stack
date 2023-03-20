import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { BackConfig } from "../config.js";
import { io } from "socket.io-client";
function App() {
  var socket = useMemo(() => {
    return io(`${BackConfig.ws[process.env.NODE_ENV]}`, {
      //
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });
  });

  let inputRef = useRef();
  return (
    <div className="App">
      <input ref={inputRef} type="text"></input>
      <button
        onClick={() => {
          let input = inputRef.current;
          socket.emit("chat message", input.value);
        }}
      >
        Send
      </button>
    </div>
  );
}

export default App;
