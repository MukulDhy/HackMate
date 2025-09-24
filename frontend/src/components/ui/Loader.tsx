// src/components/ui/MatrixLoader.tsx
import React from "react";
import "./loader.css"; // we'll put the keyframes here

const Loader: React.FC = () => {
  return (
    <div className="ai-matrix-loader grid grid-cols-3 gap-[5px] w-[120px] h-[160px] mx-auto my-[30px] relative [perspective:800px]">
      <div className="digit">0</div>
      <div className="digit">1</div>
      <div className="digit">0</div>
      <div className="digit">1</div>
      <div className="digit">1</div>
      <div className="digit">0</div>
      <div className="digit">0</div>
      <div className="digit">1</div>
      <div className="glow absolute top-0 left-0 right-0 bottom-0"></div>
    </div>
  );
};

export default Loader;
