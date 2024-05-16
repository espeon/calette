import chroma, { hex } from "chroma-js";
import React, { useState, useEffect } from "react";

let defaultkv = {
    "#2b0594":"Full Swing Indigo",
    "#700092":"Chinese Purple",
    "#9e008d":"Vanishing Night",
    "#c40087":"Medium Violet Red",
    "#e3187f":"Mexican Pink"
}

const ColorPizza = ({
  hexValue,
  className,
  colorName = undefined
}: {
  hexValue: string;
  className: string;
  colorName?: string;
}) => {
  const [paletteTitle, setPaletteTitle] = useState((defaultkv as any)[hexValue] != undefined ? (defaultkv as any)[hexValue] : ".isloading");

  console.log((defaultkv as any)[hexValue])

  useEffect(() => {
    fetch(`https://api.color.pizza/v1/${hexValue.replace("#", "")}`)
      .then((res) => res.json())
      .then((data) => {
        setPaletteTitle(data.paletteTitle);
      })
  }, [hexValue])

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
