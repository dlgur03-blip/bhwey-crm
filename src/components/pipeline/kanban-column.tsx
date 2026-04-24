"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { KanbanCard } from "./kanban-card";
import type { Customer, CustomerProcess, TemplateStage } from "@/types";

interface CardData {
  customer: Customer;
  process: CustomerProcess;
}

interface Props {
  stage: TemplateStage;
  cards: CardData[];
  templateColor: string;
}

export function KanbanColumn({ stage, cards, templateColor }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: `stage-${stage.id}`,
    data: { stage },
  });

  const cardIds = cards.map((c) => `${c.customer.id}-${c.process.id}`);

  return (
    <div className="flex flex-col min-w-[260px] max-w-[300px]">
      {/* 컬럼 헤더 */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: templateColor }}
        />
        <h3 className="text-sm font-semibold text-foreground truncate">
          {stage.name}
        </h3>
        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
          {cards.length}
        </span>
      </div>

      {/* 카드 영역 */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-2 rounded-xl bg-muted/30 border border-transparent transition-colors space-y-2 min-h-[100px]",
          isOver && "border-primary/30 bg-primary/5"
        )}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((cardData) => (
            <KanbanCard
              key={`${cardData.customer.id}-${cardData.process.id}`}
              customer={cardData.customer}
              process={cardData.process}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
            고객 없음
          </div>
        )}
      </div>
    </div>
  );
}
