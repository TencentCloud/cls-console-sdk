# SDK 外部调用前端模块
负责对 CLS-SDK 进行包装，用于在非腾讯云控制台环境渲染 CLS-SDK 内容。

使用方式：
1. 初始化：调用 initSdkRunner 方法，传递自定义接口转发方法 capi
2. React环境：在需要渲染的组件中，直接引入 SdkSearchPage 或 SdkDashboard，根据入参要求进行传参
3. 其他环境： 使用 renderSdkSearchPage 和 renderSdkDashboard 方法，直接渲染到dom节点上



# 业务方包装二次开发
对于需要将页面，深度集成到自有业务的系统，可进行二次开发，以此获得更佳体验。
此方式接入复杂，需要相当的人力开发，推荐直接使用SDK项目整体包装方案。

## 后端部分
目标：参考[capi-forward](../capi-forward)文件夹，创建一个提供云API调用转发的服务（也可直接在原有后端服务中集成）

1. 参考[AppService](../capi-forward/src/app.service.ts)中内容，实现 doCApiRequest 方法，返回指定参数格式的内容（格式为 {Response: ...} 对象 ）。

   当前项目使用了腾讯云Nodejs SDK 中的 doRequestWithSign3 方法，处理接口的请求签名生成。

   其他语言实现过程可使用 [腾讯云SDK介绍](https://cloud.tencent.com/document/sdk/Description) 完成对应的签名行为。

2. 业务后端可在 doCApiRequest 函数之前，加入业务本身使用的鉴权中间件，保证用户身份合法（如使用oa鉴权验证 ）

## 前端部分
目标：调用 CLS-SDK, 在业务内部页面中，渲染相关内容。
1. 进入文件夹 sdk-modules，执行 `npm run build`, 构建出用于独立使用的js包。（不含React）

2. 参考 [src/App.tsx](../src/App.tsx) 内容，进行 `initSdkRunner` 调用。参数capi负责将SDK内部请求，转发到业务实现的后端服务。

3. 使用 `window.TeaSDKRunner` 判断SDK初始化完成状态，当初始化完成后，可进行SDK内组件渲染。

4. 参考 [src/pages/Search.tsx](../src/pages/Search.tsx) 逻辑，使用sdk-modules包中的检索页组件，并自行处理页面路由、Topic选择器等功能。

5. 在业务使用方，主动引入 `sdk-modules/lib/tea.css` 文件（主要负责reset全局样式逻辑），缺少样式引入可能导致部分布局内容展示异常。

6. 在业务使用方，主动引入`src/polyfill.ts`文件并安装`regenerator-runtime`依赖，缺少可能导致页面无法渲染。

## 其他

自定义开发时，实现 capi 方法可参考 [src/utils/capi.ts](../src/utils/capi.ts) 文件内容。

如果业务系统使用的是js代码，可考虑在仓库根目录执行 `tsc -p tsconfig-js.json` 命令，可在jsSrc文件夹中获取到源码的js版本内容，并修改引入到业务方代码中。
