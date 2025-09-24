import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { RestaurantProvider } from "@/contexts/RestaurantContext";
import Firstlook from "@/components/Firstlook";
import DynamicMenu from "@/components/DynamicMenu";
import NotFound from "@/components/NotFound";
import Loader from "@/components/loader";
import Feedback from "@/pages/Feedback";
import RestaurantMenuPage from "@/components/RestaurantMenuPage";
import AdminRoutes from "@/admin/routes/AdminRoutes";
import { MenuConfig } from "@/types/menu";
import { getMenuConfig } from "@/config/dynamicMenuConfig";
import LandingPage from "./pages/LandingPage";

// import { useDisableRightClick } from './hooks/useDisableRightClick';

// Valid languages
const VALID_LANGUAGES = ["ku", "ar", "en"];

// Language validation component
const ValidateLanguage = ({ children }: { children: React.ReactNode }) => {
  const { language } = useParams();

  if (!language || !VALID_LANGUAGES.includes(language)) {
    return <NotFound />;
  }

  return <>{children}</>;
};

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [menuConfig, setMenuConfig] = useState<MenuConfig | null>(null);

  useEffect(() => {
    const loadConfiguration = async () => {
      // console.log("App useEffect: Starting to load configuration");

      try {
        const config = await getMenuConfig();
        // console.log("App useEffect: Menu config loaded:", config);
        setMenuConfig(config);
      } catch (error) {
        console.error("App useEffect: Error loading configuration:", error);
      }
    };

    loadConfiguration();
  }, []);

  const handleItemClick = () => {
    // The ItemInfo modal will automatically open when an item is clicked
    // You can add any additional custom logic here if needed:
    // - Analytics tracking
    // - Custom notifications
    // - etc.
  };
  // useDisableRightClick();

  const handleInitialLoadComplete = () => {
    setIsInitialLoading(false);
  };

  return (
    <LanguageProvider>
      <ThemeProvider>
        <CartProvider>
          <AlertProvider>
            <RestaurantProvider>
              <Analytics />
              {isInitialLoading && (
                <Loader
                  onLoadComplete={handleInitialLoadComplete}
                  duration={3000}
                />
              )}

              {!isInitialLoading && (
                <Router>
                  <Routes>
                    {/* Default routes with static config */}
                    {menuConfig && (
                      <>
                        <Route path="/" element={<LandingPage />} />
                      </>
                    )}

                    {/* Catch-all for invalid static routes */}
                    <Route path="/menu/*" element={<NotFound />} />
                    <Route path="/feedback/*" element={<NotFound />} />

                    {/* Restaurant-specific routes */}
                    <Route
                      path="/:restaurantSlug"
                      element={
                        <RestaurantMenuPage>
                          <Firstlook />
                        </RestaurantMenuPage>
                      }
                    />
                    <Route
                      path="/:restaurantSlug/menu/:language"
                      element={
                        <ValidateLanguage>
                          <RestaurantMenuPage>
                            <DynamicMenu onItemClick={handleItemClick} />
                          </RestaurantMenuPage>
                        </ValidateLanguage>
                      }
                    />
                    <Route
                      path="/:restaurantSlug/feedback/:language"
                      element={
                        <ValidateLanguage>
                          <RestaurantMenuPage>
                            <Feedback />
                          </RestaurantMenuPage>
                        </ValidateLanguage>
                      }
                    />

                    {/* Catch-all for invalid restaurant routes */}
                    <Route path="/:restaurantSlug/*" element={<NotFound />} />

                    {/* General 404 page that doesn't try to load restaurant data */}
                    <Route path="/not-found" element={<NotFound />} />
                    <Route path="/404" element={<NotFound />} />

                    <Route path="/admin/*" element={<AdminRoutes />} />
                    <Route path="/*" element={<NotFound />} />
                  </Routes>
                </Router>
              )}
            </RestaurantProvider>
          </AlertProvider>
        </CartProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
