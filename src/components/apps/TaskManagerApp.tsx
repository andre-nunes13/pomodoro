"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Task, TaskCategory, TaskPriority } from "@/lib/types";
import { Plus, Trash2, Edit2, Check, X, Sparkles, Filter } from "lucide-react";

export const TaskManagerApp: React.FC = () => {
  const {
    tasks,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
    deleteTasks,
    clearCompletedTasks,
    importTasks,
    language,
    t,
  } = useApp();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>("Work");
  const [priority, setPriority] = useState<TaskPriority>("Medium");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // AI Modal State
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiQuantity, setAiQuantity] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiPreview, setAiPreview] = useState<Array<{ description: string; category?: TaskCategory; priority?: TaskPriority }>>([]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    addTask(description.trim(), category, priority);
    setDescription("");
  };

  const handleStartEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.description);
  };

  const handleSaveEdit = (id: number) => {
    if (editText.trim()) {
      editTask(id, editText.trim());
    }
    setEditingId(null);
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map((t) => t.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length > 0) {
      deleteTasks(selectedIds);
      setSelectedIds([]);
    }
  };

  // AI Task Generation handler
  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError("");
    setAiPreview([]);

    try {
      const res = await fetch("/api/tasks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt.trim(),
          quantity: aiQuantity,
          language,
        }),
      });

      const data = await res.json();
      if (res.ok && data.tasks) {
        setAiPreview(data.tasks);
      } else {
        setAiError(data.error || "Failed to generate tasks.");
      }
    } catch {
      setAiError("Network error connecting to AI service.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleConfirmAI = () => {
    if (aiPreview.length > 0) {
      importTasks(aiPreview);
      setShowAIModal(false);
      setAiPreview([]);
      setAiPrompt("");
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterCategory === "All") return true;
    if (filterCategory === "Completed") return t.completed;
    if (filterCategory === "Active") return !t.completed;
    return t.category === filterCategory;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col gap-2.5 p-2 bg-[#c0c0c0] font-sans text-black">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-[#808080] pb-2">
        <button
          onClick={() => setShowAIModal(true)}
          className="win98-btn flex items-center gap-1.5 font-bold text-xs bg-amber-100 text-amber-900 border-amber-400"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{t("generateAITasks")}</span>
        </button>

        <div className="flex items-center gap-1 text-[11px]">
          <Filter className="w-3.5 h-3.5 text-gray-700" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="win98-sunken px-1.5 py-0.5 text-[11px] bg-white cursor-pointer"
          >
            <option value="All">All Tasks ({tasks.length})</option>
            <option value="Active">Active ({tasks.length - completedCount})</option>
            <option value="Completed">Completed ({completedCount})</option>
            <option value="Work">{t("work")}</option>
            <option value="Study">{t("study")}</option>
            <option value="Personal">{t("personal")}</option>
            <option value="Leisure">{t("leisure")}</option>
            <option value="Other">{t("other")}</option>
          </select>
        </div>
      </div>

      {/* New Task Input Bar */}
      <form onSubmit={handleAddTask} className="flex flex-wrap items-center gap-1.5">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("enterTask")}
          className="win98-sunken flex-1 px-2 py-1 text-xs bg-white min-w-[180px]"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as TaskCategory)}
          className="win98-sunken px-1.5 py-1 text-xs bg-white"
        >
          <option value="Work">{t("work")}</option>
          <option value="Study">{t("study")}</option>
          <option value="Personal">{t("personal")}</option>
          <option value="Leisure">{t("leisure")}</option>
          <option value="Other">{t("other")}</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="win98-sunken px-1.5 py-1 text-xs bg-white"
        >
          <option value="High">{t("high")}</option>
          <option value="Medium">{t("medium")}</option>
          <option value="Low">{t("low")}</option>
        </select>

        <button
          type="submit"
          className="win98-btn flex items-center gap-1 text-xs font-bold px-3 py-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t("add")}</span>
        </button>
      </form>

      {/* Task List Well */}
      <div className="win98-sunken bg-white min-h-[220px] max-h-[340px] overflow-y-auto p-1 text-xs flex flex-col gap-1">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500 italic text-center">
            {t("noTasks")}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-1.5 border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                task.completed ? "bg-gray-50 opacity-70" : ""
              }`}
            >
              <div className="flex items-center gap-2 flex-1 truncate">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(task.id)}
                  onChange={() => handleToggleSelect(task.id)}
                  className="w-3.5 h-3.5 accent-[#000080]"
                  title="Select for batch action"
                />

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-4 h-4 accent-emerald-700 cursor-pointer"
                  title="Toggle completed"
                />

                {editingId === task.id ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="win98-sunken px-1.5 py-0.5 text-xs w-full bg-white"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(task.id)}
                      className="win98-btn p-0.5"
                    >
                      <Check className="w-3 h-3 text-emerald-700" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="win98-btn p-0.5"
                    >
                      <X className="w-3 h-3 text-red-700" />
                    </button>
                  </div>
                ) : (
                  <span
                    className={`truncate cursor-pointer select-text ${
                      task.completed ? "line-through text-gray-500" : "font-normal"
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.description}
                  </span>
                )}
              </div>

              {/* Badges & Actions */}
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {task.generatedByAI && (
                  <span className="bg-purple-100 text-purple-800 text-[10px] px-1 py-0.2 rounded border border-purple-300" title="Generated by Gemini AI">
                    AI
                  </span>
                )}
                <span
                  className={`text-[10px] px-1 py-0.2 border rounded ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-800 border-red-300"
                      : task.priority === "Medium"
                      ? "bg-amber-100 text-amber-800 border-amber-300"
                      : "bg-blue-100 text-blue-800 border-blue-300"
                  }`}
                >
                  {task.priority}
                </span>

                <span className="text-[10px] bg-gray-100 text-gray-700 px-1 py-0.2 border border-gray-300 rounded">
                  {task.category}
                </span>

                <button
                  onClick={() => handleStartEdit(task)}
                  className="win98-btn p-1"
                  title={t("edit")}
                >
                  <Edit2 className="w-2.5 h-2.5" />
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="win98-btn p-1 text-red-700"
                  title={t("delete")}
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Batch Operations Bar */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#808080]">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className="win98-btn px-2 py-0.5 text-[11px]"
          >
            {selectedIds.length === filteredTasks.length && filteredTasks.length > 0
              ? "Deselect All"
              : t("selectAll")}
          </button>
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="win98-btn px-2 py-0.5 text-[11px] text-red-700 font-bold"
            >
              {t("deleteSelected")} ({selectedIds.length})
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-700">
          <span>
            {completedCount} / {tasks.length} {t("completedTasks")}
          </span>
          {completedCount > 0 && (
            <button
              onClick={clearCompletedTasks}
              className="win98-btn px-2 py-0.5 text-[11px]"
            >
              {t("clearCompleted")}
            </button>
          )}
        </div>
      </div>

      {/* Gemini AI Task Generation Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10000] p-4 select-none">
          <div className="win98-box w-full max-w-md p-[3px] shadow-2xl flex flex-col gap-2">
            <div className="win98-titlebar">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-xs font-bold">{t("aiGenerateTitle")}</span>
              </div>
              <button
                onClick={() => setShowAIModal(false)}
                className="win98-title-btn"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#c0c0c0] flex flex-col gap-2 text-xs">
              <label className="font-bold">{t("aiGeneratePrompt")}</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Build landing page with Next.js, prepare chemistry exam, write monthly report..."
                className="win98-sunken p-2 text-xs bg-white w-full h-20 resize-none"
              />

              <div className="flex items-center justify-between">
                <label className="font-medium">{t("aiGenerateQuantity")}:</label>
                <select
                  value={aiQuantity}
                  onChange={(e) => setAiQuantity(parseInt(e.target.value, 10))}
                  className="win98-sunken px-2 py-1 text-xs bg-white"
                >
                  <option value={3}>3 tasks</option>
                  <option value={5}>5 tasks</option>
                  <option value={8}>8 tasks</option>
                </select>
              </div>

              {aiError && (
                <div className="win98-sunken p-2 text-red-700 bg-red-50 text-[11px]">
                  {aiError}
                </div>
              )}

              {/* Preview Generated Items */}
              {aiPreview.length > 0 && (
                <div className="flex flex-col gap-1 mt-1">
                  <div className="font-bold text-[11px]">Generated Breakdown:</div>
                  <div className="win98-sunken bg-white max-h-36 overflow-y-auto p-1.5 flex flex-col gap-1">
                    {aiPreview.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-1 text-[11px] border-b pb-0.5">
                        <span className="truncate flex-1">• {item.description}</span>
                        <span className="text-[9px] px-1 bg-gray-100 rounded border">
                          {item.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-[#808080]">
                {aiPreview.length > 0 ? (
                  <>
                    <button
                      onClick={() => setAiPreview([])}
                      className="win98-btn px-3 py-1"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      onClick={handleConfirmAI}
                      className="win98-btn px-4 py-1 font-bold bg-emerald-100 text-emerald-900 border-emerald-400"
                    >
                      Import {aiPreview.length} Tasks
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowAIModal(false)}
                      className="win98-btn px-3 py-1"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      onClick={handleGenerateAI}
                      disabled={aiLoading || !aiPrompt.trim()}
                      className="win98-btn px-4 py-1 font-bold flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>{aiLoading ? t("generating") : t("generate")}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
