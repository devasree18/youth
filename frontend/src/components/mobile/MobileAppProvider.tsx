import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { WifiOff } from 'lucide-react';

export const MobileAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Configure Status Bar & hide Splash Screen when ready
    const initNativeFeatures = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#4F46E5' });
      } catch {
        // Not running on native device, ignore
      }

      try {
        await SplashScreen.hide();
      } catch {
        // Not running on native device, ignore
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
        // Network plugin not on native, fallback to window.navigator.onLine
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

  // 3. Android Hardware Back Button navigation handling
  useEffect(() => {
    let backListener: any = null;

    const setupBackButton = async () => {
      try {
        backListener = await CapApp.addListener('backButton', ({ canGoBack }) => {
          const pathname = location.pathname;
          const rootPaths = ['/dashboard', '/login', '/'];

          if (rootPaths.includes(pathname) || !canGoBack) {
            // Minimize or exit app if at root
            CapApp.minimizeApp();
          } else {
            // Navigate back within React Router
            navigate(-1);
          }
        });
      } catch {
        // Not native Android, ignore
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
    <>
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-0 left-0 right-0 z-[9999] bg-amber-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-center gap-2 shadow-md"
        >
          <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
          <span>No internet connection. Operating in offline mode.</span>
        </div>
      )}
      {children}
    </>
  );
};
