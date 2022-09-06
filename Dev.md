# 开发指引

分别启动前后端项目

```sh
npm run dev
cd ./capi-forward
npm run dev
```


配置whistle规则

```whistle
# CLS 外部SDK
clsiframe.com/clsApi/user http://localhost:3001/clsApi/user
clsiframe.com/clsApi/forward http://localhost:3001/clsApi/forward
clsiframe.com http://localhost:8080
```
