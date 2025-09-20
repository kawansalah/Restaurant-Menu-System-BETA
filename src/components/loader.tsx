import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { defaultMenuConfig } from '@/config/dynamicMenuConfig';
import logo_dark from '@/assets/logo/MyMenuCircle.svg';
import logo_light from '@/assets/logo/My Menu LightCircle.svg';


interface LoaderProps {
  onLoadComplete?: () => void;
  duration?: number;
}

const Loader: React.FC<LoaderProps> = ({ onLoadComplete, duration = 3000 }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const progressRingRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);

  const SystemName ={
    ku: "مێنوەکەم",
    ar: "قائمتي",
    en: "My Menu"
  };

  const subtitleTexts = {
    ku: "لێرە کواڵتی خۆی ئەدوێت.",
    ar: "هنا الجودة تتحدث عن نفسها.",
    en: "Quality speaks for itself here."
  };

  const stepTexts = {
    ku: ["دامەزراندنی پەیوەندی", "بارکردنی مینیو", "ئامادەکردن", "تەواو بوو"],
    ar: ["تأسيس الاتصال", "تحميل القائمة", "تحضير التجربة", "اكتمل"],
    en: ["Establishing Connection", "Loading Menu", "Preparing Experience", "Complete"]
  };

  const currentName = SystemName[language as keyof typeof SystemName] || SystemName.en;
  const currentSubtitle = subtitleTexts[language as keyof typeof subtitleTexts] || subtitleTexts.en;
  const currentSteps = stepTexts[language as keyof typeof stepTexts] || stepTexts.en;

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          // Fade out animation
          const fadeOutTl = gsap.timeline({
            onComplete: () => {
              setIsVisible(false);
              onLoadComplete?.();
            }
          });

          fadeOutTl
            .to(loaderRef.current, {
              opacity: 0,
              duration: 0.8,
              ease: "power2.inOut"
            })
            .to(centerContentRef.current, {
              scale: 0.8,
              y: -100,
              duration: 0.6,
              ease: "back.in(1.7)"
            }, "-=0.6");
        }, 700);
      }
    });

    // Initial setup
    gsap.set([logoRef.current, titleRef.current, subtitleRef.current, progressRingRef.current, stepsRef.current], {
      opacity: 0,
      scale: 0.8
    });

    // Entrance animations
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    .to(titleRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.4")
    .to(subtitleRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.3")
    .to(progressRingRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.2")
    .to(stepsRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.4");

    // Progress animation with steps
    const progressDuration = duration / 1000 - 2;
    const stepDuration = progressDuration / 4;

    // Step-by-step progress
    for (let i = 0; i < 4; i++) {
      tl.call(() => {
        setCurrentStep(i);
      }, [], i * stepDuration + 1);
    }

    // Smooth progress animation
    tl.to({}, {
      duration: progressDuration,
      ease: "power2.out",
      onUpdate: function() {
        const progress = Math.round(this.progress() * 100);
        setLoadingProgress(progress);
      }
    }, 1);

    // Logo breathing animation
    gsap.to(logoRef.current, {
      scale: 1.05,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    return () => {
      tl.kill();
    };
  }, [theme, language, duration, onLoadComplete]);

  if (!isVisible) return null;

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: theme === 'dark' 
          ? 'var(--bg-primary)'
          : 'var(--bg-primary)'
      }}
    >
      <div 
        ref={centerContentRef}
        className="relative flex flex-col items-center justify-center w-full max-w-sm space-y-8"
      >
        {/* Progress Ring */}
        <div 
          ref={progressRingRef}
          className="relative w-48 h-48 flex items-center justify-center"
        >
          {/* Outer Ring */}
          <div 
            className="absolute inset-0 rounded-full border-4"
            style={{
              borderColor: theme === 'dark' ? 'var(--category-stroke)' : 'var(--category-stroke)',
              borderTopColor: 'var(--bg-main)',
              borderRightColor: 'var(--bg-main)',
              borderBottomColor: theme === 'dark' ? 'var(--category-stroke)' : 'var(--category-stroke)',
              borderLeftColor: theme === 'dark' ? 'var(--category-stroke)' : 'var(--category-stroke)'
            }}
          />
          
          {/* Inner decorative ring */}
          <div 
            className="absolute inset-4 rounded-full border-2"
            style={{
              borderColor: 'var(--bg-main)',
              opacity: 0.3
            }}
          />

          {/* Logo container */}
          <div 
            ref={logoRef}
            className="relative z-10 p-8 rounded-2xl"
            style={{
              background: theme === 'dark' ? 'var(--bg-card)' : 'var(--bg-card)',
              boxShadow: 'var(--topbar-shadow)',
              border: `2px solid ${theme === 'dark' ? 'var(--category-stroke)' : 'var(--category-stroke)'}`
            }}
          >
            {/* Animated corner accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 rounded-tl-lg" style={{ borderColor: 'var(--bg-main)' }} />
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 rounded-tr-lg" style={{ borderColor: 'var(--bg-main)' }} />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 rounded-bl-lg" style={{ borderColor: 'var(--bg-main)' }} />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 rounded-br-lg" style={{ borderColor: 'var(--bg-main)' }} />
            
            {/* Logo with pulse effect */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {/* Pulse rings */}
                <div 
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    background: 'var(--bg-main)',
                    opacity: 0.2,
                    transform: 'scale(1.2)'
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    background: 'var(--bg-main)',
                    opacity: 0.1,
                    transform: 'scale(1.4)'
                  }}
                />
                
                {/* Logo */}
                <img 
                  src={theme === 'dark' ? logo_dark : logo_light} 
                  alt="Salar Restaurant Logo" 
                  className="relative z-10 w-20 h-20 object-contain"
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                  }}
                />
              </div>
              
              {/* Animated dots */}
              <div className="flex space-x-2">
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    background: 'var(--bg-main)',
                    animationDelay: '0s'
                  }}
                />
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    background: 'var(--bg-main)',
                    animationDelay: '0.2s'
                  }}
                />
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    background: 'var(--bg-main)',
                    animationDelay: '0.4s'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Progress percentage */}
          <div 
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-bold"
            style={{
              background: 'var(--bg-main)',
              color: theme === 'dark' ? 'var(--button-text-primary)' : 'var(--button-text-primary)',
              boxShadow: '0px 4px 0px 0px var(--main-stroke)',
              border: '2px solid var(--main-stroke)'
            }}
          >
            {loadingProgress}{defaultMenuConfig.ui?.loader.percentage[language as keyof typeof defaultMenuConfig.ui.loader.percentage] || '%'}
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center space-y-3">
          <h1 
            ref={titleRef}
            className="text-3xl font-bold"
            style={{
              color: theme === 'dark' ? 'var(--text-secondary)' : 'var(--text-primary)',
              fontFamily: 'BahijJanna, sans-serif'
            }}
          >
            {currentName}
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-base font-medium"
            style={{
              color: theme === 'dark' ? 'var(--text-secondary)' : 'var(--text-primary)',
              fontFamily: 'BahijJanna, sans-serif'
            }}
          >
            {currentSubtitle}
          </p>
        </div>

        {/* Loading Steps */}
        <div 
          ref={stepsRef}
          className="w-full max-w-xs space-y-3"
        >
          {currentSteps.map((step, index) => (
            <div 
              key={index}
              className="flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300"
              style={{
                background: index === currentStep 
                  ? (theme === 'dark' ? 'var(--bg-card)' : 'var(--bg-card)')
                  : 'transparent',
                border: index === currentStep 
                  ? '2px solid var(--bg-main)'
                  : `2px solid ${theme === 'dark' ? 'var(--category-stroke)' : 'var(--category-stroke)'}`,
                boxShadow: index === currentStep 
                  ? '0px 4px 0px 0px var(--main-stroke)'
                  : 'none'
              }}
            >
              {/* Step indicator */}
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: index <= currentStep ? 'var(--bg-main)' : 'transparent',
                  color: index <= currentStep 
                    ? (theme === 'dark' ? 'var(--button-text-primary)' : 'var(--button-text-primary)')
                    : (theme === 'dark' ? 'var(--text-secondary)' : 'var(--text-secondary)'),
                  border: index <= currentStep ? 'none' : `2px solid ${theme === 'dark' ? 'var(--category-stroke)' : 'var(--category-stroke)'}`
                }}
              >
                {index <= currentStep ? '✓' : index + 1}
              </div>

              {/* Step text */}
              <span 
                className="text-sm font-medium flex-1"
                style={{
                  color: index === currentStep 
                    ? 'var(--bg-main)'
                    : (theme === 'dark' ? 'var(--text-secondary)' : 'var(--text-secondary)'),
                  fontFamily: 'BahijJanna, sans-serif'
                }}
              >
                {step}
              </span>

              {/* Loading animation for current step */}
              {index === currentStep && (
                <div className="flex space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: 'var(--bg-main)',
                      animationDelay: '0s'
                    }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: 'var(--bg-main)',
                      animationDelay: '0.2s'
                    }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: 'var(--bg-main)',
                      animationDelay: '0.4s'
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;
