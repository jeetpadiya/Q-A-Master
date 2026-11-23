import { useContext, useEffect, useMemo, useState } from "react";
import { QuizContext } from "../context/QuizContext";
import certificateTemplate from "../assets/certificate-template.png";
import { toast } from "sonner";
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
        ctx.drawImage(img, 0, 0, 2000, 1414);

        ctx.font = "italic 700 86px 'Plus Jakarta Sans', Georgia, serif";
        ctx.fillStyle = "#b88b43";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(cert.recipientName || "Learner", 1000, 650);

        ctx.font = "500 28px 'Plus Jakarta Sans', system-ui, sans-serif";
        ctx.fillStyle = "#28221d";
        const awardText = `Awarded for completing the ${cert.category} challenge in Q-A-Master with a score of ${cert.score}/${cert.totalQuestions}.`;
        ctx.fillText(awardText, 1000, 870);

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

        const link = document.createElement("a");
        const cleanName = (cert.recipientName || "Learner").replace(/[^a-zA-Z0-9]/g, "_");
        const cleanTrack = (cert.category || "Track").replace(/[^a-zA-Z0-9]/g, "_");
        link.download = `Certificate_${cleanTrack}_${cleanName}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("Certificate PNG downloaded!");
      } catch (err) {
        console.error("Canvas export failed:", err);
        toast.error("Failed to generate download");
      } finally {
        setIsDownloading(false);
      }
    };

    img.onerror = () => {
      setIsDownloading(false);
      toast.error("Failed to load certificate template");
    };
  };

  return (
    <section className="min-h-screen bg-[#09090b] px-4 sm:px-6 lg:px-8 py-10 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-zinc-800 bg-[#121215] p-6 sm:p-7 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-zinc-500">
              <span>PORTFOLIO / CREDENTIALS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              {user?.name ? `${user.name}'s Verified Certificates` : "Your Certificates"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Cryptographically verified credentials awarded for technical excellence.
            </p>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs">
            <span className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-300">
              🔥 {streak || 1}d Streak
            </span>
            <span className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-300">
              ⚡ {xp || 120} XP
            </span>
            <span className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-emerald-400 font-semibold">
              {earnedCertificates.length} Earned
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-[#121215] p-5">
              <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-3 font-semibold">
                Earned Credentials ({earnedCertificates.length})
              </h2>
              <div className="space-y-2">
                {earnedCertificates.length > 0 ? (
                  earnedCertificates.map((certificate) => (
                    <button
                      key={certificate.id || certificate._id || certificate.verificationCode}
                      onClick={() => {
                        playTactilePop();
                        setActiveCategory(certificate.category);
                      }}
                      className={`w-full rounded-lg border p-3.5 text-left transition font-mono text-xs ${
                        selectedCertificate?.category === certificate.category
                          ? "border-zinc-600 bg-zinc-800/80 text-zinc-100"
                          : "border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                      }`}
                    >
                      <p className="font-semibold text-sm font-sans text-zinc-200">{certificate.category}</p>
                      <p className="mt-1 text-[11px] text-zinc-500">
                        {certificate.verificationCode}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="rounded border border-dashed border-zinc-800 p-4 text-xs text-zinc-500 leading-relaxed font-mono">
                    No certificates unlocked yet. Complete an adaptive assessment or score 10/10 in blitz mode.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-[#121215] p-5">
              <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-3 font-semibold">
                Available Tracks ({lockedCategories.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {lockedCategories.length > 0 ? (
                  lockedCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        playTactilePop();
                        handleCategoryChange(category);
                      }}
                      className="rounded border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition"
                    >
                      {category}
                    </button>
                  ))
                ) : (
                  <p className="font-mono text-xs text-emerald-400">
                    All tracks completed!
                  </p>
                )}
              </div>
            </div>
          </aside>

          {/* Main Certificate View */}
          <div className="rounded-xl border border-zinc-800 bg-[#121215] p-5 sm:p-6 shadow-sm">
            {selectedCertificate ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg bg-black p-3 border border-zinc-800">
                  <div className="relative mx-auto aspect-[1.414/1] w-full max-w-4xl overflow-hidden rounded shadow-xl">
                    <img
                      src={certificateTemplate}
                      alt="Certificate template"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 text-center text-[#23160c]">
                      <div className="absolute left-1/2 top-[46%] z-10 w-[43%] -translate-x-1/2 -translate-y-1/2 px-5 py-3">
                        <h2 className="text-[clamp(1.6rem,3.8vw,3.8rem)] font-bold italic leading-none text-[#b88b43]">
                          {selectedCertificate.recipientName}
                        </h2>
                      </div>

                      <div className="absolute left-1/2 top-[61.5%] z-10 w-[62%] -translate-x-1/2 -translate-y-1/2 px-8 py-4">
                        <p className="text-[clamp(0.8rem,1.2vw,1.1rem)] leading-relaxed text-[#28221d] font-medium">
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

                {/* Actions Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 font-mono text-xs">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-emerald-400">✓ Verified:</span>
                    <span className="text-zinc-200 font-semibold">
                      {selectedCertificate.verificationCode || "QAM-OFFICIAL"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {selectedCertificate.verificationCode && (
                      <button
                        onClick={() => copyVerificationCode(selectedCertificate.verificationCode)}
                        className="btn-secondary py-1.5 px-3 text-xs flex-1 sm:flex-initial"
                      >
                        Copy Code
                      </button>
                    )}

                    <button
                      onClick={() => downloadCertificatePng(selectedCertificate)}
                      disabled={isDownloading}
                      className="btn-primary py-1.5 px-4 text-xs flex-1 sm:flex-initial disabled:opacity-50"
                    >
                      {isDownloading ? "Generating..." : "Download PNG ↓"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-zinc-800 p-8 text-center">
                <div>
                  <h2 className="text-base font-semibold text-zinc-300">
                    No certificate selected
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500 font-mono">
                    Complete an assessment track to unlock your credential.
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
