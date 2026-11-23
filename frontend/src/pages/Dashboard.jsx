import { useContext, useEffect, useMemo, useState } from "react";
import { QuizContext } from "../context/QuizContext";
import certificateTemplate from "../assets/certificate-template.png";

const Dashboard = () => {
  const { user, earnedCertificates, categories, handleCategoryChange } =
    useContext(QuizContext);
  const [activeCategory, setActiveCategory] = useState(
    earnedCertificates[0]?.category || ""
  );

  useEffect(() => {
    if (!earnedCertificates.length) {
      setActiveCategory("");
      return;
    }

    const hasActiveCertificate = earnedCertificates.some(
      (item) => item.category === activeCategory
    );

    if (!hasActiveCertificate) {
      setActiveCategory(earnedCertificates[0].category);
    }
  }, [activeCategory, earnedCertificates]);

  const selectedCertificate = useMemo(() => {
    return (
      earnedCertificates.find((item) => item.category === activeCategory) ||
      earnedCertificates[0] ||
      null
    );
  }, [activeCategory, earnedCertificates]);

  const lockedCategories = categories.filter(
    (category) =>
      !earnedCertificates.some((certificate) => certificate.category === category)
  );

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#090d24_0%,#101934_45%,#09111f_100%)] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-300">
              Personal Dashboard
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {user?.name ? `${user.name}'s Certificates` : "Your Certificates"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base font-normal leading-relaxed text-slate-300">
              Clear all questions in a track with a perfect score to unlock its
              verified completion certificate.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 font-mono text-xs uppercase tracking-wider text-emerald-200">
            Earned: <span className="font-bold text-base text-emerald-300 ml-1">{earnedCertificates.length}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-bold text-base text-white tracking-tight uppercase font-mono text-xs tracking-wider text-cyan-300">
                Unlocked Tracks
              </h2>
              <div className="mt-4 space-y-3">
                {earnedCertificates.length > 0 ? (
                  earnedCertificates.map((certificate) => (
                    <button
                      key={certificate.id}
                      onClick={() => setActiveCategory(certificate.category)}
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        selectedCertificate?.category === certificate.category
                          ? "border-cyan-300 bg-cyan-300/15"
                          : "border-white/10 bg-slate-950/40 hover:border-cyan-300/50"
                      }`}
                    >
                      <p className="font-bold text-sm text-white">{certificate.category}</p>
                      <p className="mt-1 font-mono text-xs text-slate-400">
                        Perfect score verified
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="rounded-xl border border-dashed border-white/15 bg-slate-950/30 px-4 py-5 text-xs text-slate-400 leading-relaxed">
                    No certificates unlocked yet. Complete any track with 100% correct answers.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-300">
                Locked Tracks
              </h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {lockedCategories.length > 0 ? (
                  lockedCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-amber-200 transition hover:border-amber-300 hover:bg-amber-300 hover:text-slate-950"
                    >
                      {category}
                    </button>
                  ))
                ) : (
                  <p className="font-mono text-xs text-emerald-300">
                    All available tracks unlocked!
                  </p>
                )}
              </div>
            </div>
          </aside>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl">
            {selectedCertificate ? (
              <div className="overflow-hidden rounded-xl bg-[#0d1228] p-4">
                <div className="relative mx-auto aspect-[1.414/1] w-full max-w-5xl overflow-hidden rounded-xl">
                  <img
                    src={certificateTemplate}
                    alt="Certificate template"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 text-center text-[#23160c]">
                    <div className="absolute left-1/2 top-[46%] z-10 w-[43%] -translate-x-1/2 -translate-y-1/2 px-5 py-3">
                      <h2 className="text-[clamp(1.8rem,4vw,4rem)] font-bold italic leading-none text-[#b88b43]">
                        {selectedCertificate.recipientName}
                      </h2>
                    </div>

                    <div className="absolute left-1/2 top-[61.5%] z-10 w-[62%] -translate-x-1/2 -translate-y-1/2 px-8 py-4">
                      <p className="text-[clamp(0.85rem,1.3vw,1.15rem)] leading-relaxed text-[#28221d] font-medium">
                        Awarded for completing the{" "}
                        <span className="font-bold text-[#b88b43]">
                          {selectedCertificate.category}
                        </span>{" "}
                        challenge in Q-A-Master with a score of{" "}
                        <span className="font-bold text-[#b88b43]">
                          {selectedCertificate.score}/{selectedCertificate.totalQuestions}
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-slate-950/30 p-8 text-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    No certificate unlocked yet
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400 max-w-md mx-auto">
                    Finish every question in a selected track with a full score
                    to generate your verified certificate here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
