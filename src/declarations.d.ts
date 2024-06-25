// declarations.d.ts
declare module "react-qr-scanner" {
  import { Component } from "react";

  interface QrScannerProps {
    delay?: number;
    onError?: (error: any) => void;
    onScan?: (data: string | null) => void;
    style?: React.CSSProperties;
    constraints?: MediaTrackConstraints; // constraints 속성 추가
  }

  class QrScanner extends Component<QrScannerProps> {}

  export default QrScanner;
}
