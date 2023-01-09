import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { Application, Sprite, Assets, Container, Graphics, Text } from 'pixi.js';
import Hammer from 'hammerjs'
import './App.css'
console.log(Hammer, 'config')

function App() {
  // const [width, setWidth] = useState(window.innerWidth)
  // const [height, setHeight] = useState(window.innerHeight)
  let appRef = useRef(null)
  const 行数 = config.row;
  const 列数 = config.column;
  const 方块间距 = config.gap;
  const 缓动系数 = config.ease;
  const 平移的速度 = config.speed;
  console.log(行数, '行数')

  let app,
    width,
    height,
    particles = [],
    mouseX = 0,
    mouseY = 0,
    放大倍数 = 1.1,
    之前的放大倍数 = 1.1,
    图片的宽度 = 0,
    图片的高度 = 0,
    悬浮图片的宽度 = 0,
    悬浮图片的高度 = 0,
    悬浮的图片 = null,
    文字背景透明度 = 0.7,
    需要销毁悬浮图片 = false,
    // 手指触摸时防止图片跳动
    offsetX = 0,
    offsetY = 0,
    // 放大时保证在图片的中心点放大
    moveOffsetX = 0,
    moveOffsetY = 0,
    触点数量 = 0,
    正在缩放中 = false,
    从右往左平移 = true,
    开始销毁 = false,
    randomX = [];

  useEffect(() => {
    document.querySelector("#select").addEventListener("click", selectImages);
  }, [])

  const selectImages = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = (e) => {
      const files = e.target.files;
      particles = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        particles.push({
          url,
          name: file.name,
        });
      }
      document.querySelector("#container").innerHTML = "";
      init();
    };
    input.click();
  }
  // const resizeUpdate = (e) => {
  //   // 通过事件对象获取浏览器窗口的高度
  //   let h = e.target.innerHeight;
  //   let w = e.target.innerWidth;
  //   // 对应用进行重置
  //   appRef.renderer.resize(w, h)
  //   setHeight(h);
  //   setWidth(w)
  // };

  // 重置窗口大小
  // useEffect(() => {
  //   // 页面刚加载完成后获取浏览器窗口的大小
  //   let h = window.innerHeight;
  //   setHeight(h)
  //   let w = window.innerWidth;
  //   setWidth(w)
  //   // 页面变化时获取浏览器窗口的大小 
  //   window.addEventListener('resize', resizeUpdate);
  //   return () => {
  //     // 组件销毁时移除监听事件
  //     window.removeEventListener('resize', resizeUpdate);
  //   }
  // }, [])

  // // 初始化/销毁 应用
  // useEffect(() => {
  //   // 创建应用
  //   appRef = new Application({
  //     width: width,
  //     height: height,
  //     resolution: window.devicePixelRatio // default: 1 分辨率-- window.devicePixelRatio获取设备像素比， 
  //   });
  //   // 是否自动尺寸渲染
  //   const containerDom = document.querySelector("#container");
  //   containerDom.appendChild(appRef.view);
  //   // const cm = new Hammer(containerDom);
  //   appRef.renderer.autoResize = true;
  //   // document.body.appendChild(appRef.view);
  //   // 舞台交互
  //   appRef.stage.interactive = true;
  //   console.log(appRef, 'appRef')
  //   //  hit区域
  //   appRef.stage.hitArea = appRef.screen; // TODO:删除试试，这里是有屏幕大小的
  //   // 点移动
  //   appRef.stage.on("pointermove", (e) => {
  //     mouseX = e.global.x;
  //     mouseY = e.global.y;
  //   })

  //   //创建鼠标指示
  //   let circle = createCircle();
  //   appRef.stage.addChild(circle);
  //   circle.x = 100;
  //   circle.y = 100;

  //   //创建方块
  //   createTiles();
  //   //缓动系数
  //   const easeVal = 20;

  //   //帧循环
  //   appRef.ticker.add(() => {
  //     //鼠标指示跟随
  //     circle.x += (mouseX - circle.x) / easeVal;
  //     circle.y += (mouseY - circle.y) / easeVal;

  //     //遍历所有方块
  //     for (let item of particles) {
  //       //计算每个方块中心点和鼠标坐标的距离
  //       let distance = getDistance(item.dx + item.dw / 2, item.dy + item.dh / 2, mouseX, mouseY);

  //       if (distance < 100) {
  //         //当距离小于100时，计算互斥效果

  //         //互斥算法
  //         //计算鼠标和方块中心点的角度
  //         var angle = Math.atan2((mouseY - (item.dy + item.dh / 2)), (mouseX - (item.dx + item.dw / 2)));

  //         //根据角度计算互斥的坐标
  //         var nextX = (item.dx) - Math.cos(angle) * (100 - distance);
  //         var nextY = (item.dy) - Math.sin(angle) * (100 - distance);

  //         //缓动算法： 当前位置+（目标位置-当前位置）/缓动系数
  //         item.instance.x += (nextX - item.instance.x) / easeVal;
  //         item.instance.y += (nextY - item.instance.y) / easeVal;
  //       } else {
  //         //当距离大于100时，恢复起始坐标
  //         item.instance.x += (item.dx - item.instance.x) / easeVal;
  //         item.instance.y += (item.dy - item.instance.y) / easeVal;
  //       }
  //     }
  //   })
  //   // 组件销毁时移除app应用
  //   return () => {
  //     document.body.removeChild(appRef.view);
  //   }
  // }, [])
  function init() {
    width = document.body.clientWidth;
    console.log(document.body, 'document.body.clientHeight')
    height = document.body.clientHeight;

    app = new Application({
      width: width,
      height: height,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio,
    });

    const containerDom = document.querySelector("#container");
    containerDom.appendChild(app.view);
    const cm = new Hammer(containerDom);
    cm.get("pinch").set({ enable: true });

    app.stage.interactive = true;
    app.stage.hitArea = app.screen;

    //创建方块
    createTiles();

    app.stage.on("touchstart", (e) => {
      从右往左平移 = false;
      触点数量++;
      if (触点数量 > 1) {
        return;
      }
      const target = e.target;
      // 如果点击的不是图片，直接返回
      if (!target.__url) return;
      mouseX = e.data.global.x;
      mouseY = e.data.global.y;
      moveOffsetX = 0;
      moveOffsetY = 0;
      offsetX = target.x - mouseX;
      offsetY = target.y - mouseY;
      需要销毁悬浮图片 = 放大倍数 <= 1.1;
      if (!悬浮的图片) {
        更新悬浮图片的宽高();
        // 手指触摸时防止图片跳动
        offsetX = offsetX - (悬浮图片的宽度 - target.width) / 2;
        offsetY = offsetY - (悬浮图片的高度 - target.height) / 2;
        悬浮的图片 = createRect(
          悬浮图片的宽度,
          悬浮图片的高度,
          target.__url,
          target.__name
        );
        悬浮的图片.interactive = true;
        悬浮的图片.x = target.x;
        悬浮的图片.y = target.y;
        悬浮的图片.__targetX = target.x;
        悬浮的图片.__targetY = target.y;
        app.stage.addChild(悬浮的图片);
      }
    });
    app.stage.on("touchmove", (e) => {
      if (触点数量 > 1 || 正在缩放中) {
        return;
      }
      mouseX = e.data.global.x;
      mouseY = e.data.global.y;
    });
    app.stage.on("touchend", (e) => {
      if (触点数量 > 1) {
        触点数量--;
        return;
      }
      触点数量--;
      正在缩放中 = false;
      if (需要销毁悬浮图片) {
        开始销毁 = true;
        悬浮的图片.removeChild(悬浮的图片.__background);
        悬浮的图片.removeChild(悬浮的图片.__text);
      }
    });
    // 双指缩放开始
    cm.on("pinchstart", (e) => {
      正在缩放中 = true;
    });
    // 双指缩放
    cm.on("pinchmove", (e) => {
      放大倍数 = 之前的放大倍数 + e.scale - 1;
      更新悬浮图片的宽高();
      悬浮的图片.scale.set(放大倍数, 放大倍数);
      // 保证以中心点放大
      if (之前的放大倍数) {
        moveOffsetX = -(图片的宽度 * (放大倍数 - 之前的放大倍数)) / 2;
        moveOffsetY = -(图片的高度 * (放大倍数 - 之前的放大倍数)) / 2;
      } else {
        moveOffsetX = -(图片的宽度 * (放大倍数 - 1)) / 2;
        moveOffsetY = -(图片的高度 * (放大倍数 - 1)) / 2;
      }
      需要销毁悬浮图片 = 放大倍数 <= 1.1;
      // 双指快速缩小时，销毁悬浮图片
      if (e.additionalEvent === "pinchin" && e.deltaTime < 300) {
        需要销毁悬浮图片 = true;
      }
    });
    // 双指缩放结束
    cm.on("pinchend", () => {
      之前的放大倍数 = 放大倍数;
    });

    let last = particles[particles.length - 1];
    //帧循环
    app.ticker.add(() => {
      let 悬浮图片的中心点 = null;
      if (开始销毁) {
        悬浮的图片.x += (悬浮的图片.__targetX - 悬浮的图片.x) / 缓动系数;
        悬浮的图片.y += (悬浮的图片.__targetY - 悬浮的图片.y) / 缓动系数;
        悬浮的图片.scale.x += (1 / 1.1 - 悬浮的图片.scale.x) / 缓动系数;
        悬浮的图片.scale.y += (1 / 1.1 - 悬浮的图片.scale.y) / 缓动系数;
        if (Math.abs(悬浮的图片.x - 悬浮的图片.__targetX) < 1) {
          销毁悬浮图片(app, 悬浮的图片);
        }
      } else if (悬浮的图片) {
        const xy = 获得最新的悬浮图片坐标();
        悬浮的图片.x = xy.x;
        悬浮的图片.y = xy.y;
        悬浮图片的中心点 = {
          x: xy.x + 悬浮图片的宽度 / 2,
          y: xy.y + 悬浮图片的高度 / 2,
        };
      }

      //遍历所有方块
      for (let i = 0; i < particles.length; i++) {
        const item = particles[i];
        if (从右往左平移) {
          // 左边消失的一列图片移动到右边，这样就可以无限滚动下去
          if (-item.dx >= item.dw * 2) {
            // 最后一个方块所在的行数
            const rowOfLast = Math.floor(last.dy / 图片的高度);
            if (last.dy < 图片的高度 * (行数 - 1) + 方块间距 * 行数) {
              item.instance.y = item.dy = last.dy + last.dh + 方块间距;
              item.instance.x = item.dx =
                last.dx - randomX[rowOfLast] + randomX[rowOfLast + 1];
            } else {
              item.instance.y = item.dy = 方块间距;
              item.instance.x = item.dx =
                last.dx - randomX[rowOfLast] + randomX[0] + last.dw + 方块间距;
            }
            last = item;
            continue;
          } else {
            item.dx -= 平移的速度;
          }
        }
        if (悬浮的图片 && !开始销毁) {
          //计算每个方块中心点和鼠标坐标的距离
          let distance = getDistance(
            item.dx + item.dw / 2,
            item.dy + item.dh / 2,
            悬浮图片的中心点.x,
            悬浮图片的中心点.y
          );
          // 防止选中图片时，原来该位置的图片突然飞出去
          if (distance < 60) {
            item.instance.x += Math.ceil(
              (悬浮的图片.x - item.instance.x) / 缓动系数
            );
            item.instance.y += Math.ceil(
              (悬浮的图片.y - item.instance.y) / 缓动系数
            );
            continue;
          }

          //互斥算法
          //计算鼠标和方块中心点的角度
          var angle = Math.atan2(
            悬浮图片的中心点.y - Math.ceil(item.dy + item.dh / 2),
            悬浮图片的中心点.x - Math.ceil(item.dx + item.dw / 2)
          );

          //根据角度计算互斥的坐标
          var nextX =
            item.dx -
            Math.cos(angle) *
            Math.ceil((item.dw * item.dw * 放大倍数) / 2 / distance);
          var nextY =
            item.dy -
            Math.sin(angle) *
            Math.ceil((item.dh * item.dh * 放大倍数) / 2 / distance);

          //缓动算法： 当前位置+（目标位置-当前位置）/缓动系数
          item.instance.x += Math.ceil((nextX - item.instance.x) / 缓动系数);
          item.instance.y += Math.ceil((nextY - item.instance.y) / 缓动系数);
        } else {
          item.instance.x += (item.dx - item.instance.x) / 缓动系数;
          item.instance.y += (item.dy - item.instance.y) / 缓动系数;
        }
      }
    });
  }


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
  function 获得最新的悬浮图片坐标() {
    const x = mouseX + offsetX + moveOffsetX;
    const y = mouseY + offsetY + moveOffsetY;

    return { x, y };
  }

  function 销毁悬浮图片(app, image) {
    app.stage.removeChild(image);
    放大倍数 = 1.1;
    之前的放大倍数 = 1.1;
    需要销毁悬浮图片 = false;
    开始销毁 = false;
    悬浮的图片 = null;
    从右往左平移 = true;
    文字背景透明度 = 0.7;
    image = null;
    mouseX = 0;
    mouseY = 0;
    moveOffsetX = 0;
    moveOffsetY = 0;
    offsetX = 0;
    offsetY = 0;
  }

  function 更新悬浮图片的宽高() {
    悬浮图片的宽度 = 图片的宽度 * 放大倍数;
    悬浮图片的高度 = 图片的高度 * 放大倍数;
  }
  function createRect(width, height, url, name) {
    const fontSize = width / 6;
    const result = new Container();

    if (url) {
      const sprite = Sprite.from(url);
      sprite.width = result.width = width;
      sprite.height = result.height = height;
      result.__url = url;
      result.addChild(sprite);
    }

    if (name) {
      // 一个黑色背景的矩形
      const background = new Graphics();
      const rectHeight = fontSize * 0.4;
      background.beginFill(0x000000, 文字背景透明度);
      background.drawRect(0, 0, width, rectHeight);
      background.endFill();
      background.y = height - rectHeight;
      // 文字
      const text = new Text(name, {
        fontFamily: "Arial",
        fontSize,
        fill: "white",
        wordWrapWidth: width,
      });
      text.x = 1;
      text.y = height - rectHeight + 1;
      text.scale.x = 0.3;
      text.scale.y = 0.3;
      result.addChild(background);
      result.addChild(text);
      result.__text = text;
      result.__background = background;
    }
    return result;
  }

  //获取两点间的直线距离
  const getDistance = function (x1, y1, x2, y2) {
    const _x = Math.abs(x1 - x2);
    const _y = Math.abs(y1 - y2);
    return Math.sqrt(_x * _x + _y * _y);
  }

  //创建方块
  function createTiles() {
    悬浮图片的宽度 = 图片的宽度 = Math.floor(
      (width - 方块间距 * (列数 + 1)) / 列数
    );
    悬浮图片的高度 = 图片的高度 = Math.floor(
      (height - 方块间距 * (行数 + 1)) / 行数
    );
    // 生成随机的x坐标，用于使图片不要排列那么整齐
    randomX = new Array(行数).fill().map(() => Math.random() * 图片的宽度);

    for (let i = 0; i < particles.length; i++) {
      const { url, name } = particles[i];
      const c = createRect(图片的宽度, 图片的高度, url);
      c.__name = name;
      c.interactive = true;
      c.x =
        Math.floor(i / 行数) * 图片的宽度 +
        方块间距 * Math.floor(i / 行数) +
        方块间距 +
        randomX[i % 行数];
      c.y =
        Math.floor(i % 行数) * 图片的高度 +
        方块间距 * Math.floor(i % 行数) +
        方块间距;
      app.stage.addChild(c);

      particles[i] = {
        dx: c.x, //起始x坐标
        dy: c.y, //起始x坐标
        dw: 图片的宽度, //方块宽度
        dh: 图片的高度, //方块高度
        instance: c, //实例对象
        url: url,
      };
    }
  }


  return (
    <div id="container">
      <button id="select">选择</button>
    </div>
  )
}

export default App
