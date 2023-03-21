import { Environment } from "@react-three/drei";
import { JoyStick } from "../../../components/canvas/MetaOnline/Joystick";
import { LoaderGLB } from "../../../components/canvas/MetaOnline/LoaderGLB";
import { MetaverseGLB } from "../../../components/canvas/MetaOnline/MetaverseGLB";
import { EnvSSR } from "../../../components/canvas/RealismEffect/EnvSSR";
import { Canvas } from "@react-three/fiber";
import { sRGBEncoding } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { useMeta } from "../MetaOnline/useMeta";
import { ChatRoom } from "../../html/ChatRoom/ChatRoom";

function Content() {
  return (
    <>
      <LoaderGLB
        decorate={({ glb }) => {
          glb.scene = clone(glb.scene);
          return glb;
        }}
        url={`/assets/2023-03-20-phar/hall-phar-1k.glb`}
      >
        {({ glb }) => {
          return (
            <group>
              <MetaverseGLB offsetY={0.01} glb={glb}></MetaverseGLB>
            </group>
          );
        }}
      </LoaderGLB>
    </>
  );
}

export function MetaApp(
  {
    //
  }
) {
  let showPhase = useMeta((r) => r.showPhase);
  let renderMdoe = useMeta((r) => r.renderMdoe);
  //showPhase
  return (
    <div className="h-full w-full">
      <Canvas
        onCreated={(st) => {
          st.gl.outputEncoding = sRGBEncoding;
        }}
        className="h-full w-full"
      >
        <Content></Content>

        {renderMdoe === "smooth" && (
          <>
            <Environment preset="sunset"></Environment>
          </>
        )}

        {renderMdoe === "quality" && (
          <>
            <EnvSSR></EnvSSR>
          </>
        )}
      </Canvas>

      {showPhase === "game" && <JoyStick></JoyStick>}
      {showPhase === "game" && (
        <div className=" absolute top-0 right-0">
          <button
            onClick={() => {
              useMeta.setState({ showPhase: "menu" });
            }}
            className=" inline-block m-1 p-3 w-20 h-20 bg-white text-center rounded-lg"
          >
            Menu
          </button>
        </div>
      )}
      {showPhase === "game" && (
        <div className="absolute bottom-0 right-4 z-40">
          {/*  */}
          {/*  */}
          <ChatRoom roomID="general"></ChatRoom>
          {/*  */}
        </div>
      )}

      {showPhase === "menu" && (
        <div
          className="bg-white bg-opacity-30 absolute rounded-xl shadow-2xl  backdrop-blur-lg shadow-black"
          style={{
            width: `320px`,
            height: "320px",
            top: `calc(50% - 320px/  2)`,
            left: `calc(50% - 320px/  2)`,
          }}
        >
          <div className="w-full h-full flex items-center flex-col justify-center">
            <div className="py-3 text-center px-3 text-xl underline">
              Welcome to <br /> Pharmecy Conference
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={() => {
                  useMeta.setState({ renderMdoe: "smooth", showPhase: "game" });
                }}
                className=" inline-block mx-2 p-3 w-32 h-32 bg-gray-200 shadow-xl shadow-gray-500  text-center rounded-2xl"
              >
                Smooth Experience
              </button>
              <button
                onClick={() => {
                  useMeta.setState({
                    renderMdoe: "quality",
                    showPhase: "game",
                  });
                }}
                className=" inline-block mx-2 p-3 w-32 h-32 bg-gray-200 shadow-xl shadow-gray-500  text-center rounded-2xl"
              >
                High Quality Experience
              </button>
            </div>
            <div className="py-3 text-center px-3 text-xs text-gray-600">
              Smooth Experience can run on older phones.
            </div>
          </div>
        </div>
      )}

      {/* <></showPhase> */}
    </div>
  );
}
