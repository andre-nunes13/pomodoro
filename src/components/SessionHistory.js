import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  Box,
  Text,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Stack,
} from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SessionHistory = () => {
  const { sessions, setSessions, t } = useContext(AppContext);
  const [filter, setFilter] = useState("all");

  const filterSessions = () => {
    const now = new Date();
    switch (filter) {
      case "week":
        return sessions.filter((session) => {
          const sessionDate = new Date(session.date);
          return (now - sessionDate) / (1000 * 60 * 60 * 24) <= 7;
        });
      case "month":
        return sessions.filter((session) => {
          const sessionDate = new Date(session.date);
          return (now - sessionDate) / (1000 * 60 * 60 * 24) <= 30;
        });
      default:
        return sessions;
    }
  };

  const filteredSessions = filterSessions();

  const totalWorkHours = filteredSessions
    .filter((s) => s.type === "Trabalho")
    .reduce((acc, session) => acc + session.duration / 60, 0);
  const totalCycles = filteredSessions.filter((s) => s.type === "Trabalho").length;
  const avgSessionDuration = filteredSessions.length
    ? filteredSessions.reduce((acc, s) => acc + s.duration, 0) / filteredSessions.length / 60
    : 0;

  const chartData = {
    labels: filteredSessions.map((s) => s.date),
    datasets: [
      {
        label: t("Duration (min)"),
        data: filteredSessions.map((s) => s.duration),
        backgroundColor: filteredSessions.map((s) =>
          s.type === "Trabalho" ? "rgba(54, 162, 235, 0.6)" : "rgba(255, 99, 132, 0.6)"
        ),
        borderColor: filteredSessions.map((s) =>
          s.type === "Trabalho" ? "rgba(54, 162, 235, 1)" : "rgba(255, 99, 132, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: t("Session History") },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: t("Duration (min)") } },
      x: { title: { display: true, text: t("Date") } },
    },
  };

  const exportToCSV = () => {
    const headers = `${t("Date")},${t("Duration (min)")},${t("Category")},${t("Type")}\n`;
    const rows = filteredSessions
      .map((s) => `${s.date},${s.duration},${s.category},${s.type}`)
      .join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "session_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearHistory = () => {
    setSessions([]);
    localStorage.setItem("sessions", JSON.stringify([]));
  };

  return (
    <Box
      p={6}
      bg="xpBlue.100"
      border="1px solid"
      borderColor="xpGray.200"
      boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
      h="calc(100vh - 30px)"
      maxH="calc(100vh - 30px)"
      w={{ base: "100%", md: "80vw", lg: "60vw" }}
      maxW="800px"
      overflowY="auto"
      position="relative"
      mx="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4} color="xpGray.300">
        {t("Session History")}
      </Text>

      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        mb={4}
        bg="white"
        color="xpGray.300"
        border="1px solid"
        borderColor="xpGray.200"
        boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
        maxW="200px"
      >
        <option value="all">{t("All")}</option>
        <option value="week">{t("Last Week")}</option>
        <option value="month">{t("Last Month")}</option>
      </Select>

      <Stack spacing={2} mb={4}>
        <Text color="xpGray.300">
          {t("Total Work Hours")}: {totalWorkHours.toFixed(2)} h
        </Text>
        <Text color="xpGray.300">
          {t("Completed Cycles")}: {totalCycles}
        </Text>
        <Text color="xpGray.300">
          {t("Average Session Duration")}: {avgSessionDuration.toFixed(2)} min
        </Text>
      </Stack>

      <Box
        mb={4}
        h="40vh"
        maxH="40vh"
        overflowY="auto"
        border="1px solid"
        borderColor="xpGray.200"
      >
        <Bar data={chartData} options={chartOptions} />
      </Box>

      <Box
        h="40vh"
        maxH="40vh"
        overflowY="auto"
        border="1px solid"
        borderColor="xpGray.200"
        mb={16}
      >
        <Table variant="simple" size="sm">
          <Thead position="sticky" top={0} bg="xpBlue.200" zIndex={1}>
            <Tr>
              <Th color="white">{t("Date")}</Th>
              <Th color="white">{t("Duration (min)")}</Th>
              <Th color="white">{t("Category")}</Th>
              <Th color="white">{t("Type")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredSessions.map((session, index) => (
              <Tr key={index}>
                <Td>{session.date}</Td>
                <Td>{session.duration}</Td>
                <Td>{session.category}</Td>
                <Td>{t(session.type)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Stack
        direction="row"
        spacing={4}
        position="absolute"
        bottom={4}
        left="50%"
        transform="translateX(-50%)"
        zIndex={2}
      >
        <Button
          onClick={exportToCSV}
          bg="xpBlue.300"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "xpBlue.400" }}
          isDisabled={filteredSessions.length === 0}
          size="sm"
        >
          {t("Export as CSV")}
        </Button>
        <Button
          onClick={clearHistory}
          bg="xpRed.500"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "#FF4040" }}
          isDisabled={filteredSessions.length === 0}
          size="sm"
        >
          {t("Clear History")}
        </Button>
      </Stack>
    </Box>
  );
};

export default SessionHistory;