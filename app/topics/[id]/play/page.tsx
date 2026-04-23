import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { StudyDeck } from "./study-deck";

type PlayPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function PlayPage({ params }: PlayPageProps) {
  const { id } = await params;
  const topic = await prisma.topic.findUnique({
    where: { id },
    include: {
      flashcards: {
        orderBy: [{ createdAt: "asc" }],
      },
    },
  });

  if (!topic) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_30%),linear-gradient(180deg,#020617_0%,#111827_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6">
        <div className="flex flex-col gap-3">
          <Link
            href={`/topics/${topic.id}`}
            className="text-sm text-cyan-300 transition hover:text-cyan-200"
          >
            Back to topic
          </Link>
          {topic.flashcards.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/50 px-6 py-14 text-center text-slate-300">
              This topic has no flashcards yet. Add cards before starting study mode.
            </div>
          ) : (
            <StudyDeck
              topicName={topic.name}
              flashcards={topic.flashcards.map((flashcard) => ({
                id: flashcard.id,
                question: flashcard.question,
                answer: flashcard.answer,
              }))}
            />
          )}
        </div>
      </div>
    </main>
  );
}
