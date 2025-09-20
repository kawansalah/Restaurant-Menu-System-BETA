import React, { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useRestaurantOptional } from "@/contexts/RestaurantContext";
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";
import darkLogo from "@/assets/logo/dark.svg";
import lightLogo from "@/assets/logo/light.svg";
import kawanLogo from "@/assets/logo/kawan.svg";
import kawanLogoDark from "@/assets/logo/kawan-dark.png";
import codeLightIcon from "@/assets/icons/code-light.svg";
import codeDarkIcon from "@/assets/icons/code-dark.svg";

interface FooterProps {
  className?: string;
}

interface LocalizedText {
  ku: string;
  ar: string;
  en: string;
}

// Social Media Icons Components
const FacebookIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    version="1.1"
    id="Icons"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 32 32"
    xmlSpace="preserve"
    fill="#000000"
    className={className}
    aria-hidden="true"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <style type="text/css">{`.st0{fill:#FFFFFF;} .st1{fill:#3A559F;}`}</style>
      <path
        className="st1"
        d="M23,0H9C4,0,0,4,0,9v14c0,5,4,9,9,9h14c5,0,9-4,9-9V9C32,4,28,0,23,0z"
      ></path>
      <path
        className="st0"
        d="M26.8,15.4C26.6,15.2,26.3,15,26,15h-5v-3.8c0-0.1,0.1-0.2,0.2-0.2H25c0.6,0,1-0.4,1-1V7c0-0.6-0.4-1-1-1h-4 c-3.3,0-5,2.7-5,6v3h-4c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h4v12h5V20h3c0.4,0,0.8-0.2,0.9-0.6l2-3C27.1,16.1,27,15.7,26.8,15.4z"
      ></path>
    </g>
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    width="3365"
    height="3365"
    viewBox="0 0 3365 3365"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <g clipPath="url(#clip0_3248_254)">
      <rect
        width="3364.7"
        height="3364.7"
        rx="1000"
        fill="url(#paint0_radial_3248_254)"
      />
      <path
        d="M853.2 3352.8C653.1 3343.7 544.4 3310.4 472.1 3282.2C376.3 3244.9 308 3200.5 236.1 3128.7C164.2 3056.9 119.7 2988.6 82.6 2892.8C54.4 2820.5 21.1 2711.8 12 2511.7C2 2295.4 0 2230.5 0 1682.5C0 1134.5 2.2 1069.7 11.9 853.2C21 653.1 54.5 544.6 82.5 472.1C119.8 376.3 164.3 308 236 236C307.8 164.2 376.1 119.6 472 82.5C544.3 54.3 653 21 853.1 11.9C1069.5 2 1134.5 0 1682.3 0C2230.3 0 2295.1 2.2 2511.6 11.9C2711.7 21 2820.2 54.5 2892.7 82.5C2988.5 119.6 3056.8 164.2 3128.7 236C3200.6 307.8 3244.9 376.2 3282.2 472C3310.4 544.3 3343.7 653 3352.8 853.1C3362.7 1069.6 3364.7 1134.4 3364.7 1682.4C3364.7 2230.2 3362.7 2295.2 3352.8 2511.7C3343.7 2711.8 3310.2 2820.5 3282.2 2892.8C3244.9 2988.6 3200.5 3056.9 3128.7 3128.7C3056.9 3200.5 2988.5 3244.9 2892.7 3282.2C2820.4 3310.4 2711.7 3343.7 2511.6 3352.8C2295.3 3362.7 2230.3 3364.7 1682.3 3364.7C1134.5 3364.7 1069.5 3362.8 853.2 3352.8Z"
        fill="url(#paint1_radial_3248_254)"
      />
      <path
        d="M1265.4 1682C1265.4 1451.89 1451.89 1265.3 1682 1265.3C1912.11 1265.3 2098.7 1451.89 2098.7 1682C2098.7 1912.11 1912.11 2098.7 1682 2098.7C1451.89 2098.7 1265.4 1912.11 1265.4 1682ZM1040.14 1682C1040.14 2036.5 1327.5 2323.86 1682 2323.86C2036.5 2323.86 2323.86 2036.5 2323.86 1682C2323.86 1327.5 2036.5 1040.14 1682 1040.14C1327.5 1040.14 1040.15 1327.48 1040.15 1682M2199.28 1014.69C2199.27 1044.36 2208.05 1073.36 2224.53 1098.04C2241 1122.71 2264.42 1141.94 2291.82 1153.31C2319.23 1164.67 2349.39 1167.66 2378.48 1161.88C2407.58 1156.1 2434.32 1141.83 2455.3 1120.86C2476.29 1099.89 2490.59 1073.17 2496.39 1044.07C2502.19 1014.98 2499.23 984.816 2487.88 957.403C2476.54 929.989 2457.33 906.555 2432.67 890.063C2408 873.571 2379.01 864.762 2349.34 864.75H2349.28C2309.51 864.769 2271.38 880.57 2243.26 908.683C2215.13 936.797 2199.31 974.924 2199.28 1014.69ZM1177 2699.48C1055.13 2693.93 988.89 2673.63 944.87 2656.48C886.51 2633.76 844.87 2606.7 801.09 2562.98C757.31 2519.26 730.21 2477.66 707.59 2419.3C690.43 2375.3 670.13 2309.04 664.59 2187.17C658.53 2055.41 657.32 2015.83 657.32 1682.02C657.32 1348.21 658.63 1308.74 664.59 1176.87C670.14 1055 690.59 988.87 707.59 944.74C730.31 886.38 757.37 844.74 801.09 800.96C844.81 757.18 886.41 730.08 944.87 707.46C988.87 690.3 1055.13 670 1177 664.46C1308.76 658.4 1348.34 657.19 1682 657.19C2015.66 657.19 2055.28 658.48 2187.15 664.48C2309.02 670.03 2375.15 690.48 2419.28 707.48C2477.64 730.1 2519.28 757.26 2563.06 800.98C2606.84 844.7 2633.84 886.4 2656.56 944.76C2673.72 988.76 2694.02 1055.02 2699.56 1176.89C2705.62 1308.76 2706.83 1348.23 2706.83 1682.04C2706.83 2015.85 2705.62 2055.32 2699.56 2187.19C2694.01 2309.06 2673.61 2375.3 2656.56 2419.32C2633.84 2477.68 2606.78 2519.32 2563.06 2563C2519.34 2606.68 2477.64 2633.78 2419.28 2656.5C2375.28 2673.66 2309.02 2693.96 2187.15 2699.5C2055.39 2705.56 2015.81 2706.77 1682 2706.77C1348.19 2706.77 1308.72 2705.56 1177 2699.5M1166.65 439.57C1033.58 445.63 942.65 466.73 863.24 497.63C781.05 529.54 711.38 572.35 641.81 641.81C572.24 711.27 529.54 780.95 497.63 863.24C466.73 942.7 445.63 1033.58 439.57 1166.65C433.41 1299.93 432 1342.54 432 1682C432 2021.46 433.41 2064.07 439.57 2197.35C445.63 2330.43 466.73 2421.3 497.63 2500.76C529.54 2582.95 572.25 2652.76 641.81 2722.19C711.37 2791.62 780.95 2834.37 863.24 2866.37C942.8 2897.27 1033.58 2918.37 1166.65 2924.43C1300 2930.49 1342.54 2932 1682 2932C2021.46 2932 2064.07 2930.59 2197.35 2924.43C2330.43 2918.37 2421.3 2897.27 2500.76 2866.37C2582.95 2834.37 2652.62 2791.65 2722.19 2722.19C2791.76 2652.73 2834.37 2582.95 2866.37 2500.76C2897.27 2421.3 2918.47 2330.42 2924.43 2197.35C2930.49 2063.97 2931.9 2021.46 2931.9 1682C2931.9 1342.54 2930.49 1299.93 2924.43 1166.65C2918.37 1033.57 2897.27 942.65 2866.37 863.24C2834.37 781.05 2791.65 711.38 2722.19 641.81C2652.73 572.24 2582.95 529.54 2500.86 497.63C2421.3 466.73 2330.42 445.53 2197.45 439.57C2064.15 433.48 2021.56 432 1682.15 432C1342.74 432 1300.05 433.41 1166.7 439.57"
        fill="white"
      />
    </g>
    <defs>
      <radialGradient
        id="paint0_radial_3248_254"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(217.76 3290.99) scale(4271.92)"
      >
        <stop offset="0.09" stopColor="#FA8F21" />
        <stop offset="0.78" stopColor="#D82D7E" />
      </radialGradient>
      <radialGradient
        id="paint1_radial_3248_254"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(2330.61 3182.95) scale(3759.33)"
      >
        <stop offset="0.64" stopColor="#8C3AAA" stopOpacity="0" />
        <stop offset="1" stopColor="#8C3AAA" />
      </radialGradient>
      <clipPath id="clip0_3248_254">
        <rect width="3364.7" height="3364.7" rx="1000" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    width="3365"
    height="3365"
    viewBox="0 0 3365 3365"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="3364.7" height="3364.7" rx="1000" fill="#0A66C2" />
    <rect
      x="561.003"
      y="561.006"
      width="2241.19"
      height="2241.19"
      fill="white"
    />
    <path
      d="M2591.08 2591.09H2208.52V1991.85C2208.52 1848.97 2205.93 1665.01 2009.49 1665.01C1810.24 1665.01 1779.69 1820.79 1779.69 1981.3V2591.09H1397.12V1358.82H1764.41V1527.3H1769.57C1844.45 1399.49 1983.88 1322.89 2131.92 1328.27C2519.65 1328.27 2591.3 1583.24 2591.3 1915.25L2591.08 2590.87V2591.09ZM965.496 1190.35C906.728 1190.07 850.445 1166.61 808.869 1125.07C767.293 1083.54 743.783 1027.28 743.443 968.511C743.443 846.727 843.711 746.459 965.496 746.459C1087.28 746.459 1187.33 846.727 1187.55 968.511C1187.55 1090.3 1087.28 1190.35 965.496 1190.35ZM1156.78 2591.09H773.782V1358.82H1156.78V2591.09ZM2781.5 391.003H581.423C531.536 390.713 483.551 410.123 447.895 445.014C412.239 479.904 391.793 527.457 391 577.338V2786.67C391.793 2836.55 412.239 2884.11 447.895 2919C483.551 2953.89 531.536 2973.3 581.423 2973.01H2781.72C2831.72 2973.41 2879.86 2954.07 2915.68 2919.18C2951.5 2884.28 2972.1 2836.67 2973 2786.67V577.123C2972.1 527.167 2951.48 479.594 2915.65 444.771C2879.82 409.948 2831.68 390.699 2781.72 391.218L2781.5 391.003Z"
      fill="#0A66C2"
    />
  </svg>
);
const LocationIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M20.6211 8.45C19.5711 3.83 15.5411 1.75 12.0011 1.75C12.0011 1.75 12.0011 1.75 11.9911 1.75C8.46107 1.75 4.42107 3.82 3.37107 8.44C2.20107 13.6 5.36107 17.97 8.22107 20.72C9.28107 21.74 10.6411 22.25 12.0011 22.25C13.3611 22.25 14.7211 21.74 15.7711 20.72C18.6311 17.97 21.7911 13.61 20.6211 8.45ZM12.0011 13.46C10.2611 13.46 8.85107 12.05 8.85107 10.31C8.85107 8.57 10.2611 7.16 12.0011 7.16C13.7411 7.16 15.1511 8.57 15.1511 10.31C15.1511 12.05 13.7411 13.46 12.0011 13.46Z"
        fill="#B6934B"
      />
    </g>
  </svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    version="1.1"
    id="Icons"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 32 32"
    xmlSpace="preserve"
    fill="#000000"
    className={className}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <style type="text/css">{`.st0{fill:#FFFFFF;} .st8{fill:#25D366;}`}</style>
      <path
        className="st8"
        d="M17,0C8.7,0,2,6.7,2,15c0,3.4,1.1,6.6,3.2,9.2l-2.1,6.4c-0.1,0.4,0,0.8,0.3,1.1C3.5,31.9,3.8,32,4,32 c0.1,0,0.3,0,0.4-0.1l6.9-3.1C13.1,29.6,15,30,17,30c8.3,0,15-6.7,15-15S25.3,0,17,0z"
      ></path>
      <path
        className="st0"
        d="M25.7,20.5c-0.4,1.2-1.9,2.2-3.2,2.4C22.2,23,21.9,23,21.5,23c-0.8,0-2-0.2-4.1-1.1c-2.4-1-4.8-3.1-6.7-5.8 L10.7,16C10.1,15.1,9,13.4,9,11.6c0-2.2,1.1-3.3,1.5-3.8c0.5-0.5,1.2-0.8,2-0.8c0.2,0,0.3,0,0.5,0c0.7,0,1.2,0.2,1.7,1.2l0.4,0.8 c0.3,0.8,0.7,1.7,0.8,1.8c0.3,0.6,0.3,1.1,0,1.6c-0.1,0.3-0.3,0.5-0.5,0.7c-0.1,0.2-0.2,0.3-0.3,0.3c-0.1,0.1-0.1,0.1-0.2,0.2 c0.3,0.5,0.9,1.4,1.7,2.1c1.2,1.1,2.1,1.4,2.6,1.6l0,0c0.2-0.2,0.4-0.6,0.7-0.9l0.1-0.2c0.5-0.7,1.3-0.9,2.1-0.6 c0.4,0.2,2.6,1.2,2.6,1.2l0.2,0.1c0.3,0.2,0.7,0.3,0.9,0.7C26.2,18.5,25.9,19.8,25.7,20.5z"
      ></path>
    </g>
  </svg>
);

