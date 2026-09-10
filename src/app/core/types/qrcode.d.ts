declare module 'qrcode' {
  type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

  interface Options {
    errorCorrectionLevel?: ErrorCorrectionLevel;
    margin?: number;
    width?: number;
    color?: { dark?: string; light?: string };
    type?: 'svg';
  }

  const QRCode: {
    toDataURL(text: string, options?: Options): Promise<string>;
    toString(text: string, options: Options): Promise<string>;
  };

  export default QRCode;
}
