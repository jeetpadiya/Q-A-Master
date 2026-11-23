import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
      toast.error("Please enter email and password.");
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
    <section className="min-h-screen bg-[#09090b] flex items-center justify-center px-4 py-12 text-zinc-100">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-[#121215] p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <div className="flex h-7 w-7 items-center justify-center rounded border border-zinc-700 bg-zinc-800 text-zinc-100 font-mono text-xs font-bold mb-3">
            QA
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Sign in to Q-A Master</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Continue your adaptive assessment trail.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-2.5 text-xs font-semibold mt-2"
          >
            {isSubmitting ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="mt-6 pt-4 border-t border-zinc-800 text-center text-xs text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-zinc-300 hover:text-white transition">
            Create account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