const LightCode: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => <img src={codeLightIcon} alt="Code" className={className} />;

// Sub-components
const RestaurantBranding: React.FC<{
  language: string;
  themeClasses: any;
  config: any;
  footerText: any;
}> = ({ language, themeClasses, config, footerText }) => (
  <div className="text-center mb-12">
    <div
      className={`inline-flex items-center justify-center w-60 h-60 rounded-full mb-6 ${themeClasses.topbarShadowStyle} border-2 ${themeClasses.borderCategory}`}
    >
      <img
        src={
          themeClasses.isDark
            ? config.logo?.dark || darkLogo
            : config.logo?.light || lightLogo
        }
        alt={`${
          footerText.restaurantSystem[language as keyof LocalizedText]
        } logo`}
        className="w-[70%] h-[70%] object-contain"
      />
    </div>
    <h2
      className={`text-2xl md:text-3xl font-bold ${
        themeClasses.isDark
          ? themeClasses.buttonTextPrimary
          : themeClasses.textPrimary
      } mb-2`}
    >
      {footerText.restaurantSystem[language as keyof LocalizedText]}
    </h2>
    <p
      className={`text-lg ${
        themeClasses.isDark
          ? themeClasses.textTertiary
          : themeClasses.textSecondary
      } max-w-2xl mx-auto font-normal`}
    >
      {footerText.poweredBy[language as keyof LocalizedText]}
    </p>
  </div>
);

