import React from "react";

interface RatingProps {
  rating: number;
  reviewCount: number;
  size?: "small" | "medium" | "large";
  showCount?: boolean;
}

const Rating: React.FC<RatingProps> = ({ 
  rating, 
  reviewCount, 
  size = "medium",
  showCount = true 
}) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  // تحديد حجم النجوم
  const starSizes = {
    small: { fontSize: "12px", gap: "2px" },
    medium: { fontSize: "16px", gap: "4px" },
    large: { fontSize: "20px", gap: "6px" }
  };

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      gap: starSizes[size].gap,
      flexWrap: "wrap" as const
    },
    stars: {
      color: "#ffc107",
      fontSize: starSizes[size].fontSize,
      letterSpacing: "2px"
    },
    count: {
      color: "#6c757d",
      fontSize: size === "small" ? "11px" : size === "medium" ? "13px" : "15px",
      marginLeft: "8px"
    }
  };

  return (
    <div style={styles.container}>
      <span style={styles.stars}>
        {"★".repeat(fullStars)}
        {halfStar && "½"}
        {"☆".repeat(emptyStars)}
      </span>
      {showCount && (
        <span style={styles.count}>({reviewCount} reviews)</span>
      )}
    </div>
  );
};

export default Rating;