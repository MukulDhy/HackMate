
import React from 'react';
import { createRoot } from 'react-dom/client';
import { X, AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';

// Types
export interface ToastOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // 0 = no auto close
  theme?: 'dark' | 'light';
}

interface ToastComponentProps extends ToastOptions {
  onClose: () => void;
}

// Toast Component
const ToastComponent: React.FC<ToastComponentProps> = ({
  title,
  message,
  type = 'info',
  duration = 4000,
  theme = 'dark',
  onClose
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    // Show toast
    setTimeout(() => setIsVisible(true), 50);

    // Auto close
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const configs = {
    success: {
      icon: CheckCircle,
      colors: theme === 'dark' 
        ? { border: 'border-green-500/50', bg: 'from-green-600/20 to-green-700/20', progress: 'from-green-500 to-green-600' }
        : { border: 'border-green-400/60', bg: 'from-green-100 to-green-200', progress: 'from-green-400 to-green-500' }
    },
    error: {
      icon: AlertTriangle,
      colors: theme === 'dark'
        ? { border: 'border-red-500/50', bg: 'from-red-600/20 to-red-700/20', progress: 'from-red-500 to-red-600' }
        : { border: 'border-red-400/60', bg: 'from-red-100 to-red-200', progress: 'from-red-400 to-red-500' }
    },
    warning: {
      icon: AlertTriangle,
      colors: theme === 'dark'
        ? { border: 'border-yellow-500/50', bg: 'from-yellow-600/20 to-yellow-700/20', progress: 'from-yellow-500 to-yellow-600' }
        : { border: 'border-yellow-400/60', bg: 'from-yellow-100 to-yellow-200', progress: 'from-yellow-400 to-yellow-500' }
    },
    info: {
      icon: Info,
      colors: theme === 'dark'
        ? { border: 'border-blue-500/50', bg: 'from-blue-600/20 to-blue-700/20', progress: 'from-blue-500 to-blue-600' }
        : { border: 'border-blue-400/60', bg: 'from-blue-100 to-blue-200', progress: 'from-blue-400 to-blue-500' }
    }
  };

  const config = configs[type];
  const Icon = config.icon;
  const themeClasses = theme === 'dark'
    ? { bg: 'bg-gray-900/95', text: 'text-gray-300', title: 'text-white', button: 'bg-gray-700/50 hover:bg-gray-600/50', progress: 'bg-gray-800' }
    : { bg: 'bg-white/95', text: 'text-gray-700', title: 'text-gray-900', button: 'bg-gray-100 hover:bg-gray-200', progress: 'bg-gray-200' };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out w-80
        ${isVisible && !isClosing ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${themeClasses.bg} backdrop-blur-md shadow-xl ${config.colors.border}
        border-2 rounded-lg overflow-hidden relative
      `}
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      <div className="flex items-start p-3">
        <div className={`p-1.5 rounded-md bg-gradient-to-br flex-shrink-0 mr-3 ${config.colors.bg}`}>
          <Icon className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0 mr-2">
          {title && (
            <h4 className={`text-sm font-bold ${themeClasses.title} mb-1 truncate`}>
              {title}
            </h4>
          )}
          <p className={`text-xs ${themeClasses.text} leading-relaxed`}>
            {message}
          </p>
        </div>
        
        <button
          onClick={handleClose}
          className={`p-1 rounded-md transition-all duration-200 flex-shrink-0 ${themeClasses.button} hover:scale-110`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {duration > 0 && (
        <div className={`h-1 ${themeClasses.progress} overflow-hidden`}>
          <div 
            className={`h-full bg-gradient-to-r ${config.colors.progress} transition-all ease-linear`}
            style={{
              width: isVisible && !isClosing ? '0%' : '100%',
              transition: isVisible && !isClosing ? `width ${duration}ms linear` : 'none'
            }}
          />
        </div>
      )}

      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${config.colors.border} opacity-40`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${config.colors.border} opacity-40`} />
    </div>
  );
};

// Toast Manager
class ToastManager {
  private container: HTMLDivElement | null = null;
  private toasts: Map<number, { root: any; element: HTMLDivElement }> = new Map();
  private counter = 0;

  private getContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'fixed top-4 right-4 z-[9999] space-y-2';
      this.container.style.pointerEvents = 'none';
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  private createToast(options: ToastOptions) {
    const id = ++this.counter;
    const container = this.getContainer();
    
    const toastElement = document.createElement('div');
    toastElement.style.pointerEvents = 'auto';
    container.appendChild(toastElement);

    const root = createRoot(toastElement);
    
    const handleClose = () => {
      root.unmount();
      if (container.contains(toastElement)) {
        container.removeChild(toastElement);
      }
      this.toasts.delete(id);
      
      // Clean up container if empty
      if (container.children.length === 0 && document.body.contains(container)) {
        document.body.removeChild(container);
        this.container = null;
      }
    };

    root.render(React.createElement(ToastComponent, { ...options, onClose: handleClose }));
    
    this.toasts.set(id, { root, element: toastElement });
    return id;
  }

  // Public methods with default durations
  success(message: string, title?: string, duration: number = 4000) {
    return this.createToast({ message, title, type: 'success', duration });
  }

  error(message: string, title?: string, duration: number = 6000) {
    return this.createToast({ message, title, type: 'error', duration });
  }

  warning(message: string, title?: string, duration: number = 5000) {
    return this.createToast({ message, title, type: 'warning', duration });
  }

  info(message: string, title?: string, duration: number = 3000) {
    return this.createToast({ message, title, type: 'info', duration });
  }

  // Quick duration methods
  quick(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    return this.createToast({ message, type, duration: 1500 });
  }

  permanent(message: string, title?: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    return this.createToast({ message, title, type, duration: 0 });
  }

  // Custom toast with all options
  show(options: ToastOptions) {
    return this.createToast(options);
  }

  // Clear specific toast
  clear(id: number) {
    const toast = this.toasts.get(id);
    if (toast) {
      toast.root.unmount();
      if (this.container && this.container.contains(toast.element)) {
        this.container.removeChild(toast.element);
      }
      this.toasts.delete(id);
    }
  }

  // Clear all toasts
  clearAll() {
    this.toasts.forEach((toast, id) => {
      this.clear(id);
    });
  }
}

// Create singleton instance
const toast = new ToastManager();

export default toast;

// Named exports for convenience with default durations
export const showSuccess = (message: string, title?: string, duration: number = 4000) => 
  toast.success(message, title, duration);

export const showError = (message: string, title?: string, duration: number = 6000) => 
  toast.error(message, title, duration);

export const showWarning = (message: string, title?: string, duration: number = 5000) => 
  toast.warning(message, title, duration);

export const showInfo = (message: string, title?: string, duration: number = 3000) => 
  toast.info(message, title, duration);

// Quick duration helpers
export const quickToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') =>
  toast.quick(message, type);

export const permanentToast = (message: string, title?: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') =>
  toast.permanent(message, title, type);

export const clearAllToasts = () => toast.clearAll();

// ===============================
// 2. Duration Usage Examples
// ===============================

// Example 1: Using Default Durations
/*
showSuccess("Saved!");           // 4 seconds
showError("Failed!");            // 6 seconds  
showWarning("Warning!");         // 5 seconds
showInfo("Loading...");          // 3 seconds
*/

// Example 2: Custom Durations
/*
showSuccess("Quick save!", "Done", 1000);     // 1 second
showError("Critical error!", "Error", 10000); // 10 seconds
showWarning("Check this", "Warning", 0);      // Permanent (no auto-close)
showInfo("Processing...", "Wait", 30000);     // 30 seconds
*/

// Example 3: Duration Helpers
/*
import { quickToast, permanentToast } from '@/utils/toast';

quickToast("Quick message!");                    // 1.5 seconds
permanentToast("Important notice", "Alert");     // No auto-close
*/
