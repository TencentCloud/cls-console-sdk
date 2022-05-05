# CLS 控制台独立运行环境

本项目是基于 `sdk-modules` 文件夹，实现的 独立运行环境 快速体验样例。允许业务方将CLS控制台集成到自身页面，使用检索分析页面和仪表盘能力。

为达成业务对权限管控和页面集成的相关诉求，需要进行前端页面嵌入 和 后端接入层转发 逻辑的开发工作，详情请参考 [独立运行环境接入文档](https://github.com/TencentCloud/cls-console-sdk/blob/main/sdk-modules/%E5%AE%9A%E5%88%B6%E5%8C%96%E5%BC%80%E5%8F%91.md)。



注意：<br />
对于仅需要实现控制台免登陆访问，无需特殊权限管控的客户，为减少工作量，
推荐使用 [roleAccess 免登陆访问](https://cloud.tencent.com/document/product/614/45742)，
相关效果可参考 [演示示例](https://github.com/TencentCloud/cls-iframe-demo)。

## 演示使用前提

创建 `./capi-forward/.env` 文件, 填写[秘钥信息](https://console.cloud.tencent.com/cam/capi) 和 环境密码。
```dotenv
# 环境变量区分大小写。secretId长度为36位，secretKey长度为32位。
secretId=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
secretKey=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# 设置后支持密码鉴权，不设置则无任何鉴权
demoPassword=123456
```

## 部署项目
### 容器化运行方案
> 从源码构建最新镜像版本 
> `docker build . --tag=cls_web`
> 
> 运行容器
> `docker run --env-file ./capi-forward/.env -p 3001:3001 cls_web`


### Node.js 运行方案
1. 使用 pnpm 安装依赖。
> 如未使用 pnpm，请先 [安装](https://pnpm.io/zh/installation) 。
>
> 在项目根目录执行 `pnpm recursive install --frozen-lockfile=true` 命令安装依赖。
> 
> 如遇到安装出错，请在项目根目录运行 `find . -name "node_modules" -type d -exec rm -rf '{}' +` 命令后重新进行安装。 

2. 项目构建与运行
> 在项目根目录运行 `npm run build` 完成项目构建。
>
> 在项目根目录运行 `npm run serve` 启动项目。（用户可自行使用 PM2 等工具进行任务管理）
>
> 注意：修改代码后需要重新进行构建


## SDK控制台使用
### 浏览器直接访问
完成项目运行后，可在浏览器中打开相应页面。

```url
# 检索分析页面：将以下网址中的 ${Region} 和 ${TopicId}，替换为对应的地域和日志主题ID，即可访问。${Query}为检索语句，可以为空。
http://localhost:3001/search?region=${Region}&topic_id=${TopicId}&query=${Query}&time=now-h,now

# 检索分析页面: 将以下网址中的 ${Region} ${logset_name} ${topic_name}，替换为对应的地域、日志集名称、日志主题名称，即可访问。
http://localhost:3001/search?region=${Region}&topic_name=${TopicName}&logset_name=${LogsetName}

# 仪表盘页面：将以下网址中的 ${dashboardId} 替换为仪表盘ID，即可访问。
http://localhost:3001/dashboard?id=${dashboardId}&time=now-7d,now
```
地域参数格式为`ap-shanghai`, 检索页面参数设置请参考[检索页面参数设置](https://cloud.tencent.com/document/product/614/39331)


### 使用iframe方式引入内嵌控制台
在业务内部系统中，直接将此SDK控制台页面，作为iframe嵌入，通过路由参数完成与其他页面的结合
```typescript
// 一个快速查看效果的样例，请根据自身业务进行调整
function prepareSdkFrame(url) {
   var ifrm = document.createElement("iframe");
   ifrm.setAttribute("src", url);
   ifrm.style.width = "1280px";
   ifrm.style.height = "960px";
   document.body.appendChild(ifrm);
}
const url = 'http://localhost:3001/search?region=${Region}&topic_id=${TopicId}&query=${Query}&time=now-h,now'

prepareSdkFrame(url)
```
