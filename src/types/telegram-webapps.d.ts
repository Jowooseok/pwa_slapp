// src/types/telegram-webapps.d.ts

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code: string;
    allows_write_to_pm: boolean;
  }
  
  interface TelegramInitDataUnsafe {
    user: TelegramUser;
  }
  
  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: TelegramInitDataUnsafe;
  }
  
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
  