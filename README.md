### 需求：

1. 项目目录下会存在配置文件

```
{
    row:10,
    column:6
}
```

1. 启动时画面中有一个按钮，点击后可进行文件夹选择。
2. 遍历所选的文件夹读取文件列表，图片的文件名将在图片放大时显示。
3. 根据配置文件中的 row,column 来计算并设置图片在默认状态的尺寸。
4. 所有图片从右向左匀速移动。
5. 手指点击图片，停止移动。同时略放大一点（1.1 倍）。
6. 点击状态的图片，使用双指可以放大。
7. 放大的图片会对周围其他的图片产生互斥效果。
8. 如果图片大于 1.1 倍，此时松开手也不会复原和恢复匀速移动，在双指缩小事件后进行复原和恢复匀速移动。
9. 如果如片小于 1.1 倍，松开手即复原和恢复匀速移动。

### npm 下载 hammerjs

`npm install --save hammerjs`
