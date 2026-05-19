import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    brand: "Toyota",
    condition: "Used",
    reg_year: 2015,
    engine_capacity: 1500,
    km_run: 50000,
    selected_model: "Random Forest", // NEW: Default model choice
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "brand" || name === "condition" || name === "selected_model"
          ? value
          : Number(value),
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // KEEP YOUR RENDER URL HERE!
      const response = await fetch(
        "https://machine-learning-project-1-wwky.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Failed to fetch prediction");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        "Could not connect to the AI model. Is the Flask server running?",
      );
      print(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-12 px-4 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <div className="text-center mb-10 mt-8 animate-[fade-in_0.8s_ease-out]">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Advanced AI Valuation
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Compare predictions across 3 different Machine Learning architectures.
        </p>
      </div>

      {/* Input Form */}
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
        <form
          onSubmit={handlePredict}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* NEW: Model Selection Dropdown */}
          <div className="flex flex-col space-y-2 md:col-span-2 p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl">
            <label className="text-sm text-indigo-300 font-bold tracking-wider uppercase">
              Select AI Model
            </label>
            <select
              name="selected_model"
              value={formData.selected_model}
              onChange={handleChange}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-medium"
            >
              <option value="Random Forest">Random Forest (Recommended)</option>
              <option value="Gradient Boosting">Gradient Boosting</option>
              <option value="Linear Regression">
                Linear Regression (Baseline)
              </option>
            </select>
          </div>

          {/* Standard Inputs */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              Car Brand
            </label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Nissan">Nissan</option>
              <option value="Mitsubishi">Mitsubishi</option>
              <option value="Suzuki">Suzuki</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              Condition
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Used">Used</option>
              <option value="Reconditioned">Reconditioned</option>
              <option value="New">New</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              Registration Year
            </label>
            <input
              type="number"
              name="reg_year"
              value={formData.reg_year}
              onChange={handleChange}
              required
              className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              Engine Capacity (CC)
            </label>
            <input
              type="number"
              name="engine_capacity"
              value={formData.engine_capacity}
              onChange={handleChange}
              required
              className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-col space-y-2 md:col-span-2">
            <label className="text-sm text-slate-300 font-medium">
              Kilometers Run
            </label>
            <input
              type="number"
              name="km_run"
              value={formData.km_run}
              onChange={handleChange}
              required
              className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="md:col-span-2 mt-4 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold text-lg py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transform hover:-translate-y-1 disabled:opacity-50"
          >
            {isLoading
              ? "Processing Neural Networks..."
              : "Compare & Predict Price"}
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
          {error}
        </div>
      )}

      {/* RESULTS DASHBOARD */}
      {result && (
        <div className="mt-12 w-full max-w-4xl flex flex-col gap-6 animate-[fade-in_0.5s_ease-out]">
          {/* Top Result Card */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">
              Selected: {result.selected_model}
            </div>
            <h3 className="text-indigo-300 font-semibold tracking-wide uppercase text-sm mb-2 mt-2">
              Estimated Market Value
            </h3>
            <div className="text-6xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <span className="text-3xl text-indigo-400">Tk</span>
              {result.predicted_price_tk.toLocaleString()}
            </div>

            {/* AI Recommendation Badge */}
            <div className="mt-6 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
              AI Recommendation: The {result.best_model_suggestion} model is
              statistically best for this data.
            </div>
          </div>

          {/* Model Comparison Graph Section */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-3xl p-8 shadow-xl">
            <h4 className="text-xl text-white font-bold mb-6 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              Graphical Analysis: Model Performance
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* R2 Score Bar Chart (Accuracy) */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
                  Accuracy (R² Score) - Higher is Better
                </h5>
                {Object.entries(result.model_statistics).map(
                  ([name, stats]) => (
                    <div key={name} className="relative">
                      <div className="flex justify-between text-sm mb-1">
                        <span
                          className={
                            name === result.selected_model
                              ? "text-indigo-400 font-bold"
                              : "text-slate-300"
                          }
                        >
                          {name}
                        </span>
                        <span className="font-mono text-cyan-400">
                          {stats.r2_score}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-1000 ${name === result.best_model_suggestion ? "bg-gradient-to-r from-cyan-400 to-emerald-400" : "bg-slate-600"}`}
                          style={{ width: `${Math.max(0, stats.r2_score)}%` }}
                        ></div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* MAE Error Bar Chart */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
                  Error Margin (MAE) - Lower is Better
                </h5>
                {Object.entries(result.model_statistics).map(
                  ([name, stats]) => {
                    // Find max error to scale the bars properly
                    const maxError = Math.max(
                      ...Object.values(result.model_statistics).map(
                        (s) => s.test_error_mae,
                      ),
                    );
                    const errorPercentage =
                      (stats.test_error_mae / maxError) * 100;

                    return (
                      <div key={name} className="relative">
                        <div className="flex justify-between text-sm mb-1">
                          <span
                            className={
                              name === result.selected_model
                                ? "text-indigo-400 font-bold"
                                : "text-slate-300"
                            }
                          >
                            {name}
                          </span>
                          <span className="font-mono text-rose-400">
                            ± {stats.test_error_mae.toLocaleString()} Tk
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full transition-all duration-1000 ${name === result.best_model_suggestion ? "bg-gradient-to-r from-rose-500 to-orange-400" : "bg-slate-600"}`}
                            style={{ width: `${errorPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
