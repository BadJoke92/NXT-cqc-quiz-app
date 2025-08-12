import React, { useState, useEffect, useCallback } from "react";

// --- ICONE SVG ---
const icons = {
  arrowRight: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  check: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  x: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  arrowLeft: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  ),
  loader: (
    <svg
      className="animate-spin h-8 w-8"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  ),
  clock: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  sun: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  ),
  moon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  ),
  trash: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  ),
};

// --- GESTIONE STATISTICHE ---
const saveErrorToStats = (question) => {
  try {
    const stats = JSON.parse(localStorage.getItem("quizErrors")) || {};
    const questionText = question.testo_domanda_it;
    if (stats[questionText]) {
      stats[questionText].count += 1;
    } else {
      stats[questionText] = { question, count: 1 };
    }
    localStorage.setItem("quizErrors", JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to save error stats:", error);
  }
};

// --- COMPONENTI UI ---

const ThemeToggle = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className={`p-2 rounded-full transition ${
      theme === "light"
        ? "bg-white/50 text-[#075B5E]"
        : "bg-gray-800/60 text-gray-300"
    }`}
  >
    {theme === "light" ? icons.moon : icons.sun}
  </button>
);

const ListItem = ({ title, description, onClick, delay, theme }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-6 border rounded-lg transition-all duration-300 flex justify-between items-center group animate-fade-in-up ${
      theme === "light"
        ? "bg-white/80 border-gray-200/80 hover:bg-white hover:border-[#FF3F33]/50 hover:shadow-lg"
        : "bg-gray-800/60 border-gray-700/80 hover:bg-gray-700/80 hover:border-violet-500"
    }`}
    style={{ animationDelay: `${delay * 50}ms` }}
  >
    <div>
      <h3
        className={`text-lg font-bold ${
          theme === "light" ? "text-[#075B5E]" : "text-white"
        }`}
      >
        {title}
      </h3>
      <p
        className={`${
          theme === "light" ? "text-[#075B5E]/60" : "text-gray-400"
        } text-sm`}
      >
        {description}
      </p>
    </div>
    <div
      className={`text-gray-400 transition-transform duration-300 group-hover:translate-x-1 ${
        theme === "light"
          ? "group-hover:text-[#FF3F33]"
          : "group-hover:text-violet-400"
      }`}
    >
      {icons.arrowRight}
    </div>
  </button>
);

const LoadingSpinner = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="text-inherit">{icons.loader}</div>
    <p className="mt-4 text-lg">{message}</p>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="bg-red-600 text-white p-4 text-center fixed top-5 left-1/2 -translate-x-1/2 z-50 rounded-lg shadow-2xl max-w-md w-11/12">
    <h3 className="font-bold mb-2">Si è verificato un errore</h3>
    <p className="text-sm">{message}</p>
  </div>
);

// --- SCHERMATE DELL'APPLICAZIONE ---

const LoginScreen = ({ onLogin, theme, toggleTheme }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, error: dbError } = await supabase
        .from("credentials")
        .select("username, password")
        .eq("id", 1)
        .single();
      if (dbError) throw dbError;
      if (data && data.username === username && data.password === password)
        onLogin();
      else setError("Credenziali non valide.");
    } catch (err) {
      setError("Impossibile verificare le credenziali.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
      <div className="w-full max-w-sm">
        <header className="text-center mb-8 animate-fade-in-up">
          <h1
            className={`text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${
              theme === "light"
                ? "from-[#FF3F33] to-[#ff6a60]"
                : "from-violet-500 to-cyan-400"
            }`}
          >
            Accesso
          </h1>
          <p
            className={`${
              theme === "light" ? "text-[#075B5E]/70" : "text-gray-400"
            } mt-2`}
          >
            Inserisci le credenziali per iniziare.
          </p>
        </header>
        <form
          onSubmit={handleLogin}
          className={`p-8 rounded-2xl border shadow-xl animate-fade-in-up ${
            theme === "light"
              ? "bg-white/60 border-gray-200/80"
              : "bg-gray-800/50 border-gray-700"
          }`}
          style={{ animationDelay: "150ms" }}
        >
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="username">
              Nome Utente
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                theme === "light"
                  ? "bg-white/70 border-gray-300 focus:ring-[#FF3F33]"
                  : "bg-gray-700 border-gray-600 focus:ring-violet-500"
              }`}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                theme === "light"
                  ? "bg-white/70 border-gray-300 focus:ring-[#FF3F33]"
                  : "bg-gray-700 border-gray-600 focus:ring-violet-500"
              }`}
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === "light"
                ? "bg-[#075B5E] hover:bg-[#075B5E]/90 text-white"
                : "bg-violet-600 hover:bg-violet-700 text-white"
            }`}
          >
            {loading ? "Verifica..." : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
};

