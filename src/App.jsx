import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { Application, Sprite, Assets } from 'pixi.js';
import './App.css'

function App() {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  let appRef = useRef(null)

  const resizeUpdate = (e) => {
    // 通过事件对象获取浏览器窗口的高度
    let h = e.target.innerHeight;
    let w = e.target.innerWidth;
    // 对应用进行重置
    appRef.renderer.resize(w, h)
    setHeight(h);
    setWidth(w)
  };

  // 重置窗口大小
  useEffect(() => {
    // 页面刚加载完成后获取浏览器窗口的大小
    let h = window.innerHeight;
    setHeight(h)
    let w = window.innerWidth;
    setWidth(w)
    // 页面变化时获取浏览器窗口的大小 
    window.addEventListener('resize', resizeUpdate);
    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate);
    }
  }, [])
  useEffect(() => {
    appRef = new Application({
      width: width,
      height: height
    });
    appRef.renderer.autoResize = true;
    document.body.appendChild(appRef.view);
    // 组件销毁时移除app应用
    return () => {
      document.body.removeChild(appRef.view);
    }
  }, [])
  return (
    <div id="container"></div>
  )
}

export default App
