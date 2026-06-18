import { useState } from "react";

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9C8B7A"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// إضافة أيقونة المفضلة
const FavouritesIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C4622D"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

type SearchBarProps = {
  isMenuOpen: boolean;
  favouritesCount?: number; // إضافة عداد المفضلة
};

export const SearchBar = ({ isMenuOpen, favouritesCount = 0 }: SearchBarProps) => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <>
      <style>
        {`
          .hme-search-wrap {
            flex: 1;
            max-width: ${isMenuOpen ? "100%" : "360px"};
            position: relative;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .hme-search-icon {
            position: absolute;
            left: 12px;
            pointer-events: none;
            display: flex;
            align-items: center;
          }

          .hme-search-input {
            width: 100%;
            padding: 9px 16px 9px 38px;
            border-radius: 24px;
            border: 1.5px solid ${
              searchFocused ? "#C4622D" : "#DDD3C5"
            };
            background: #F5EFE6;
            font-family: 'DM Sans', sans-serif;
            font-size: 13.5px;
            color: #3D2E1E;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
            box-shadow: ${
              searchFocused
                ? "0 0 0 3px rgba(196,98,45,0.12)"
                : "none"
            };
          }

          .hme-search-input::placeholder {
            color: #9C8B7A;
            font-style: italic;
          }

          /* إضافة أنماط أيقونة المفضلة */
          .hme-fav-icon-btn {
            position: relative;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: none;
            background: transparent;
            cursor: pointer;
            transition: background 0.15s;
            flex-shrink: 0;
          }

          .hme-fav-icon-btn:hover {
            background: #F0E6D8;
          }

          .hme-fav-badge {
            position: absolute;
            top: 2px;
            right: 2px;
            min-width: 16px;
            height: 16px;
            background: #dc3545;
            color: white;
            font-size: 10px;
            font-weight: 600;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'DM Sans', sans-serif;
            padding: 0 3px;
          }

          @media (max-width: 768px) {
            .hme-fav-icon-btn {
              width: 32px;
              height: 32px;
            }
            
            .hme-fav-badge {
              min-width: 14px;
              height: 14px;
              font-size: 9px;
            }
          }
        `}
      </style>

      <div className="hme-search-wrap">
        <span className="hme-search-icon">
          <SearchIcon />
        </span>

        <input
          type="text"
          className="hme-search-input"
          placeholder="Search for unique treasures..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />

        {/* إضافة زر المفضلة */}
        <button className="hme-fav-icon-btn" aria-label="Favourites">
          <FavouritesIcon />
          {favouritesCount > 0 && (
            <span className="hme-fav-badge">{favouritesCount}</span>
          )}
        </button>
      </div>
    </>
  );
};