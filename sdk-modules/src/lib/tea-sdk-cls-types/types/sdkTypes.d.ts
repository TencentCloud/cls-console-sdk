/** 由于Duck暂时无法产出类型文件，sdkTypes.d.ts用于补充sdk中需要的类型声明。
 * 补充步骤：
 * 1. build-types后，首先复制本文件到./dts/types
 *
 * 2. 在SdkSearchPage.d.ts文件中
 *  删除语句：import Duck, { ISearchPageHideParams } from "./SdkSearchPageDuck";
 *  补充语句：import Duck, { ISdkSearchPageHideParams } from '../../../sdkTypes'
 *  替换 ISearchPageHideParams 为 ISdkSearchPageHideParams 以规避类型文件名称冲突
 */

import { DuckMap } from 'saga-duck';

export type ISdkSearchPageHideParams = Partial<{
  /**
   * hide系列参数，支持url参数控制隐藏部分内容，主要支持内嵌控制台自定义展示需求
   * hideWidget hideTopNav hideLeftNav 参数为平台提供的隐藏参数，隐藏 智能客服button、顶部导航、左侧导航
   * cls相应隐藏参数需要注意，不与平台相应参数冲突
   */
  hideWidget: boolean;
  hideTopNav: boolean;
  hideLeftNav: boolean;
  /** 隐藏cls顶部Header，包括title和地域选择 */
  hideHeader: boolean;
  /** 隐藏顶部选项菜单 */
  hideTopTips: boolean;
  /** 隐藏日志主题下拉框 */
  hideTopicSelect: boolean;
  /** 隐藏顶部按钮菜单 */
  hideConfigMenu: boolean;
  /** 隐藏原始日志下载按钮 */
  hideLogDownload: boolean;
}>;

export default DuckMap;
