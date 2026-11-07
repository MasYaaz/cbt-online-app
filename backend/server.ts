import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { questions, type SanitizedQuestion } from "./data/questions";

const app: Application = express();

app.use(cors());
app.use(express.json());

// Interface untuk payload request submit jawaban
interface SubmitRequestBody {
  answers?: Record<number, string>; // Format: { 1: "A", 2: "C" }
}

// Interface untuk response hasil nilai
interface SubmitResponseBody {
  score: number;
  correctCount: number;
  totalQuestions: number;
}

// Endpoint GET Soal (Tanpa kunci jawaban)
app.get(
  "/api/questions",
  (_req: Request, res: Response<SanitizedQuestion[]>) => {
    const sanitizedQuestions: SanitizedQuestion[] = questions.map(
      ({ answer, ...q }) => q,
    );
    res.json(sanitizedQuestions);
  },
);

// Endpoint POST Submit Jawaban
app.post(
  "/api/submit",
  (
    req: Request<{}, {}, SubmitRequestBody>,
    res: Response<SubmitResponseBody>,
  ) => {
    const userAnswers = req.body.answers || {};
    let totalScore: number = 0;
    let correctCount: number = 0;

    questions.forEach((q) => {
      if (userAnswers[q.id] === q.answer) {
        totalScore += 10;
        correctCount += 1;
      }
    });

    res.json({
      score: totalScore,
      correctCount: correctCount,
      totalQuestions: questions.length,
    });
  },
);

const PORT: number = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server Express (Bun + TS) berjalan di port ${PORT}`),
);
