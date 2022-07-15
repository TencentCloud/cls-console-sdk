# 开发指引

分别启动前后端项目

```sh
npm run dev
cd ./capi-forward
npm run dev
```


配置whistle规则

```whistle
clsiframe.com/user http://localhost:3001/user
clsiframe.com/forward http://localhost:3001/forward
clsiframe.com http://localhost:8080/
```
