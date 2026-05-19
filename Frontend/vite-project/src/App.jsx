import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    brand: "Toyota",
    condition: "Used",
    reg_year: 2015,
    engine_capacity: 1500,
    km_run: 50000,
  });

  // NEW: Added states to hold the stats and the user's input summary
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [stats, setStats] = useState(null);
  const [summaryInputs, setSummaryInputs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "brand" || name === "condition" ? value : Number(value),
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPredictedPrice(null);
    setStats(null);
    setSummaryInputs(null);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to fetch prediction");

      const data = await response.json();

      // NEW: Catching all the new data from Flask!
      setPredictedPrice(data.predicted_price_tk);
      setStats(data.model_statistics);
      setSummaryInputs(data.user_inputs);
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-12 px-4 selection:bg-cyan-500 selection:text-white">
      {/* Hero Section */}
      <div className="text-center mb-10 mt-8">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
          AI Car Valuation
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Enter your vehicle specifications below and let our Machine Learning
          model predict the fair market price.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(8,112,184,0.1)]">
        <form
          onSubmit={handlePredict}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              Car Brand
            </label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="md:col-span-2 mt-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-lg py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Calculating via AI..." : "Predict Fair Price"}
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 max-w-2xl w-full text-center">
          {error}
        </div>
      )}

      {/* NEW: The Ultimate Results Dashboard */}
      {predictedPrice !== null && stats !== null && (
        <div className="mt-8 w-full max-w-2xl flex flex-col gap-6 animate-[fade-in_0.5s_ease-out]">
          {/* Main Price Card */}
          <div className="bg-gradient-to-r from-cyan-900/40 to-emerald-900/40 border border-cyan-500/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.15)]">
            <h3 className="text-cyan-400 font-semibold tracking-wide uppercase text-sm mb-2">
              Estimated Market Value
            </h3>
            <div className="text-5xl font-bold text-white flex justify-center items-center gap-2 mb-4">
              <span className="text-3xl text-slate-400">Tk</span>
              {predictedPrice.toLocaleString()}
            </div>
            {/* Input Summary */}
            <p className="text-slate-400 text-sm italic">
              Based on your input of a {summaryInputs.condition}{" "}
              {summaryInputs.brand} ({summaryInputs.reg_year}),{" "}
              {summaryInputs.engine_capacity} CC, driven for{" "}
              {summaryInputs.km_run.toLocaleString()} km.
            </p>
          </div>

          {/* Academic Model Stats Grid */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-400"
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
              Model Performance Analytics
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                  R² Score (Accuracy Eq.)
                </p>
                <p className="text-2xl font-bold text-cyan-400">
                  {stats.r2_score}%
                </p>
              </div>

              <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                  Model Fit Status
                </p>
                <p
                  className={`text-sm font-bold mt-1 ${stats.fit_status.includes("OVERFITTING") ? "text-red-400" : "text-emerald-400"}`}
                >
                  {stats.fit_status}
                </p>
              </div>

              <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                  Training Error (MAE)
                </p>
                <p className="text-lg font-medium text-slate-200">
                  ± {stats.train_error_mae.toLocaleString()} Tk
                </p>
              </div>

              <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                  Testing Error (MAE)
                </p>
                <p className="text-lg font-medium text-slate-200">
                  ± {stats.test_error_mae.toLocaleString()} Tk
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
