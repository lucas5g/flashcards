import Link from "next/link";
import { ArrowUpRight, Trash } from "@phosphor-icons/react/dist/ssr";

import { createTopic, deleteTopic, updateTopic } from "@/app/actions";
import { prisma } from "@/lib/prisma";

type HomePageProps = {
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
      className={`rounded-2xl border px-4 py-3 text-sm ${isError
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
        }`}
    >
      {error ?? message}
    </div>
  );
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const topics = await prisma.topic.findMany({
    orderBy: [{ name: "asc" }],
    include: {
      _count: {
        select: {
          flashcards: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row-reverse lg:items-start">
        <section className="flex-1 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-6">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
              Flashcards
            </p>
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-semibold tracking-tight text-white">
                  Topics
                </h1>
                <p className="max-w-2xl text-sm text-slate-300">
                  Organize every flashcard under a topic, then manage the cards inline inside each topic page.
                </p>
                <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                  {topics.length} topic{topics.length === 1 ? "" : "s"}
                </div>
              </div>

            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Notice
              error={resolvedSearchParams?.error}
              message={resolvedSearchParams?.message}
            />

            {topics.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/60 px-6 py-14 text-center text-slate-300">
                No topics yet. Create your first topic to start building flashcards.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {topics.map((topic) => (
                  <article
                    key={topic.id}
                    className="rounded-3xl border border-white/10 bg-slate-900/80 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-semibold text-white break-words">{topic.name}</h2>
                        <p className="mt-2 text-sm text-slate-400">
                          {topic._count.flashcards} flashcard
                          {topic._count.flashcards === 1 ? "" : "s"}
                        </p>
                      </div>
                      <Link
                        href={`/topics/${topic.id}`}
                        aria-label={`Open ${topic.name}`}
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center self-start rounded-full bg-cyan-300 text-slate-950 transition hover:bg-cyan-200"
                      >
                        <ArrowUpRight size={20} weight="bold" />
                      </Link>
                    </div>

                    <details className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <summary className="cursor-pointer list-none text-sm font-medium text-slate-200">
                        Edit topic
                      </summary>
                      <form action={updateTopic} className="mt-4 space-y-3">
                        <input type="hidden" name="topicId" value={topic.id} />
                        <input type="hidden" name="redirectPath" value="/" />
                        <label className="block space-y-2 text-sm text-slate-300">
                          <span>Name</span>
                          <input
                            name="name"
                            defaultValue={topic.name}
                            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300"
                          />
                        </label>
                        <button
                          type="submit"
                          className="rounded-full border border-cyan-300/40 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10"
                        >
                          Save changes
                        </button>
                      </form>
                    </details>

                    <form action={deleteTopic} className="mt-4">
                      <input type="hidden" name="topicId" value={topic.id} />
                      <input type="hidden" name="redirectPath" value="/" />
                      <button
                        type="submit"
                        aria-label={`Delete ${topic.name}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-rose-300 transition hover:bg-rose-300/10 hover:text-rose-200"
                      >
                        <Trash size={18} weight="bold" />
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="w-full rounded-[2rem] border border-white/10 bg-slate-900/80 px-6 py-6 text-slate-100 shadow-2xl shadow-slate-950/30 backdrop-blur lg:sticky lg:top-6 lg:max-w-sm">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            New Topic
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Create a group</h2>
          <p className="mt-2 text-sm text-slate-300">
            Topics are the main grouping for your flashcards. Use a short clear name.
          </p>

          <form action={createTopic} className="mt-6 space-y-4">
            <input type="hidden" name="redirectPath" value="/" />
            <label className="block space-y-2 text-sm font-medium text-slate-200">
              <span>Topic name</span>
              <input
                name="name"
                placeholder="JavaScript basics"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-cyan-300 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-200"
            >
              Create topic
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}
