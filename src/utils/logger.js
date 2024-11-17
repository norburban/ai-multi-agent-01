// Centralized logging utility
const isDevelopment = import.meta.env.DEV;

class Logger {
  static error(message, error) {
    if (isDevelopment) {
      console.error(message, error);
    }
  }

  static warn(message, data) {
    if (isDevelopment) {
      console.warn(message, data);
    }
  }

  static info(message, data) {
    // Only log info in development if explicitly enabled
    if (isDevelopment && import.meta.env.VITE_ENABLE_INFO_LOGS === 'true') {
      console.log(message, data);
    }
  }
}

export default Logger;
