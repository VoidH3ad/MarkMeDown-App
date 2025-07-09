import {
    pgTable,
    uuid,
    text,
    integer,
    boolean,
    timestamp,
    index,
    pgEnum,
  } from "drizzle-orm/pg-core";
  import { relations } from "drizzle-orm";
  
  // ENUM para dias da semana
  export const daysOfWeekEnum = pgEnum("day", [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ]);
  
  // Timestamps reutilizáveis
  const createdAt = timestamp("createdAt").notNull().defaultNow();
  const updatedAt = timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date());
  
  /* ============================================================================
     Events: eventos públicos criados pelos usuários
  ============================================================================ */
  export const EventTable = pgTable(
    "events",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      description: text("description"),
      durationInMinutes: integer("durationInMinutes").notNull(),
      clerkUserId: text("clerkUserId").notNull(),
      isActive: boolean("isActive").notNull().default(true),
      createdAt,
      updatedAt,
    },
    (table) => [
      index("clerkUserId_idx").on(table.clerkUserId),
    ]
  );
  
  /* ============================================================================
     Schedules: configurações de agenda por usuário
  ============================================================================ */
  export const ScheduleTable = pgTable(
    "schedules",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      timezone: text("timezone").notNull(),
      clerkUserId: text("clerkUserId").notNull().unique(),
      createdAt,
      updatedAt,
    }
  );
  
  /* ============================================================================
     Schedule Availabilities: disponibilidade de horário por dia da semana
  ============================================================================ */
  export const ScheduleAvailabilityTable = pgTable(
    "schedule_availabilities",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      scheduleId: uuid("scheduleId")
        .notNull()
        .references(() => ScheduleTable.id, { onDelete: "cascade" }),
      dayOfWeek: daysOfWeekEnum("dayOfWeek").notNull(),
      startTime: text("startTime").notNull(), // formato "HH:mm"
      endTime: text("endTime").notNull(),
    },
    (table) => [
      index("scheduleId_idx").on(table.scheduleId),
    ]
  );
  
  /* ============================================================================
     Relações entre tabelas
  ============================================================================ */
  export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
    availabilities: many(ScheduleAvailabilityTable),
  }));
  
  export const scheduleAvailabilityRelations = relations(ScheduleAvailabilityTable, ({ one }) => ({
    schedule: one(ScheduleTable, {
      fields: [ScheduleAvailabilityTable.scheduleId],
      references: [ScheduleTable.id],
    }),
  }));
  