# CLS 控制台独立运行环境

本项目是基于 `sdk-modules` 文件夹，实现的 独立运行环境 快速体验样例。允许业务方将CLS控制台通过前端代码调用SDK集成到自身页面，使用检索分析页面和仪表盘能力。

为达成业务对权限管控、代码传参、页面集成等相关诉求，需要进行 **前端页面嵌入** 和 **后端接入层转发** 两方面逻辑的开发工作，**开发指引请参考 [独立运行环境接入文档](./sdk-modules/ReadMe.md)**。


注意：<br />
对于仅需要实现控制台免登陆访问，无需特殊权限管控的客户，为减少工作量，
推荐使用 [roleAccess 免登陆访问](https://cloud.tencent.com/document/product/614/45742)，
相关效果可参考 [演示示例](https://github.com/TencentCloud/cls-iframe-demo)。

---

以下内容是运行本项目Demo示例部分，**开发指引请参考 [独立运行环境接入文档](./sdk-modules/ReadMe.md)**。

## 演示使用前提

创建 `./capi-forward/.env` 文件, 填写[秘钥信息](https://console.cloud.tencent.com/cam/capi) 和 环境密码。
```dotenv
# 环境变量区分大小写。secretId长度为36位，secretKey长度为32位。
secretId=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
secretKey=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

<!-- 以下为可选配置： -->
# 部署在内网环境时，设置为 true
#internal=true
# 设置后支持密码鉴权，不设置则无任何鉴权
#demoPassword=123456
# 独立部署所在域名，设置后页面内所有跳转默认使用该域名
#CLS_DEPLOYMENT_HOST=clsiframe.com
# 独立部署的后端服务是否支持转发SSE云API接口
#CLS_SUPPORT_SSE=true
```

## 部署项目
### 容器化运行方案
> 从源码构建最新镜像版本 
> `docker build . --tag=cls_web`
> 
> 运行容器
> `docker run --env-file ./capi-forward/.env -p 3001:3001 cls_web`


### Node.js 运行方案
> Node版本要求 >= 20。
1. 使用 pnpm 安装依赖，版本 >= 9。
> 如未使用 pnpm，请先 [安装](https://pnpm.io/zh/installation) 。
>
> 在项目根目录执行 `pnpm install -r` 命令安装依赖。
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
完成项目运行后，可在浏览器中打开相应页面。路径地址和参数格式，与控制台保持一致

```url
# 检索分析页面：将以下网址中的 ${Region} 和 ${TopicId}，替换为对应的地域和日志主题ID，即可访问。${Query}为检索语句，可以为空。
http://localhost:3001/cls/search?region=${Region}&topic_id=${TopicId}&query=${Query}&time=now-h,now

# 检索分析页面: 将以下网址中的 ${Region} ${logset_name} ${topic_name}，替换为对应的地域、日志集名称、日志主题名称，即可访问。
http://localhost:3001/cls/search?region=${Region}&topic_name=${TopicName}&logset_name=${LogsetName}

# 仪表盘页面：将以下网址中的 ${dashboardId} 替换为仪表盘ID，即可访问。
http://localhost:3001/cls/dashboard/d?id=${dashboardId}&time=now-7d,now

# DataSight管理页：
http://localhost:3001/cls/datasight
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
const url = 'http://localhost:3001/cls/search?region=${Region}&topic_id=${TopicId}&query=${Query}&time=now-h,now'

prepareSdkFrame(url)
```
