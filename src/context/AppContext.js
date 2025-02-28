import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import { translations } from "./translations";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const toast = useToast();
  const getStoredValue = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    console.log(`[getStoredValue] Key: ${key}, Value: ${saved}`);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [workTime, setWorkTime] = useState(() => getStoredValue("workTime", 25));
  const [breakTime, setBreakTime] = useState(() => getStoredValue("breakTime", 5));
  const [longBreakTime, setLongBreakTime] = useState(() => getStoredValue("longBreakTime", 15));
  const [cyclesBeforeLongBreak, setCyclesBeforeLongBreak] = useState(() => getStoredValue("cyclesBeforeLongBreak", 4));
  const [sessions, setSessions] = useState(() => getStoredValue("sessions", []));
  const [tasks, setTasks] = useState(() => getStoredValue("tasks", []));
  const [strictMode, setStrictMode] = useState(() => getStoredValue("strictMode", false));
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => getStoredValue("notificationsEnabled", true));
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(() =>
    getStoredValue("keyboardShortcuts", { timer: "t", history: "h", tasks: "k" })
  );
  const [activeTab, setActiveTab] = useState("timer");
  const [achievements, setAchievements] = useState(() => {
    const stored = getStoredValue("achievements", []);
    const uniqueAchievements = Array.from(new Map(stored.map((a) => [a.id, a])).values());
    console.log('[Initial Achievements]', uniqueAchievements);
    return uniqueAchievements;
  });
  const [language, setLanguage] = useState(() => getStoredValue("language", "en"));

  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);
  const [endTime, setEndTime] = useState(null);

  // Memoizar a função t com useCallback
  const t = useCallback((key) => translations[language][key] || key, [language]);

  const achievementList = useMemo(
    () => [
      { id: 1, name: t("First Steps"), description: t("Complete your first work cycle"), condition: () => cycleCount >= 1 },
      { id: 2, name: t("Initial Productivity"), description: t("Complete 5 work cycles"), condition: () => cycleCount >= 5 },
      { id: 3, name: t("Pomodoro Master"), description: t("Complete 20 work cycles"), condition: () => cycleCount >= 20 },
      { id: 4, name: t("Marathon Runner"), description: t("Complete 50 work cycles"), condition: () => cycleCount >= 50 },
      { id: 5, name: t("Basic Task"), description: t("Add your first task"), condition: () => tasks.length >= 1 },
      { id: 6, name: t("Organizer"), description: t("Add 10 tasks"), condition: () => tasks.length >= 10 },
      { id: 7, name: t("Planner"), description: t("Add 25 tasks"), condition: () => tasks.length >= 25 },
      { id: 8, name: t("Strict Focus"), description: t("Complete a cycle in strict mode"), condition: () => strictMode && cycleCount >= 1 },
      { id: 9, name: t("Silence is Golden"), description: t("Disable sound notifications"), condition: () => !notificationsEnabled },
      { id: 10, name: t("Living History"), description: t("Record 10 sessions in history"), condition: () => sessions.length >= 10 },
      { id: 11, name: t("Long Break"), description: t("Complete a cycle until the long break"), condition: () => cycleCount % cyclesBeforeLongBreak === 0 && cycleCount > 0 },
      { id: 12, name: t("Task Completed"), description: t("Mark a task as completed"), condition: () => tasks.some(task => task.completed) },
      { id: 13, name: t("Multitasking"), description: t("Complete 5 tasks"), condition: () => tasks.filter(task => task.completed).length >= 5 },
      { id: 14, name: t("Total Focus"), description: t("Complete 10 cycles without pausing"), condition: () => cycleCount >= 10 && !isRunning },
      { id: 15, name: t("Explorer"), description: t("Visit all tabs of the application"), condition: () => ["timer", "history", "tasks", "achievements"].every(tab => activeTab === tab || true) },
      { id: 16, name: t("Customizer"), description: t("Change keyboard shortcuts"), condition: () => Object.values(keyboardShortcuts).some(key => key !== "t" && key !== "h" && key !== "k") },
      { id: 17, name: t("Idea Generator"), description: t("Generate automatic tasks with AI"), condition: () => tasks.some(task => task.description.includes(t("Task about"))) },
      { id: 18, name: t("Productive Day"), description: t("Complete 8 hours of work"), condition: () => sessions.reduce((acc, session) => acc + (session.type === "Trabalho" ? session.duration : 0), 0) >= 480 },
      { id: 19, name: t("No Distractions"), description: t("Complete 5 cycles in strict mode"), condition: () => strictMode && cycleCount >= 5 },
      { id: 20, name: t("Conqueror"), description: t("Unlock all other achievements"), condition: () => achievements.length === 19 },
    ],
    [cycleCount, tasks, strictMode, notificationsEnabled, sessions, cyclesBeforeLongBreak, isRunning, keyboardShortcuts, activeTab, achievements.length, t]
  );

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const updateAchievements = useCallback(() => {
    console.log('[updateAchievements] Executando...');
    console.log('[updateAchievements] Achievements atuais:', achievements);
    const unlockedAchievements = achievementList.filter(
      (achievement) => achievement.condition() && !achievements.some((a) => a.id === achievement.id)
    );
    console.log('[updateAchievements] Novas conquistas detectadas:', unlockedAchievements);

    if (unlockedAchievements.length > 0) {
      setAchievements((prev) => {
        const newAchievements = [
          ...prev,
          ...unlockedAchievements.map((a) => ({
            id: a.id,
            name: a.name,
            description: a.description,
            unlockedAt: new Date().toLocaleString(),
          })),
        ];
        const uniqueAchievements = Array.from(new Map(newAchievements.map((a) => [a.id, a])).values());
        console.log('[updateAchievements] Novo estado de conquistas (único):', uniqueAchievements);
        return uniqueAchievements;
      });

      unlockedAchievements.forEach((achievement) => {
        console.log(`[updateAchievements] Toast disparado para: ${achievement.name}`);
        toast({
          title: t("Achievement Unlocked"),
          description: `${achievement.name}: ${achievement.description}`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
          containerStyle: {
            fontFamily: "'MS Sans Serif', Tahoma, sans-serif",
            bg: "xpGreen.500",
            color: "white",
            border: "1px solid",
            borderColor: "xpGray.200",
            boxShadow: "inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)",
          },
        });
      });
    } else {
      console.log('[updateAchievements] Nenhuma nova conquista para adicionar.');
    }
  }, [achievementList, achievements, toast, t]);

  const updateTimer = useCallback(() => {
    if (!isRunning || !endTime) return;

    const now = Date.now();
    const newTimeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
    console.log(`[updateTimer] timeLeft: ${newTimeLeft}`);
    setTimeLeft(newTimeLeft);

    if (newTimeLeft <= 0) {
      console.log('[updateTimer] Ciclo concluído');
      if (notificationsEnabled) {
        new Audio("/sound.mp3").play().catch((error) => console.error("Erro ao tocar som:", error));
      }

      if (isWorkSession) {
        const newCycleCount = cycleCount + 1;
        setCycleCount(newCycleCount);
        setSessions((prev) => [
          ...prev,
          {
            date: new Date().toLocaleString(),
            duration: workTime,
            category: "Estudo",
            type: "Trabalho",
          },
        ]);
        setIsWorkSession(false);
        const nextBreakDuration = newCycleCount % cyclesBeforeLongBreak === 0 ? longBreakTime * 60 : breakTime * 60;
        setTimeLeft(nextBreakDuration);
        setEndTime(Date.now() + nextBreakDuration * 1000);
      } else {
        setSessions((prev) => [
          ...prev,
          {
            date: new Date().toLocaleString(),
            duration: cycleCount % cyclesBeforeLongBreak === 0 ? longBreakTime : breakTime,
            category: "Pausa",
            type: "Pausa",
          },
        ]);
        setIsWorkSession(true);
        setTimeLeft(workTime * 60);
        setEndTime(Date.now() + workTime * 60 * 1000);
      }
      updateAchievements();
    }
  }, [
    isRunning,
    endTime,
    isWorkSession,
    cycleCount,
    workTime,
    breakTime,
    longBreakTime,
    cyclesBeforeLongBreak,
    notificationsEnabled,
    updateAchievements,
  ]);

  const toggleTimer = () => {
    if (!strictMode || !isRunning) {
      setIsRunning((prev) => {
        const sessionDuration = isWorkSession
          ? workTime * 60
          : cycleCount % cyclesBeforeLongBreak === 0
          ? longBreakTime * 60
          : breakTime * 60;

        if (!prev) {
          if (timeLeft === sessionDuration && endTime === null) {
            setTimeLeft(sessionDuration);
            setEndTime(Date.now() + sessionDuration * 1000);
            console.log('[toggleTimer] Timer iniciado');
          } else {
            setEndTime(Date.now() + timeLeft * 1000);
            console.log('[toggleTimer] Timer retomado');
          }
        } else {
          setEndTime(null);
          console.log('[toggleTimer] Timer pausado');
        }
        return !prev;
      });
    }
  };

  const resetTimer = () => {
    if (!strictMode) {
      setIsRunning(false);
      setIsWorkSession(true);
      setTimeLeft(workTime * 60);
      setCycleCount(0);
      setEndTime(null);
      console.log('[resetTimer] Timer reiniciado');
    }
  };

  useEffect(() => {
    let timerInterval;
    if (isRunning) {
      timerInterval = setInterval(() => {
        console.log('[Timer Interval] Executando updateTimer');
        updateTimer();
      }, 1000);
      updateTimer();
    }
    return () => {
      console.log('[Timer Interval] Limpando intervalo');
      clearInterval(timerInterval);
    };
  }, [isRunning, updateTimer]);

  useEffect(() => {
    console.log('[useEffect] Atualizando localStorage');
    localStorage.setItem("workTime", JSON.stringify(workTime));
    localStorage.setItem("breakTime", JSON.stringify(breakTime));
    localStorage.setItem("longBreakTime", JSON.stringify(longBreakTime));
    localStorage.setItem("cyclesBeforeLongBreak", JSON.stringify(cyclesBeforeLongBreak));
    localStorage.setItem("strictMode", JSON.stringify(strictMode));
    localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled));
    localStorage.setItem("keyboardShortcuts", JSON.stringify(keyboardShortcuts));
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("achievements", JSON.stringify(achievements));
    localStorage.setItem("language", JSON.stringify(language));
  }, [
    workTime,
    breakTime,
    longBreakTime,
    cyclesBeforeLongBreak,
    strictMode,
    notificationsEnabled,
    keyboardShortcuts,
    sessions,
    tasks,
    achievements,
    language,
  ]);

  useEffect(() => {
    console.log('[useEffect] Verificando conquistas iniciais');
    updateAchievements();
  }, [updateAchievements]);

  const sendNotification = (title, options) => {
    if (!notificationsEnabled) return;
    if (Notification.permission === "granted") {
      new Notification(title, options);
    } else if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        }
      });
    }
  };

  const resetSettings = () => {
    setWorkTime(25);
    setBreakTime(5);
    setLongBreakTime(15);
    setCyclesBeforeLongBreak(4);
    setStrictMode(false);
    setNotificationsEnabled(true);
    setKeyboardShortcuts({ timer: "t", history: "h", tasks: "k" });
    console.log('[resetSettings] Configurações resetadas');
  };

  return (
    <AppContext.Provider
      value={{
        workTime,
        setWorkTime,
        breakTime,
        setBreakTime,
        longBreakTime,
        setLongBreakTime,
        cyclesBeforeLongBreak,
        setCyclesBeforeLongBreak,
        sessions,
        setSessions,
        tasks,
        setTasks,
        strictMode,
        setStrictMode,
        notificationsEnabled,
        setNotificationsEnabled,
        keyboardShortcuts,
        setKeyboardShortcuts,
        activeTab,
        setActiveTab,
        timeLeft,
        isRunning,
        isWorkSession,
        cycleCount,
        toggleTimer,
        resetTimer,
        formatTime,
        sendNotification,
        resetSettings,
        achievements,
        setAchievements,
        achievementList,
        toast,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};