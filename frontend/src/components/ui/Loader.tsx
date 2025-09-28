// // src/components/ui/MatrixLoader.tsx
// import React from "react";
// import "./loader.css"; // we'll put the keyframes here

// const Loader: React.FC = () => {
//   return (
//     <div className="ai-matrix-loader grid grid-cols-3 gap-[5px] w-[120px] h-[160px] mx-auto my-[30px] relative [perspective:800px]">
//       <div className="digit">0</div>
//       <div className="digit">1</div>
//       <div className="digit">0</div>
//       <div className="digit">1</div>
//       <div className="digit">1</div>
//       <div className="digit">0</div>
//       <div className="digit">0</div>
//       <div className="digit">1</div>
//       <div className="glow absolute top-0 left-0 right-0 bottom-0"></div>
//     </div>
//   );
// };

// export default Loader;
// src/components/ui/MatrixLoader.tsx
import React from "react";
import "./loader.css"; // keep animations here

const Loader: React.FC = () => {
  return (
    <div
      aria-label="Orange and tan hamster running in a metal wheel"
      role="img"
      className="wheel-and-hamster relative w-[12em] h-[12em] text-[14px]"
    >
      <div className="wheel absolute top-0 left-0 w-full h-full rounded-full z-[2]" />
      <div className="hamster absolute top-1/2 left-[calc(50%-3.5em)] w-[7em] h-[3.75em] z-[1]" >
        <div className="hamster__body relative top-[0.25em] left-[2em] w-[4.5em] h-[3em]">
          <div className="hamster__head absolute top-0 left-[-2em] w-[2.75em] h-[2.5em]">
            <div className="hamster__ear absolute w-[0.75em] h-[0.75em] top-[-0.25em] right-[-0.25em]" />
            <div className="hamster__eye absolute w-[0.5em] h-[0.5em] top-[0.375em] left-[1.25em]" />
            <div className="hamster__nose absolute w-[0.2em] h-[0.25em] top-[0.75em] left-0" />
          </div>
          <div className="hamster__limb hamster__limb--fr absolute" />
          <div className="hamster__limb hamster__limb--fl absolute" />
          <div className="hamster__limb hamster__limb--br absolute" />
          <div className="hamster__limb hamster__limb--bl absolute" />
          <div className="hamster__tail absolute" />
        </div>
      </div>
      <div className="spoke absolute top-0 left-0 w-full h-full rounded-full" />
    </div>
  );
};

export default Loader;
