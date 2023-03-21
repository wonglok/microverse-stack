import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BackConfig } from "../../../../config.js";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

export function ChatRoom({ roomID = "general" }) {
  let socket = useMemo(() => {
    return io(`${BackConfig.ws[process.env.NODE_ENV]}`, {
      //
      extraHeaders: {
        // "my-custom-header": "abcd",
      },
    });
  }, []);
  let [messages, setMsg] = useState([]);
  let [myName, setName] = useState("");

  useEffect(() => {
    if (!myName) {
      //

      let storedName = localStorage.getItem("storedNameLocally");
      if (!storedName) {
        //
        const randomName = uniqueNamesGenerator({
          dictionaries: [colors, animals],
          separator: "-",
        }); // big_red_donkey
        localStorage.setItem(
          "storedNameLocally",
          randomName + "-" + Math.round(10000 * Math.random())
        );

        setName(localStorage.getItem("storedNameLocally"));
      } else {
        setName(localStorage.getItem("storedNameLocally"));
      }
      // localStorage.setItem('myName', )
    }
  }, []);
  useEffect(() => {
    socket.emit("enter-room", { roomID });

    socket.on("chat-message", (ev) => {
      // console.log(ev);
      setMsg((r) => {
        if (r.find((v) => v.id === ev.id)) {
          return r;
        }
        return [...r, ev];
      });

      setTimeout(() => {
        rMessages.current.scrollTop = 100000000000000000;
      });
    });

    //
    window.addEventListener("focus", () => {
      if (!socket.connected) {
        socket.connect();
      }
    });
    return () => {
      socket.emit("leave-room", { roomID });
    };
  }, [roomID, socket]);

  let rInput = useRef();
  let rMessages = useRef();
  let onSend = () => {
    //
    if (!rInput.current.value) {
      return;
    }
    if (!myName) {
      return;
    }

    socket.emit("chat-message", {
      name: myName,
      roomID: roomID,
      id: "_" + Math.random() * 100000000,
      message: rInput.current.value,
    });

    rInput.current.value = "";
    rInput.current.focus();
  };

  return (
    <div className=" p-2 bg-white">
      {/*  */}
      <div className="text-xs mb-1">Chat Room</div>

      <ul className=" h-72 overflow-scroll bg-slate-100" ref={rMessages}>
        {messages.map((m) => {
          return (
            <li className="text-xs" key={m.id}>
              {m.name}: {m.message}
            </li>
          );
        })}
      </ul>

      <div className="sender bg-gray-200">
        <input
          type="text"
          className="p-3 py-2 bg-gray-300"
          ref={rInput}
          onKeyDown={(ev) => {
            if (ev.key.toLowerCase() === "enter") {
              onSend();
            }
          }}
        ></input>
        <button className="px-3 py-2" type="button" onClick={onSend}>
          Send
        </button>
      </div>
      {/*  */}
    </div>
  );
}
