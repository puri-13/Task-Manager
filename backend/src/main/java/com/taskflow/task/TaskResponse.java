package com.taskflow.task;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskCategory category,
        TaskPriority priority,
        LocalDate dueDate,
        TaskStatus status,
        LocalDateTime createdAt
) {
    public static TaskResponse from(Task task) {
        return new TaskResponse(task.getId(), task.getTitle(), task.getDescription(), task.getCategory(),
                task.getPriority(), task.getDueDate(), task.getStatus(), task.getCreatedAt());
    }
}
