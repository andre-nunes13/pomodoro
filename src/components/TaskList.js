import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import {
  Box,
  Text,
  Input,
  Button,
  Stack,
  Checkbox,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { GoogleGenerativeAI } from "@google/generative-ai";

const TaskList = () => {
  const { tasks, setTasks, t } = useContext(AppContext);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [taskCategory, setTaskCategory] = useState("Estudo");
  const [taskPriority, setTaskPriority] = useState("Média");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [generateTopic, setGenerateTopic] = useState("");
  const [generateQuantity, setGenerateQuantity] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(new Set());

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  useEffect(() => {
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      console.error("Chave de API do Gemini não configurada. Configure REACT_APP_GEMINI_API_KEY no seu arquivo .env.");
    }
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks((prevTasks) => [
        ...prevTasks,
        {
          id: Date.now(),
          description: newTask,
          completed: false,
          category: taskCategory,
          priority: taskPriority,
          dueDate: null,
        },
      ]);
      setNewTask("");
      setTaskCategory(t("Study"));
      setTaskPriority(t("Medium"));
      setIsAddOpen(false);
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (task) => {
    setEditingTask(task.id);
    setEditText(task.description);
  };

  const saveEdit = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, description: editText } : task
      )
    );
    setEditingTask(null);
    setEditText("");
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const generateTasks = async () => {
    if (!generateTopic.trim() || !generateQuantity) {
      alert(t("Please enter a theme and select the number of tasks."));
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Cria exatamente ${generateQuantity} tarefas detalhadas para estudar sobre o seguinte tema: "${generateTopic}". As tarefas devem ser numeradas de 1 a ${generateQuantity}, focadas e específicas. Não deves incluir texto extra, apenas as ${generateQuantity} tarefas numeradas. Exemplo: 1. Resolver 10 exercícios de tal matéria 2. Estudar 30 minutos sobre funções exponenciais APENAS ESCREVE AS TAREFAS E NADA ALÉM DISSO`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const tasksArray = responseText
        .split("\n")
        .filter((line) => line.trim() && line.match(/^\d+\.\s/))
        .map((line) => line.trim());

      const generatedTasks = tasksArray.map((task, index) => ({
        id: Date.now() + index,
        description: task,
        completed: false,
        category: t("Study"),
        dueDate: null,
        priority: t("Medium"),
      }));

      setTasks([...tasks, ...generatedTasks]);
      setIsGenerateOpen(false);
      setGenerateTopic("");
      setGenerateQuantity(5);
    } catch (error) {
      console.error("Erro ao gerar tarefas com o Gemini:", error);
      alert(t("An error occurred while generating tasks. Check the API key or theme."));
      const mockTasks = Array.from({ length: generateQuantity }, (_, i) => ({
        id: Date.now() + i,
        description: `${i + 1}. ${t("Task about")} ${generateTopic}`,
        completed: false,
        category: t("Study"),
        dueDate: null,
        priority: t("Medium"),
      }));
      setTasks([...tasks, ...mockTasks]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskSelection = (id) => {
    const newSelectedTasks = new Set(selectedTasks);
    if (newSelectedTasks.has(id)) {
      newSelectedTasks.delete(id);
    } else {
      newSelectedTasks.add(id);
    }
    setSelectedTasks(newSelectedTasks);
  };

  const selectAllTasks = () => {
    const allTaskIds = new Set(tasks.map((task) => task.id));
    setSelectedTasks(allTaskIds);
  };

  const deleteSelectedTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !selectedTasks.has(task.id)));
    setSelectedTasks(new Set());
    setIsManageOpen(false);
  };

  return (
    <Box p={6} bg="xpBlue.100" borderRadius={0} boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)">
      <Stack direction="row" justify="space-between" align="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          {t("Task List")}
        </Text>
        <Stack direction="row" spacing={2}>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<AddIcon />}
              variant="outline"
              border="1px solid"
              borderColor="xpGray.200"
              bg="xpBlue.300"
              color="black"
              boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
              _hover={{ bg: "xpBlue.400" }}
              aria-label={t("Task Actions")}
              isDisabled={isLoading}
            />
            <MenuList bg="xpBlue.100" borderColor="xpGray.200" boxShadow="1px 1px 2px rgba(0, 0, 0, 0.5)">
              <MenuItem onClick={() => setIsAddOpen(true)} bg="xpBlue.100" isDisabled={isLoading}>
                {t("Add Task Manually")}
              </MenuItem>
              <MenuItem onClick={() => setIsGenerateOpen(true)} bg="xpBlue.100" isDisabled={isLoading}>
                {t("Generate Automatic Tasks")}
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            icon={<DeleteIcon />}
            variant="outline"
            border="1px solid"
            borderColor="xpGray.200"
            bg="xpRed.500"
            color="white"
            boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
            _hover={{ bg: "#FF4040" }}
            aria-label={t("Manage Tasks")}
            onClick={() => setIsManageOpen(true)}
            isDisabled={isLoading || tasks.length === 0}
          />
        </Stack>
      </Stack>
      <Box
        maxH="400px"
        overflowY="auto"
        border="1px solid"
        borderColor="xpGray.200"
        bg="xpBlue.100"
        p={2}
      >
        <Stack spacing={2}>
          {tasks.map((task) => (
            <Box
              key={task.id}
              display="flex"
              alignItems="center"
              p={2}
              bg="xpBlue.100"
              border="1px solid"
              borderColor="xpGray.200"
              boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
            >
              <Checkbox
                isChecked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
                mr={2}
                borderColor="xpGray.200"
                bg="xpBlue.100"
                isDisabled={isLoading}
              />
              {editingTask === task.id ? (
                <Stack direction="row" flex={1}>
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    bg="white"
                    color="xpGray.300"
                    border="1px solid"
                    borderColor="xpGray.200"
                    boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                    flex={1}
                    isDisabled={isLoading}
                  />
                  <Button
                    onClick={() => saveEdit(task.id)}
                    colorScheme="blue"
                    bg="xpBlue.300"
                    border="1px solid"
                    borderColor="xpGray.200"
                    boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
                    size="sm"
                    _hover={{ bg: "xpBlue.400" }}
                    isDisabled={isLoading}
                  >
                    {t("Save")}
                  </Button>
                </Stack>
              ) : (
                <Text flex={1} className={task.completed ? "line-through text-gray-500" : ""}>
                  {task.description} ({t("Cat")}: {t(task.category)}, {t("Pri")}: {t(task.priority)})
                </Text>
              )}
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<EditIcon />}
                  variant="ghost"
                  bg="xpBlue.100"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
                  isDisabled={isLoading}
                />
                <MenuList bg="xpBlue.100" borderColor="xpGray.200" boxShadow="1px 1px 2px rgba(0, 0, 0, 0.5)">
                  <MenuItem onClick={() => editTask(task)} bg="xpBlue.100" icon={<EditIcon />} isDisabled={isLoading}>
                    {t("Edit")}
                  </MenuItem>
                  <MenuItem
                    onClick={() => deleteTask(task.id)}
                    bg="xpBlue.100"
                    icon={<DeleteIcon />}
                    color="xpRed.500"
                    isDisabled={isLoading}
                  >
                    {t("Delete")}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          ))}
        </Stack>
      </Box>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
        <ModalContent bg="xpBlue.100" border="1px solid" borderColor="xpGray.200" boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)">
          <ModalHeader bg="xpBlue.200" color="white" borderBottom="1px solid" borderColor="xpGray.200">
            {t("Add Task Manually")}
          </ModalHeader>
          <ModalCloseButton color="white" isDisabled={isLoading} />
          <ModalBody>
            <Stack spacing={4}>
              <Box>
                <Text mb={2}>{t("New Task")}</Text>
                <Input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder={t("Enter the task")}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                  isDisabled={isLoading}
                />
              </Box>
              <Box>
                <Text mb={2}>{t("Category")}</Text>
                <Select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                  isDisabled={isLoading}
                >
                  <option value="Estudo">{t("Study")}</option>
                  <option value="Trabalho">{t("Work")}</option>
                  <option value="Lazer">{t("Leisure")}</option>
                </Select>
              </Box>
              <Box>
                <Text mb={2}>{t("Priority")}</Text>
                <Select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                  isDisabled={isLoading}
                >
                  <option value="Alta">{t("High")}</option>
                  <option value="Média">{t("Medium")}</option>
                  <option value="Baixa">{t("Low")}</option>
                </Select>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={addTask}
              colorScheme="green"
              bg="xpGreen.500"
              border="1px solid"
              borderColor="xpGray.200"
              boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
              _hover={{ bg: "#00A000" }}
              isDisabled={isLoading}
            >
              {t("Add")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
        <ModalContent bg="xpBlue.100" border="1px solid" borderColor="xpGray.200" boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)">
          <ModalHeader bg="xpBlue.200" color="white" borderBottom="1px solid" borderColor="xpGray.200">
            {t("Generate Automatic Tasks")}
          </ModalHeader>
          <ModalCloseButton color="white" isDisabled={isLoading} />
          <ModalBody>
            <Stack spacing={4}>
              <Box>
                <Text mb={2}>{t("Theme")}</Text>
                <Input
                  value={generateTopic}
                  onChange={(e) => setGenerateTopic(e.target.value)}
                  placeholder={t("Enter the theme (ex.: Mathematics)")}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                  isDisabled={isLoading}
                />
              </Box>
              <Box>
                <Text mb={2}>{t("Quantity of Tasks")}</Text>
                <Select
                  value={generateQuantity}
                  onChange={(e) => setGenerateQuantity(parseInt(e.target.value))}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                  isDisabled={isLoading}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                  <option value={9}>9</option>
                  <option value={10}>10</option>
                </Select>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={generateTasks}
              colorScheme="blue"
              bg="xpBlue.300"
              border="1px solid"
              borderColor="xpGray.200"
              boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
              _hover={{ bg: "xpBlue.400" }}
              isLoading={isLoading}
              loadingText={t("Generating")}
            >
              {t("Generate")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isManageOpen} onClose={() => setIsManageOpen(false)}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
        <ModalContent bg="xpBlue.100" border="1px solid" borderColor="xpGray.200" boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)">
          <ModalHeader bg="xpBlue.200" color="white" borderBottom="1px solid" borderColor="xpGray.200">
            {t("Manage Tasks")}
          </ModalHeader>
          <ModalCloseButton color="white" isDisabled={isLoading} />
          <ModalBody>
            <Stack spacing={4}>
              <Text>{t("Select tasks to delete")}</Text>
              <Stack spacing={2}>
                {tasks.map((task) => (
                  <Box key={task.id} display="flex" alignItems="center" p={2} bg="xpBlue.100" border="1px solid" borderColor="xpGray.200" boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)">
                    <Checkbox
                      isChecked={selectedTasks.has(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                      mr={2}
                      borderColor="xpGray.200"
                      bg="xpBlue.100"
                      isDisabled={isLoading}
                    />
                    <Text>{task.description} ({t("Cat")}: {t(task.category)}, {t("Pri")}: {t(task.priority)})</Text>
                  </Box>
                ))}
              </Stack>
              <Button
                onClick={selectAllTasks}
                colorScheme="blue"
                bg="xpBlue.300"
                border="1px solid"
                borderColor="xpGray.200"
                boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
                _hover={{ bg: "xpBlue.400" }}
                isDisabled={isLoading || tasks.length === 0}
              >
                {t("Select All")}
              </Button>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={deleteSelectedTasks}
              colorScheme="red"
              bg="xpRed.500"
              border="1px solid"
              borderColor="xpGray.200"
              boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
              _hover={{ bg: "#FF4040" }}
              isDisabled={isLoading || selectedTasks.size === 0}
            >
              {t("Delete Selected")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TaskList;