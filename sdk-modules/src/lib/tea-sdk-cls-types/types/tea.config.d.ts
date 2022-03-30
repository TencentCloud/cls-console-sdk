export namespace buffet {
  const productId: number;
  const routes: string;
  const css: string[];
}
export namespace intl {
  const id: number;
  const token: string;
}
export namespace command {
  namespace dev {
    const lang: string;
    const port: number;
  }
  namespace scan {
    const input: string[];
  }
}
export function webpack(
  config: any,
  {
    MiniCssExtractPlugin,
  }: {
    MiniCssExtractPlugin: any;
  }
): any;
export const allowTsInNodeModules: boolean;
