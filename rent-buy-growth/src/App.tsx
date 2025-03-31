// import { useState } from 'react'
import "./App.css";
import GrowthChart from "./components/GrowthChart";

function App() {
  return (
    <div>
      <header>
        <a href="/">Tinker Deck</a>
      </header>
      <main>
        <h1>Rent vs Buy: What's the Real Growth Story?</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
          posuere leo id dolor commodo, in viverra erat dictum. Nullam id magna
          ac eros tristique dictum in at justo. Suspendisse nec porta erat.
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas.
        </p>
        <GrowthChart />
        <p>
          Praesent feugiat ligula a nibh interdum, vitae tempus ante fermentum.
          Curabitur vitae tincidunt libero, at imperdiet lacus. Donec
          scelerisque nisl et sapien pulvinar, ac tincidunt neque convallis.
          Duis sed nunc et urna malesuada feugiat. Integer a commodo odio.
        </p>
      </main>
    </div>
  );
}

export default App;
