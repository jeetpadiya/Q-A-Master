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
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              {user?.name ? `${user.name}'s Certificates` : "Your Certificates"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Clear all questions in a track with a perfect score to unlock its
              completion certificate. Each earned certificate appears here.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
            Certificates earned:{" "}
            <span className="font-bold">{earnedCertificates.length}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Unlocked</h2>
              <div className="mt-4 space-y-3">
                {earnedCertificates.length > 0 ? (
                  earnedCertificates.map((certificate) => (
                    <button
                      key={certificate.id}
                      onClick={() => setActiveCategory(certificate.category)}
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                        selectedCertificate?.category === certificate.category
                          ? "border-cyan-300 bg-cyan-300/15"
                          : "border-white/10 bg-slate-950/40 hover:border-cyan-300/50"
                      }`}
                    >
                      <p className="font-semibold">{certificate.category}</p>
                      <p className="mt-1 text-sm text-slate-300">
                        Perfect score certificate
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-white/15 bg-slate-950/30 px-4 py-5 text-sm text-slate-400">
                    No certificates yet. Finish a full track with all answers
                    correct to unlock one.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Locked Tracks</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {lockedCategories.length > 0 ? (
                  lockedCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className="rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-100 transition hover:border-amber-300 hover:bg-amber-300 hover:text-slate-950"
                    >
                      {category}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-emerald-300">
                    Every available track is unlocked.
                  </p>
                )}
              </div>
            </div>
          </aside>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl">
            {selectedCertificate ? (
              <div className="overflow-hidden rounded-3xl bg-[#0d1228] p-4">
                <div className="relative mx-auto aspect-[1.414/1] w-full max-w-5xl overflow-hidden rounded-2xl">
                  <img
                    src={certificateTemplate}
                    alt="Certificate template"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 text-center text-[#23160c]">
                    <div className="absolute left-1/2 top-[46%] z-10 w-[43%] -translate-x-1/2 -translate-y-1/2 px-5 py-3">
                      <h2 className="text-[clamp(2rem,4.4vw,4.4rem)] font-semibold italic leading-none text-[#b88b43]">
                        {selectedCertificate.recipientName}
                      </h2>
                    </div>

                    <div className="absolute left-1/2 top-[61.5%] z-10 w-[62%] -translate-x-1/2 -translate-y-1/2 px-8 py-4">
                      <p className="text-[clamp(0.9rem,1.35vw,1.16rem)] leading-relaxed text-[#28221d]">
                        Awarded for completing the{" "}
                        <span className="font-semibold text-[#b88b43]">
                          {selectedCertificate.category}
                        </span>{" "}
                        challenge in Q-A-Master with a score of{" "}
                        <span className="font-semibold text-[#b88b43]">
                          {selectedCertificate.score}/{selectedCertificate.totalQuestions}
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-slate-950/30 p-8 text-center">
                <div>
                  <h2 className="text-2xl font-semibold">No certificate unlocked yet</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Finish every question in a selected track with a full score
                    to generate a certificate here.
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
