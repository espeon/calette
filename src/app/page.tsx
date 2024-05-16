import ColorGen from "@/components/ColorGen";
import chroma from "chroma-js";

export default function Home() {
  const palette = chroma
    .scale(["#ff0000", "#00ff00", "#0000ff"])
    .mode("lch")
    .colors(5);
  return (
    <main className="flex min-h-screen flex-col items-center justify-top p-24">
      <div className="flex flex-col items-left">
        <div className="pl-2 pb-8">
          <h1 className="text-4xl">calette</h1>
          <p className="text-lg">just a silly little palette generator</p>
        </div>
        <ColorGen />
      </div>
      {/* {palette.map(color => <div key={color} style={{backgroundColor: color}} className="w-32 h-32" />)} */}
    </main>
  );
}
