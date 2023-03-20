import { Environment } from "@react-three/drei";
import { JoyStick } from "../../../components/canvas/MetaOnline/Joystick";
import { LoaderGLB } from "../../../components/canvas/MetaOnline/LoaderGLB";
import { MetaverseGLB } from "../../../components/canvas/MetaOnline/MetaverseGLB";
import { EnvSSR } from "../../../components/canvas/RealismEffect/EnvSSR";
import { Canvas } from "@react-three/fiber";
import { sRGBEncoding } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { useMeta } from "../MetaOnline/useMeta";

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

export function MetaApp({}) {
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

      {showPhase === "menu" && (
        <div
          className="bg-white absolute rounded-xl shadow-2xl flex items-center justify-center"
          style={{
            width: `300px`,
            height: "300px",
            top: `calc(50% - 300px/  2)`,
            left: `calc(50% - 300px/  2)`,
          }}
        >
          <button
            onClick={() => {
              useMeta.setState({ renderMdoe: "smooth", showPhase: "game" });
            }}
            className=" inline-block ml-1 p-3 w-32 h-32 bg-gray-200 text-center rounded-lg"
          >
            Smooth Experience
          </button>
          <button
            onClick={() => {
              useMeta.setState({ renderMdoe: "quality", showPhase: "game" });
            }}
            className=" inline-block mx-1 p-3 w-32 h-32 bg-gray-200 text-center rounded-lg"
          >
            High Quality Experience
          </button>
        </div>
      )}

      {/* <></showPhase> */}
    </div>
  );
}
