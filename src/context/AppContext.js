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
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(
    JSON.parse(localStorage.getItem("keyboardShortcuts")) || {
      timer: "t",
      history: "h",
      tasks: "l",
      generator: "g",
      settings: "s",
    }
  );

  useEffect(() => {
    localStorage.setItem("workTime", workTime);
    localStorage.setItem("breakTime", breakTime);
    localStorage.setItem("longBreakTime", longBreakTime);
    localStorage.setItem("cyclesBeforeLongBreak", cyclesBeforeLongBreak);
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("strictMode", JSON.stringify(strictMode));
    localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled));
    localStorage.setItem("theme", theme);
    localStorage.setItem("keyboardShortcuts", JSON.stringify(keyboardShortcuts));
  }, [workTime, breakTime, longBreakTime, cyclesBeforeLongBreak, sessions, tasks, strictMode, notificationsEnabled, theme, keyboardShortcuts]);

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
        theme,
        setTheme,
        keyboardShortcuts,
        setKeyboardShortcuts,
        sendNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};