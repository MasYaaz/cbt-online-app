export interface QuestionOption {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface Question {
  id: number;
  question: string;
  options: QuestionOption;
  answer: "A" | "B" | "C" | "D";
}

// Tipe data soal tanpa kunci jawaban untuk dikirim ke client
export type SanitizedQuestion = Omit<Question, "answer">;

export const questions: Question[] = [
  {
    id: 1,
    question: "Apa ibu kota Indonesia?",
    options: { A: "Surabaya", B: "Jakarta", C: "Nusantara", D: "Bandung" },
    answer: "C",
  },
  {
    id: 2,
    question: "Hasil dari 5 + 5 adalah...",
    options: { A: "8", B: "9", C: "10", D: "12" },
    answer: "C",
  },
  {
    id: 3,
    question: "Bahasa pemograman yang digunakan dalam React Native adalah...",
    options: { A: "Python", B: "JavaScript", C: "Java", D: "C++" },
    answer: "B",
  },
  {
    id: 4,
    question: "Planet terbesar dalam tata surya kita adalah...",
    options: { A: "Mars", B: "Bumi", C: "Jupiter", D: "Saturnus" },
    answer: "C",
  },
  {
    id: 5,
    question: "Simbol kimia untuk air adalah...",
    options: { A: "O2", B: "H2O", C: "CO2", D: "NaCl" },
    answer: "B",
  },
  {
    id: 6,
    question: "Tahun berapa Indonesia merdeka?",
    options: { A: "1945", B: "1950", C: "1942", D: "1948" },
    answer: "A",
  },
  {
    id: 7,
    question: "Siapa penemu lampu pijar?",
    options: {
      A: "Nikola Tesla",
      B: "Thomas Edison",
      C: "Albert Einstein",
      D: "Graham Bell",
    },
    answer: "B",
  },
  {
    id: 8,
    question: "Berapa jumlah sisi pada kubus?",
    options: { A: "4", B: "6", C: "8", D: "12" },
    answer: "B",
  },
  {
    id: 9,
    question: "Framework backend Node.js yang populer adalah...",
    options: { A: "Laravel", B: "Django", C: "Express.js", D: "Spring Boot" },
    answer: "C",
  },
  {
    id: 10,
    question: "Benua terbesar di dunia adalah...",
    options: { A: "Afrika", B: "Amerika", C: "Eropa", D: "Asia" },
    answer: "D",
  },
];
