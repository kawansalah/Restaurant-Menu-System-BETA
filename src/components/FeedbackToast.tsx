import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useThemeClasses } from '@/hooks/useThemeClasses';
import { useLanguage } from '@/contexts/LanguageContext';
import { defaultMenuConfig } from "@/config/dynamicMenuConfig";
import { gsap } from 'gsap';

interface FeedbackToastProps {
  isVisible: boolean;
  onClose: () => void;
  delay?: number;
}

function FeedbackToast({ isVisible, onClose, delay = 3000 }: FeedbackToastProps) {
  const [showToast, setShowToast] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const theme = useThemeClasses();
  const { language } = useLanguage();

  useEffect(() => {
    if (isVisible) {
      // Set initial state immediately when toast should be visible
      if (toastRef.current && tailRef.current) {
        gsap.set([toastRef.current, tailRef.current], {
          opacity: 0,
          y: 20,
          scale: 0.8,
          rotationY: -15,
        });
      }
      
      const timer = setTimeout(() => {
        setShowToast(true);
        
        // Show animation with GSAP
        if (toastRef.current && tailRef.current) {
          const tl = gsap.timeline();

          // Animate in with professional easing
          tl.to([toastRef.current, tailRef.current], {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 0.8,
            ease: "back.out(1.2)",
          })
          .to(toastRef.current, {
            y: -3,
            duration: 0.4,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
          }, "-=0.2");
        }
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setShowToast(false);
      // Kill any running animations
      if (toastRef.current && tailRef.current) {
        gsap.killTweensOf([toastRef.current, tailRef.current]);
        // Reset to invisible state
        gsap.set([toastRef.current, tailRef.current], {
          opacity: 0,
        });
      }
    }
  }, [isVisible, delay]);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      if (toastRef.current && tailRef.current) {
        gsap.killTweensOf([toastRef.current, tailRef.current]);
      }
    };
  }, []);

  // Auto-hide toast after 6 seconds with GSAP animation
  useEffect(() => {
    if (showToast && toastRef.current && tailRef.current) {
      const autoHideTimer = setTimeout(() => {
        // Hide animation with GSAP
        const tl = gsap.timeline({
          onComplete: () => {
            setShowToast(false);
            onClose();
          }
        });

        tl.to([toastRef.current, tailRef.current], {
          opacity: 0,
          y: -20,
          scale: 0.9,
          rotationY: 15,
          duration: 0.6,
          ease: "power2.in",
        });
      }, 6000);

      return () => clearTimeout(autoHideTimer);
    }
  }, [showToast, onClose]);

  // Manual close handler with GSAP animation
  const handleClose = () => {
    if (toastRef.current && tailRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setShowToast(false);
          onClose();
        }
      });

      tl.to([toastRef.current, tailRef.current], {
        opacity: 0,
        y: -15,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.in",
      });
    }
  };

  const getMessage = () => {
    const messages = defaultMenuConfig.ui?.feedbackToast.message || {
      ku: 'دوای خواردن، دەتوانیت ڕەیتینگ بدەیت!',
      ar: 'بعد تناول الطعام، يمكنك تقييمه!',
      en: 'After eating, you can rate this food!'
    };
    return messages[language] || messages.en;
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Toast positioned above rating button */}
      <div
        ref={toastRef}
        className={`
          absolute bottom-18 left-1/2 transform -translate-x-1/2 pointer-events-auto z-[100]
          ${theme.bgCard} ${theme.textPrimary} border-2 ${theme.borderCategory}
          px-4 py-3 rounded-2xl shadow-lg whitespace-nowrap

        `}
        style={{ 
          boxShadow: 'var(--shadow)',
          minWidth: 'max-content',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className={`text-sm ${theme.isDark ? theme.textSecondary : theme.textPrimary} leading-relaxed font-medium`}>
              {getMessage()}
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 p-1 rounded-full transition-all duration-200 
              ${theme.textSecondary} hover:${theme.textPrimary}
              hover:${theme.bgSearchBar} hover:scale-110 active:scale-95
            `}
            aria-label={defaultMenuConfig.ui?.feedbackToast.closeLabel[language] || "Close toast"}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Speech bubble tail pointing down */}
        <div 
          ref={tailRef}
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
        >
          <div 
            className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent"
            style={{
              borderTopColor: theme.isDark ? '#3A3A3A' : '#ffffff'
            }}
          />
        </div>
      </div>
    </>
  );
}

export default FeedbackToast; 