const ExamSelectionScreen = ({ onSelectExam, theme, toggleTheme }) => (
  <div className="min-h-screen p-4 sm:p-8">
    <div className="max-w-2xl mx-auto">
      <header className="text-center mb-12 animate-fade-in-up relative">
        <div className="absolute top-0 right-0">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        <h1
          className={`text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${
            theme === "light"
              ? "from-[#FF3F33] to-[#ff6a60]"
              : "from-violet-500 to-cyan-400"
          }`}
        >
          NXT CQC Quiz
        </h1>
        <p
          className={`${
            theme === "light" ? "text-[#075B5E]/70" : "text-gray-400"
          } mt-2 text-lg`}
        >
          Scegli il tuo percorso di studio.
        </p>
      </header>
      <main
        className="space-y-3 animate-fade-in-up"
        style={{ animationDelay: "150ms" }}
      >
        <ListItem
          theme={theme}
          title="Esame CQC Solo Comune"
          description="Preparati sulla parte comune dell'esame."
          onClick={() => onSelectExam("comune")}
          delay={0}
        />
        <ListItem
          theme={theme}
          title="Esame CQC + Merci"
          description="Include la parte comune e quella specifica per le merci."
          onClick={() => onSelectExam("merci")}
          delay={1}
        />
        <ListItem
          theme={theme}
          title="Esame CQC + Persone"
          description="Include la parte comune e quella specifica per le persone."
          onClick={() => onSelectExam("persone")}
          delay={2}
        />
        <ListItem
          theme={theme}
          title="Pratica su Tutto"
          description="Accedi a tutti i capitoli e modalità."
          onClick={() => onSelectExam("all")}
          delay={3}
        />
      </main>
    </div>
  </div>
);

