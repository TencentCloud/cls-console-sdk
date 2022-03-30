# SDK 外部调用前端模块
负责对CLS-SDK进行包装，适用于需要对页面进行精细控制的用户，后续可单独打包为npm包进行发布。

使用方式：
1. 初始化：调用 initSdkRunner 方法，传递用户信息loginInfo与自定义接口转发方法 capi
2. React环境：在需要渲染的组件中，直接引入 SdkSearchPage 或 SdkDashboard，根据入参要求进行传参
3. 其他环境： 使用 renderSdkSearchPage 和 renderSdkDashboard 方法，直接渲染到dom节点上
