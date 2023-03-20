import { useEffect, useMemo, useRef, useState } from "react";
import { BackConfig } from "../../../config.js";
import { io } from "socket.io-client";

//
export function Demo() {
  //
  let roomID = "";

  let socket = useMemo(() => {
    return io(`${BackConfig.ws[process.env.NODE_ENV]}`, {
      //
      extraHeaders: {
        // "my-custom-header": "abcd",
      },
    });
  });

  useEffect(() => {
    socket.emit("enter", roomID);

    // socket.on("connect", (con) => {
    //   //

    //   console.log();
    // });
    return () => {
      socket.disconnect();
    };
  }, [roomID, socket]);

  let inputRef = useRef();

  //
  return (
    <div className="">
      <input ref={inputRef} type="text"></input>
      <button
        onClick={() => {
          let input = inputRef.current;
          socket.emit("walk", {
            data: input,
          });
        }}
      >
        Send
      </button>

      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
}
