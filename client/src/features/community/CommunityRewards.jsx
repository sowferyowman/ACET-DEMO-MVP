import { FaMedal } from "react-icons/fa";

export default function CommunityRewards({ rewards }) {
  if (!rewards.length) {
    return null;
  }

  return (
    <section id="community" className="space-y-6 pb-8">
      <header>
        <h2 className="text-3xl font-black text-slate-950">Community and Rewards</h2>
        <p className="mt-1 text-sm text-slate-500">Progress badges, peer milestones, and premium reward signals.</p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        {rewards.map((reward) => (
          <div key={reward.title} className="glass-card p-6">
            <div className="mb-4 inline-flex rounded-lg bg-yellow-100 p-3 text-yellow-700">
              <FaMedal />
            </div>
            <h3 className="text-lg font-black text-slate-950">{reward.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{reward.description}</p>
            <p className="mt-4 text-2xl font-black text-primary">{reward.points} pts</p>
          </div>
        ))}
      </div>
    </section>
  );
}
