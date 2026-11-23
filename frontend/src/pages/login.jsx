import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { QuizContext } from "../context/QuizContext";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useContext(QuizContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please complete all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await handleLogin(
        formData.email.trim(),
        formData.password
      );

      toast.success(data.message || "Logged in successfully.");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#155e75_0%,#13073e_50%,#070114_100%)] px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl md:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-slate-950/70 p-8 sm:p-10">
            <div className="mx-auto max-w-md">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-300">
                Account Sign In
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Welcome back</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Sign in to continue your quiz progress and jump back into the challenge.
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Need an account?{" "}
                <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
                  Register here
                </Link>
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-xs font-mono uppercase tracking-wider font-semibold text-slate-300">
                    Email Address
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-mono uppercase tracking-wider font-semibold text-slate-300">
                    Password
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-sm sm:text-base text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Signing in..." : "Sign In →"}
                </button>
              </form>
            </div>
          </div>
          <div className="hidden flex-col justify-between bg-black/20 p-10 md:flex">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest font-semibold text-cyan-300 mb-3">
                Q-A Master
              </p>
              <h3 className="text-2xl font-bold leading-snug">
                Track your developer knowledge across tracks.
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
