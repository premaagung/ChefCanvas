-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "courseType" TEXT NOT NULL,
    "portions" INTEGER NOT NULL,
    "ingredients" TEXT NOT NULL,
    "steps" TEXT NOT NULL,
    "flavorAnalysis" TEXT NOT NULL,
    "chefRecommendations" TEXT NOT NULL,
    "protein" TEXT,
    "starchBase" TEXT,
    "vegetable" TEXT,
    "sauce" TEXT,
    "garnish" TEXT,
    "flavorGoal" TEXT NOT NULL
);
