import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { WifiOff, RefreshCw } from 'lucide-react';

interface BackButtonHandler {
  id: string;
  handler: () => boolean; // returns true if handled/consumed
  priority: number;
}

interface MobileAppContextType {
  isOffline: boolean;
  registerBackHandler: (id: string, handler: () => boolean, priority?: number) => () => void;
  recheckNetwork: () => Promise<void>;
}

const MobileAppContext = createContext<MobileAppContextType>({
  isOffline: false,
  registerBackHandler: () => () => {},
  recheckNetwork: async () => {},
});

export const useMobileApp = () => useContext(MobileAppContext);

export const MobileAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const backHandlersRef = useRef<BackButtonHandler[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const registerBackHandler = useCallback(
    (id: string, handler: () => boolean, priority = 10) => {
      const newEntry: BackButtonHandler = { id, handler, priority };
      backHandlersRef.current = [...backHandlersRef.current.filter((h) => h.id !== id), newEntry].sort(
        (a, b) => b.priority - a.priority
      );

      return () => {
        backHandlersRef.current = backHandlersRef.current.filter((h) => h.id !== id);
      };
    },
    []
  );

  const recheckNetwork = useCallback(async () => {
    try {
      const status = await Network.getStatus();
      setIsOffline(!status.connected);
    } catch {
      setIsOffline(!navigator.onLine);
    }
  }, []);

  useEffect(() => {
    // 1. Configure Status Bar & hide Splash Screen on native device
    const initNativeFeatures = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#4F46E5' });
      } catch {
        // Ignored on web
      }

      try {
        await SplashScreen.hide();
      } catch {
        // Ignored on web
      }
    };

    initNativeFeatures();

    // 2. Network status monitoring
    let networkListener: any = null;
    const checkNetwork = async () => {
      try {
        const status = await Network.getStatus();
        setIsOffline(!status.connected);

        networkListener = await Network.addListener('networkStatusChange', (s) => {
          setIsOffline(!s.connected);
        });
      } catch {
        // Fallback to web online/offline events
        setIsOffline(!navigator.onLine);
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    };

    checkNetwork();

    return () => {
      if (networkListener && typeof networkListener.remove === 'function') {
        networkListener.remove();
      }
    };
  }, []);

  // 3. Android Hardware Back Button navigation handling with overlay stack
  useEffect(() => {
    let backListener: any = null;

    const setupBackButton = async () => {
      try {
        backListener = await CapApp.addListener('backButton', ({ canGoBack }) => {
          // 3a. Check if any modal/drawer overlay handler consumes the back event
          if (backHandlersRef.current.length > 0) {
            for (const item of backHandlersRef.current) {
              const consumed = item.handler();
              if (consumed) {
                return;
              }
            }
          }

          // 3b. If no overlay open, check root path or navigate history
          const pathname = location.pathname;
          const rootPaths = ['/dashboard', '/login', '/'];

          if (rootPaths.includes(pathname) || !canGoBack) {
            CapApp.minimizeApp();
          } else {
            navigate(-1);
          }
        });
      } catch {
        // Ignored on web
      }
    };

    setupBackButton();

    return () => {
      if (backListener && typeof backListener.remove === 'function') {
        backListener.remove();
      }
    };
  }, [location.pathname, navigate]);

  return (
    <MobileAppContext.Provider value={{ isOffline, registerBackHandler, recheckNetwork }}>
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-0 left-0 right-0 z-[9999] bg-amber-600 text-white text-xs font-semibold px-4 py-2 pt-[calc(0.5rem+env(safe-area-inset-top,0px))] flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
            <span>No internet connection. Operating offline.</span>
          </div>
          <button
            onClick={recheckNetwork}
            className="flex items-center gap-1 bg-amber-700/80 hover:bg-amber-800 active:bg-amber-900 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      )}
      {children}
    </MobileAppContext.Provider>
  );
};
