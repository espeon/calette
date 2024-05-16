"use client";
import React, { useEffect, useState } from "react";
import chroma, { Color } from "chroma-js";
import { PiPlus, PiMinus, PiLock, PiLockOpen } from "react-icons/pi";
import { IoIosHeart, IoIosRefresh } from "react-icons/io";
import ColorPizza from "./ColorPizza";
import SimplePalette from "./SimplePalette";
import { RiHeart2Line, RiHeartFill, RiHeartLine } from "react-icons/ri";

const calculateReasonableColor = (color: Color, colorNext: Color) => {
  // get the complement of the color
  const c = color.rgb();
  const m = Math.min(c[0], c[1], c[2]) + Math.max(c[0], c[1], c[2]);
  const complement = chroma([m - c[0], m - c[1], m - c[2]]);
  // get a random color and return a mix of the color and the complement
  console.log(color, complement);
  let random = chroma.random();
  // get luminance of complement and mix with original
  let luminance = chroma
    .mix(color, complement, 0.2 + Math.random() * 0.2)
    .luminance();
  // get chromacity of original
  let lch = color.lch();
  // console.log(chromacity);
  return chroma
    .mix(
      chroma.mix(color, complement, 0.6 + Math.random() * 0.3),
      chroma.mix(colorNext, random),
      Math.random()
    )
    .luminance(luminance)
    .set("lch.c", lch[1] + Math.random() * 0.1 - 0.05);
  //return chroma(complement);
};

const generateRandomPalette = (
  numColors: number = 5,
  lockedColors: boolean[] = [],
  currentPalette: string[] = []
) => {
  let pal;
  if (lockedColors.includes(true)) {
    // which colors are locked? get the indices of the locked colors
    let lockedIndices = lockedColors
      .map((color, index) => (color ? index : -1))
      .filter((color) => color !== -1);

    // get the colors that are locked
    let lColors = currentPalette.filter((color, index) =>
      lockedIndices.includes(index)
    );

    console.log(lockedIndices.includes(numColors - 1));
    console.log(lColors);

    // zip indices and colors
    let zip = lockedIndices.map((color, index) => {
      return { index: color, color: currentPalette[color] };
    });

    if (!lockedIndices.includes(0)) {
      console.log("First indice not locked");
      zip.push({
        index: 0,
        color: calculateReasonableColor(
          chroma(currentPalette[0]),
          chroma(currentPalette[1])
        ).hex(),
      });
      // lockedIndices = [0, ...lockedIndices];
      // // calculate reasonable color
      // lColors = [calculateReasonableColor(chroma(currentPalette[0])).hex(), ...lColors];
    }
    if (!lockedIndices.includes(numColors - 1)) {
      console.log("Last indice not locked");
      let last = currentPalette.length - 1;
      let nextLast = last - 1;
      console.log(
        currentPalette.length,
        currentPalette[last],
        currentPalette[nextLast]
      );
      zip.push({
        index: numColors - 1,
        color: calculateReasonableColor(
          chroma(currentPalette[last]),
          chroma(currentPalette[nextLast])
        ).hex(),
      });
      // lockedIndices.push(numColors - 1);
      // lColors.push(calculateReasonableColor(chroma(currentPalette[numColors - 1])).hex());
    }

    // last changed value index
    let lc = 0;
    for (let i = 0; i < numColors - 1; i++) {
      if (!lockedIndices.includes(i) && lc < i - numColors / 3) {
        console.log("Indice not locked", i);
        let nextPal = i - 1;
        let curr = i;
        if (i == 0 && nextPal <= currentPalette.length) {
          nextPal = i + 1;
        }
        if (curr <= currentPalette.length) {
          lc = curr;
        }
        console.log(currentPalette[curr], currentPalette[nextPal]);
        zip.push({
          index: i,
          color: calculateReasonableColor(
            chroma(currentPalette[i]),
            chroma(currentPalette[nextPal])
          ).hex(),
        });
        lc = i;
      }
    }

    // sort zip
    zip.sort((a, b) => a.index - b.index);
    // break zip out into indices and colors
    lockedIndices = zip.map((color) => color.index);
    lColors = zip.map((color) => color.color);

    console.log(lockedIndices);
    console.log(lColors);

    console.log(lockedIndices.join(", "));
    console.log(lColors);
    pal = chroma
      .scale(lColors)
      .domain(lockedIndices)
      .mode("lch")
      .colors(numColors);
  } else {
    const randomColor = chroma.random().hex();
    const randomColor2 = chroma.random().hex();
    const randomColor3 = chroma.random().hex();
    let colorScale = [randomColor, randomColor2];
    let random = Math.random();
    if (random < 0.2) {
      console.log("Adding color 3", random);
      colorScale.push(randomColor3);
    }
    pal = chroma.scale(colorScale).mode("lch").colors(numColors);
  }

  return pal;
};

