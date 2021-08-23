import { useGenerate, useInterpolate } from './api';
import { useState } from 'react';

import './App.css';

function App() {
  const [seed, setSeed] = useState("");
  const [image, error] = useInterpolate(seed, "");

  // converting blob to image
  let img = "";
  try {
    img = window.URL.createObjectURL(image);
  }
  catch(e) {
    console.log(e)
  }
  console.log(typeof img);

  return (
    <img src={img}/>
  );
}

export default App;
