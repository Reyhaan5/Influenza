import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Inbox,
  Video,
  FileCheck,
  Send,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import KanbanCard from "./KanbanCard";

const COLUMNS = [
  {
    key: "application",
    title: "Application",
    icon: Inbox,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200/60",
    dotColor: "bg-blue-500",
    description: "Invites & Creator Applications",
  },
  {
    key: "content_creation",
    title: "Content Creation",
    icon: Video,
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200/60",
    dotColor: "bg-purple-500",
    description: "Scripting, Filming & Production",
  },
  {
    key: "review",
    title: "In Review",
    icon: FileCheck,
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/60",
    dotColor: "bg-amber-500",
    description: "Drafts submitted for brand feedback",
  },
  {
    key: "posting",
    title: "Ready to Post",
    icon: Send,
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200/60",
    dotColor: "bg-sky-500",
    description: "Approved & Scheduled for Live Post",
  },
  {
    key: "completed",
    title: "Completed",
    icon: CheckCircle2,
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    dotColor: "bg-emerald-500",
    description: "Live verified & Payout released",
  },
];

export default function KanbanBoard({
  collaborations = [],
  onStageChange,
  onOpenWorkflow,
  onOpenReview,
}) {
  const [draggingCollab, setDraggingCollab] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (e, collab) => {
    setDraggingCollab(collab);
    e.dataTransfer.setData("text/plain", collab._id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggingCollab(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== columnKey) {
      setDragOverColumn(columnKey);
    }
  };

  const handleDragLeave = (e, columnKey) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverColumn === columnKey) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    const collabId = e.dataTransfer.getData("text/plain") || draggingCollab?._id;
    if (collabId && targetStage) {
      onStageChange(collabId, targetStage);
    }
    setDraggingCollab(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 items-start min-h-[calc(100vh-280px)]">
      {COLUMNS.map((col) => {
        const colCollabs = collaborations.filter(
          (c) =>
            (c.stage === col.key) ||
            (col.key === "content_creation" && (!c.stage || c.stage === "in_progress"))
        );
        const isTarget = dragOverColumn === col.key;
        const IconComponent = col.icon;

        return (
          <div
            key={col.key}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={(e) => handleDragLeave(e, col.key)}
            onDrop={(e) => handleDrop(e, col.key)}
            className={`w-72 shrink-0 flex flex-col rounded-3xl transition-all duration-200 ${
              isTarget
                ? "bg-fuchsia-50/60 ring-2 ring-[#c026d3]/60 ring-dashed"
                : "bg-gray-50/70 border border-gray-200/70"
            }`}
          >
            {/* Column Header */}
            <div className="p-3.5 border-b border-gray-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <h3 className="text-xs font-bold text-gray-900 tracking-tight">
                  {col.title}
                </h3>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${col.badgeColor}`}
                >
                  {colCollabs.length}
                </span>
              </div>

              <Link
                to="/creator-discovery"
                className="p-1 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-200/60 transition"
                title="Discover creators for this stage"
              >
                <Plus size={14} />
              </Link>
            </div>

            {/* Cards List / Drop Target Container */}
            <div className="p-2.5 flex-1 flex flex-col gap-3 min-h-[400px]">
              {colCollabs.length === 0 ? (
                <div
                  className={`flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed rounded-2xl transition-colors ${
                    isTarget
                      ? "border-[#c026d3] bg-fuchsia-50/40"
                      : "border-gray-200 bg-white/40"
                  }`}
                >
                  <IconComponent
                    size={22}
                    className={`mb-1.5 transition-colors ${
                      isTarget ? "text-[#c026d3] scale-110" : "text-gray-300"
                    }`}
                  />
                  <p className="text-[11px] font-semibold text-gray-400">
                    {isTarget ? "Drop to move here" : "No collaborations"}
                  </p>
                  <p className="text-[9px] text-gray-400 mt-0.5">
                    {col.description}
                  </p>
                </div>
              ) : (
                colCollabs.map((collab) => (
                  <KanbanCard
                    key={collab._id}
                    collab={collab}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onStageChange={onStageChange}
                    onOpenWorkflow={onOpenWorkflow}
                    onOpenReview={onOpenReview}
                    isDragging={draggingCollab?._id === collab._id}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
