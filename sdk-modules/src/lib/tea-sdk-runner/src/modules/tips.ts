import { isNull, isObject } from 'lodash-es';

import { use } from '../sdk';

export const tipsModules = {
  tips: {
    tipsSDK: null,
    loadingInstance: null,
    notification(str, type, duration, context?) {
      if (!str) return;

      const show = (tips) => {
        let instance;
        const options = {
          duration,
          description: str,
          content: str,
        };
        if (type === 'error' && context) {
          // menus-sdk 已补充了 path、lid、uin、ownerUin 等基本信息
          instance = tips[type](options, context);
        } else {
          instance = tips[type](options);
        }
        if (type === 'loading') {
          this.loadingInstance = instance;
        }
      };

      if (this.tipsSDK) {
        show(this.tipsSDK);
      } else {
        use('menus-sdk')
          .then((menusSdk) => {
            if (menusSdk.tips) {
              this.tipsSDK = menusSdk.tips;
              return show(menusSdk.tips);
            }
          })
          .catch(() => {});
      }
    },
    success(str, duration) {
      return this.notification(str, 'success', duration);
    },
    error(str, duration, context) {
      if (str && typeof str === 'object') {
        str = str.message || str.msg || str;
      }

      if (str && typeof str === 'string') {
        context = this._validateTipsErrorContext(context);
        return this.notification(str, 'error', duration, context);
      }
      console.warn('tips.error with invalid str');
      return;
    },
    loading(str = '正在加载...', duration) {
      return this.notification(str, 'loading', duration);
    },
    requestStart({ text }) {
      return this.loading(text, 4000);
    },
    requestStop() {
      if (this.loadingInstance) {
        this.loadingInstance.destroy();
      }
    },

    /**
     * 规范化 tips.error 传入的 context，避免传入非法内容
     * @param {*} obj
     */
    _validateTipsErrorContext(obj) {
      if (isNull(obj)) return obj;
      if (!isObject(obj)) return undefined;

      const output = Object.create(null);

      for (const key in obj) {
        const value = obj[key];
        switch (key) {
          case 'service':
          case 'action':
          case 'errorCode':
          case 'reqId':
          case 'exReqId':
          case 'capiRequestId': {
            if (typeof value === 'string') {
              output[key] = value.slice(0, 50);
            }
            break;
          }
          case 'reason': {
            if (typeof value === 'string') {
              output[key] = value.slice(0, 100);
            }
            break;
          }

          case 'cost': {
            if (typeof value === 'number') {
              output[key] = value;
            }
            break;
          }

          case 'exUrl':
            output[key] = value;
            break;

          default:
            break;
        }
      }
      return output;
    },
  },
};
