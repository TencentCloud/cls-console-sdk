# CLS SDK 独立环境使用说明

1. 项目依赖安装
> 项目使用 pnpm 安装依赖，如未使用 pnpm，请先 [安装](https://pnpm.io/zh/installation) 。
> 
> 在项目总目录下，运行 `pnpm recursive install` 完成依赖安装。
> 
> 在capi-forward目录下，运行 `pnpm recursive install` 完成依赖安装。

2. 在capi-forward文件夹中，创建.env文件，填写秘钥信息，区分大小写，demoPassword 设置则提供简单密码鉴权，不设置则无密码鉴权。
```environment
secretId=
secretKey=
demoPassword=
```
附：[创建密钥链接](https://console.cloud.tencent.com/cam/capi)

3. 构建或直接运行项目
> 后端项目：进入 capi-forward 文件夹，使用 npm run build 进行构建，然后使用 npm run prod 进行启动 （每次修改后端项目内容需要重新构建一次）
> 
> 前端项目：根目录使用 npm run dev 进行启动预览<br>
> 
> 使用 npm run build 进行构建，可进行页面部署


4. 网页使用

> 以前端预览状态为例，网页地址如下示例：
> 
> 示例: <br>
> http://localhost:8080/search?region=ap-shanghai&topic_id=${TopicId}&query=123time=now-h,now <br> 
> http://localhost:8080/search?region=ap-shanghai&topic_name=${TopicName}&logset_name=${LogsetName}&filter=${FilterStr} <br>
>
> 
> 后部分路由参数请参考 [检索页面参数设置](https://cloud.tencent.com/document/product/614/39331)


5. iframe方式引入，快捷实现与控制台能力对标。

用户可在业务内部系统中，直接将此sdk方案部署链接地址，作为iframe嵌入，实现查看效果。

```ts
// 一个快速查看效果的样例，请根据自身业务进行调整
function prepareFrame(url) {
   var ifrm = document.createElement("iframe");
   ifrm.setAttribute("src", url);
   ifrm.style.width = "1280px";
   ifrm.style.height = "960px";
   document.body.appendChild(ifrm);
}
const url = 'http://localhost:8080/search?region=ap-shanghai&topicId=${TopicId}&query=123time=now-h,now'

prepareFrame(url)
```

注：
1. 目前支持手动填写cls-sdk版本号。如下例：
```ts
    // App.tsx中initSdkRunner修改为
    initSdkRunner({
        capi: CApiForward,
        config: {
          js: 'js版本号',
          css: 'css版本号',
        },
      }).then(() => forceUpdate());
```

2. 外部SDK方案不支持直接切换日志主题，建议自行将日志主题及日志集等通过组件外部方式引入。


### 以上为本地调试方法，部署参考如下：

1. 将cls-sdk-runner-verify前端项目构建物部署到对应机器；

- 进入cls-sdk-runner-verify项目根目录
- 安装pnpm，执行pnpm recursive install
- npm run build

2. iframe方式引入, src指向服务器nginx资源转发端口即可。

3.进入/capi-forword后端项目文件夹，安装依赖，main.ts中指定服务监听端口(比如3001)，将capi-forword上传至服务器指定目录，也可先上传后在linux服务器上进行相关安装依赖操作（前提是服务器需要安装nodejs），创建提供云API调用转发的服务。

4.linux安装nodejs，建议node版本8.0以上，可参考如下命令行：

```
cd /usr/local
mkdir node && cd node
wget https://nodejs.org/dist/v16.13.0/node-v16.3.0.tar.xz
# xz -d node-v16.3.0-linux-x64.tar.xz
tar -xvf node-v16.3.0-linux-x64.tar.xz
mv node-v16.3.0-linux-x64 nodejs
// 建立软连接
ln -s /usr/local/node/nodejs/bin/node /usr/local/bin/node
ln -s /usr/local/node/nodejs/bin/npm /usr/local/bin/npm
```

5.配置node环境变量

进入配置文件，进入文件末尾添加如下代码并保存：
export NODE_HOME=/usr/local/node/nodejs
export PATH=$PATH:$NODE_HOME/bin
export NODE_PATH=$NODE_HOME/lib/node_modules

```
vim /etc/profile
// 配置完成后执行
source /etc/profile
// 为保证每个账户下改配置均可用需要，在/root/.bashrc文件中添加source etc/profile
vim /root/.bashrc
```

6.安装node进程管理模块pm2

```
npm install -g pm2
// 建立pm2软连接
ln -s /usr/local/node/nodejs/bin/pm2 /usr/local/bin/pm2

// pm2常用命令
启动：pm2 start demo.js
停止：pm2 stop app_name|app_id
删除：pm2 delete app_name|app_id
重启：pm2 restart app_name|app_id
停止所有：pm2 stop all
查看所有的进程：pm2 list
查看所有的进程状态：pm2 status
查看某一个进程信息：pm2 describe app_name|app_id
```

7.上传capi-forward（**注意新建.env文件并填入secretId和secretKey（和demoPassword）**），npm build构建后进入dist文件夹，**将根目录下的.env文件复制一份到dist文件夹下**，pm2启动node服务。

```
pm2 start main.js
// 查看进程状态
pm2 ls
// 查看启动进程
ps -ef|grep node
// 杀掉进程
kill process_id
```

8.配置nginx，将cls-sdk-runner-verify前端项目的监听端口下的/capi请求转发到云转发服务的3001端口(也可根据需要设置为其他端口)，重启nginx。

9.根据前端路由，访问前端业务系统配置好的cls模块，查看嵌入的cls日志服务。

> 其他： 
>
> [定制化开发](https://github.com/TencentCloud/cls-console-sdk/blob/main/%E5%AE%9A%E5%88%B6%E5%8C%96%E5%BC%80%E5%8F%91.md)
>
> [SDK 外部调用前端模块](https://github.com/TencentCloud/cls-console-sdk/blob/main/sdk-modules/ReadMe.md)
