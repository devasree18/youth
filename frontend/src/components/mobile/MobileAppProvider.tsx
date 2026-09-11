import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
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
  const locationRef = useRef(location);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

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
      if (Capacitor.isPluginAvailable('Network')) {
        const status = await Network.getStatus();
        setIsOffline(!status.connected);
      } else {
        setIsOffline(!navigator.onLine);
      }
    } catch {
      setIsOffline(!navigator.onLine);
    }
  }, []);

  // 1. Native Status Bar & Splash Screen setup
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      if (Capacitor.isPluginAvailable('StatusBar')) {
        StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
        StatusBar.setBackgroundColor({ color: '#4F46E5' }).catch(() => {});
      }
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        SplashScreen.hide().catch(() => {});
      }
    }
  }, []);

  // 2. Network monitoring: Only set offline if Network.getStatus().connected === false
  useEffect(() => {
    let isMounted = true;
    let networkHandle: { remove: () => void } | null = null;

    const initNetwork = async () => {
      if (Capacitor.isPluginAvailable('Network')) {
        try {
          const status = await Network.getStatus();
          if (isMounted) {
            setIsOffline(status ? !status.connected : false);
          }

          const handle = await Network.addListener('networkStatusChange', (s) => {
            if (isMounted) {
              setIsOffline(s ? !s.connected : false);
            }
          });

          if (isMounted) {
            networkHandle = handle;
          } else {
            handle?.remove?.();
          }
        } catch (e) {
          console.warn('Network plugin monitoring unavailable:', e);
          if (isMounted) {
            setIsOffline(!navigator.onLine);
          }
        }
      } else {
        // Fallback for web browser
        if (isMounted) setIsOffline(!navigator.onLine);
        const handleOnline = () => isMounted && setIsOffline(false);
        const handleOffline = () => isMounted && setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    };

    let webCleanup: (() => void) | undefined;
    initNetwork().then((cleanup) => {
      if (typeof cleanup === 'function') {
        webCleanup = cleanup;
      }
    });

    return () => {
      isMounted = false;
      if (networkHandle && typeof networkHandle.remove === 'function') {
        networkHandle.remove();
      }
      if (typeof webCleanup === 'function') {
        webCleanup();
      }
    };
  }, []);

  // 3. Android Hardware Back Button: single persistent listener with overlay handling
  useEffect(() => {
    let isMounted = true;
    let backHandle: { remove: () => void } | null = null;

    if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('App')) {
      CapApp.addListener('backButton', ({ canGoBack }) => {
        // 3a. Check if any active overlay / modal consumes the event
        if (backHandlersRef.current.length > 0) {
          for (const item of backHandlersRef.current) {
            try {
              const consumed = item.handler();
              if (consumed) return;
            } catch (err) {
              console.warn('Back handler error:', err);
            }
          }
        }

        // 3b. Root paths minimize app, sub-pages go back
        const currentPath = locationRef.current.pathname;
        const rootPaths = ['/dashboard', '/login', '/'];

        if (rootPaths.includes(currentPath) || !canGoBack) {
          CapApp.minimizeApp().catch(() => {});
        } else {
          window.history.back();
        }
      })
        .then((handle) => {
          if (isMounted) {
            backHandle = handle;
          } else {
            handle?.remove?.();
          }
        })
        .catch((err) => {
          console.warn('App backButton listener setup error:', err);
        });
    }

    return () => {
      isMounted = false;
      if (backHandle && typeof backHandle.remove === 'function') {
        backHandle.remove();
      }
    };
  }, []);

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
