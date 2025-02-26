import React, { createContext, useState, useEffect, useCallback } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
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
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(() =>
    getStoredValue("keyboardShortcuts", { timer: "t", history: "h", tasks: "k" })
  );
  const [activeTab, setActiveTab] = useState("timer");

  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);
  const [endTime, setEndTime] = useState(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const updateTimer = useCallback(() => {
    if (!isRunning || !endTime) {
      console.log(`[updateTimer] Temporizador parado - isRunning: ${isRunning}, endTime: ${endTime}`);
      return;
    }

    const now = Date.now();
    const newTimeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
    console.log(`[updateTimer] Atualizando - now: ${now}, endTime: ${endTime}, newTimeLeft: ${newTimeLeft}, isWorkSession: ${isWorkSession}, cycleCount: ${cycleCount}`);

    setTimeLeft(newTimeLeft);

    if (newTimeLeft <= 0) {
      console.log(`[updateTimer] Tempo esgotado - Iniciando transição`);
      if (notificationsEnabled) {
        new Audio("/sound.mp3").play().catch((error) => console.error("[updateTimer] Erro ao tocar som:", error));
      }

      if (isWorkSession) {
        const newCycleCount = cycleCount + 1;
        console.log(`[updateTimer] Fim do trabalho - Novo ciclo: ${newCycleCount}`);
        setCycleCount(newCycleCount);
        setSessions((prev) => [...prev, { date: new Date().toLocaleString(), duration: workTime, category: "Estudo" }]);
        setIsWorkSession(false);
        const nextBreakDuration = newCycleCount % cyclesBeforeLongBreak === 0 ? longBreakTime * 60 : breakTime * 60;
        console.log(`[updateTimer] Transição para pausa - Duração: ${nextBreakDuration / 60} minutos`);
        setTimeLeft(nextBreakDuration);
        setEndTime(Date.now() + nextBreakDuration * 1000);
      } else {
        console.log(`[updateTimer] Fim da pausa - Voltando ao trabalho`);
        setIsWorkSession(true);
        setTimeLeft(workTime * 60);
        setEndTime(Date.now() + workTime * 60 * 1000);
      }
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
          // Iniciando ou retomando
          if (timeLeft === sessionDuration && endTime === null) {
            // Início fresco (primeira vez ou após reset)
            console.log(`[toggleTimer] Iniciando fresco - Duração: ${sessionDuration / 60} minutos, isWorkSession: ${isWorkSession}`);
            setTimeLeft(sessionDuration);
            setEndTime(Date.now() + sessionDuration * 1000);
          } else {
            // Retomando após pausa
            console.log(`[toggleTimer] Retomando - Tempo restante: ${timeLeft}s`);
            setEndTime(Date.now() + timeLeft * 1000);
          }
        } else {
          // Pausando
          console.log(`[toggleTimer] Pausando - Tempo restante: ${timeLeft}s`);
          setEndTime(null);
        }
        return !prev;
      });
    } else {
      console.log(`[toggleTimer] Bloqueado pelo modo estrito - isRunning: ${isRunning}`);
    }
  };

  const resetTimer = () => {
    if (!strictMode) {
      console.log(`[resetTimer] Resetando temporizador`);
      setIsRunning(false);
      setIsWorkSession(true);
      setTimeLeft(workTime * 60);
      setCycleCount(0);
      setEndTime(null);
    } else {
      console.log(`[resetTimer] Bloqueado pelo modo estrito`);
    }
  };

  useEffect(() => {
    let timerInterval;
    if (isRunning) {
      console.log(`[useEffect] Iniciando intervalo - isRunning: ${isRunning}`);
      timerInterval = setInterval(updateTimer, 1000);
      updateTimer(); // Chama imediatamente para evitar atraso inicial
    } else {
      console.log(`[useEffect] Parando intervalo - isRunning: ${isRunning}`);
    }
    return () => {
      console.log(`[useEffect] Limpando intervalo`);
      clearInterval(timerInterval);
    };
  }, [isRunning, updateTimer]);

  useEffect(() => {
    console.log(`[useEffect] Salvando configurações no localStorage`);
    localStorage.setItem("workTime", JSON.stringify(workTime));
    localStorage.setItem("breakTime", JSON.stringify(breakTime));
    localStorage.setItem("longBreakTime", JSON.stringify(longBreakTime));
    localStorage.setItem("cyclesBeforeLongBreak", JSON.stringify(cyclesBeforeLongBreak));
    localStorage.setItem("strictMode", JSON.stringify(strictMode));
    localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled));
    localStorage.setItem("keyboardShortcuts", JSON.stringify(keyboardShortcuts));
  }, [workTime, breakTime, longBreakTime, cyclesBeforeLongBreak, strictMode, notificationsEnabled, keyboardShortcuts]);

  useEffect(() => {
    console.log(`[useEffect] Salvando sessões e tarefas no localStorage`);
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [sessions, tasks]);

  const sendNotification = (title, options) => {
    if (!notificationsEnabled) {
      console.log(`[sendNotification] Notificações desativadas`);
      return;
    }
    if (Notification.permission === "granted") {
      console.log(`[sendNotification] Enviando notificação: ${title}`);
      new Notification(title, options);
    } else if (Notification.permission === "default") {
      console.log(`[sendNotification] Solicitando permissão para notificação`);
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        }
      });
    }
  };

  const resetSettings = () => {
    console.log(`[resetSettings] Resetando configurações para valores padrão`);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};