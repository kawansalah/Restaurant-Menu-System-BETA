import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Star,
  Smartphone,
  Clock,
  Users,
  ChefHat,
  QrCode,
  MessageCircle,
  Phone,
  Code,
  Globe,
} from "lucide-react";
import demoImage from "@/assets/demo.png";
import Navbar from "@/components/Navbar";

const LandingPage: React.FC = () => {
  const { direction } = useLanguage();

  // Kurdish language content
  const content = {
    hero: {
      title: "مێنوەکەم",
      subtitle: "ئەزموونێکی نوێ و گونجاو بۆ خواردنگەکەت",
      description:
        "سیستەمێکی پێشکەوتوو بۆ بەڕێوەبردنی مینووی خواردنگە کە ئەزموونی داواکردنی خواردن دەگۆڕێت بۆ شتێکی سادە و خۆش",
      cta: "دەست پێ بکە",
    },
    features: {
      title: "تایبەتمەندیەکانی ئەم سیستەمە چییە؟",
      items: [
        {
          icon: <QrCode className="w-8 h-8" />,
          title: "QR Code ی تایبەت بە خواردنگەکەت",
          description: "تەنها QR Code ەکە سکان دەکەیت و مێنوەکەت دەکرێتەوە",
        },
        {
          icon: <Smartphone className="w-8 h-8" />,
          title: "لەگەڵ هەموو ئامێرێک گونجاوە",
          description:
            "زۆر بە باشی لەسەر هەموو ئامێرەکان کار دەکات (مۆبایل، تەبلێت، کۆمپیتەر)",
        },
        {
          icon: <Clock className="w-8 h-8" />,
          title: "سیستەمێکی خێراو بەهێز",
          description: "بەخێرایی مێنوەکەت لۆد دەبێت بەو پەڕی کواڵتی",
        },
        {
          icon: <Users className="w-8 h-8" />,
          title: "بەڕێوەبردن",
          description:
            "لایەنی بەڕێوەبردنی سیستەمەکە زۆر گرنگی پێدراوە و کۆنتڕۆڵی تەواوت هەیە",
        },
        {
          icon: <ChefHat className="w-8 h-8" />,
          title: "خواردنەکانت زۆر بە ئاسانی زیاد و کەم دەکەیت",
          description: "زیادکردن و بەڕێوەبردنی خواردن بە سادەیی",
        },
        {
          icon: <Star className="w-8 h-8" />,
          title: "سیستەمی هەڵسەنگاندن",
          description:
            "سیستەمی هەڵسەنگاندن لە خۆدەگرێت و کە بە 2 جۆر کڕایار دەتوانێ ڕای خۆی بڵێت",
        },
      ],
    },
    benefits: {
      title: "سوودی ئەم سیستەمە چییە؟",
      items: [
        "کەمکردنەوەی کات و هەڵە",
        "باشترکردنی ئەزموونی کڕیارەکانت",
        "بەڕێوەبردنی ئاسانتر",
        "تێچووی کەمتر",
      ],
    },
  };

  return (
    <div
      className="min-h-screen font-bold"
      style={{
        backgroundColor: "var(--bg-primary)",
        direction,
      }}
    >
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 30%, var(--bg-secondary) 70%, var(--bg-primary) 100%)",
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, var(--bg-main) 0%, transparent 50%), radial-gradient(circle at 75% 75%, var(--main-stroke) 0%, transparent 50%)",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div
              className={`${
                direction === "rtl" ? "lg:order-2" : "lg:order-1"
              } space-y-10`}
            >
              <div className="space-y-6">
                <div
                  className="inline-block px-6 py-2 rounded-full"
                  style={{
                    backgroundColor: "var(--bg-main)",
                    color: "var(--button-text-primary)",
                    opacity: 0.9,
                    fontSize: "14px",
                    fontWeight: "600",
                    letterSpacing: "1px",
                  }}
                >
                  مێنویەکی تەواو دیجتاڵ
                </div>
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
                  style={{
                    color: "var(--text-secondary)",
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {content.hero.title}
                </h1>
                <h2
                  className="text-2xl sm:text-3xl font-semibold"
                  style={{ color: "var(--bg-main)", opacity: 0.9 }}
                >
                  {content.hero.subtitle}
                </h2>
                <p
                  className="text-xl leading-relaxed max-w-lg"
                  style={{
                    color: "var(--text-secondary)",
                    opacity: 0.7,
                    lineHeight: 1.8,
                  }}
                >
                  {content.hero.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={() => {
                    document.getElementById("contact")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="px-10 py-5 rounded-3xl font-bold text-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                  style={{
                    backgroundColor: "var(--bg-main)",
                    color: "var(--button-text-primary)",
                    boxShadow:
                      "0 10px 30px rgba(182, 147, 75, 0.4), var(--button-shadow-primary)",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 15px 40px rgba(182, 147, 75, 0.6), var(--button-shadow-primary-hover)";
                    e.currentTarget.style.transform =
                      "translateY(-2px) scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(182, 147, 75, 0.4), var(--button-shadow-primary)";
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                  }}
                >
                  {content.hero.cta}
                </button>
                <button
                  onClick={() => {
                    document.getElementById("features")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="px-10 py-5 rounded-3xl font-semibold text-xl transition-all duration-300 hover:shadow-xl"
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--bg-main)",
                    border: "2px solid var(--bg-main)",
                    opacity: 0.8,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-main)";
                    e.currentTarget.style.color = "var(--button-text-primary)";
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--bg-main)";
                    e.currentTarget.style.opacity = "0.8";
                  }}
                >
                  زانیاری زیاتر
                </button>
              </div>
            </div>

            {/* Demo Image */}
            <div
              className={`${
                direction === "rtl" ? "lg:order-1" : "lg:order-2"
              } flex justify-center`}
            >
              <div className="relative group">
                <div
                  className="absolute -inset-8 rounded-3xl blur-2xl opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(45deg, var(--bg-main), var(--main-stroke), var(--bg-main))",
                  }}
                ></div>
                <div
                  className="absolute -inset-6 rounded-3xl opacity-20"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--bg-main) 0%, transparent 50%, var(--main-stroke) 100%)",
                    filter: "blur(1px)",
                  }}
                ></div>
                <img
                  src={demoImage}
                  alt="Restaurant Menu System Demo"
                  className="relative w-full max-w-lg h-auto rounded-3xl transform hover:scale-105 transition-all duration-500 group-hover:shadow-2xl"
                  style={{
                    border: "6px solid var(--bg-card)",
                    boxShadow:
                      "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)",
                    filter: "brightness(1.05)",
                  }}
                />
                {/* Floating elements */}
                <div
                  className="absolute -top-4 -right-4 w-8 h-8 rounded-full opacity-60 animate-bounce"
                  style={{
                    backgroundColor: "var(--bg-main)",
                    animationDelay: "0.5s",
                  }}
                ></div>
                <div
                  className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full opacity-40 animate-bounce"
                  style={{
                    backgroundColor: "var(--main-stroke)",
                    animationDelay: "1s",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 lg:py-32 relative"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(45deg, transparent 49%, var(--category-stroke) 50%, transparent 51%)",
            backgroundSize: "20px 20px",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-20">
            <div
              className="inline-block px-6 py-2 rounded-full mb-6"
              style={{
                backgroundColor: "var(--bg-main)",
                color: "var(--button-text-primary)",
                opacity: 0.9,
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              تایبەتمەندیکان
            </div>
            <h2
              className="text-4xl sm:text-5xl font-bold mb-6"
              style={{
                color: "var(--text-secondary)",
                textShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              {content.features.title}
            </h2>
            <div
              className="w-24 h-1 mx-auto rounded-full"
              style={{ backgroundColor: "var(--bg-main)" }}
            ></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {content.features.items.map((feature, index) => (
              <div
                key={index}
                className="group p-10 rounded-3xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500 relative overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-card)",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
                  border: "1px solid var(--category-stroke)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 20px 60px rgba(0, 0, 0, 0.15)";
                  e.currentTarget.style.borderColor = "var(--bg-main)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 10px 40px rgba(0, 0, 0, 0.08)";
                  e.currentTarget.style.borderColor = "var(--category-stroke)";
                }}
              >
                <div
                  className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5 transform translate-x-6 -translate-y-6"
                  style={{ backgroundColor: "var(--bg-main)" }}
                ></div>
                <div className="relative">
                  <div
                    className="mb-6 p-4 rounded-2xl inline-block"
                    style={{
                      backgroundColor: "var(--bg-main)",
                      color: "var(--button-text-primary)",
                      opacity: 0.9,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-lg leading-relaxed"
                    style={{
                      color: "var(--text-secondary)",
                      opacity: 0.7,
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        className="py-20 lg:py-32 relative"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, var(--bg-main) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--main-stroke) 0%, transparent 50%)",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-20">
            <div
              className="inline-block px-6 py-2 rounded-full mb-6"
              style={{
                backgroundColor: "var(--bg-main)",
                color: "var(--button-text-primary)",
                opacity: 0.9,
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              سوودەکان
            </div>
            <h2
              className="text-4xl sm:text-5xl font-bold mb-6"
              style={{
                color: "var(--text-secondary)",
                textShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              {content.benefits.title}
            </h2>
            <div
              className="w-24 h-1 mx-auto rounded-full"
              style={{ backgroundColor: "var(--bg-main)" }}
            ></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {content.benefits.items.map((benefit, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 space-x-6 rtl:space-x-reverse p-8 rounded-3xl transition-all duration-500 hover:shadow-xl hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, var(--bg-secondary), var(--bg-card))",
                  border: "1px solid var(--category-stroke)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--bg-main)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 50px rgba(0, 0, 0, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--category-stroke)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 30px rgba(0, 0, 0, 0.06)";
                }}
              >
                <div
                  className="flex-shrink-0 p-3 rounded-2xl"
                  style={{ backgroundColor: "var(--bg-main)", opacity: 0.9 }}
                >
                  <Star
                    className="w-8 h-8"
                    style={{ color: "var(--button-text-primary)" }}
                    fill="currentColor"
                  />
                </div>
                <p
                  className="text-xl font-semibold"
                  style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                >
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--bg-main), var(--main-stroke))",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, white 0%, transparent 50%), radial-gradient(circle at 70% 60%, white 0%, transparent 50%)",
          }}
        ></div>
        <div
          className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-10 transform -translate-x-36 -translate-y-36"
          style={{ backgroundColor: "white" }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 transform translate-x-48 translate-y-48"
          style={{ backgroundColor: "white" }}
        ></div>
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="mb-8">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8"
              style={{
                color: "var(--button-text-primary)",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              چاوەڕێی چیت؟ هەر ئێستا پەیوەندی بکە
            </h2>
            <p
              className="text-2xl mb-12 leading-relaxed max-w-3xl mx-auto"
              style={{
                color: "var(--button-text-primary)",
                opacity: 0.9,
                lineHeight: 1.7,
              }}
            >
              سیستەمی مینووی دیجیتاڵی خۆت دروست بکە و ئەزموونی کڕیارانت باشتر
              بکە
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            {/* WhatsApp Button */}
            <button
              onClick={() =>
                window.open("https://wa.me/9647706673679", "_blank")
              }
              className="flex items-center gap-3 px-12 py-6 rounded-full font-bold text-xl transform hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: "#25D366",
                color: "white",
                boxShadow: "0 15px 40px rgba(37, 211, 102, 0.4)",
                border: "3px solid #25D366",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 20px 60px rgba(37, 211, 102, 0.6)";
                e.currentTarget.style.transform =
                  "translateY(-3px) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 15px 40px rgba(37, 211, 102, 0.4)";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
              }}
            >
              <MessageCircle className="w-6 h-6" />
              واتساپ
            </button>

            {/* Phone Call Button */}
            <button
              onClick={() => window.open("tel:+9647706673679", "_self")}
              className="flex items-center gap-3 px-12 py-6 rounded-full font-bold text-xl transform hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--bg-main)",
                boxShadow:
                  "0 15px 40px rgba(255, 255, 255, 0.3), var(--button-shadow-secondary)",
                border: "3px solid var(--bg-card)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 20px 60px rgba(255, 255, 255, 0.4), var(--button-shadow-secondary-hover)";
                e.currentTarget.style.transform =
                  "translateY(-3px) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 15px 40px rgba(255, 255, 255, 0.3), var(--button-shadow-secondary)";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
              }}
            >
              <Phone className="w-6 h-6" />
              پەیوەندی
            </button>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section
        className="py-16 relative"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderTop: "1px solid var(--category-stroke)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div
            className="inline-block px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: "var(--bg-main)",
              color: "var(--button-text-primary)",
              opacity: 0.9,
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            گەشەپێدەر
          </div>

          <h3
            className="text-2xl sm:text-3xl font-bold mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            دروستکراو لەلایەن: Kawan Salahadin
          </h3>

          <div className="flex items-center justify-center gap-2 mb-6">
            <Code className="w-5 h-5" style={{ color: "var(--bg-main)" }} />
            <p
              className="text-lg font-semibold"
              style={{ color: "var(--text-secondary)", opacity: 0.8 }}
            >
              Full Stack Developer & UI/UX Designer
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
            {/* Developer Website */}
            <button
              onClick={() =>
                window.open("https://www.kawansalahadin.dev", "_blank")
              }
              className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-base transform hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: "var(--bg-main)",
                color: "var(--button-text-primary)",
                border: "2px solid var(--bg-main)",
                boxShadow: "0 4px 15px rgba(182, 147, 75, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(182, 147, 75, 0.5)";
                e.currentTarget.style.transform =
                  "translateY(-2px) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(182, 147, 75, 0.3)";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
              }}
            >
              <Globe className="w-4 h-4" />
              وێبسایتی گەشەپێدەر
            </button>

            {/* Developer WhatsApp */}
            <button
              onClick={() =>
                window.open(
                  "https://wa.me/9647706673679?text=سڵاو، حەز دەکەم لەسەر سیستەمی مێنو زیاتر بزانم",
                  "_blank"
                )
              }
              className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-base transform hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
                border: "2px solid var(--category-stroke)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--bg-main)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(182, 147, 75, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--category-stroke)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(0, 0, 0, 0.1)";
              }}
            >
              <MessageCircle className="w-4 h-4" />
              چات
            </button>

            {/* Developer Phone */}
            <button
              onClick={() => window.open("tel:+9647706673679", "_self")}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-base transform hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: "transparent",
                color: "var(--text-secondary)",
                border: "2px solid var(--category-stroke)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-main)";
                e.currentTarget.style.color = "var(--button-text-primary)";
                e.currentTarget.style.borderColor = "var(--bg-main)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.borderColor = "var(--category-stroke)";
              }}
            >
              <Phone className="w-4 h-4" />
              077066737679
            </button>
          </div>

          <div className="mt-6">
            <p
              className="text-sm"
              style={{ color: "var(--text-secondary)", opacity: 0.6 }}
            >
              © 2024 سیستەمی مێنوەکەم. هەموو مافەکان پارێزراون.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
