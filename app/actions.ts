"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function isPrismaUniqueConstraintError(
  error: unknown,
): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  );
}

function readRequiredText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function readRedirectPath(formData: FormData, fallback: string) {
  const redirectPath = String(formData.get("redirectPath") ?? fallback);

  return redirectPath.startsWith("/") ? redirectPath : fallback;
}

function redirectWithNotice(
  path: string,
  params: { error?: string; message?: string },
) {
  const searchParams = new URLSearchParams();

  if (params.error) {
    searchParams.set("error", params.error);
  }

  if (params.message) {
    searchParams.set("message", params.message);
  }

  const query = searchParams.toString();

  redirect(query ? `${path}?${query}` : path);
}

function handleUniqueTopicName(error: unknown, redirectPath: string) {
  if (isPrismaUniqueConstraintError(error) && error.code === "P2002") {
    redirectWithNotice(redirectPath, {
      error: "Topic name already exists.",
    });
  }

  throw error;
}

export async function createTopic(formData: FormData) {
  const name = readRequiredText(formData, "name");
  const redirectPath = readRedirectPath(formData, "/");

  if (!name) {
    redirectWithNotice(redirectPath, {
      error: "Topic name is required.",
    });
  }

  try {
    await prisma.topic.create({
      data: { name },
    });
  } catch (error) {
    handleUniqueTopicName(error, redirectPath);
  }

  revalidatePath("/");
  redirectWithNotice(redirectPath, { message: "Topic created." });
}

export async function updateTopic(formData: FormData) {
  const topicId = readRequiredText(formData, "topicId");
  const name = readRequiredText(formData, "name");
  const redirectPath = readRedirectPath(formData, "/");

  if (!topicId || !name) {
    redirectWithNotice(redirectPath, {
      error: "Topic name is required.",
    });
  }

  try {
    await prisma.topic.update({
      where: { id: topicId },
      data: { name },
    });
  } catch (error) {
    handleUniqueTopicName(error, redirectPath);
  }

  revalidatePath("/");
  revalidatePath(`/topics/${topicId}`);
  redirectWithNotice(redirectPath, { message: "Topic updated." });
}

export async function deleteTopic(formData: FormData) {
  const topicId = readRequiredText(formData, "topicId");
  const redirectPath = readRedirectPath(formData, "/");

  if (!topicId) {
    redirectWithNotice(redirectPath, {
      error: "Topic not found.",
    });
  }

  await prisma.topic.delete({
    where: { id: topicId },
  });

  revalidatePath("/");
  redirectWithNotice("/", { message: "Topic deleted." });
}

export async function createFlashcard(formData: FormData) {
  const topicId = readRequiredText(formData, "topicId");
  const question = readRequiredText(formData, "question");
  const answer = readRequiredText(formData, "answer");
  const redirectPath = readRedirectPath(formData, `/topics/${topicId}`);

  if (!topicId || !question || !answer) {
    redirectWithNotice(redirectPath, {
      error: "Question and answer are required.",
    });
  }

  await prisma.flashcard.create({
    data: {
      topicId,
      question,
      answer,
    },
  });

  revalidatePath("/");
  revalidatePath(`/topics/${topicId}`);
  redirectWithNotice(redirectPath, { message: "Flashcard created." });
}

export async function updateFlashcard(formData: FormData) {
  const flashcardId = readRequiredText(formData, "flashcardId");
  const topicId = readRequiredText(formData, "topicId");
  const question = readRequiredText(formData, "question");
  const answer = readRequiredText(formData, "answer");
  const redirectPath = readRedirectPath(formData, `/topics/${topicId}`);

  if (!flashcardId || !topicId || !question || !answer) {
    redirectWithNotice(redirectPath, {
      error: "Question and answer are required.",
    });
  }

  await prisma.flashcard.update({
    where: { id: flashcardId },
    data: {
      question,
      answer,
    },
  });

  revalidatePath("/");
  revalidatePath(`/topics/${topicId}`);
  redirectWithNotice(redirectPath, { message: "Flashcard updated." });
}

export async function deleteFlashcard(formData: FormData) {
  const flashcardId = readRequiredText(formData, "flashcardId");
  const topicId = readRequiredText(formData, "topicId");
  const redirectPath = readRedirectPath(formData, `/topics/${topicId}`);

  if (!flashcardId || !topicId) {
    redirectWithNotice(redirectPath, {
      error: "Flashcard not found.",
    });
  }

  await prisma.flashcard.delete({
    where: { id: flashcardId },
  });

  revalidatePath("/");
  revalidatePath(`/topics/${topicId}`);
  redirectWithNotice(redirectPath, { message: "Flashcard deleted." });
}
