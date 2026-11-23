import React from 'react';

/**
 * Clean developer tier calibration based on technical level (1.0 to 5.0)
 */
export const getLevelTier = (lvl) => {
  const level = Number(lvl) || 1.0;
  if (level >= 4.5) {
    return {
      title: 'Architect / Staff',
      stars: 'L5',
      badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
      barColor: 'bg-amber-400',
    };
  }
  if (level >= 3.8) {
    return {
      title: 'Senior Engineer',
      stars: 'L4',
      badgeClass: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
      barColor: 'bg-violet-400',
    };
  }
  if (level >= 2.8) {
    return {
      title: 'Mid-Level Dev',
      stars: 'L3',
      badgeClass: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
      barColor: 'bg-blue-400',
    };
  }
  if (level >= 1.8) {
    return {
      title: 'Junior Developer',
      stars: 'L2',
      badgeClass: 'border-teal-500/30 bg-teal-500/10 text-teal-300',
      barColor: 'bg-teal-400',
    };
  }
  return {
    title: 'Foundational',
    stars: 'L1',
    badgeClass: 'border-zinc-700 bg-zinc-800 text-zinc-300',
    barColor: 'bg-zinc-300',
  };
};

export const AdaptiveGauge = ({ currentLevel = 1.0, peakLevel = 1.0, streak = 0 }) => {
  const tier = getLevelTier(currentLevel);
  const percentage = Math.min(100, Math.max(0, ((currentLevel - 1.0) / 4.0) * 100));

  return (
    <div className="w-full rounded-xl border border-zinc-800 bg-[#121215] p-4 sm:p-5 shadow-sm font-mono text-xs">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 uppercase tracking-widest text-[11px]">
            Difficulty:
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-bold ${tier.badgeClass}`}
          >
            <span>[{tier.stars}]</span>
            <span>{tier.title}</span>
            <span className="text-zinc-400 font-normal">({currentLevel.toFixed(1)})</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          {streak >= 2 && (
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <span>🔥</span>
              <span>{streak} in a row</span>
            </span>
          )}
          <span>
            Peak: <strong className="text-zinc-200">{peakLevel.toFixed(1)}</strong>
          </span>
        </div>
      </div>

      {/* Minimalist Progress Meter */}
      <div className="relative">
        <div className="h-1.5 w-full rounded-full bg-zinc-900 border border-zinc-800/80 overflow-hidden">
          <div
            className={`h-full ${tier.barColor} transition-all duration-300 ease-out`}
            style={{ width: `${Math.max(6, percentage)}%` }}
          />
        </div>

        {/* Milestone Marks */}
        <div className="flex justify-between mt-2 text-[10px] text-zinc-500 uppercase tracking-wider">
          <span>Junior (1.0)</span>
          <span>Mid (2.5)</span>
          <span>Senior (4.0)</span>
          <span>Staff (5.0)</span>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveGauge;
