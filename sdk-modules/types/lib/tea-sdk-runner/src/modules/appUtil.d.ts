export declare const appUtil: {
    setRegionId(rid: number): void;
    getRegionId(): number;
    setProjectId(pid: any): void;
    getProjectId(skipAll: boolean): number;
    ipToUint(ip: string): number;
    isValidCIDR(ip: string, maskLen: number): boolean;
    getRegionOrderHackObj(obj?: {}): {};
};
export declare const appUtilModules: {
    'lib/appUtil': {
        setRegionId(rid: number): void;
        getRegionId(): number;
        setProjectId(pid: any): void;
        getProjectId(skipAll: boolean): number;
        ipToUint(ip: string): number;
        isValidCIDR(ip: string, maskLen: number): boolean;
        getRegionOrderHackObj(obj?: {}): {};
    };
    appUtil: {
        setRegionId(rid: number): void;
        getRegionId(): number;
        setProjectId(pid: any): void;
        getProjectId(skipAll: boolean): number;
        ipToUint(ip: string): number;
        isValidCIDR(ip: string, maskLen: number): boolean;
        getRegionOrderHackObj(obj?: {}): {};
    };
};
