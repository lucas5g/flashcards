-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "flashcard";

-- CreateTable
CREATE TABLE "flashcard"."Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard"."Flashcard" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "flashcard"."Topic"("name");

-- CreateIndex
CREATE INDEX "Flashcard_topicId_idx" ON "flashcard"."Flashcard"("topicId");

-- AddForeignKey
ALTER TABLE "flashcard"."Flashcard" ADD CONSTRAINT "Flashcard_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "flashcard"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
