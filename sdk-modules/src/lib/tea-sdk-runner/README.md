# Tea SDK Runner

Tea SDK 独立环境运行模块。

## 安装

```
npm i @tencent/tea-sdk-runner
```

## 使用

### setup

初始化运行模块。

```js
import { setup } from "@tencent/tea-sdk-runner";

setup({
  // 是否需要获取控制台地域信息
  requireRegionData: true,

  // SDK 列表
  sdks: [{
    name: "cam-sdk",
    js: "https://imgcache.qq.com/qcloud/tea/sdk/cam.zh.7539aae832.js?max_age=31536000",
    css: "https://imgcache.qq.com/qcloud/tea/sdk/cam.zh.919cfdf0e5.css?max_age=31536000"
  }],

  // 云 API 调用代理
  capi: async (body, options) => {
    console.log(body, options);
    return { Response: {} };
  },

  // 自定义模块实现
  modules: {
    "foo/bar": {
      foo: "",
      bar: () => {},
    }
  },

  // 用户信息，用于复写控制台下 `window.LOGIN_INFO`
  loginInfo: {},
});
```

### register

可在初始化后追加注册新的 SDK。

```js
import { register } from "@tencent/tea-sdk-runner";

register({
  name: "cam-sdk",
  js: "https://imgcache.qq.com/qcloud/tea/sdk/cam.zh.7539aae832.js?max_age=31536000",
  css: "https://imgcache.qq.com/qcloud/tea/sdk/cam.zh.919cfdf0e5.css?max_age=31536000"
});
```

### use

获取使用一个 SDK。

```js
import { use } from "@tencent/tea-sdk-runner";

try {
  const sdk = await use('cam-sdk');
  sdk.showBreakModal();
} catch (err) {
  console.error('加载 SDK 失败：' + err.message);
}
```

### SDKLoader

组件方式获取使用 SDK。

```js
import { SDKLoader } from "@tencent/tea-sdk-runner";
import { LoadingTip, ErrorTip } from "@tencent/tea-component";

function Page() {
  return (
    <SDKLoader
      sdkNames={["cam-sdk"]}
      loading={<LoadingTip />}
      error={(error, retry) => <ErrorTip onRetry={retry} />}
    >
      {([{ CAMBreak }]) => <CAMBreak />}
    </SDKLoader>
  );
}
```
