interface PlugAgent {
    getPrincipal: () => Promise<import('@dfinity/principal').Principal>;
  }
  
  interface Plug {
    agent: PlugAgent;
    isConnected: () => Promise<boolean>;
    requestConnect: () => Promise<void>;
  }
  
  interface Window {
    ic?: {
      plug?: Plug;
    };
    ethereum?: {
      isMetaMask?: boolean;
      request?: (request: { method: string; params?: Array<any> }) => Promise<any>;
      on?: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener?: (eventName: string, callback: (...args: any[]) => void) => void;
    };
  }
  