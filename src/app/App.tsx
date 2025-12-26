import { useState } from "react";
import { ThemeProvider } from "./components/ThemeContext";
import { ToastProvider, useToast } from "./components/ToastContext";
import { Navigation } from "./components/Navigation";
import { MobileTopBar } from "./components/MobileTopBar";
import { BottomNavigation } from "./components/BottomNavigation";
import { TaskMasterView } from "./components/TaskMasterView";
import { HeroView } from "./components/HeroView";
import { DashboardView } from "./components/DashboardView";
import { LeaderboardView } from "./components/LeaderboardView";
import { ActiveQuestBar } from "./components/ActiveQuestBar";
import { MobileMenu } from "./components/MobileMenu";
import { WalletOverlay } from "./components/WalletOverlay";
import { NotificationPanel } from "./components/NotificationPanel";
import { Footer } from "./components/Footer";

// Define Quest interface
interface Quest {
  title: string;
  description: string;
  reward: number;
  xp: number;
  urgency: "low" | "medium" | "urgent";
  deadline: string;
  location?: string;
  highlighted?: boolean;
  isMyQuest?: boolean; // Added property
}

function AppContent() {
  const [activeTab, setActiveTab] = useState("post");
  const [activeQuest, setActiveQuest] = useState<{
    title: string;
    location?: string;
    duration: number;
    reward: number;
  } | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showWalletOverlay, setShowWalletOverlay] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const { showToast } = useToast();

  // Centralized Quest State
  const [quests, setQuests] = useState<Quest[]>([
    {
      title: "Hold Canteen Line Spot",
      description: "Stand in the lunch queue for me for 20 mins.",
      reward: 150,
      xp: 50,
      urgency: "medium" as const,
      deadline: "Today, 2 PM",
      location: "Main Canteen",
    },
    {
      title: "Deliver Lab Coat ASAP",
      description: "Forgot my coat at Hostel 4. Need it at Chem Lab now!",
      reward: 250,
      xp: 75,
      urgency: "urgent" as const,
      deadline: "In 30 Mins",
      location: "Hostel 4 → Chem Lab",
    },
    {
      title: "Tutoring Session: Calculus II",
      description: "2-hour session to prep for midterm exam.",
      reward: 600,
      xp: 200,
      urgency: "low" as const,
      deadline: "Tomorrow, 5 PM",
      location: "Library",
      highlighted: true,
    },
    {
      title: "Print Assignment",
      description: "Print 10 pages and deliver to Block A, Room 204.",
      reward: 100,
      xp: 30,
      urgency: "medium" as const,
      deadline: "Today, 4 PM",
      location: "Block A",
    },
    {
      title: "Wake Me Up Call",
      description: "Call me at 6 AM for morning class. I'm a heavy sleeper!",
      reward: 80,
      xp: 25,
      urgency: "low" as const,
      deadline: "Tomorrow, 6 AM",
    },
    {
      title: "Submit Assignment",
      description: "Submit my assignment to the faculty office before 12 PM.",
      reward: 200,
      xp: 60,
      urgency: "urgent" as const,
      deadline: "Today, 11:30 AM",
      location: "Faculty Office",
    },
    {
      title: "Buy Snacks from Canteen",
      description: "Get me 2 samosas and a cold coffee during break.",
      reward: 120,
      xp: 40,
      urgency: "low" as const,
      deadline: "Today, 3 PM",
      location: "Canteen",
    },
    {
      title: "Take Notes in Class",
      description: "Attend CS101 lecture and share detailed notes.",
      reward: 300,
      xp: 100,
      urgency: "medium" as const,
      deadline: "Today, 10 AM",
      location: "Room 301",
    },
    {
      title: "Return Library Book",
      description: "Return 'Data Structures' book to library before due date.",
      reward: 90,
      xp: 35,
      urgency: "medium" as const,
      deadline: "Tomorrow, 6 PM",
      location: "Library",
    },
  ]);

  // Centralized Wallet Balance State
  const [balance, setBalance] = useState(450);

  // Add new quest function
  const addQuest = (newQuest: Quest) => {
    setQuests((prevQuests) => [newQuest, ...prevQuests]);
    // Switch to "find" tab to show the new quest
    setActiveTab("find");
  };

  const handleAcceptQuest = (quest: Quest) => {
    setActiveQuest({
      title: quest.title,
      location: quest.location,
      duration: 7185, // 1:59:45 in seconds - this would be calculated based on deadline
      reward: quest.reward,
    });
  };

  const handleCompleteQuest = () => {
    if (activeQuest) {
      // Update balance
      setBalance((prevBalance) => prevBalance + activeQuest.reward);
      // Show success toast
      showToast("success", "Quest Completed!", `₹${activeQuest.reward} added to your wallet!`);
      // Clear active quest
      setActiveQuest(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--campus-bg)] relative overflow-x-hidden transition-colors duration-300">
      {/* Animated Background - Only visible in dark mode */}
      <div className="dark:block hidden fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2D7FF9]/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#9D4EDD]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00F5D4]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Desktop Navigation */}
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onMenuClick={() => setShowMobileMenu(true)}
          onWalletClick={() => setShowWalletOverlay(true)}
          onNotificationClick={() => setShowNotificationPanel(true)}
          balance={balance}
        />
        
        {/* Mobile Top Bar */}
        <MobileTopBar 
          onMenuClick={() => setShowMobileMenu(true)}
          onWalletClick={() => setShowWalletOverlay(true)}
          onNotificationClick={() => setShowNotificationPanel(true)}
          balance={balance}
        />

        {/* Main Content Area */}
        {activeTab === "post" && <TaskMasterView addQuest={addQuest} />}
        {activeTab === "find" && <HeroView quests={quests} onAcceptQuest={handleAcceptQuest} />}
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "leaderboard" && <LeaderboardView />}

        <Footer />
        
        {/* Mobile Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Active Quest Bar - Only show when quest is accepted */}
      {activeQuest && (
        <ActiveQuestBar 
          quest={activeQuest}
          onComplete={handleCompleteQuest}
          onDismiss={() => setActiveQuest(null)}
        />
      )}

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Wallet Overlay */}
      <WalletOverlay
        isOpen={showWalletOverlay}
        onClose={() => setShowWalletOverlay(false)}
        balance={balance}
      />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotificationPanel}
        onClose={() => setShowNotificationPanel(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}