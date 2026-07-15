import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  FaTrophy, 
  FaStar, 
  FaMedal, 
  FaAward, 
  FaGem, 
  FaFire, 
  FaRocket, 
  FaCertificate,
  FaShieldAlt,
  FaBrain,
  FaClock,
  FaCheckCircle,
  FaLock,
  FaUnlock,
  FaPlay,
  FaPercentage
} from "react-icons/fa";
import { getCurrentUser, getStudentDashboard } from "../../services/storage";

export default function RewardsBadgesPage() {
  const user = getCurrentUser();
  const dashboard = getStudentDashboard(user?.email);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  // Safe badge data with error handling
  const badges = useMemo(() => {
    try {
      // Try to get badges from dashboard data first
      const userBadges = dashboard?.badges || [];
      
      // If we have real badges, use them
      if (userBadges.length > 0) {
        return userBadges.map((badge, index) => ({
          id: badge.id || index + 1,
          name: badge.name || "Achievement",
          description: badge.description || "Great job!",
          icon: getIconByName(badge.icon || "trophy"),
          color: badge.color || "from-blue-400 to-blue-600",
          glow: badge.glow || "shadow-blue-500/30",
          earned: badge.earned !== undefined ? badge.earned : true,
          date: badge.date || new Date().toISOString().split('T')[0],
          rarity: badge.rarity || "rare",
          points: badge.points || 100
        }));
      }

      // Fallback: Generate badges from exam data
      const examCount = dashboard?.exams?.length || 0;
      const generatedBadges = [];

      if (examCount > 0) {
        generatedBadges.push({
          id: 1,
          name: "First Step",
          description: "Completed your first mock exam",
          icon: FaStar,
          color: "from-blue-400 to-blue-600",
          glow: "shadow-blue-500/30",
          earned: true,
          date: dashboard?.exams?.[0]?.takenAt || new Date().toISOString().split('T')[0],
          rarity: "rare",
          points: 100
        });
      }

      if (examCount >= 3) {
        generatedBadges.push({
          id: 2,
          name: "Practice Makes Perfect",
          description: "Completed 3 mock exams",
          icon: FaRocket,
          color: "from-purple-400 to-purple-600",
          glow: "shadow-purple-500/30",
          earned: true,
          date: new Date().toISOString().split('T')[0],
          rarity: "epic",
          points: 200
        });
      }

      if (examCount >= 5) {
        generatedBadges.push({
          id: 3,
          name: "Dedicated Student",
          description: "Completed 5 mock exams",
          icon: FaFire,
          color: "from-orange-400 to-orange-600",
          glow: "shadow-orange-500/30",
          earned: true,
          date: new Date().toISOString().split('T')[0],
          rarity: "legendary",
          points: 350
        });
      }

      // Add some locked badges for goals
      if (examCount < 10) {
        generatedBadges.push({
          id: 4,
          name: "Marathon Runner",
          description: "Complete 10 mock exams",
          icon: FaMedal,
          color: "from-red-400 to-red-600",
          glow: "shadow-red-500/30",
          earned: false,
          date: null,
          rarity: "legendary",
          points: 500
        });
      }

      if (examCount < 7) {
        generatedBadges.push({
          id: 5,
          name: "Consistency King",
          description: "Complete 7 mock exams",
          icon: FaTrophy,
          color: "from-yellow-400 to-yellow-600",
          glow: "shadow-yellow-500/30",
          earned: false,
          date: null,
          rarity: "epic",
          points: 350
        });
      }

      // Always have at least one locked badge as a goal
      if (generatedBadges.length === 0 || generatedBadges.every(b => b.earned)) {
        generatedBadges.push({
          id: 99,
          name: "Perfect Score",
          description: "Achieve 100% on any mock exam",
          icon: FaGem,
          color: "from-cyan-400 to-cyan-600",
          glow: "shadow-cyan-500/30",
          earned: false,
          date: null,
          rarity: "legendary",
          points: 600
        });
      }

      return generatedBadges;

    } catch (error) {
      console.error("Error loading badges:", error);
      // Return default badges if everything fails
      return [
        {
          id: 1,
          name: "Welcome",
          description: "Welcome to ACET prep!",
          icon: FaStar,
          color: "from-blue-400 to-blue-600",
          glow: "shadow-blue-500/30",
          earned: true,
          date: new Date().toISOString().split('T')[0],
          rarity: "common",
          points: 50
        },
        {
          id: 2,
          name: "First Exam",
          description: "Complete your first mock exam",
          icon: FaTrophy,
          color: "from-yellow-400 to-yellow-600",
          glow: "shadow-yellow-500/30",
          earned: false,
          date: null,
          rarity: "epic",
          points: 300
        }
      ];
    }
  }, [dashboard]);

  const earnedBadges = badges.filter(b => b.earned);
  const lockedBadges = badges.filter(b => !b.earned);
  const totalPoints = earnedBadges.reduce((sum, b) => sum + (b.points || 0), 0);
  const completionRate = badges.length > 0 ? Math.round((earnedBadges.length / badges.length) * 100) : 0;

  const getRarityBadge = (rarity) => {
    const badges = {
      common: "bg-gray-500/20 text-gray-400 border-gray-500/20",
      rare: "bg-blue-500/20 text-blue-400 border-blue-500/20",
      epic: "bg-purple-500/20 text-purple-400 border-purple-500/20",
      legendary: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
    };
    return badges[rarity] || badges.common;
  };

  const getIconByName = (name) => {
    const icons = {
      trophy: FaTrophy,
      star: FaStar,
      medal: FaMedal,
      award: FaAward,
      gem: FaGem,
      fire: FaFire,
      rocket: FaRocket,
      certificate: FaCertificate,
      shield: FaShieldAlt,
      brain: FaBrain,
      clock: FaClock,
      check: FaCheckCircle
    };
    return icons[name] || FaStar;
  };

  return (
    <>
      <style>{`
        .rewards-page {
          background: radial-gradient(ellipse at 50% 0%, #003b88 0%, #001c44 40%, #00122c 70%, #000c1d 100%);
          min-height: 100vh;
          padding: 24px;
        }

        .rewards-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .glass-card-premium {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .glass-card-premium:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
        }

        .badge-card {
          position: relative;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }

        .badge-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 60%);
          pointer-events: none;
          transition: all 0.6s ease;
        }

        .badge-card:hover::before {
          transform: scale(1.2);
        }

        .badge-card.earned {
          border-color: rgba(255, 255, 255, 0.15);
        }

        .badge-card.locked {
          opacity: 0.5;
          filter: grayscale(0.5);
        }

        .badge-card .badge-icon {
          font-size: 2.5rem;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .badge-card:hover .badge-icon {
          transform: scale(1.1) rotate(-5deg);
        }

        .badge-card .shine {
          position: absolute;
          top: -100%;
          left: -100%;
          width: 300%;
          height: 300%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.03) 50%,
            transparent 70%
          );
          transform: rotate(45deg);
          transition: all 0.8s ease;
          pointer-events: none;
        }

        .badge-card:hover .shine {
          top: 100%;
          left: 100%;
        }

        .badge-card .glow-ring {
          position: absolute;
          inset: -2px;
          border-radius: 20px;
          padding: 2px;
          background: conic-gradient(
            from 0deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.6s ease;
        }

        .badge-card:hover .glow-ring {
          opacity: 1;
          animation: spin 4s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .stat-card-premium {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .stat-card-premium:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #ffffff 0%, #93c5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rarity-badge {
          font-size: 0.6rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 12px;
          border-radius: 9999px;
          border: 1px solid transparent;
        }

        .progress-fill {
          transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .particle {
          position: fixed;
          pointer-events: none;
          border-radius: 50%;
          opacity: 0.1;
          animation: float 20s infinite linear;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(0) rotate(180deg); }
          75% { transform: translateY(20px) rotate(270deg); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

      <div className="rewards-page">
        <div className="rewards-container">
          
          {/* Floating Particles Background */}
          <div className="particle" style={{ width: '300px', height: '300px', top: '10%', left: '-5%', background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
          <div className="particle" style={{ width: '200px', height: '200px', bottom: '20%', right: '-3%', background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', animationDelay: '-5s' }} />
          <div className="particle" style={{ width: '150px', height: '150px', top: '50%', left: '50%', background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', animationDelay: '-10s' }} />

          {/* Header Section */}
          <header className="mb-10 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/30">
                    <FaTrophy className="text-white text-lg" />
                  </span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">Rewards & Badges</h1>
                <p className="text-white/50 mt-1 text-sm">Track your achievements and unlock new milestones</p>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3">
                <FaGem className="text-2xl text-cyan-400" />
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-white/40">Total Points</p>
                  <p className="text-2xl font-black text-white">{totalPoints}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
            <div className="stat-card-premium">
              <div className="flex items-center justify-between">
                <FaAward className="text-blue-400 text-xl" />
                <span className="text-xs font-bold text-white/30">STATS</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/40 mt-3">Badges Earned</p>
              <p className="stat-number">{earnedBadges.length}</p>
              <p className="text-xs text-white/30 mt-1">of {badges.length} total</p>
            </div>

            <div className="stat-card-premium">
              <div className="flex items-center justify-between">
                <FaPercentage className="text-emerald-400 text-xl" />
                <span className="text-xs font-bold text-white/30">STATS</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/40 mt-3">Completion</p>
              <p className="stat-number">{completionRate}%</p>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                  className="progress-fill h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full"
                  style={{ width: animated ? `${completionRate}%` : '0%' }}
                />
              </div>
            </div>

            <div className="stat-card-premium">
              <div className="flex items-center justify-between">
                <FaFire className="text-orange-400 text-xl" />
                <span className="text-xs font-bold text-white/30">STATS</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/40 mt-3">Total Points</p>
              <p className="stat-number">{totalPoints}</p>
              <p className="text-xs text-white/30 mt-1">across all badges</p>
            </div>

            <div className="stat-card-premium">
              <div className="flex items-center justify-between">
                <FaRocket className="text-purple-400 text-xl" />
                <span className="text-xs font-bold text-white/30">STATS</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/40 mt-3">Next Milestone</p>
              <p className="text-lg font-black text-white">{lockedBadges.length} locked</p>
              <p className="text-xs text-white/30 mt-1">badges remaining</p>
            </div>
          </section>

          {/* Earned Badges Section */}
          {earnedBadges.length > 0 && (
            <section className="mb-10 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FaUnlock className="text-emerald-400" />
                  <h2 className="text-xl font-black text-white">Earned Badges</h2>
                  <span className="text-xs font-bold text-white/30 bg-white/5 px-3 py-1 rounded-full">
                    {earnedBadges.length}
                  </span>
                </div>
                <span className="text-xs text-white/30">Click to view details</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {earnedBadges.map((badge) => {
                  const Icon = badge.icon || FaStar;
                  const isSelected = selectedBadge?.id === badge.id;
                  
                  return (
                    <div
                      key={badge.id}
                      className={`badge-card earned glass-card-premium p-5 text-center ${isSelected ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-[#00122c]' : ''}`}
                      onClick={() => setSelectedBadge(isSelected ? null : badge)}
                    >
                      <div className="shine" />
                      <div className="glow-ring" />
                      
                      <div className={`badge-icon bg-gradient-to-br ${badge.color || 'from-blue-400 to-blue-600'} bg-clip-text text-transparent mx-auto`}>
                        <Icon />
                      </div>
                      
                      <h3 className="text-sm font-bold text-white mt-3 truncate">{badge.name || 'Achievement'}</h3>
                      
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className={`rarity-badge ${getRarityBadge(badge.rarity || 'rare')}`}>
                          {badge.rarity || 'rare'}
                        </span>
                        <span className="text-xs text-white/30">●</span>
                        <span className="text-xs text-white/30">{badge.points || 0} pts</span>
                      </div>

                      {badge.date && (
                        <p className="text-[10px] text-white/20 mt-2">
                          Earned: {new Date(badge.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Locked Badges Section */}
          {lockedBadges.length > 0 && (
            <section className="mb-10 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <FaLock className="text-white/30" />
                <h2 className="text-xl font-black text-white/50">Locked Badges</h2>
                <span className="text-xs font-bold text-white/20 bg-white/5 px-3 py-1 rounded-full">
                  {lockedBadges.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {lockedBadges.map((badge) => {
                  const Icon = badge.icon || FaStar;
                  
                  return (
                    <div
                      key={badge.id}
                      className="badge-card locked glass-card-premium p-5 text-center"
                    >
                      <div className="badge-icon text-white/20 mx-auto">
                        <Icon />
                      </div>
                      
                      <h3 className="text-sm font-bold text-white/40 mt-3 truncate">{badge.name || 'Locked'}</h3>
                      
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="rarity-badge bg-white/5 text-white/20 border-white/5">
                          {badge.rarity || 'common'}
                        </span>
                        <span className="text-xs text-white/10">●</span>
                        <span className="text-xs text-white/10">{badge.points || 0} pts</span>
                      </div>
                      
                      <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-white/10 rounded-full" style={{ width: '0%' }} />
                      </div>
                      <p className="text-[10px] text-white/10 mt-2">Not yet earned</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Badge Detail Modal */}
          {selectedBadge && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="glass-card-premium p-8 max-w-md w-full relative animate-in">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-xl"
                >
                  ✕
                </button>
                
                <div className="text-center">
                  <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${selectedBadge.color || 'from-blue-400 to-blue-600'} shadow-xl ${selectedBadge.glow || 'shadow-blue-500/30'} mb-4`}>
                    {selectedBadge.icon ? (
                      <selectedBadge.icon className="text-5xl text-white" />
                    ) : (
                      <FaStar className="text-5xl text-white" />
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-black text-white">{selectedBadge.name || 'Achievement'}</h3>
                  
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <span className={`rarity-badge ${getRarityBadge(selectedBadge.rarity || 'rare')}`}>
                      {selectedBadge.rarity || 'rare'}
                    </span>
                    <span className="text-white/30">●</span>
                    <span className="text-white/50 text-sm font-bold">{selectedBadge.points || 0} points</span>
                  </div>
                  
                  <p className="text-white/60 text-sm mt-4 leading-relaxed">
                    {selectedBadge.description || 'Great achievement!'}
                  </p>
                  
                  {selectedBadge.earned && selectedBadge.date && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-white/30">
                        Earned on {new Date(selectedBadge.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  
                  {!selectedBadge.earned && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-white/30">
                        Keep practicing to unlock this badge!
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-bold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State - If no badges */}
          {earnedBadges.length === 0 && (
            <div className="text-center py-16 relative z-10">
              <div className="inline-flex p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
                <FaTrophy className="text-6xl text-white/20" />
              </div>
              <h2 className="text-2xl font-black text-white/50">No badges earned yet</h2>
              <p className="text-white/30 mt-2">Complete mock exams to start earning achievements</p>
              <Link 
                to="/exam" 
                className="inline-flex items-center gap-2 mt-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-bold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
              >
                <FaPlay className="text-xs" /> Start Your Journey
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}