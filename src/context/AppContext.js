import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Inicialização segura do localStorage
  const getStoredValue = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
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
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(() => getStoredValue("keyboardShortcuts", { timer: "t", history: "h", tasks: "k" }));
  const [activeTab, setActiveTab] = useState("timer");

  // Estado do temporizador
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);
  const [startTimestamp, setStartTimestamp] = useState(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const updateTimer = () => {
    if (!isRunning || !startTimestamp) return;
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTimestamp) / 1000);
    const sessionDuration = isWorkSession ? workTime * 60 : (cycleCount % cyclesBeforeLongBreak === 0 ? longBreakTime * 60 : breakTime * 60);
    const newTimeLeft = Math.max(0, sessionDuration - elapsedSeconds);

    setTimeLeft(newTimeLeft);

    if (newTimeLeft <= 0) {
      if (notificationsEnabled) {
        new Audio("/sound.mp3").play().catch((error) => console.error("Erro ao tocar som:", error));
      }
      if (isWorkSession) {
        setCycleCount((prev) => prev + 1);
        setSessions((prev) => [...prev, { date: new Date().toLocaleString(), duration: workTime, category: "Estudo" }]);
        setIsWorkSession(false);
      } else {
        setIsWorkSession(true);
      }
      setStartTimestamp(now);
    }
  };

  const toggleTimer = () => {
    if (!strictMode || !isRunning) {
      setIsRunning((prev) => {
        if (!prev) {
          setStartTimestamp((prevTimestamp) => prevTimestamp || Date.now());
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
      setStartTimestamp(null);
    }
  };

  useEffect(() => {
    let timerInterval;
    if (isRunning) {
      timerInterval = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem("workTime", JSON.stringify(workTime));
    localStorage.setItem("breakTime", JSON.stringify(breakTime));
    localStorage.setItem("longBreakTime", JSON.stringify(longBreakTime));
    localStorage.setItem("cyclesBeforeLongBreak", JSON.stringify(cyclesBeforeLongBreak));
    localStorage.setItem("strictMode", JSON.stringify(strictMode));
    localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled));
    localStorage.setItem("keyboardShortcuts", JSON.stringify(keyboardShortcuts));
  }, [workTime, breakTime, longBreakTime, cyclesBeforeLongBreak, strictMode, notificationsEnabled, keyboardShortcuts]);

  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [sessions, tasks]);

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
  };

  return (
    <AppContext.Provider
      value={{
        workTime, setWorkTime,
        breakTime, setBreakTime,
        longBreakTime, setLongBreakTime,
        cyclesBeforeLongBreak, setCyclesBeforeLongBreak,
        sessions, setSessions,
        tasks, setTasks,
        strictMode, setStrictMode,
        notificationsEnabled, setNotificationsEnabled,
        keyboardShortcuts, setKeyboardShortcuts,
        activeTab, setActiveTab,
        timeLeft, isRunning, isWorkSession, cycleCount,
        toggleTimer, resetTimer, formatTime, sendNotification,
        resetSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
