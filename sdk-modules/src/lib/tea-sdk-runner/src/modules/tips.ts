import { use } from "../sdk/use";

export const tipsModules = {
  tips: {
    tipsSDK: null,
    loadingInstance: null,
    notification: function (str, type, duration) {
      if (!str) return;

      const show = (tips) => {
        const instance = tips[type]({
          duration: duration,
          description: str,
          content: str,
        });
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
          .catch(function (_) {});
      }
    },
    success: function (str, duration) {
      return this.notification(str, 'success', duration);
    },
    error: function (str, duration) {
      return this.notification(str, 'error', duration);
    },
    loading: function (str = '正在加载...', duration) {
      return this.notification(str, 'loading', duration);
    },
    requestStart: function ({ text }) {
      return this.loading(text, 4000);
    },
    requestStop: function () {
      if (this.loadingInstance) {
        this.loadingInstance.destroy();
      }
    },
  },
};