const SocialMediaSection: React.FC<{
  language: string;
  themeClasses: any;
  socialLinks: any[];
  footerText: any;
}> = ({ language, themeClasses, socialLinks, footerText }) => (
  <div
    className={`${themeClasses.bgSecondary} border ${themeClasses.borderCategory} rounded-3xl p-6 md:p-8 ${themeClasses.topbarShadowStyle} flex flex-col items-center justify-center`}
  >
    <h3
      className={`text-lg font-bold ${
        themeClasses.isDark
          ? themeClasses.buttonTextPrimary
          : themeClasses.textSecondary
      } mb-6 text-center`}
    >
      {footerText.connectWithUs[language as keyof LocalizedText]}
    </h3>
    <div
      className="flex gap-4 justify-center"
      role="list"
      aria-label="Social media links"
    >
      {socialLinks.map((social) => {
        const IconComponent = social.icon;
        return (
          <button
            key={social.name}
            onClick={() => window.open(social.url, "_blank")}
            className={`group flex items-center justify-center w-14 h-14 ${themeClasses.bgCard} ${themeClasses.borderCategory} border-2 rounded-full hover:${themeClasses.bgMain} hover:translate-y-[2px] transition-all duration-300 shadow-[0px_6px_0px_0px_var(--category-stroke)] hover:shadow-[var(--social-shadow-button-hover)] ${themeClasses.textSecondary} hover:${themeClasses.buttonTextPrimary} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--main-stroke)] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_var(--category-stroke)] cursor-pointer`}
            aria-label={`Follow us on ${
              social.label[language as keyof LocalizedText]
            }`}
            role="listitem"
          >
            <div className="group-hover:scale-110 transition-transform duration-300">
              <IconComponent />
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

const CopyrightSection: React.FC<{
  language: string;
  themeClasses: any;
  currentYear: number;
  footerText: any;
}> = ({ language, themeClasses, currentYear, footerText }) => (
  <div
    className={`${themeClasses.bgSecondary} h-full border ${themeClasses.borderCategory} rounded-3xl p-6 md:p-8 ${themeClasses.topbarShadowStyle} text-center flex flex-col items-center justify-center`}
  >
    <p className={`${themeClasses.textSecondary} text-base mb-2`}>
      © {currentYear}{" "}
      {footerText.restaurantSystem[language as keyof LocalizedText]}
    </p>
    <p className={`${themeClasses.textSecondary} text-base`}>
      {footerText.allRightsReserved[language as keyof LocalizedText]}
    </p>
  </div>
);

const DeveloperSection: React.FC<{
  language: string;
  themeClasses: any;
  footerText: any;
}> = ({ language, themeClasses, footerText }) => (
  <div
    className={`${themeClasses.bgSecondary} border ${themeClasses.borderCategory} rounded-3xl p-6 md:p-8 ${themeClasses.topbarShadowStyle} flex flex-col items-center justify-center`}
  >
    {/* Logo and Developer Info */}
    <div className="flex flex-col items-center gap-6 mb-6">
      {/* Logo Container */}
      <div className="group/logo flex flex-col items-center gap-3">
        <div
          className={`relative w-16 h-16 md:w-20 md:h-20 ${themeClasses.bgCard} rounded-2xl p-2 md:p-3 border-2 ${themeClasses.borderCategory} shadow-[0px_6px_0px_0px_var(--category-stroke)] group-hover/logo:shadow-[var(--social-shadow-button-hover)] group-hover/logo:translate-y-[2px] transition-all duration-300`}
        >
          <img
            src={themeClasses.isDark ? kawanLogo : kawanLogoDark}
            alt="Kawan Salahadin Logo"
            className="w-full h-full object-contain group-hover/logo:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Animated underline */}
        <div
          className={`h-0.5 w-12 ${themeClasses.bgMain} rounded-full transform scale-x-0 group-hover/logo:scale-x-100 transition-transform duration-300 origin-center`}
        ></div>
      </div>

      {/* Developer Information */}
      <div className="text-center space-y-2">
        <p
          className={`text-base font-medium ${themeClasses.textSecondary} uppercase tracking-wide`}
        >
          {footerText.developedBy[language as keyof LocalizedText]}
        </p>
        <h3
          className={`text-xl md:text-2xl font-bold ${
            themeClasses.isDark
              ? themeClasses.buttonTextPrimary
              : themeClasses.textPrimary
          }`}
        >
          Kawan Salahadin
        </h3>
        <p className={`text-base ${themeClasses.textSecondary} font-medium`}>
          Full-Stack Developer
        </p>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
      {/* Portfolio Button */}
      <button
        onClick={() => window.open("https://www.kawansalahadin.dev", "_blank")}
        className={`group flex items-center justify-center gap-2 ${
          themeClasses.bgMain
        } ${
          themeClasses.isDark
            ? themeClasses.buttonTextPrimary
            : themeClasses.buttonTextPrimary
        } px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 hover:translate-y-[2px] transition-all duration-300 ${
          themeClasses.buttonShadowPrimary
        } ${
          themeClasses.buttonShadowPrimaryHover
        } focus:outline-none active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_var(--category-stroke)] cursor-pointer flex-1`}
        aria-label="Visit Kawan Salahadin's portfolio website"
      >
        <div className="group-hover:scale-110 transition-transform duration-300">
          {themeClasses.isDark ? <LightCode /> : <LightCode />}
        </div>
        <span>Portfolio</span>
      </button>

      {/* Phone Button */}
      <button
        onClick={() => window.open("tel:+9647706673769", "_self")}
        className={`group flex items-center justify-center gap-2 ${themeClasses.bgCard} ${themeClasses.borderCategory} border-2 ${themeClasses.textSecondary} hover:${themeClasses.bgMain} hover:${themeClasses.buttonTextPrimary} px-6 py-3 rounded-full font-bold text-sm hover:translate-y-[2px] transition-all duration-300 shadow-[0px_6px_0px_0px_var(--category-stroke)] hover:shadow-[var(--social-shadow-button-hover)] focus:outline-none active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_var(--category-stroke)] cursor-pointer flex-1`}
        aria-label="Call Kawan Salahadin at +9647706673769"
      >
        <div className="group-hover:scale-110 transition-transform duration-300">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path
              d="M10.0376 5.31617L10.6866 6.4791C11.2723 7.52858 11.0372 8.90532 10.1147 9.8278C10.1147 9.8278 10.1147 9.8278 10.1147 9.8278C10.1146 9.82792 8.99588 10.9468 11.0245 12.9755C13.0525 15.0035 14.1714 13.8861 14.1722 13.8853C14.1722 13.8853 14.1722 13.8853 14.1722 13.8853C15.0947 12.9628 16.4714 12.7277 17.5209 13.3134L18.6838 13.9624C20.2686 14.8468 20.4557 17.0692 19.0628 18.4622C18.2258 19.2992 17.2004 19.9505 16.0669 19.9934C14.1588 20.0658 10.9183 19.5829 7.6677 16.3323C4.41713 13.0817 3.93421 9.84122 4.00655 7.93309C4.04952 6.7996 4.7008 5.77423 5.53781 4.93723C6.93076 3.54428 9.15317 3.73144 10.0376 5.31617Z"
              fill="currentColor"
            ></path>
            <path
              d="M13.2595 1.87983C13.3257 1.47094 13.7122 1.19357 14.1211 1.25976C14.1464 1.26461 14.2279 1.27983 14.2705 1.28933C14.3559 1.30834 14.4749 1.33759 14.6233 1.38082C14.9201 1.46726 15.3347 1.60967 15.8323 1.8378C16.8286 2.29456 18.1544 3.09356 19.5302 4.46936C20.906 5.84516 21.705 7.17097 22.1617 8.16725C22.3899 8.66487 22.5323 9.07947 22.6187 9.37625C22.6619 9.52466 22.6912 9.64369 22.7102 9.72901C22.7197 9.77168 22.7267 9.80594 22.7315 9.83125L22.7373 9.86245C22.8034 10.2713 22.5286 10.6739 22.1197 10.7401C21.712 10.8061 21.3279 10.53 21.2601 10.1231C21.258 10.1121 21.2522 10.0828 21.2461 10.0551C21.2337 9.9997 21.2124 9.91188 21.1786 9.79572C21.1109 9.56339 20.9934 9.21806 20.7982 8.79238C20.4084 7.94207 19.7074 6.76789 18.4695 5.53002C17.2317 4.29216 16.0575 3.59117 15.2072 3.20134C14.7815 3.00618 14.4362 2.88865 14.2038 2.82097C14.0877 2.78714 13.9417 2.75363 13.8863 2.7413C13.4793 2.67347 13.1935 2.28755 13.2595 1.87983Z"
              fill="currentColor"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.4857 5.3293C13.5995 4.93102 14.0146 4.7004 14.4129 4.81419L14.2069 5.53534C14.4129 4.81419 14.4129 4.81419 14.4129 4.81419L14.4144 4.81461L14.4159 4.81505L14.4192 4.81602L14.427 4.81834L14.4468 4.8245C14.4618 4.82932 14.4807 4.8356 14.5031 4.84357C14.548 4.85951 14.6074 4.88217 14.6802 4.91337C14.8259 4.97581 15.0249 5.07223 15.2695 5.21694C15.7589 5.50662 16.4271 5.9878 17.2121 6.77277C17.9971 7.55775 18.4782 8.22593 18.7679 8.7154C18.9126 8.95991 19.009 9.15897 19.0715 9.30466C19.1027 9.37746 19.1254 9.43682 19.1413 9.48173C19.1493 9.50418 19.1555 9.52301 19.1604 9.53809L19.1665 9.55788L19.1688 9.56563L19.1698 9.56896L19.1702 9.5705C19.1702 9.5705 19.1707 9.57194 18.4495 9.77798L19.1707 9.57194C19.2845 9.97021 19.0538 10.3853 18.6556 10.4991C18.2607 10.6119 17.8492 10.3862 17.7313 9.99413L17.7276 9.98335C17.7223 9.96832 17.7113 9.93874 17.6928 9.89554C17.6558 9.8092 17.5887 9.66797 17.4771 9.47938C17.2541 9.10264 16.8514 8.53339 16.1514 7.83343C15.4515 7.13348 14.8822 6.73078 14.5055 6.50781C14.3169 6.39619 14.1757 6.32909 14.0893 6.29209C14.0461 6.27358 14.0165 6.26254 14.0015 6.25721L13.9907 6.25352C13.5987 6.13564 13.3729 5.72419 13.4857 5.3293Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <span className="inline">Call</span>
      </button>
    </div>

    {/* Website URL */}
    <div className={`mt-8 pt-4 border-t ${themeClasses.borderCategory} w-full`}>
      <p
        className={`text-xs ${themeClasses.textSecondary} text-center font-mono tracking-wider`}
      >
        www.kawansalahadin.dev
      </p>
    </div>
  </div>
);

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const { language } = useLanguage();
  const theme = useThemeClasses();
  const restaurantContext = useRestaurantOptional();
  const menuConfig = restaurantContext?.menuConfig;
  const restaurant = restaurantContext?.restaurant;

  // Use dynamic config or fallback to default
  const config = menuConfig || defaultMenuConfig;

  // Memoize the current year calculation
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Dynamic footer text using the restaurant config
  const footerText = useMemo(
    () => ({
      developedBy: config.ui?.footer.developedBy || {
        ku: "پەرەی پێدراوە لەلایەن",
        ar: "طُور بواسطة",
        en: "Developed by",
      },
      connectWithUs: config.ui?.footer.connectWithUs || {
        ku: "لە تۆڕەکۆمەڵایەتیەکان لەگەڵمان بن",
        ar: "تواصل معنا",
        en: "Contact us",
      },
      allRightsReserved: config.ui?.footer.allRightsReserved || {
        ku: "هەموو مافەکانی پارێزراوە",
        ar: "جميع الحقوق محفوظة",
        en: "All rights reserved",
      },
      restaurantSystem: restaurant?.name
        ? {
            ku: restaurant.name,
            ar: restaurant.name,
            en: restaurant.name,
          }
        : config.restaurantName || {
            ku: "مطعم سالار",
            ar: "مطعم سالار",
            en: "Salar Restaurant",
          },
      poweredBy: restaurant?.description
        ? {
            ku: restaurant.description,
            ar: restaurant.description,
            en: restaurant.description,
          }
        : config.ui?.footer.poweredBy || {
            ku: "لێرە کواڵتی خۆی دەدوێت",
            ar: "حياة من الأصالة",
            en: "q",
          },
    }),
    [config, restaurant]
  );

  // Dynamic social links using the restaurant config
  const SocialLinks= useMemo(
    () => [
      {
        name: "instagram",
        url: "https://www.instagram.com/the_first_cafe_/",
        icon: InstagramIcon,
        label: config.ui?.footer.socialMedia.instagram || {
          ku: "ئینستاگرام",
          ar: "إنستغرام",
          en: "Instagram",
        },
      },
      {
        name: "Location",
        url: "https://www.google.com/maps?q=Sulaymaniyah,+Iraq",
        icon: LocationIcon,
        label: config.ui?.footer.socialMedia.linkedin || {
          ku: "شوێن",
          ar: "الموقع",
          en: "Location",
        },
      },
    ],
    [config]
  );
  const DevSocialLinks = useMemo(
    () => [
      {
        name: "whatsapp",
        url: "https://wa.me/+9647706673769",
        icon: WhatsAppIcon,
        label: config.ui?.footer.socialMedia.whatsapp || {
          ku: "واتساب",
          ar: "واتساب",
          en: "WhatsApp",
        },
      },
      {
        name: "facebook",
        url: "https://www.facebook.com/kawan.salah.offical",
        icon: FacebookIcon,
        label: config.ui?.footer.socialMedia.facebook || {
          ku: "فەیسبووک",
          ar: "فيسبوك",
          en: "Facebook",
        },
      },
      {
        name: "instagram",
        url: "https://www.instagram.com/kawancodevibe",
        icon: InstagramIcon,
        label: config.ui?.footer.socialMedia.instagram || {
          ku: "ئینستاگرام",
          ar: "إنستغرام",
          en: "Instagram",
        },
      },
      {
        name: "linkedin",
        url: "https://www.linkedin.com/in/kawan-salahadin-abubakr-b14030350/",
        icon: LinkedInIcon,
        label: config.ui?.footer.socialMedia.linkedin || {
          ku: "لینکدین",
          ar: "لينكدإن",
          en: "LinkedIn",
        },
      },
    ],
    [config]
  );

  return (
    <footer className={`${className}`} role="contentinfo">
      <div
        className={`w-full max-w-3xl mx-auto px-4 rounded-t-4xl ${
          theme.isDark
            ? "bg-[rgba(209,209,209,0.05)]"
            : "bg-[rgba(209,209,209,0.05)]"
        }`}
      >
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          {/* Restaurant Branding */}
          <RestaurantBranding
            language={language}
            themeClasses={theme}
            config={config}
            footerText={footerText}
          />

          {/* Social Media and Copyright Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start mb-8">
            <SocialMediaSection
              language={language}
              themeClasses={theme}
              socialLinks={SocialLinks}
              footerText={footerText}
            />
            <CopyrightSection
              language={language}
              themeClasses={theme}
              currentYear={currentYear}
              footerText={footerText}
            />
          </div>

          {/* Developer Section */}
          <div className="grid grid-cols-1 items-start">
            <DeveloperSection
              language={language}
              themeClasses={theme}
              footerText={footerText}
            />
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className={`py-6 ${theme.borderTopbar} border-t`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p
              className={`text-sm ${theme.textSecondary} text-center sm:text-left`}
            >
              {footerText.developedBy[language as keyof LocalizedText]}:
              <a
                href="https://www.kawansalahadin.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-2 ${theme.textMain} hover:opacity-80 transition-opacity duration-200 font-medium focus:outline-none focus:underline`}
                aria-label="Visit Kawan Salahadin's website"
              >
                Kawan Salahadin
              </a>
            </p>
            <nav
              className="flex items-center gap-4 flex-wrap justify-center"
              role="navigation"
              aria-label="Footer navigation"
            >
              {DevSocialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={`bottom-${social.name}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 ${theme.textSecondary} hover:${theme.textMain} transition-colors duration-200 text-sm focus:outline-none focus:underline`}
                    aria-label={`Visit our ${
                      social.label[language as keyof LocalizedText]
                    } page`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {social.label[language as keyof LocalizedText]}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
