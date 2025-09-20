import React from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { MessageSquare, Star, BarChart3, Users } from "lucide-react";
import { FeedbackStats } from "@/admin/types/admin";

interface FeedbackStatsCardsProps {
  stats: FeedbackStats;
}

const FeedbackStatsCards: React.FC<FeedbackStatsCardsProps> = ({ stats }) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.feedback;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Feedback */}
        <div
          className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory} transition-all duration-200`}
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className={`w-5 h-5 ${theme.textMain}`} />
            <span className={`text-sm font-medium ${theme.textSecondary}`}>
              {getText("totalFeedback")}
            </span>
          </div>
          <span
            className={`text-3xl font-bold ${
              theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
            }`}
          >
            {stats.total}
          </span>
        </div>

        {/* Average Rating */}
        <div
          className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory} transition-all duration-200`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className={`w-5 h-5 ${theme.textMain}`} />
            <span className={`text-sm font-medium ${theme.textSecondary}`}>
              {getText("averageRating")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-3xl font-bold ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              }`}
            >
              {stats.averageRating.toFixed(1)}
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= stats.averageRating
                      ? "text-main fill-current"
                      : theme.textSecondary
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Total with Rating */}
        <div
          className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory} transition-all duration-200`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className={`w-5 h-5 ${theme.textMain}`} />
            <span className={`text-sm font-medium ${theme.textSecondary}`}>
              {getText("totalWithRating")}
            </span>
          </div>
          <span
            className={`text-3xl font-bold ${
              theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
            }`}
          >
            {stats.totalWithRating}
          </span>
        </div>

        {/* Rating Distribution */}
        <div
          className={`${theme.bgButtomNavigation} rounded-3xl p-6 ${theme.topbarShadowStyle} border ${theme.borderSubCategory} transition-all duration-200`}
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className={`w-5 h-5 ${theme.textMain}`} />
            <span className={`text-sm font-medium ${theme.textSecondary}`}>
              {getText("ratingDistribution")}
            </span>
          </div>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className={`text-xs ${theme.textSecondary} w-2`}>
                  {rating}
                </span>
                <div
                  className={`flex-1 h-2 ${theme.bgSecondary} rounded-full overflow-hidden`}
                >
                  <div
                    className="h-full bg-main transition-all duration-300"
                    style={{
                      width:
                        stats.totalWithRating > 0
                          ? `${
                              (stats.ratingDistribution[
                                rating as keyof typeof stats.ratingDistribution
                              ] /
                                stats.totalWithRating) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>
                <span
                  className={`text-xs ${theme.textSecondary} w-6 text-right`}
                >
                  {
                    stats.ratingDistribution[
                      rating as keyof typeof stats.ratingDistribution
                    ]
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackStatsCards;
