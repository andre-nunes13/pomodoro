import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { AppContext } from "../context/AppContext";
import { Box, Text } from "@chakra-ui/react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SessionHistory = () => {
  const { sessions } = useContext(AppContext);

  const data = {
    labels: sessions.map((session) => session.date),
    datasets: [
      {
        label: "Tempo Trabalhado (min)",
        data: sessions.map((session) => session.duration),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Histórico de Sessões" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <Box p={6} bg="dark.200" borderRadius={8} boxShadow="md">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Histórico de Sessões
      </Text>
      {sessions.length > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <Text>Nenhuma sessão registrada ainda.</Text>
      )}
    </Box>
  );
};

export default SessionHistory;