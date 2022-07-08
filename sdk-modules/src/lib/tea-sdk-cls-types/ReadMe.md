# 外部可见的 cls-sdk 类型文件

1. 请基于 @tencent/tea-sdk-cls-types 进行裁剪
2. 保留检索页和仪表盘的类型文件，其他类型文件请删除
3. 将 src 文件夹下使用到的 app 中的类型问题，移动到 `types/patch.d.ts` 文件下，详情请参考 `types/patch.d.ts` 当前内容
4. 删除 types 文件夹下除了 `src` 和 `patch.d.ts` 以外的所有文件
