import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BackConfig } from "../../../../config.js";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import slugify from "slugify";

export function ChatRoom({ roomID = "general" }) {
  let rand = useRef(Math.round(10000 * Math.random()));

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
        localStorage.setItem("storedNameLocally", randomName);

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
      name: myName + "-" + rand.current,
      roomID: roomID,
      id: "_" + Math.random() * 100000000,
      message: rInput.current.value,
    });

    rInput.current.value = "";
    rInput.current.focus();
  };

  let [show, setShow] = useState(false);

  useEffect(() => {
    let hh = () => {
      //
      if (window.innerWidth <= 500) {
        setShow(false);
      } else {
        setShow(true);
      }
    };

    window.addEventListener("resize", hh);
    window.dispatchEvent(new Event("resize"));

    return () => {
      window.removeEventListener("resize", hh);
    };
  }, []);

  return (
    <>
      <div
        className="p-2 bg-white z-30  rounded-t-xl border-gray-300 shadow shadow-slate-500"
        style={{ display: show ? "block" : "none" }}
      >
        {/*  */}
        <div className="text-xs mb-2 flex justify-between">
          <div>Chat Room</div>
          <div className="">
            <NickName
              rand={rand.current}
              onUpdateName={(name) => {
                //
                setName(name);
              }}
            ></NickName>
          </div>
        </div>

        <ul
          className=" h-72 overflow-scroll bg-slate-100 py-1 p-2 shadow-inner shadow-slate-400 rounded-xl mx-1 mb-2 "
          ref={rMessages}
        >
          {messages.map((m) => {
            return (
              <li className="text-xs" key={m.id}>
                {m.name}: {m.message}
              </li>
            );
          })}
        </ul>

        <div className="sender mx-1 ">
          <input
            type="text"
            onFocus={() => {
              window.dispatchEvent(
                new CustomEvent("cancel-move", { detail: 123 })
              );
            }}
            className="p-3 py-2 rounded-l-xl text-sm bg-gray-200 shadow-slate-400 shadow-inner "
            ref={rInput}
            onKeyDown={(ev) => {
              ev.stopPropagation();
              if (ev.key.toLowerCase() === "enter") {
                onSend();
              }
            }}
          ></input>
          <button
            className="px-3 py-2 bg-green-300 text-green-800 rounded-r-xl text-sm  "
            type="button"
            onClick={onSend}
          >
            Send
          </button>
        </div>

        {/*  */}
      </div>
      <div className="block lg:hidden fixed bottom-0 left-0 m-5 z-40">
        <button
          onClick={() => {
            setShow((s) => !s);
          }}
          className=" p-3 bg-white rounded-full"
        >
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
          >
            <path d="M20 15c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1m-3 0c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1m-3 0c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1m5.415 4.946c-1 .256-1.989.482-3.324.482-3.465 0-7.091-2.065-7.091-5.423 0-3.128 3.14-5.672 7-5.672 3.844 0 7 2.542 7 5.672 0 1.591-.646 2.527-1.481 3.527l.839 2.686-2.943-1.272zm-13.373-3.375l-4.389 1.896 1.256-4.012c-1.121-1.341-1.909-2.665-1.909-4.699 0-4.277 4.262-7.756 9.5-7.756 5.018 0 9.128 3.194 9.467 7.222-1.19-.566-2.551-.889-3.967-.889-4.199 0-8 2.797-8 6.672 0 .712.147 1.4.411 2.049-.953-.126-1.546-.272-2.369-.483m17.958-1.566c0-2.172-1.199-4.015-3.002-5.21l.002-.039c0-5.086-4.988-8.756-10.5-8.756-5.546 0-10.5 3.698-10.5 8.756 0 1.794.646 3.556 1.791 4.922l-1.744 5.572 6.078-2.625c.982.253 1.932.407 2.85.489 1.317 1.953 3.876 3.314 7.116 3.314 1.019 0 2.105-.135 3.242-.428l4.631 2-1.328-4.245c.871-1.042 1.364-2.384 1.364-3.75" />
          </svg>
        </button>
      </div>
    </>
  );
}

function NickName({
  rand = Math.round(Math.random() * 10000),
  onUpdateName = () => {},
}) {
  let ref = useRef();
  useEffect(() => {
    setTimeout(() => {
      let name = localStorage.getItem("storedNameLocally");
      if (name) {
        ref.current.value = `${name}`;
      }

      let storedName = localStorage.getItem("storedNameLocally");
      if (!storedName) {
        //
        const randomName = uniqueNamesGenerator({
          dictionaries: [colors, animals],
          separator: "-",
        }); // big_red_donkey
        localStorage.setItem("storedNameLocally", randomName);

        onUpdateName(localStorage.getItem("storedNameLocally"));
      }
    }, 100);
  }, []);
  return (
    <>
      <input
        ref={ref}
        className=" text-right inline-block underline focus:outline-none"
        onFocus={() => {
          window.dispatchEvent(new CustomEvent("cancel-move", { detail: 123 }));
        }}
        onKeyUp={(ev) => {
          ev.stopPropagation();
          let slug = slugify(ev.target.value);
          localStorage.setItem("storedNameLocally", slug);
          onUpdateName(slug);
        }}
      ></input>
      <div className="text-right inline-block">-{rand}</div>
    </>
  );
}
