import chroma from "chroma-js";
import React from "react";

type SimplePaletteProps = {
  colors: string[];
};

const SimplePalette: React.FC<SimplePaletteProps> = ({ colors }) => {
  return (
    <div className="flex max-w-sm">
      {colors.map((color, index) => (
        <div
          key={index}
          style={{ backgroundColor: color }}
          className="group hover:w-14 w-1 transition duration-300 transition-all flex-grow h-10 flex items-center justify-center first:rounded-l-xl last:rounded-r-xl"
        >
          <p
            className={`opacity-0 group-hover:opacity-100 text-center transition duration-150 transition-opacity ${
              chroma.contrast(color, "#e2e8f0") > 4.5
                ? `text-slate-200`
                : "text-slate-800"
            }`}
          >
            {color}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SimplePalette;
