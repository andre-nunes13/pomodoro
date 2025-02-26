import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [workTime, setWorkTime] = useState(
    parseInt(localStorage.getItem("workTime")) || 25
  );
  const [breakTime, setBreakTime] = useState(
    parseInt(localStorage.getItem("breakTime")) || 5
  );
  const [longBreakTime, setLongBreakTime] = useState(
    parseInt(localStorage.getItem("longBreakTime")) || 15
  );
  const [cyclesBeforeLongBreak, setCyclesBeforeLongBreak] = useState(
    parseInt(localStorage.getItem("cyclesBeforeLongBreak")) || 4
  );
  const [sessions, setSessions] = useState(
    JSON.parse(localStorage.getItem("sessions")) || []
  );
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [strictMode, setStrictMode] = useState(
    JSON.parse(localStorage.getItem("strictMode")) || false
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    JSON.parse(localStorage.getItem("notificationsEnabled")) || true
  );
  const [activeTab, setActiveTab] = useState("timer"); // Mantido por compatibilidade, mas não usado no PomodoroTimer

  useEffect(() => {
    localStorage.setItem("workTime", workTime);
    localStorage.setItem("breakTime", breakTime);
    localStorage.setItem("longBreakTime", longBreakTime);
    localStorage.setItem("cyclesBeforeLongBreak", cyclesBeforeLongBreak);
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("strictMode", JSON.stringify(strictMode));
    localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled));
  }, [workTime, breakTime, longBreakTime, cyclesBeforeLongBreak, sessions, tasks, strictMode, notificationsEnabled]);

  const sendNotification = (title, options) => {
    if (notificationsEnabled && Notification.permission === "granted") {
      new Notification(title, options);
    } else if (notificationsEnabled && Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        }
      });
    }
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
        activeTab, // Mantido por compatibilidade, mas não usado no PomodoroTimer
        setActiveTab, // Mantido por compatibilidade, mas não usado no PomodoroTimer
        sendNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};