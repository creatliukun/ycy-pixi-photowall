import { useEffect, useState } from 'react'
import './App.css'

function App() {
  console.log(PIXI, 'PIXI')
  const [count, setCount] = useState(0)
  console.log('打印两次')
  let containerDom
  let mouseX = 0, mouseY = 0;
  const [app, setApp] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [particles, setParticles] = useState([])

  useEffect(() => {
    setWidth(document.body.clientWidth)
    setHeight(document.body.clientHeight)
    console.log(width,'width',document.body.clientWidth)
    console.log(height,'height',document.body.clientHeight)
    const _app = new PIXI.Application({
      width: width,
      height: height,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio, // 设备像素比
    });
    setApp(_app)
    containerDom = document.querySelector("#container");
    // containerDom.appendChild(app.view);
  }, [])
  return (
    <div id="container"></div>
  )
}

export default App
