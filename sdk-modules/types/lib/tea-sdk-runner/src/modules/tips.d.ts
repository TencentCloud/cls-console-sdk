export declare const tipsModules: {
    tips: {
        tipsSDK: any;
        loadingInstance: any;
        notification(str: any, type: any, duration: any, context?: any): void;
        success(str: any, duration: any): void;
        error(str: any, duration: any, context: any): void;
        loading(str: string, duration: any): void;
        requestStart({ text }: {
            text: any;
        }): void;
        requestStop(): void;
        /**
         * 规范化 tips.error 传入的 context，避免传入非法内容
         * @param {*} obj
         */
        _validateTipsErrorContext(obj: any): any;
    };
};
