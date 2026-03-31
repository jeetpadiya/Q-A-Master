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
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl md:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-slate-950/70 p-8 sm:p-10">
            <div className="mx-auto max-w-md">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                Login
              </p>
              <h2 className="mt-3 text-3xl font-semibold">Welcome back</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
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
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Email Address
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Password
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Signing in..." : "Login & Continue"}
                </button>
              </form>
            </div>
          </div>

          <div className="hidden flex-col justify-between bg-black/20 p-10 md:flex">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/20 px-4 py-1 text-sm font-medium tracking-[0.2em] uppercase text-cyan-100">
                Q-A Master
              </p>
              <h1 className="max-w-md text-4xl font-bold leading-tight">
                Pick up where you left off and keep the streak going.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-cyan-100/80">
                Your quiz history, timed rounds, and progress are waiting once
                you sign back in.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
                Ready to continue?
              </p>
              <div className="space-y-3 text-sm text-slate-100/90">
                <p>Return to your quiz dashboard instantly.</p>
                <p>Practice with the same clean timed flow.</p>
                <p>Switch between login and register whenever you need.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
