import Link from "next/link";
import { notFound } from "next/navigation";

import {
  createFlashcard,
  deleteFlashcard,
  deleteTopic,
  updateFlashcard,
  updateTopic,
} from "@/app/actions";
import { prisma } from "@/lib/prisma";

type TopicPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export const dynamic = "force-dynamic";

function Notice({ error, message }: { error?: string; message?: string }) {
  if (!error && !message) {
    return null;
  }

  const isError = Boolean(error);

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        isError
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {error ?? message}
    </div>
  );
}

export default async function TopicPage({ params, searchParams }: TopicPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const topic = await prisma.topic.findUnique({
    where: { id },
    include: {
      flashcards: {
        orderBy: [{ createdAt: "desc" }],
      },
    },
  });

  if (!topic) {
    notFound();
  }

  const redirectPath = `/topics/${topic.id}`;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_30%),linear-gradient(180deg,#020617_0%,#111827_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
          <Link href="/" className="text-sm text-cyan-300 transition hover:text-cyan-200">
            Back to topics
          </Link>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
                Topic
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
                {topic.name}
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                {topic.flashcards.length} flashcard
                {topic.flashcards.length === 1 ? "" : "s"} in this group.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {topic.flashcards.length > 0 ? (
                <Link
                  href={`/topics/${topic.id}/play`}
                  className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-200"
                >
                  Play flashcards
                </Link>
              ) : null}

              <details className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-medium text-slate-100">
                  Edit topic
                </summary>
                <form action={updateTopic} className="mt-4 flex min-w-72 flex-col gap-3">
                  <input type="hidden" name="topicId" value={topic.id} />
                  <input type="hidden" name="redirectPath" value={redirectPath} />
                  <input
                    name="name"
                    defaultValue={topic.name}
                    className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-200"
                  >
                    Save topic
                  </button>
                </form>
              </details>

              <form action={deleteTopic}>
                <input type="hidden" name="topicId" value={topic.id} />
                <input type="hidden" name="redirectPath" value={redirectPath} />
                <button
                  type="submit"
                  className="rounded-full border border-rose-300/40 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-300/10"
                >
                  Delete topic
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-semibold text-white">Cards</h2>
              <div className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-sm text-slate-300">
                {topic.flashcards.length} total
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Notice
                error={resolvedSearchParams?.error}
                message={resolvedSearchParams?.message}
              />

              {topic.flashcards.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/50 px-6 py-14 text-center text-slate-300">
                  No flashcards yet. Add your first one from the form on the right.
                </div>
              ) : (
                topic.flashcards.map((flashcard, index) => (
                  <article
                    key={flashcard.id}
                    className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-medium uppercase tracking-[0.3em] text-cyan-300">
                        Card {index + 1}
                      </p>
                      <form action={deleteFlashcard}>
                        <input type="hidden" name="flashcardId" value={flashcard.id} />
                        <input type="hidden" name="topicId" value={topic.id} />
                        <input type="hidden" name="redirectPath" value={redirectPath} />
                        <button
                          type="submit"
                          className="text-sm font-medium text-rose-300 transition hover:text-rose-200"
                        >
                          Delete
                        </button>
                      </form>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-2xl bg-white/5 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                          Question
                        </p>
                        <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-white">
                          {flashcard.question}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-cyan-300/10 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-cyan-200">
                          Answer
                        </p>
                        <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-cyan-50">
                          {flashcard.answer}
                        </p>
                      </div>
                    </div>

                    <details className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <summary className="cursor-pointer list-none text-sm font-medium text-slate-200">
                        Edit flashcard
                      </summary>
                      <form action={updateFlashcard} className="mt-4 space-y-4">
                        <input type="hidden" name="flashcardId" value={flashcard.id} />
                        <input type="hidden" name="topicId" value={topic.id} />
                        <input type="hidden" name="redirectPath" value={redirectPath} />
                        <label className="block space-y-2 text-sm text-slate-300">
                          <span>Question</span>
                          <textarea
                            name="question"
                            rows={4}
                            defaultValue={flashcard.question}
                            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300"
                          />
                        </label>
                        <label className="block space-y-2 text-sm text-slate-300">
                          <span>Answer</span>
                          <textarea
                            name="answer"
                            rows={4}
                            defaultValue={flashcard.answer}
                            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300"
                          />
                        </label>
                        <button
                          type="submit"
                          className="rounded-full border border-cyan-300/40 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10"
                        >
                          Save flashcard
                        </button>
                      </form>
                    </details>
                  </article>
                ))
              )}
            </div>
          </section>

          <aside className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 text-slate-100 shadow-2xl shadow-slate-950/30 backdrop-blur lg:sticky lg:top-6 lg:h-fit">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
              New Flashcard
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Add a card</h2>
            <p className="mt-2 text-sm text-slate-300">
              Keep the question short and the answer direct so the set stays easy to review later.
            </p>

            <form action={createFlashcard} className="mt-6 space-y-4">
              <input type="hidden" name="topicId" value={topic.id} />
              <input type="hidden" name="redirectPath" value={redirectPath} />
              <label className="block space-y-2 text-sm font-medium text-slate-200">
                <span>Question</span>
                <textarea
                  name="question"
                  rows={5}
                  placeholder="What is a closure in JavaScript?"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                />
              </label>
              <label className="block space-y-2 text-sm font-medium text-slate-200">
                <span>Answer</span>
                <textarea
                  name="answer"
                  rows={5}
                  placeholder="A closure is a function that keeps access to variables from its lexical scope."
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-cyan-300 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-200"
              >
                Create flashcard
              </button>
            </form>
          </aside>
        </div>
      </div>
    </main>
  );
}
