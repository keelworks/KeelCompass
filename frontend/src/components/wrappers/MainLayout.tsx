import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../navigation/Sidebar";
import { FiChevronDown, FiLogOut, FiMenu, FiSun, FiMoon, FiSearch, FiPlus, FiX, FiSettings } from "react-icons/fi";
import { getMe } from "../../utils/store";
import { useTheme } from "../../utils/theme";
import NotificationsPanel from "../notifications/NotificationsPanel";
import FeedbackModal from "../feedback/FeedbackModal";
import { getSocket, disconnectSocket } from "../../utils/socket";
import SmoothExpand from "../ui/SmoothExpand";
import { useIsMobile } from "../../utils/useIsMobile";

interface MainLayoutProps {
  children: React.ReactNode;
  searchBar?: React.ReactNode;
  showAsk?: boolean;
  questionTitle?: string;
  onHomeClick?: () => void;
  // mobile-only header affordances - on desktop the search bar stays inline
  // and "Ask Question" is its own button in the content, same as before
  onAskQuestionClick?: () => void;
  askDisabled?: boolean;
  searchActive?: boolean;
}

const MainLayout = ({
  children,
  searchBar,
  showAsk = false,
  questionTitle,
  onHomeClick,
  onAskQuestionClick,
  askDisabled = false,
  searchActive = false,
}: MainLayoutProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState<string | null>("User");
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [fullRoleTag, setFullRoleTag] = useState<string | null>(null);
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [contentScrolled, setContentScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  // The actual scrollable element is whichever inner list (QuestionsSection,
  // MyInterests, ...) happens to render under this wrapper, not the wrapper
  // itself - scroll events don't bubble, so listening here requires the
  // capture phase to see them at all, regardless of which descendant scrolls.

  // slid-down mobile search auto-dismisses on scroll, but only while it's
  // empty - once there's an active query/filter the results are what's
  // being scrolled through, so yanking the search bar away would be wrong
  useEffect(() => {
    if (!mobileSearchOpen || searchActive) return;
    const el = contentScrollRef.current;
    if (!el) return;
    const handleScroll = () => setMobileSearchOpen(false);
    el.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    return () => el.removeEventListener("scroll", handleScroll, true);
  }, [mobileSearchOpen, searchActive]);

  // subtle header elevation once the content underneath has scrolled, so
  // the header reads as floating above the feed instead of blending into it
  useEffect(() => {
    const el = contentScrollRef.current;
    if (!el) return;
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setContentScrolled(target.scrollTop > 4);
    };
    el.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    return () => el.removeEventListener("scroll", handleScroll, true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    disconnectSocket();
    navigate("/");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const user = await getMe();
        console.log("Fetched user data:", user);
        setUsername(user.username);
        setDisplayName(user.display_name);
        setFullRoleTag(user.full_role_tag);
        setPictureUrl(user.picture_url);
        setIsAdmin(user.roles?.includes("admin") ?? false);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
    getSocket();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="flex min-h-screen bg-[#F9F9F9] dark:bg-[#0F1113]">
      {/* Sidebar */}
      <div className="flex-none lg:transition-all lg:duration-300">
        <Navigation
          showAsk={showAsk}
          questionTitle={questionTitle}
          onHomeClick={onHomeClick}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
          theme={theme}
          isAdmin={isAdmin}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden py-4 px-4 sm:px-6 lg:pl-8 lg:px-6 max-w-7xl mx-auto w-full">
        {/* Header: hamburger + icons on their own row; the search bar is
            always inline on desktop, but only a toggle icon on mobile - the
            actual mobile search panel slides down in its own row below.
            Gains a subtle bottom border/shadow once the feed underneath has
            scrolled, so it reads as floating above the content. */}
        <div
          className={`flex flex-wrap items-center gap-3 mb-4 lg:mb-2 pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:pb-0 border-b transition-all duration-200 ${
            contentScrolled
              ? "border-gray-200 dark:border-gray-800 shadow-sm lg:shadow-none lg:border-transparent"
              : "border-transparent"
          }`}
        >
          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="order-1 shrink-0 flex items-center justify-center w-9 h-9 rounded-md text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 transition-all duration-150 active:scale-90 lg:hidden"
          >
            <FiMenu size={22} />
          </button>

          {/* Desktop search bar - unchanged, always inline. Only mounted
              here when not on mobile, so there's never a second live
              instance of it sitting hidden in the mobile panel below */}
          {!isMobile && (
            <div className="order-2 lg:flex-1 min-w-0">
              {searchBar}
            </div>
          )}

          {/* Icon cluster */}
          <div className="order-2 lg:order-3 ml-auto lg:ml-0 flex items-center gap-3 lg:gap-4 shrink-0">
            {/* Mobile-only search toggle - the search bar itself lives inline
                on desktop, so this (and the panel below) only ever render
                on mobile */}
            {searchBar && (
              <button
                onClick={() => setMobileSearchOpen((s) => !s)}
                aria-label={mobileSearchOpen ? "Close search" : "Search"}
                aria-expanded={mobileSearchOpen}
                className={`flex items-center justify-center -m-2 p-2 rounded-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-200 active:scale-90 lg:hidden ${
                  mobileSearchOpen ? "bg-brand-50 text-brand-600 dark:bg-teal-900/30 dark:text-teal-300" : ""
                }`}
              >
                {mobileSearchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
              </button>
            )}

            {/* Mobile-only "Ask Question" trigger - opens the fullscreen
                composer the same way the desktop button does */}
            {onAskQuestionClick && !showAsk && (
              <button
                onClick={onAskQuestionClick}
                disabled={askDisabled}
                aria-label="Ask a question"
                className="flex items-center justify-center -m-2 p-2 rounded-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-200 active:scale-90 disabled:opacity-40 disabled:pointer-events-none lg:hidden"
              >
                <FiPlus size={20} />
              </button>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="flex items-center justify-center -m-2 p-2 rounded-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-200 hover:rotate-12 active:scale-90"
            >
              {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Notifications */}
            <NotificationsPanel />

            {/* Feedback */}
            <FeedbackModal />

            {/* Profile & Dropdown */}
            <div
              className="relative flex items-center space-x-2 cursor-pointer"
              onClick={() => setShowDropdown((prev) => !prev)}
              ref={dropdownRef}
            >
              {pictureUrl ? (
                <img
                  src={pictureUrl}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-semibold flex items-center justify-center">
                  {username ? username.charAt(0).toUpperCase() : "?"}
                </div>
              )}
              <div className="leading-tight hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-0.5">
                  {displayName || username || "User"}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{fullRoleTag || "Member"}</p>
              </div>
              <FiChevronDown
                size={16}
                className={`text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 top-8 w-40 z-50 origin-top-right animate-dropdown-in">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-2">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/settings");
                      }}
                      className="w-full flex items-center justify-start gap-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 font-medium text-sm py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
                    >
                      <FiSettings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-start gap-2 text-red-500 bg-white dark:bg-gray-800 font-medium text-sm py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-red-600 transition duration-200"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search panel - slides down below the header when toggled,
            and collapses again via the effect above if the user scrolls
            away without typing anything. Only mounted on mobile, so this is
            the one and only SearchBar instance in that layout. */}
        {searchBar && isMobile && (
          <div className="lg:hidden -mt-1 mb-2">
            <SmoothExpand>
              {mobileSearchOpen && (
                <div className="animate-card-in">
                  {React.isValidElement(searchBar)
                    ? React.cloneElement(searchBar as React.ReactElement<{ autoFocus?: boolean }>, {
                        autoFocus: true,
                      })
                    : searchBar}
                </div>
              )}
            </SmoothExpand>
          </div>
        )}

        {/* Main Content Grid - moved closer to top */}
        <div ref={contentScrollRef} className="flex-1 overflow-auto mt-0 pt-0 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
