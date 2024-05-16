import React, { useState, useEffect } from "react";

const ColorPizza = ({ hexValue, className }: { hexValue: string, className: string }) => {
  const [paletteTitle, setPaletteTitle] = useState(".");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.color.pizza/v1/${hexValue.replace("#", "")}`);
        const data = await response.json();
        setPaletteTitle(data.paletteTitle);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [hexValue]);

  return <div className={className}>{paletteTitle}</div>;
};

export default ColorPizza;
