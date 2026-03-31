import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { QuizContext } from "../context/QuizContext";

const Register = () => {
  const navigate = useNavigate();
  const { handleregister } = useContext(QuizContext);
  const [formData, setFormData] = useState({
    name: "",
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

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please complete all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await handleregister(
        formData.name.trim(),
        formData.email.trim(),
        formData.password
      );

      toast.success(data.message || "Registered successfully.");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#5b21b6_0%,#13073e_45%,#070114_100%)] px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden flex-col justify-between bg-black/20 p-10 md:flex">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/20 px-4 py-1 text-sm font-medium tracking-[0.2em] uppercase text-violet-100">
                Q-A Master
              </p>
              <h1 className="max-w-md text-4xl font-bold leading-tight">
                Start your quiz journey with a quick account setup.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-violet-100/80">
                Create your profile to unlock the question bank, track your
                progress, and jump straight into the challenge.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-violet-200/80">
                What you get
              </p>
              <div className="space-y-3 text-sm text-slate-100/90">
                <p>Practice timed rounds with instant feedback.</p>
                <p>Keep your quiz experience tied to your account.</p>
                <p>Move from signup to playing in a single step.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/70 p-8 sm:p-10">
            <div className="mx-auto max-w-md">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                Register
              </p>
              <h2 className="mt-3 text-3xl font-semibold">Create your account</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Fill in your details and we&apos;ll sign you in right away.
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
                  Login here
                </Link>
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Full Name
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                  />
                </label>

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
                    placeholder="Create a secure password"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Creating account..." : "Register & Continue"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
