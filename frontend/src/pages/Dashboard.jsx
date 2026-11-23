import { useContext, useEffect, useMemo, useState } from "react";
import { QuizContext } from "../context/QuizContext";
import certificateTemplate from "../assets/certificate-template.png";
import { toast } from "react-toastify";
import { FlameIcon } from "../components/TechIcon";
import { playTactilePop } from "../utils/sound";

const Dashboard = () => {
  const { user, earnedCertificates, categories, handleCategoryChange, xp, streak } =
    useContext(QuizContext);
  const [activeCategory, setActiveCategory] = useState(
    earnedCertificates[0]?.category || ""
  );
  const [isDownloading, setIsDownloading] = useState(false);

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

  const copyVerificationCode = (code) => {
    if (!code) return;
    playTactilePop();
    navigator.clipboard.writeText(code);
    toast.success(`Verification code copied: ${code}`);
  };

  /**
   * 1-Click High-Res Canvas Certificate Exporter (PNG)
   * Renders native 2000x1414 canvas with pixel-perfect typography and metadata
   */
  const downloadCertificatePng = (cert) => {
    if (!cert) return;
    playTactilePop();
    setIsDownloading(true);

    const canvas = document.createElement("canvas");
    canvas.width = 2000;
    canvas.height = 1414;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = certificateTemplate;

    img.onload = () => {
      try {
        // 1. Draw base certificate background
        ctx.drawImage(img, 0, 0, 2000, 1414);

        // 2. Draw Recipient Name
        ctx.font = "italic 700 86px 'Plus Jakarta Sans', Georgia, serif";
        ctx.fillStyle = "#b88b43";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(cert.recipientName || "Learner", 1000, 650);

        // 3. Draw Award description
        ctx.font = "500 28px 'Plus Jakarta Sans', system-ui, sans-serif";
        ctx.fillStyle = "#28221d";
        const awardText = `Awarded for completing the ${cert.category} challenge in Q-A-Master with a score of ${cert.score}/${cert.totalQuestions}.`;
        ctx.fillText(awardText, 1000, 870);

        // 4. Draw Verification Code & Date at the bottom
        ctx.font = "600 22px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#554433";
        ctx.textAlign = "right";
        const code = cert.verificationCode || "QAM-OFFICIAL";
        ctx.fillText(`ID: ${code}`, 1820, 1340);

        const dateStr = cert.issuedAt
          ? new Date(cert.issuedAt).toLocaleDateString()
          : new Date().toLocaleDateString();
        ctx.textAlign = "left";
        ctx.fillText(`Verified Issued: ${dateStr}`, 180, 1340);

        // 5. Trigger download
        const link = document.createElement("a");
        const cleanName = (cert.recipientName || "Learner").replace(/[^a-zA-Z0-9]/g, "_");
        const cleanTrack = (cert.category || "Track").replace(/[^a-zA-Z0-9]/g, "_");
        link.download = `Certificate_${cleanTrack}_${cleanName}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("High-resolution certificate downloaded!");
      } catch (err) {
        console.error("Canvas export failed:", err);
        toast.error("Failed to generate download. Please try again.");
      } finally {
        setIsDownloading(false);
      }
    };

    img.onerror = () => {
      setIsDownloading(false);
      toast.error("Failed to load certificate template for export");
    };
  };

  return (
    <section className="min-h-screen bg-[#090d16] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header with Gamification Badges */}
        <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-white/10 bg-[#0f172a] p-6 sm:p-8 shadow-2xl lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-300">
                Verified Dashboard
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-400/30 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                ● Active
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {user?.name ? `${user.name}'s Credentials` : "Your Certificates"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base font-normal leading-relaxed text-slate-300">
              Verified certifications earned by scoring 100% in challenge tracks. Synced permanently to your account.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 font-mono text-xs font-bold text-amber-300">
              <FlameIcon className="w-4 h-4 text-amber-400" />
              <span>{streak || 1}d Streak</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 font-mono text-xs font-bold text-cyan-300">
              <span>⚡</span>
              <span>{xp || 120} XP</span>
            </div>

            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 font-mono text-xs font-bold text-emerald-200">
              Earned: <span className="text-sm font-extrabold text-emerald-300 ml-1">{earnedCertificates.length}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-6">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Unlocked Tracks ({earnedCertificates.length})
              </h2>
              <div className="mt-4 space-y-3">
                {earnedCertificates.length > 0 ? (
                  earnedCertificates.map((certificate) => (
                    <button
                      key={certificate.id || certificate._id || certificate.verificationCode}
                      onClick={() => {
                        playTactilePop();
                        setActiveCategory(certificate.category);
                      }}
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        selectedCertificate?.category === certificate.category
                          ? "border-cyan-300 bg-cyan-300/15"
                          : "border-white/10 bg-slate-950/40 hover:border-cyan-300/50"
                      }`}
                    >
                      <p className="font-bold text-sm text-white">{certificate.category}</p>
                      <p className="mt-1 font-mono text-[11px] text-emerald-300 flex items-center gap-1">
                        <span>✓</span> Server Verified
                      </p>
                      {certificate.verificationCode && (
                        <p className="mt-1 font-mono text-[10px] text-slate-400">
                          {certificate.verificationCode}
                        </p>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="rounded-xl border border-dashed border-white/15 bg-slate-950/30 px-4 py-5 text-xs text-slate-400 leading-relaxed">
                    No certificates unlocked yet. Score 100% on any track to unlock an official credential.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-6">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-300">
                Locked Tracks ({lockedCategories.length})
              </h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {lockedCategories.length > 0 ? (
                  lockedCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        playTactilePop();
                        handleCategoryChange(category);
                      }}
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

          {/* Main Certificate View Area */}
          <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-4 sm:p-6 shadow-2xl">
            {selectedCertificate ? (
              <div className="space-y-5">
                {/* Visual Certificate Card */}
                <div className="overflow-hidden rounded-xl bg-[#070a12] p-4">
                  <div className="relative mx-auto aspect-[1.414/1] w-full max-w-5xl overflow-hidden rounded-xl shadow-2xl border border-white/5">
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

                      {selectedCertificate.verificationCode && (
                        <div className="absolute bottom-4 right-6 font-mono text-[10px] text-[#28221d]/70">
                          ID: {selectedCertificate.verificationCode}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Certificate Action Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓ Official Credential:</span>
                    <span className="text-slate-300 font-semibold">
                      {selectedCertificate.verificationCode || "QAM-OFFICIAL"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    {selectedCertificate.verificationCode && (
                      <button
                        onClick={() => copyVerificationCode(selectedCertificate.verificationCode)}
                        className="btn-tactile-dark px-3.5 py-2 text-xs flex-1 sm:flex-initial"
                      >
                        Copy Code
                      </button>
                    )}

                    <button
                      onClick={() => downloadCertificatePng(selectedCertificate)}
                      disabled={isDownloading}
                      className="btn-tactile-primary px-4 py-2 text-xs font-bold flex-1 sm:flex-initial disabled:opacity-50"
                    >
                      {isDownloading ? "Generating..." : "Download PNG ↓"}
                    </button>
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
