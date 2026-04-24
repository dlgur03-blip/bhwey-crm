"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "./kanban-column";
import { MOCK_CUSTOMERS, MOCK_TEMPLATES } from "@/lib/mock-data";
import type { Customer, CustomerProcess, ProcessTemplate } from "@/types";

interface Props {
  selectedTemplateId: string;
  gradeFilter?: string;
  assigneeFilter?: string;
}

interface CardData {
  customer: Customer;
  process: CustomerProcess;
}

export function KanbanBoard({ selectedTemplateId, gradeFilter = "all", assigneeFilter = "all" }: Props) {
  const template = MOCK_TEMPLATES.find((t) => t.id === selectedTemplateId);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // 해당 템플릿에 배정된 고객-프로세스 데이터
  const cardsByStage = useMemo(() => {
    if (!template) return {};

    const map: Record<string, CardData[]> = {};
    for (const stage of template.stages) {
      map[stage.id] = [];
    }

    for (const customer of MOCK_CUSTOMERS) {
      if (gradeFilter !== "all" && customer.grade !== gradeFilter) continue;
      if (assigneeFilter !== "all" && customer.assigneeId !== assigneeFilter) continue;
      for (const process of customer.processes) {
        if (process.templateId === selectedTemplateId) {
          const stage = template.stages.find((s) => s.order === process.currentStageOrder);
          if (stage) {
            map[stage.id].push({ customer, process });
          }
        }
      }
    }

    return map;
  }, [selectedTemplateId, template, gradeFilter, assigneeFilter]);

  function handleDragEnd(event: DragEndEvent) {
    // Mock에서는 상태만 로그, 실제 DB 연동 시 API 호출
    const { active, over } = event;
    if (!over) return;
    console.log("Drag:", active.id, "→", over.id);
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center h-[40vh] text-muted-foreground">
        템플릿을 선택해주세요
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {template.stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            cards={cardsByStage[stage.id] || []}
            templateColor={template.color}
          />
        ))}
      </div>
    </DndContext>
  );
}
