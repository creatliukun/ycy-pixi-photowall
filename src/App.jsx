import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { Application, Sprite, Assets, Container, Graphics } from 'pixi.js';
import './App.css'

function App() {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  let appRef = useRef(null)
  let particles = [];
  let mouseX = 0, mouseY = 0;

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

  // 初始化/销毁 应用
  useEffect(() => {
    // 创建应用
    appRef = new Application({
      width: width,
      height: height,
      resolution: window.devicePixelRatio // default: 1 分辨率-- window.devicePixelRatio获取设备像素比， 
    });
    // 是否自动尺寸渲染
    appRef.renderer.autoResize = true;
    document.body.appendChild(appRef.view);
    // 舞台交互
    appRef.stage.interactive = true;
    console.log(appRef, 'appRef')
    //  hit区域
    appRef.stage.hitArea = appRef.screen; // TODO:删除试试，这里是有屏幕大小的
    // 点移动
    appRef.stage.on("pointermove", (e) => {
      mouseX = e.global.x;
      mouseY = e.global.y;
    })

    //创建鼠标指示
    let circle = createCircle();
    appRef.stage.addChild(circle);
    circle.x = 100;
    circle.y = 100;

    //创建方块
    createTiles();
    //缓动系数
    const easeVal = 20;

    //帧循环
    appRef.ticker.add(() => {
      //鼠标指示跟随
      circle.x += (mouseX - circle.x) / easeVal;
      circle.y += (mouseY - circle.y) / easeVal;

      //遍历所有方块
      for (let item of particles) {
        //计算每个方块中心点和鼠标坐标的距离
        let distance = getDistance(item.dx + item.dw / 2, item.dy + item.dh / 2, mouseX, mouseY);

        if (distance < 100) {
          //当距离小于100时，计算互斥效果

          //互斥算法
          //计算鼠标和方块中心点的角度
          var angle = Math.atan2((mouseY - (item.dy + item.dh / 2)), (mouseX - (item.dx + item.dw / 2)));

          //根据角度计算互斥的坐标
          var nextX = (item.dx) - Math.cos(angle) * (100 - distance);
          var nextY = (item.dy) - Math.sin(angle) * (100 - distance);

          //缓动算法： 当前位置+（目标位置-当前位置）/缓动系数
          item.instance.x += (nextX - item.instance.x) / easeVal;
          item.instance.y += (nextY - item.instance.y) / easeVal;
        } else {
          //当距离大于100时，恢复起始坐标
          item.instance.x += (item.dx - item.instance.x) / easeVal;
          item.instance.y += (item.dy - item.instance.y) / easeVal;
        }
      }
    })
    // 组件销毁时移除app应用
    return () => {
      document.body.removeChild(appRef.view);
    }
  }, [])


  const createCircle = () => {
    const c = new Container();
    // const bunny = Sprite.from('resources/bg-far.png');
    // bunny.width = 70;
    // bunny.height = 70;
    // bunny.scale.set(2, 2)
    // bunny.anchor.set(0.5, 1)
    // bunny.pivot.set(32, 32)
    // // scaleImage(bunny)
    // c.addChild(bunny);

    const graphics = new Graphics();

    graphics.beginFill(0xD1B641);
    graphics.drawCircle(0, 0, 10);
    graphics.endFill();

    c.addChild(graphics);

    return c;
  }

  //获取两点间的直线距离
  const getDistance = function (x1, y1, x2, y2) {
    const _x = Math.abs(x1 - x2);
    const _y = Math.abs(y1 - y2);
    return Math.sqrt(_x * _x + _y * _y);
  }

  //创建方块
  const createTiles = () => {
    particles = [];

    //每行数量
    const rowCount = 10;

    const cw = width / rowCount;
    const ch = cw / 1.5;

    for (let i = 0; i < 100; i++) {
      const c = new Container();
      const bunny = Sprite.from('/src/assets/back1.jpeg');
      bunny.width = cw;
      bunny.height = ch;
      console.log(cw, ch, '123')
      c.addChild(bunny);

      c.x = Math.floor(i % rowCount) * cw;
      c.y = Math.floor(i / rowCount) * ch;
      appRef.stage.addChild(c);

      particles.push({
        dx: c.x,//起始x坐标
        dy: c.y,//起始x坐标
        dw: cw,//方块宽度
        dh: ch,//方块高度
        instance: c//实例对象
      });
    }
  }


  return (
    <div id="container"></div>
  )
}

export default App
