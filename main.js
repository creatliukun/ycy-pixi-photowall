
!(function(){
    window.onload = init;
    console.log('123')

    //获取两点间的直线距离
    var getDistance=function(x1, y1, x2, y2) {
        var _x = Math.abs(x1 - x2); 
        var _y = Math.abs(y1 - y2); 
        return Math.sqrt(_x * _x + _y * _y);
    }

    let app;
    let width;
    let height;
    let particles = [];
    let mouseX=0,mouseY=0;
    function init(){
        width = document.body.clientWidth;
        height = document.body.clientHeight;

        app = new PIXI.Application({ 
            width:width,
            height:height,
            backgroundColor: 0x000000,
            resolution:window.devicePixelRatio
        });
    
        var containerDom = document.querySelector("#container");
        containerDom.appendChild(app.view);

        app.stage.interactive = true;
        app.stage.hitArea = app.screen;
        app.stage.on("pointermove",(e)=>{
            mouseX = e.global.x;
            mouseY = e.global.y;
        })

        //创建方块
        createTiles();

        //创建鼠标指示
        let circle = createCircle();
        app.stage.addChild(circle);
        circle.x = 100;
        circle.y = 100;

        //缓动系数
        const easeVal = 20;

        //帧循环
        app.ticker.add(() => {
            //鼠标指示跟随
            circle.x += (mouseX-circle.x)/easeVal;
            circle.y += (mouseY-circle.y)/easeVal;

            //遍历所有方块
            for(let item of particles){
                //计算每个方块中心点和鼠标坐标的距离
                let distance = getDistance(item.dx+item.dw/2,item.dy+item.dh/2,mouseX,mouseY);

                if(distance<100){
                    //当距离小于100时，计算互斥效果
                    
                    //互斥算法
                    //计算鼠标和方块中心点的角度
                    var angle = Math.atan2((mouseY-(item.dy+item.dh/2)), (mouseX-(item.dx+item.dw/2)));
                    
                    //根据角度计算互斥的坐标
                    var nextX = (item.dx)-Math.cos(angle)*(100-distance);
                    var nextY = (item.dy)-Math.sin(angle)*(100-distance);

                    //缓动算法： 当前位置+（目标位置-当前位置）/缓动系数
                    item.instance.x += (nextX-item.instance.x)/easeVal;
                    item.instance.y += (nextY-item.instance.y)/easeVal;
                }else{
                    //当距离大于100时，恢复起始坐标
                    item.instance.x += (item.dx-item.instance.x)/easeVal;
                    item.instance.y += (item.dy-item.instance.y)/easeVal;
                }
            }
        })
    }

    function createCircle(){
        const c = new PIXI.Container();
        const graphics = new PIXI.Graphics();

        graphics.beginFill(0xD1B641);
        graphics.drawCircle(0,0, 10);
        graphics.endFill();

        c.addChild(graphics);

        return c;
    }

    function createTiles(){
        particles = [];

        //每行数量
        const rowCount = 10;

        const cw = width/rowCount;
        const ch = cw/1.5;

        for(let i = 0;i<100;i++){
            const c = new PIXI.Container();
            const graphics = new PIXI.Graphics();

            graphics.beginFill(0xDE3249);
            graphics.drawRect(0,0, cw,ch);
            graphics.endFill();

            c.addChild(graphics);

            c.x = Math.floor(i%rowCount)*cw;
            c.y = Math.floor(i/rowCount)*ch;
            app.stage.addChild(c);

            particles.push({
                dx:c.x,//起始x坐标
                dy:c.y,//起始x坐标
                dw:cw,//方块宽度
                dh:ch,//方块高度
                instance:c//实例对象
            });
        }
    }
})()