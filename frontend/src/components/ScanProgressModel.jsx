import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const steps = [
  "Launching Playwright Browser",
  "Collecting Network Signals",
  "Analyzing Authentication",
  "Resolving Geo Intelligence",
  "Building Security Dashboard",
];

export default function ScanProgressModal({
  open,
  onComplete,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) return;

    setCurrentStep(0);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 4;

        if (next >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            onComplete();
          }, 600);

          return 100;
        }

        const step = Math.floor(next / 20);

        setCurrentStep(step);

        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center">

      <div className="w-[650px] rounded-2xl border border-cyan-500/20 bg-[#0D1B2A] shadow-2xl p-8">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

            <ShieldCheck
              className="text-cyan-400"
              size={28}
            />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-white">

              Authentication Analysis

            </h2>

            <p className="text-slate-400">

              Preparing Security Intelligence Report...

            </p>

          </div>

        </div>

        <div className="mt-8">

          <div className="flex justify-between mb-2">

            <span className="text-slate-400">

              Overall Progress

            </span>

            <span className="text-cyan-400 font-semibold">

              {progress}%

            </span>

          </div>

          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">

            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        <div className="mt-8 space-y-5">

          {steps.map((step, index) => (

            <div
              key={step}
              className="flex items-center gap-4"
            >

              {index < currentStep ? (

                <CheckCircle2
                  className="text-green-400"
                  size={22}
                />

              ) : index === currentStep ? (

                <Loader2
                  className="text-cyan-400 animate-spin"
                  size={22}
                />

              ) : (

                <div className="w-5 h-5 rounded-full border border-slate-600" />

              )}

              <span
                className={`${
                  index <= currentStep
                    ? "text-white"
                    : "text-slate-500"
                }`}
              >
                {step}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}