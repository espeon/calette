import ColorGen from '@/components/ColorGen';
import chroma from 'chroma-js'

export default function Home() {
  const palette = chroma.scale(['#ff0000', '#00ff00', '#0000ff']).mode('lch').colors(5)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ColorGen />
      {/* {palette.map(color => <div key={color} style={{backgroundColor: color}} className="w-32 h-32" />)} */}
    </main>
  );
}
