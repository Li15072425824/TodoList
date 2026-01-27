在 `vue3-todolist` 目录执行 `node api/local-connect/server.js` 启动服务，随后浏览器访问 http://localhost:3000/api/get-data 即可查看结果。
关联文件 ./server.js、./get-data.js

### 链接后面的api/get-data和目录中的 get-data.js 有什么关系？
    链接后面的api/get-data 是一个路径，表示访问的接口地址。
    目录中的 get-data.js 是一个 Node.js 脚本文件，用于处理该接口的请求。
    当你在浏览器中访问 http://localhost:3000/api/get-data 时，服务器会接收到这个请求，并尝试在服务器上找到对应的处理脚本。
    在这个例子中，服务器会根据这个路径找到对应的处理脚本（在这个例子中是 get-data.js），然后执行其中的代码来响应请求。