const ColorGen = () => {
  const [numColors, setNumColors] = useState(5);
  const [palette, setPalette] = useState(generateRandomPalette(5));
  const [locked, isLocked] = useState([false]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleKeyUp = (event: { key: any; }) => {
      if (event.key === 'Enter' || event.key === " ") { 
        setRandomPalette();
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);


  const setRandomPalette = () => {
    console.log("generating palette");
    setPalette(generateRandomPalette(numColors, locked, palette));
  };

  const setColorLocked = (index: number) => {
    console.log("Locking color at index " + index);
    const newLocked = [...locked];
    newLocked[index] = !newLocked[index];
    isLocked(newLocked);
  };

  const onNumColorsClick = (dir: number) => {
    setNumColors(numColors + dir);
    console.log("changing numColors to " + numColors);
    // on increase
    if (dir > 0) {
      let locked = Array(numColors).fill(true);
      console.log(locked);
      setPalette(generateRandomPalette(numColors + dir, locked, palette));
    }
    // on decrease
    else if (dir < 0) {
      setPalette(palette.slice(0, numColors + dir));
      isLocked(locked.slice(0, numColors + dir));
    }
  };

  const onRefreshClick = () => {
    setIsRefreshing(true);
    setRandomPalette();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div>
      <button className={`ml-2 pb-0.5 transition hover:scale-110 ${isRefreshing ? "refresh-colors" : ""}`} onClick={onRefreshClick}>
        <IoIosRefresh className="w-6 h-6" />
      </button>
      <div className="flex max-w-7xl w-screen rounded-xl">
        {palette.map((color, i) => (
          <div
            key={i}
            style={{ backgroundColor: color }}
            className={`h-64 w-full flex flex-col items-start justify-end first:rounded-l-xl last:rounded-r-xl group transition duration-500 transition-all`}
          >
            <button
              onClick={() => setColorLocked(i)}
              className={`${
                locked[i] ? "scale-110" : "scale-100"
              } ml-2 p-1 -mb-1 rounded transition hover:scale-110 ${
                chroma.contrast(color, "#e2e8f0") > 4.5
                  ? "hover:bg-black/30"
                  : "hover:bg-slate-300/50"
              }`}
            >
              {locked[i] == true ? (
                <PiLock
                  className={`w-6 h-6 transition duration-150 transition-all ${
                    chroma.contrast(color, "#e2e8f0") > 4.5
                      ? "text-slate-200/50 group-hover:text-slate-200"
                      : "text-black/50 group-hover:text-black"
                  }`}
                />
              ) : (
                <PiLockOpen
                  className={`w-6 h-6 opacity-0 group-hover:opacity-100 transition duration-150 transition-all ${
                    chroma.contrast(color, "#e2e8f0") > 4.5
                      ? "text-slate-200"
                      : "text-black"
                  }`}
                />
              )}
            </button>
            <div
              className={`ml-2 font-mono text-md ${
                chroma.contrast(color, "#e2e8f0") > 4.5
                  ? "text-slate-200"
                  : "text-black"
              }`}
            >
              {color}
            </div>
            <ColorPizza hexValue={color} className={`mx-2 font-mono -mt-1 pb-1 text-md ${
                chroma.contrast(color, "#e2e8f0") > 4.5
                  ? "text-slate-200"
                  : "text-black"
              }`} />
          </div>
        ))}
      </div>
      <div className="pt-2 pl-2">
        <button onClick={() => onNumColorsClick(1)} disabled={numColors >= 12} className="disabled:text-gray-500 transition duration-150 transition-all hover:scale-110 disabled:hover:scale-100">
          <PiPlus className="w-6 h-6" />
        </button>
        <button onClick={() => onNumColorsClick(-1)} disabled={numColors <= 2} className="disabled:text-gray-500 transition duration-150 transition-all hover:scale-110 disabled:hover:scale-100">
          <PiMinus className="w-6 h-6 ml-2" />
        </button>
        <button className="ml-3 transition duration-150 transition-all hover:scale-110">
          <RiHeartLine className="w-6 h-6" />
        </button>
      </div>
      <SimplePalette colors={palette} />
    </div>
  );
};

export default ColorGen;