const Dashboard = ({
  onStartQuiz,
  onSelectChapter,
  onShowStats,
  setAppError,
  theme,
  toggleTheme,
  examContext,
  onBackToSelection,
}) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        let query = supabase.from("cqc-table-2").select("argomento, categoria");
        switch (examContext) {
          case "comune":
            query = query.eq("categoria", "PARTE COMUNE");
            break;
          case "merci":
            query = query.in("categoria", ["PARTE COMUNE", "MERCI"]);
            break;
          case "persone":
            query = query.in("categoria", ["PARTE COMUNE", "PERSONE"]);
            break;
          default:
            break;
        }
        const { data, error } = await query;
        if (error) throw error;
        const uniqueChapters = [...new Set(data.map((item) => item.argomento))];
        setChapters(uniqueChapters);
      } catch (err) {
        setAppError(`Impossibile caricare i capitoli: ${err.message}.`);
      } finally {
        setLoading(false);
      }
    };
    if (supabase) fetchChapters();
  }, [supabase, setAppError, examContext]);

  if (loading) return <LoadingSpinner message="Caricamento capitoli..." />;

  const getExamTitle = () => {
    switch (examContext) {
      case "comune":
        return "CQC Solo Parte Comune";
      case "merci":
        return "CQC + Merci";
      case "persone":
        return "CQC + Persone";
      default:
        return "Pratica su Tutto";
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-12 animate-fade-in-up relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <h1
            className={`text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${
              theme === "light"
                ? "from-[#FF3F33] to-[#ff6a60]"
                : "from-violet-500 to-cyan-400"
            }`}
          >
            {getExamTitle()}
          </h1>
          <button
            onClick={onBackToSelection}
            className={`text-sm hover:underline ${
              theme === "light" ? "text-[#075B5E]/70" : "text-gray-400"
            }`}
          >
            Cambia esame
          </button>
        </header>
        <main className="space-y-8">
          {examContext !== "all" && (
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "150ms" }}
            >
              <h2
                className={`text-xs uppercase font-bold mb-3 tracking-wider ${
                  theme === "light" ? "text-[#FF3F33]/80" : "text-violet-400"
                }`}
              >
                Simulazione Esame
              </h2>
              <ListItem
                theme={theme}
                title={`Avvia Simulazione ${getExamTitle()}`}
                description="70 domande, 90 minuti."
                onClick={() => onStartQuiz(examContext, 70)}
                delay={0}
              />
            </div>
          )}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            <h2
              className={`text-xs uppercase font-bold mb-3 tracking-wider ${
                theme === "light" ? "text-[#FF3F33]/80" : "text-violet-400"
              }`}
            >
              Pratica Libera
            </h2>
            <div className="space-y-3">
              <ListItem
                theme={theme}
                title="Tutte le Domande (del contesto)"
                description="Esercitati senza timer."
                onClick={() => onStartQuiz(examContext)}
                delay={0}
              />
              <ListItem
                theme={theme}
                title="Statistiche Errori"
                description="Rivedi le domande che hai sbagliato."
                onClick={onShowStats}
                delay={1}
              />
            </div>
          </div>
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "450ms" }}
          >
            <h2
              className={`text-xs uppercase font-bold mb-3 tracking-wider ${
                theme === "light" ? "text-[#FF3F33]/80" : "text-violet-400"
              }`}
            >
              Esercitazione per Capitolo
            </h2>
            {chapters.length > 0 ? (
              <div className="space-y-3">
                {chapters.map((chapter, index) => (
                  <ListItem
                    theme={theme}
                    key={chapter}
                    title={chapter}
                    description="Fai pratica con le domande di questo argomento."
                    onClick={() => onSelectChapter(chapter)}
                    delay={index}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Nessun capitolo trovato.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const Timer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const intervalId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return (
    <div className="flex items-center gap-2 font-semibold text-lg">
      {icons.clock}
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
};

const QuizScreen = ({
  questions,
  onQuizComplete,
  onGoBack,
  isExamMode,
  theme,
  toggleTheme,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(() =>
    Array(questions.length).fill(null)
  );
  const [isWrong, setIsWrong] = useState(false);
  const [displayedLanguage, setDisplayedLanguage] = useState("it");

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex]?.userAnswer;

  const handleTimeUp = useCallback(() => {
    onQuizComplete(userAnswers.filter((a) => a !== null));
  }, [userAnswers, onQuizComplete]);

  const handleAnswer = (answer) => {
    if (selectedAnswer) return;
    const isCorrect = answer === currentQuestion.risposta_corretta;
    if (!isCorrect) {
      setIsWrong(true);
      saveErrorToStats(currentQuestion);
      setTimeout(() => setIsWrong(false), 500);
    }
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.testo_domanda_it,
      questionText: currentQuestion.testo_domanda_it,
      userAnswer: answer,
      correctAnswer: currentQuestion.risposta_corretta,
      isCorrect,
    };
    setUserAnswers(newAnswers);
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        goToQuestion(currentQuestionIndex + 1);
      }
    }, 1200);
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setDisplayedLanguage("it");
    }
  };

  const getButtonClass = (answer) => {
    if (!selectedAnswer)
      return `bg-white/70 text-[#075B5E] hover:bg-white ${
        theme === "dark" &&
        "dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      }`;
    if (answer === currentQuestion.risposta_corretta)
      return "bg-[#9FC87E] text-white";
    if (
      answer === selectedAnswer &&
      answer !== currentQuestion.risposta_corretta
    )
      return "bg-[#FF3F33] text-white";
    return `bg-white/50 text-[#075B5E]/70 opacity-70 ${
      theme === "dark" && "dark:bg-gray-800/50 dark:text-gray-400"
    }`;
  };

  const getDisplayedQuestion = () => {
    switch (displayedLanguage) {
      case "en":
        return currentQuestion.testo_domanda_en || "Translation not available";
      case "ur":
        return currentQuestion.testo_domanda_ur || "Translation not available";
      case "pa":
        return currentQuestion.testo_domanda_pa || "Translation not available";
      default:
        return currentQuestion.testo_domanda_it;
    }
  };

  const getNavButtonClass = (index) => {
    const baseClass =
      "w-8 h-8 rounded-full flex items-center justify-center transition text-sm font-bold";
    if (currentQuestionIndex === index)
      return `${baseClass} bg-[#FF3F33] text-white ring-2 ring-offset-2 ${
        theme === "light" ? "ring-offset-[#FFE6E1]" : "ring-offset-gray-900"
      } ring-[#FF3F33]`;
    if (userAnswers[index])
      return userAnswers[index].isCorrect
        ? `${baseClass} bg-[#9FC87E] text-white`
        : `${baseClass} bg-[#FF3F33]/70 text-white`;
    return `${baseClass} ${
      theme === "light" ? "bg-white/50" : "bg-gray-700/50"
    }`;
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 sm:p-8`}>
      <div className={`w-full max-w-2xl ${isWrong ? "animate-shake" : ""}`}>
        <header className="mb-8 w-full flex justify-between items-center">
          <button
            onClick={() =>
              onQuizComplete(userAnswers.filter((a) => a !== null))
            }
            className={`flex items-center gap-2 transition-colors ${
              theme === "light"
                ? "text-[#FF3F33] hover:text-[#ff6a60]"
                : "text-violet-400 hover:text-violet-300"
            }`}
          >
            {icons.arrowLeft} Abbandona
          </button>
          <div className="flex items-center gap-4">
            {isExamMode && <Timer duration={90 * 60} onTimeUp={handleTimeUp} />}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </header>
        <div
          className={`w-full p-8 rounded-2xl border shadow-xl animate-fade-in-up ${
            theme === "light"
              ? "bg-white/60 border-gray-200/80"
              : "bg-gray-800/50 border-gray-700"
          }`}
        >
          <div className="mb-6">
            <div
              className={`flex justify-between items-center mb-2 ${
                theme === "light" ? "text-[#075B5E]/70" : "text-gray-400"
              }`}
            >
              <span>
                Domanda {currentQuestionIndex + 1} / {questions.length}
              </span>
              <span
                className={`font-semibold ${
                  theme === "light" ? "text-[#075B5E]" : "text-violet-400"
                }`}
              >
                {currentQuestion.argomento}
              </span>
            </div>
            <div
              className={`w-full rounded-full h-2 overflow-hidden ${
                theme === "light" ? "bg-black/5" : "bg-gray-900/50"
              }`}
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 bg-gradient-to-r ${
                  theme === "light"
                    ? "from-[#FF3F33] to-[#ff6a60]"
                    : "from-violet-500 to-cyan-400"
                }`}
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
          <p
            key={currentQuestionIndex}
            className="text-2xl font-medium text-center my-8 min-h-[140px] flex items-center justify-center animate-fade-in-zoom"
          >
            {getDisplayedQuestion()}
          </p>
          <div
            className={`flex flex-wrap justify-center items-center gap-3 mb-8 border-t pt-6 ${
              theme === "light" ? "border-gray-200/80" : "border-gray-700"
            }`}
          >
            <button
              onClick={() => setDisplayedLanguage("it")}
              className={`px-3 py-1 text-sm rounded-full transition ${
                displayedLanguage === "it"
                  ? theme === "light"
                    ? "bg-[#075B5E] text-white"
                    : "bg-violet-600 text-white"
                  : theme === "light"
                  ? "bg-white/70 hover:bg-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Italiano
            </button>
            <button
              onClick={() => setDisplayedLanguage("en")}
              className={`px-3 py-1 text-sm rounded-full transition ${
                displayedLanguage === "en"
                  ? theme === "light"
                    ? "bg-[#075B5E] text-white"
                    : "bg-violet-600 text-white"
                  : theme === "light"
                  ? "bg-white/70 hover:bg-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setDisplayedLanguage("ur")}
              className={`px-3 py-1 text-sm rounded-full transition ${
                displayedLanguage === "ur"
                  ? theme === "light"
                    ? "bg-[#075B5E] text-white"
                    : "bg-violet-600 text-white"
                  : theme === "light"
                  ? "bg-white/70 hover:bg-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Urdu
            </button>
            <button
              onClick={() => setDisplayedLanguage("pa")}
              className={`px-3 py-1 text-sm rounded-full transition ${
                displayedLanguage === "pa"
                  ? theme === "light"
                    ? "bg-[#075B5E] text-white"
                    : "bg-violet-600 text-white"
                  : theme === "light"
                  ? "bg-white/70 hover:bg-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Punjabi
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={() => handleAnswer("Vero")}
              disabled={!!selectedAnswer}
              className={`w-full py-5 text-xl font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-3 ${getButtonClass(
                "Vero"
              )}`}
            >
              Vero{" "}
              {selectedAnswer &&
                currentQuestion.risposta_corretta === "Vero" &&
                icons.check}{" "}
              {selectedAnswer === "Vero" &&
                currentQuestion.risposta_corretta !== "Vero" &&
                icons.x}
            </button>
            <button
              onClick={() => handleAnswer("Falso")}
              disabled={!!selectedAnswer}
              className={`w-full py-5 text-xl font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-3 ${getButtonClass(
                "Falso"
              )}`}
            >
              Falso{" "}
              {selectedAnswer &&
                currentQuestion.risposta_corretta === "Falso" &&
                icons.check}{" "}
              {selectedAnswer === "Falso" &&
                currentQuestion.risposta_corretta !== "Falso" &&
                icons.x}
            </button>
          </div>
        </div>
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => goToQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-lg disabled:opacity-50 transition ${
              theme === "light" ? "bg-white/70" : "bg-gray-800"
            }`}
          >
            Precedente
          </button>
          <button
            onClick={() =>
              onQuizComplete(userAnswers.filter((a) => a !== null))
            }
            className="px-6 py-2 rounded-lg bg-[#FF3F33] text-white font-semibold transition hover:bg-[#ff6a60]"
          >
            Termina e vedi risultati
          </button>
          <button
            onClick={() => goToQuestion(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`px-6 py-2 rounded-lg disabled:opacity-50 transition ${
              theme === "light" ? "bg-white/70" : "bg-gray-800"
            }`}
          >
            Successivo
          </button>
        </div>
        <div
          className={`mt-4 p-4 rounded-lg flex flex-wrap justify-center gap-2 ${
            theme === "light" ? "bg-white/60" : "bg-gray-800/50"
          }`}
        >
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={getNavButtonClass(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResultsScreen = ({ results, onGoBack, theme }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalCount = results.length;
  const scorePercentage =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const scoreColor =
    scorePercentage >= 60
      ? theme === "light"
        ? "text-[#9FC87E]"
        : "text-green-400"
      : theme === "light"
      ? "text-[#FF3F33]"
      : "text-red-400";
  useEffect(() => {
    if (displayScore < scorePercentage) {
      const timeout = setTimeout(() => setDisplayScore(displayScore + 1), 10);
      return () => clearTimeout(timeout);
    }
  }, [displayScore, scorePercentage]);
  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <header className="text-center mb-12">
          <h1
            className={`text-5xl font-extrabold ${
              theme === "light" ? "text-[#075B5E]" : "text-white"
            }`}
          >
            Riepilogo
          </h1>
          <p className={`text-8xl font-bold mt-4 ${scoreColor}`}>
            {displayScore}%
          </p>
          <p
            className={`${
              theme === "light" ? "text-[#075B5E]/80" : "text-gray-300"
            } text-xl`}
          >
            {correctCount} risposte corrette su {totalCount}
          </p>
        </header>
        <div
          className={`p-6 rounded-2xl border shadow-lg ${
            theme === "light"
              ? "bg-white/60 border-gray-200/80"
              : "bg-gray-800/50 border-gray-700"
          }`}
        >
          <h2
            className={`text-lg font-bold mb-4 ${
              theme === "light" ? "text-[#075B5E]" : "text-violet-400"
            }`}
          >
            Dettaglio Risposte
          </h2>
          <ul className="space-y-3 max-h-[45vh] overflow-y-auto pr-3">
            {results.map((result, index) => (
              <li
                key={result.questionId}
                className={`p-4 rounded-lg flex items-start gap-4 animate-fade-in-up ${
                  theme === "light" ? "bg-[#FFE6E1]/50" : "bg-gray-900/70"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`mt-1 flex-shrink-0 ${
                    result.isCorrect
                      ? theme === "light"
                        ? "text-[#9FC87E]"
                        : "text-green-500"
                      : theme === "light"
                      ? "text-[#FF3F33]"
                      : "text-red-500"
                  }`}
                >
                  {result.isCorrect ? icons.check : icons.x}
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      theme === "light" ? "text-[#075B5E]" : "text-gray-200"
                    }`}
                  >
                    {result.questionText}
                  </p>
                  <p
                    className={`text-sm ${
                      theme === "light" ? "text-[#075B5E]/60" : "text-gray-400"
                    }`}
                  >
                    Hai risposto:{" "}
                    <span
                      className={`font-bold ${
                        result.isCorrect ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {result.userAnswer}
                    </span>
                    . (Corretta:{" "}
                    <span className="font-bold text-green-700">
                      {result.correctAnswer}
                    </span>
                    )
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center mt-12">
          <button
            onClick={onGoBack}
            className={`font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 ${
              theme === "light"
                ? "bg-[#075B5E] hover:bg-[#075B5E]/90 text-white"
                : "bg-violet-600 hover:bg-violet-700 text-white"
            }`}
          >
            Torna alla Home
          </button>
        </div>
      </div>
    </div>
  );
};

const StatsScreen = ({ onGoBack, theme }) => {
  const [errors, setErrors] = useState([]);
  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem("quizErrors")) || {};
    const sortedErrors = Object.values(stats).sort((a, b) => b.count - a.count);
    setErrors(sortedErrors);
  }, []);
  const clearStats = () => {
    if (
      window.confirm(
        "Sei sicuro di voler cancellare la cronologia degli errori?"
      )
    ) {
      localStorage.removeItem("quizErrors");
      setErrors([]);
    }
  };
  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <header className="mb-8 w-full flex justify-between items-center">
          <h1
            className={`text-5xl font-extrabold ${
              theme === "light" ? "text-[#075B5E]" : "text-white"
            }`}
          >
            Statistiche Errori
          </h1>
          <button
            onClick={onGoBack}
            className={`flex items-center gap-2 transition-colors ${
              theme === "light"
                ? "text-[#FF3F33] hover:text-[#ff6a60]"
                : "text-violet-400 hover:text-violet-300"
            }`}
          >
            {icons.arrowLeft} Torna Indietro
          </button>
        </header>
        <div
          className={`p-6 rounded-2xl border shadow-lg ${
            theme === "light"
              ? "bg-white/60 border-gray-200/80"
              : "bg-gray-800/50 border-gray-700"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2
              className={`text-lg font-bold ${
                theme === "light" ? "text-[#075B5E]" : "text-violet-400"
              }`}
            >
              Domande sbagliate più spesso
            </h2>
            <button
              onClick={clearStats}
              className="flex items-center gap-2 text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1 rounded-full transition"
            >
              {icons.trash} Cancella Cronologia
            </button>
          </div>
          {errors.length > 0 ? (
            <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-3">
              {errors.map(({ question, count }, index) => (
                <li
                  key={question.testo_domanda_it}
                  className={`p-4 rounded-lg flex items-start gap-4 animate-fade-in-up ${
                    theme === "light" ? "bg-[#FFE6E1]/50" : "bg-gray-900/70"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`flex-shrink-0 text-lg font-bold ${
                      theme === "light" ? "text-[#FF3F33]" : "text-red-400"
                    }`}
                  >
                    {count}x
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        theme === "light" ? "text-[#075B5E]" : "text-gray-200"
                      }`}
                    >
                      {question.testo_domanda_it}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-500 font-semibold">
                      Risposta corretta: {question.risposta_corretta}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p
              className={`text-center py-8 ${
                theme === "light" ? "text-[#075B5E]/70" : "text-gray-400"
              }`}
            >
              Nessun errore registrato. Ottimo lavoro!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPALE APP ---
let supabase = null;
export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [gameState, setGameState] = useState("loading");
  const [questions, setQuestions] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [appError, setAppError] = useState(null);
  const [isExamMode, setIsExamMode] = useState(false);
  const [examContext, setExamContext] = useState(null);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; opacity: 0; } @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } } .animate-shake { animation: shake 0.5s ease-in-out; } @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } } .animate-fade-out { animation: fade-out 0.5s ease-out forwards; } @keyframes fade-in-zoom { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-fade-in-zoom { animation: fade-in-zoom 0.4s ease-out forwards; }`;
    document.head.appendChild(style);
    if (supabase) {
      setIsSupabaseReady(true);
      setGameState("login");
      return;
    }
    const supabaseUrl = "https://ecshbqjcityvztoyfdpp.supabase.co";
    const supabaseKey = "sb_publishable_vs_-hHJ9Vby2iwLADNo0gg_Jm3MP5za";
    const script = document.createElement("script");
    script.id = "supabase-script";
    script.src =
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
    script.async = true;
    script.onload = () => {
      if (window.supabase) {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        setIsSupabaseReady(true);
        setGameState("login");
      } else {
        setAppError("Impossibile inizializzare Supabase.");
      }
    };
    script.onerror = () =>
      setAppError("Impossibile caricare la libreria Supabase.");
    document.body.appendChild(script);
    return () => {
      if (document.head.contains(style)) document.head.removeChild(style);
      const existingScript = document.getElementById("supabase-script");
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

  const fetchQuestions = useCallback(async (examType, options = {}) => {
    if (!supabase) return;
    setGameState("loading");
    setAppError(null);
    setIsExamMode(examType !== "tutte" && examType !== "capitolo");
    try {
      let query = supabase
        .from("cqc-table-2")
        .select(
          "testo_domanda_it, risposta_corretta, argomento, categoria, testo_domanda_en, testo_domanda_ur, testo_domanda_pa"
        );
      const currentExamType = options.context || examType;
      switch (currentExamType) {
        case "comune":
          query = query.eq("categoria", "PARTE COMUNE");
          break;
        case "merci":
          query = query.in("categoria", ["PARTE COMUNE", "MERCI"]);
          break;
        case "persone":
          query = query.in("categoria", ["PARTE COMUNE", "PERSONE"]);
          break;
        case "capitolo":
          query = query.eq("argomento", options.chapterName);
          break;
        case "all":
        case "tutte":
        default:
          break;
      }
      const { data, error: dbError } = await query;
      if (dbError) throw dbError;
      if (data.length === 0)
        throw new Error(`Nessuna domanda trovata per la selezione.`);
      const shuffled = data.sort(() => 0.5 - Math.random());
      const selectedQuestions = options.count
        ? shuffled.slice(0, options.count)
        : shuffled;
      setQuestions(selectedQuestions);
      setGameState("quiz");
    } catch (err) {
      console.error("Errore nel caricamento delle domande:", err);
      setAppError(err.message);
      setGameState("dashboard");
    }
  }, []);

  const handleStartQuiz = (examType, count) =>
    fetchQuestions(examType, { count, context: examContext });
  const handleSelectChapter = (chapterName) =>
    fetchQuestions("capitolo", { chapterName });
  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setGameState("results");
  };
  const handleGoBackToDashboard = () => {
    setGameState("dashboard");
    setQuestions([]);
    setQuizResults([]);
    setAppError(null);
  };
  const handleShowStats = () => setGameState("stats");
  const handleSelectExam = (context) => {
    setExamContext(context);
    setGameState("dashboard");
  };
  const handleBackToSelection = () => {
    setExamContext(null);
    setGameState("examSelection");
  };
  const handleLogin = () => setGameState("examSelection");

  const renderContent = () => {
    if (!isSupabaseReady)
      return <LoadingSpinner message="Inizializzazione..." />;
    switch (gameState) {
      case "loading":
        return <LoadingSpinner message="Caricamento..." />;
      case "login":
        return (
          <LoginScreen
            onLogin={handleLogin}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
      case "examSelection":
        return (
          <ExamSelectionScreen
            onSelectExam={handleSelectExam}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
      case "quiz":
        return (
          <QuizScreen
            questions={questions}
            onQuizComplete={handleQuizComplete}
            onGoBack={handleGoBackToDashboard}
            isExamMode={isExamMode}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
      case "results":
        return (
          <ResultsScreen
            results={quizResults}
            onGoBack={handleGoBackToDashboard}
            theme={theme}
          />
        );
      case "stats":
        return <StatsScreen onGoBack={handleGoBackToDashboard} theme={theme} />;
      case "dashboard":
      default:
        return (
          <Dashboard
            setAppError={setAppError}
            onStartQuiz={handleStartQuiz}
            onSelectChapter={handleSelectChapter}
            onShowStats={handleShowStats}
            theme={theme}
            toggleTheme={toggleTheme}
            examContext={examContext}
            onBackToSelection={handleBackToSelection}
          />
        );
    }
  };

  return (
    <div
      className={
        theme === "light"
          ? "bg-[#FFE6E1] text-[#075B5E]"
          : "dark bg-gray-900 text-gray-300"
      }
    >
      {appError && <ErrorDisplay message={appError} />}
      {renderContent()}
    </div>
  );
}
