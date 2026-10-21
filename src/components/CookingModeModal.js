import React, { useState, useEffect } from "react";
import { 
  X, ChevronLeft, ChevronRight, CheckCircle2, Circle, 
  Play, Pause, RotateCcw, Clock, Sparkles, ChefHat, Volume2 
} from "lucide-react";

export default function CookingModeModal({ recipe, isOpen, onClose }) {
  const steps = recipe?.steps || [];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  
  // Kitchen Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerPreset, setTimerPreset] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen || !recipe) return null;

  const toggleStepCompleted = (index) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const addTimer = (seconds) => {
    setTimerSeconds((prev) => prev + seconds);
    setTimerPreset((prev) => prev + seconds);
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setTimerPreset(0);
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = steps.length ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/70 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Mode Memasak Interaktif
              </span>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white line-clamp-1">
                {recipe.name}
              </h2>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            title="Tutup Mode Memasak"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-2">
          <div
            className="bg-gradient-to-r from-brand-500 to-amber-500 h-2 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Step Indicator & Timer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-brand-100 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300">
                Langkah {currentStepIndex + 1} dari {steps.length}
              </span>
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                ({progressPercent}% selesai)
              </span>
            </div>

            {/* Smart Kitchen Timer Widget */}
            <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800/80 px-3 py-1.5 rounded-2xl border border-stone-200 dark:border-stone-700">
              <Clock className="w-4 h-4 text-brand-500" />
              <span className="font-mono font-bold text-stone-800 dark:text-stone-100 text-sm">
                {formatTimer(timerSeconds)}
              </span>
              {timerSeconds > 0 ? (
                <>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
                    title={isTimerRunning ? "Pause Timer" : "Start Timer"}
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => addTimer(60)}
                    className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 hover:bg-brand-500 hover:text-white transition font-medium text-stone-700 dark:text-stone-300"
                  >
                    +1m
                  </button>
                  <button
                    onClick={() => addTimer(300)}
                    className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 hover:bg-brand-500 hover:text-white transition font-medium text-stone-700 dark:text-stone-300"
                  >
                    +5m
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Current Step Big Display Card */}
          <div className="p-6 md:p-10 rounded-3xl bg-gradient-to-br from-brand-50/50 via-white to-amber-50/30 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm relative">
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleStepCompleted(currentStepIndex)}
                className="mt-1 flex-shrink-0 text-stone-400 hover:text-brand-500 transition"
                title={completedSteps[currentStepIndex] ? "Tandai belum selesai" : "Tandai selesai"}
              >
                {completedSteps[currentStepIndex] ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                ) : (
                  <Circle className="w-8 h-8 text-stone-400 hover:text-brand-500" />
                )}
              </button>
              
              <div className="flex-1">
                <p className={`text-xl md:text-2xl leading-relaxed font-medium transition-all ${
                  completedSteps[currentStepIndex] 
                    ? "line-through text-stone-400 dark:text-stone-500" 
                    : "text-stone-900 dark:text-stone-100"
                }`}>
                  {steps[currentStepIndex]}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => toggleStepCompleted(currentStepIndex)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      completedSteps[currentStepIndex]
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-brand-500 text-white hover:bg-brand-600 shadow-md"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {completedSteps[currentStepIndex] ? "Langkah Selesai ✓" : "Tandai Selesai"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* All Steps Preview Tabs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Semua Langkah
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`p-3 rounded-2xl border text-sm cursor-pointer transition flex items-center gap-3 ${
                    idx === currentStepIndex
                      ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 text-brand-900 dark:text-brand-200 font-semibold shadow-sm"
                      : "border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-300"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    completedSteps[idx] 
                      ? "bg-emerald-500 text-white" 
                      : idx === currentStepIndex 
                        ? "bg-brand-500 text-white" 
                        : "bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300"
                  }`}>
                    {completedSteps[idx] ? "✓" : idx + 1}
                  </span>
                  <span className="line-clamp-1 flex-1">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/70 backdrop-blur-sm">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Sebelumnya
          </button>

          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStepIndex(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === currentStepIndex
                    ? "w-8 bg-brand-500"
                    : completedSteps[i]
                    ? "w-2.5 bg-emerald-500"
                    : "w-2.5 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400"
                }`}
                title={`Ke langkah ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Selanjutnya
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
