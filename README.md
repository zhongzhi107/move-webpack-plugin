# move-webpack-plugin

Webpack plugin to move around files and directories.

在 webpack 编译前 或 编译后 执行文件移动操作。

## 安装
```
npm i move-webpack-plugin
```

## 用法
```js
import MoveWebpackPlugin from 'move-webpack-plugin';

new MoveWebpackPlugin({
  src: 'webpack-stats.json',
  dest: 'dist'
}),

```

## 参数
### patterns
{Object}: 需要操作的文件 `glob` 对象

### when
{String='done|beforeRun'}: 移动文件的时机
- done: 编译完成时移动文件
- beforeRun: 准备编译前时移动文件
