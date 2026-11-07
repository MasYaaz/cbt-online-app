import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { questions, type NewQuestion } from "./db/schema";

const app: Application = express();

app.use(cors());
app.use(express.json());

interface SubmitRequestBody {
  answers?: Record<number, string>;
}

// ==========================================
// ENDPOINT PESERTA (EXAM)
// ==========================================

// 1. Get Soal Ujian (Tanpa kunci jawaban)
app.get("/api/questions", async (_req: Request, res: Response) => {
  try {
    const list = await db
      .select({
        id: questions.id,
        question: questions.question,
        optionA: questions.optionA,
        optionB: questions.optionB,
        optionC: questions.optionC,
        optionD: questions.optionD,
      })
      .from(questions);

    const formatted = list.map((q) => ({
      id: q.id,
      question: q.question,
      options: {
        A: q.optionA,
        B: q.optionB,
        C: q.optionC,
        D: q.optionD,
      },
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data soal" });
  }
});

// 2. Submit Jawaban & Hitung Nilai
app.post(
  "/api/submit",
  async (req: Request<{}, {}, SubmitRequestBody>, res: Response) => {
    try {
      const userAnswers = req.body.answers || {};
      const allQuestions = await db
        .select({ id: questions.id, answer: questions.answer })
        .from(questions);

      let totalScore = 0;
      let correctCount = 0;
      const totalQuestions = allQuestions.length;
      const weightPerQuestion = totalQuestions > 0 ? 100 / totalQuestions : 0;

      allQuestions.forEach((q) => {
        if (userAnswers[q.id] === q.answer) {
          totalScore += weightPerQuestion;
          correctCount += 1;
        }
      });

      res.json({
        score: Math.round(totalScore),
        correctCount,
        totalQuestions,
      });
    } catch (err) {
      res.status(500).json({ error: "Gagal memproses penilaian" });
    }
  },
);

// ==========================================
// ENDPOINT ADMIN (CRUD SOAL DRIZZLE)
// ==========================================

// GET Semua Soal (Admin)
app.get("/api/admin/questions", async (_req: Request, res: Response) => {
  try {
    const all = await db.select().from(questions);
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil soal admin" });
  }
});

// POST Tambah Soal
app.post(
  "/api/admin/questions",
  async (req: Request<{}, {}, NewQuestion>, res: Response) => {
    try {
      const [newQuestion] = await db
        .insert(questions)
        .values(req.body)
        .returning();
      res.status(201).json(newQuestion);
    } catch (err) {
      res.status(400).json({ error: "Gagal menambah soal" });
    }
  },
);

// PUT Update Soal
app.put(
  "/api/admin/questions/:id",
  async (req: Request<{ id: string }, {}, NewQuestion>, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const [updated] = await db
        .update(questions)
        .set(req.body)
        .where(eq(questions.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "Soal tidak ditemukan" });
      }

      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: "Gagal mengubah soal" });
    }
  },
);

// DELETE Hapus Soal
app.delete(
  "/api/admin/questions/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const [deleted] = await db
        .delete(questions)
        .where(eq(questions.id, id))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: "Soal tidak ditemukan" });
      }

      res.json({ message: "Soal berhasil dihapus" });
    } catch (err) {
      res.status(400).json({ error: "Gagal menghapus soal" });
    }
  },
);

const PORT: number = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Server Express + Drizzle ORM aktif di http://localhost:${PORT}`,
  );
});
