# SnakeTS
 
## Создание проекта

Создать файловую структуру:
```
||--dist
||--public
||--src
```
,где:
- dist - собранные файлы;
- public - html и ресурсы;
- src - исходники.

В ./public/ создать файл **index.html**:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Title of Your Project</title>
    </head>
    <body>
    </body>
</html>
```

## Установка Babylon.js

Сгенерировать **package.json**
```bash
npm init
```

Установить пакеты Babylon.js
```bash
npm install --save-dev @babylonjs/core
npm install --save-dev @babylonjs/inspector
npm install --save-dev @babylonjs/gui
```

Подключить TypeScript
```
tsc -init
```

Заменить содержимое **tsconfig.json** на:
```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "ESNext",
    "moduleResolution": "node",
    "noResolve": false,
    "noImplicitAny": false,
    "sourceMap": true,
    "preserveConstEnums":true,
    "lib": [
        "dom",
        "es6"
    ],
    "rootDir": "src"
  }
}
```

## Настройка Webpack

Установить зависимости:
```bash
npm install --save-dev typescript webpack ts-loader webpack-cli
```

Создать **webpack.config.js** с содержимым:
```JavaScript
const path = require("path");
const fs = require("fs");
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
    entry: path.resolve(appDirectory, "src/app.ts"), //path to the main .ts file
    output: {
        filename: "js/app.js", //name for the javascript file that is created/compiled in memory
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    mode: "development",
};
```

Для запуска и обнволения сборки:
```bash
npm install --save-dev html-webpack-plugin
npm install --save-dev webpack-dev-server
```

Обновить содержимое **webpack.config.js**:
```JavaScript
const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
    entry: path.resolve(appDirectory, "src/app.ts"), //path to the main .ts file
    output: {
        filename: "js/app.js", //name for the js file that is created/compiled in memory
        clean: true,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
        host: "0.0.0.0",
        port: 8080, //port that we're using for local host (localhost:8080)
        static: path.resolve(appDirectory, "public"), //tells webpack to serve from the public folder
        hot: true,
        devMiddleware: {
            publicPath: "/",
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(appDirectory, "public/index.html"),
        })
    ],
    mode: "development",
};
```

Настройка команд в **package.json**:
```json
"scripts": {
        "build": "webpack",
        "start": "webpack-dev-server --port 8080"
    },
```

Для запуска:
```bash
npm run build
npm run start
```