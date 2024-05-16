import chroma from "chroma-js";
import React, { useState, useEffect } from "react";

const ColorPizza = ({
  hexValue,
  className,
}: {
  hexValue: string;
  className: string;
}) => {
  const [paletteTitle, setPaletteTitle] = useState(".isloading");

  useEffect(() => {
    const fetchData = async () => {
      setPaletteTitle(".isloading");
      try {
        const response = await fetch(
          `https://api.color.pizza/v1/${hexValue.replace("#", "")}`
        );
        const data = await response.json();
        setPaletteTitle(data.paletteTitle);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [hexValue]);

  if (paletteTitle === ".isloading") {
    return (
      <div className={className}>
        <Spinner color={hexValue} />
      </div>
    );
  }

  return <div className={className}>{paletteTitle}</div>;
};

const Spinner = ({ color }: { color: string }) => {
    // calculate complement color
    console.log(color)
    const col = chroma(color)
    const c = col.rgb();
    const m = Math.min(c[0], c[1], c[2]) + Math.max(c[0], c[1], c[2]);
    const complement = chroma([m - c[0], m - c[1], m - c[2]]).luminance(1 - col.luminance() - .25);
  return (<div role="status" className="">
    <div
      style={{"borderColor": complement.hex(), "borderTopColor": col.hex(), "animation": "spin 1s cubic-bezier(.34,.6,.85,.74) infinite"}}
      className={`h-4 w-4 my-1 border-solid ease-in-out rounded-full border-4`}
    >
    </div>
    <span className="sr-only">Loading...</span>
  </div>
)
}

export default ColorPizza;
