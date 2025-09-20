import React from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useFeedbackUtils } from "./FeedbackUtils";
import { Feedback } from "@/admin/types/admin";
import { Star, Trash2, Edit } from "lucide-react";
import {
  Feedback as Feedback_icon,
  Calendar,
  Email,
  Phone,
} from "@/admin/components/Icons";

interface FeedbackMobileCardProps {
  feedback: Feedback;
  onEdit?: (feedback: Feedback) => void;
  onDelete?: (feedback: Feedback) => void;
  onClick?: (feedback: Feedback) => void;
  className?: string;
}

const FeedbackMobileCard: React.FC<FeedbackMobileCardProps> = ({
  feedback,
  onEdit,
  onDelete,
  onClick,
  className = "",
}) => {
  const theme = useThemeClasses();
  const { formatDate, truncateText } = useFeedbackUtils();

  return (
    <div
      className={`${
        theme.isDark ? theme.bgPrimary : theme.bgCard
      } rounded-[25px] p-4 ${theme.topbarShadowStyle} border ${
        theme.borderSubCategory
      } transition-all duration-200 ${className} cursor-pointer hover:shadow-lg`}
      onClick={() => onClick?.(feedback)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${theme.bgSecondary} ${theme.textSecondary}`}
          >
            #{feedback.id.slice(-6)}
          </div>
          <div>
            <h3
              className={`font-semibold ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              } mb-1`}
            >
              {feedback.customer_name || "Anonymous"}
            </h3>
            {feedback.rating && (
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm font-medium ${
                    theme.isDark ? theme.textSecondary : theme.textPrimary
                  }`}
                >
                  {feedback.rating}
                </span>
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(feedback);
              }}
              className={`p-2 rounded-lg ${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bgCard} transition-colors`}
            >
              <Edit className={`w-4 h-4`} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(feedback);
              }}
              className={`p-2 rounded-2xl ${theme.bgSecondary} ${theme.textSecondary} hover:${theme.bgCard} hover:text-red-500 transition-colors`}
            >
              <Trash2 className={`w-4 h-4`} />
            </button>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex flex-wrap gap-4 text-xs">
        {feedback.email && (
          <div className="flex items-center gap-1">
            <Email
              className={`w-4 h-4 ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              }`}
            />
            <span className={theme.textSecondary}>{feedback.email}</span>
          </div>
        )}
        {feedback.phone && (
          <div className="flex items-center gap-1">
            <Phone
              className={`w-4 h-4 ${
                theme.isDark ? theme.textSecondary : theme.textPrimary
              }`}
            />
            <span className={theme.textSecondary}>{feedback.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Calendar
            className={`w-4 h-4 ${
              theme.isDark ? theme.textSecondary : theme.textPrimary
            }`}
          />
          <span className={theme.textSecondary}>
            {formatDate(feedback.created_at)}
          </span>
        </div>
      </div>

      {/* Message */}
      <div
        className={`${theme.textSecondary} ${theme.bgSecondary} border-1 ${theme.borderCategory} p-2 mt-4 rounded-2xl text-sm leading-relaxed`}
      >
        <Feedback_icon className="w-4 h-4 inline-block mx-1" />
        {truncateText(feedback.message, 150)}
      </div>
    </div>
  );
};

export default FeedbackMobileCard;
