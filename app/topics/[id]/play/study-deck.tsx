"use client";

import { useEffect, useEffectEvent, useState } from "react";

type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

type StudyDeckProps = {
  topicName: string;
  flashcards: Flashcard[];
};

export function StudyDeck({ topicName, flashcards }: StudyDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const totalCards = flashcards.length;
  const activeCard = flashcards[currentIndex];
  const progress = Math.round(((currentIndex + 1) / totalCards) * 100);

  function goToCard(index: number) {
    setCurrentIndex(index);
    setShowAnswer(false);
  }

  function goToNextCard() {
    if (currentIndex < totalCards - 1) {
      goToCard(currentIndex + 1);
    }
  }

  function goToPreviousCard() {
    if (currentIndex > 0) {
      goToCard(currentIndex - 1);
    }
  }

  function restartDeck() {
    goToCard(0);
  }

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      setShowAnswer((current) => !current);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNextCard();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPreviousCard();
      return;
    }

    if (event.key.toLowerCase() === "r") {
      event.preventDefault();
      restartDeck();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <section className="flex min-h-[calc(100vh-8rem)] flex-col gap-5">
      <div className="flex flex-1 items-center justify-center">
        <button
          type="button"
          onClick={() => setShowAnswer((current) => !current)}
          className="group block h-[68vh] min-h-[28rem] w-full [perspective:2000px] focus:outline-none"
          aria-label={showAnswer ? "Hide answer" : "Reveal answer"}
        >
          <div
            className={`relative h-full w-full rounded-[2.5rem] transition-transform duration-700 [transform-style:preserve-3d] ${
              showAnswer ? "rotate-y-180" : ""
            }`}
          >
            <div className="absolute inset-0 flex h-full w-full [backface-visibility:hidden] flex-col rounded-[2.5rem] border border-white/10 bg-[linear-gradient(160deg,rgba(15,23,42,0.95),rgba(8,47,73,0.92))] p-8 text-left shadow-[0_30px_80px_rgba(2,6,23,0.45)] md:p-12">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.35em] text-cyan-300">
                    {topicName}
                  </p>
                  <p className="mt-3 text-sm text-slate-400">
                    Card {currentIndex + 1} of {totalCards}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-300">
                  Tap to flip
                </span>
              </div>

              <div className="mt-5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-cyan-300 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex flex-1 items-center justify-center py-10">
                <p className="max-w-4xl whitespace-pre-wrap text-center text-3xl leading-tight font-semibold text-white md:text-5xl md:leading-[1.15]">
                  {activeCard.question}
                </p>
              </div>

              <div className="mt-auto space-y-4">
                <p className="text-center text-sm text-slate-400">
                  Space or Enter flips the card.
                </p>

                <div className="flex w-full flex-col gap-3 rounded-[2rem] border border-white/10 bg-slate-950/75 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        goToPreviousCard();
                      }}
                      disabled={currentIndex === 0}
                      className="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        goToNextCard();
                      }}
                      disabled={currentIndex === totalCards - 1}
                      className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-cyan-300/40"
                    >
                      Next card
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        restartDeck();
                      }}
                      className="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5"
                    >
                      Restart
                    </button>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 lg:max-w-[42rem]">
                    {flashcards.map((flashcard, index) => {
                      const isActive = index === currentIndex;

                      return (
                        <button
                          key={flashcard.id}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            goToCard(index);
                          }}
                          className={`shrink-0 rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-[0.25em] transition ${
                            isActive
                              ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-100"
                              : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex h-full w-full rotate-y-180 [backface-visibility:hidden] flex-col rounded-[2.5rem] border border-cyan-300/20 bg-[linear-gradient(160deg,rgba(8,47,73,0.96),rgba(14,116,144,0.92))] p-8 text-left shadow-[0_30px_80px_rgba(2,6,23,0.5)] md:p-12">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.35em] text-cyan-100">
                    {topicName}
                  </p>
                  <p className="mt-3 text-sm text-cyan-100/80">
                    Card {currentIndex + 1} of {totalCards}
                  </p>
                </div>
                <span className="rounded-full border border-cyan-100/15 bg-cyan-100/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-cyan-50">
                  Tap to flip back
                </span>
              </div>

              <div className="mt-5 overflow-hidden rounded-full bg-cyan-100/10">
                <div
                  className="h-2 rounded-full bg-cyan-50 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex flex-1 items-center justify-center py-10">
                <p className="max-w-4xl whitespace-pre-wrap text-center text-2xl leading-relaxed text-cyan-50 md:text-4xl md:leading-[1.3]">
                  {activeCard.answer}
                </p>
              </div>

              <div className="mt-auto space-y-4">
                <p className="text-center text-sm text-cyan-100/80">
                  Arrow keys move between cards. R restarts the deck.
                </p>

                <div className="flex w-full flex-col gap-3 rounded-[2rem] border border-cyan-100/15 bg-slate-950/30 p-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        goToPreviousCard();
                      }}
                      disabled={currentIndex === 0}
                      className="rounded-full border border-cyan-100/15 px-4 py-3 text-sm font-medium text-cyan-50 transition hover:bg-cyan-100/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        goToNextCard();
                      }}
                      disabled={currentIndex === totalCards - 1}
                      className="rounded-full bg-cyan-50 px-5 py-3 text-sm font-medium text-cyan-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-cyan-50/40"
                    >
                      Next card
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        restartDeck();
                      }}
                      className="rounded-full border border-cyan-100/15 px-4 py-3 text-sm font-medium text-cyan-50 transition hover:bg-cyan-100/10"
                    >
                      Restart
                    </button>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 lg:max-w-[42rem]">
                    {flashcards.map((flashcard, index) => {
                      const isActive = index === currentIndex;

                      return (
                        <button
                          key={flashcard.id}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            goToCard(index);
                          }}
                          className={`shrink-0 rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-[0.25em] transition ${
                            isActive
                              ? "border-cyan-50/40 bg-cyan-50/15 text-cyan-50"
                              : "border-cyan-100/15 bg-cyan-100/5 text-cyan-100/80 hover:bg-cyan-100/10"
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}
