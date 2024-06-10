import express, { Router, Request, Response } from "express";
import { AppDataSource } from "database/src/AppDataSource.ts";

import Highscore from "database/src/entity/Highscore.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  const highScoreAttempt: { score: number; time: string } = req.body;
  // Attempt to save the high score
  try {
    // Attempt to create in the database
    const savedScore = new Highscore();
    savedScore.score = highScoreAttempt.score;
    await AppDataSource.manager.save(savedScore);
    console.info("Successfully saved high score attempt"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(
      `Unable to save high score attempt ${highScoreAttempt}: ${error}`,
    );
    res.sendStatus(400); // Send error
    return; // Don't try to send duplicate statuses
  }

  res.sendStatus(200); // Otherwise say it's fine
});

// Whenever a get request is made, return the high score
router.get("/", async function (req: Request, res: Response) {
  // Fetch the high score from Prisma
  const highScore = await AppDataSource.manager.findOne(Highscore, {});

  // If the high score doesn't exist
  if (highScore === null) {
    // Log that (it's a problem)
    console.error("No high score found in database!");
    res.sendStatus(204); // and send 204, no data
  } else {
    // Otherwise, send the score
    res.send(highScore);
  }
});

export default router;
