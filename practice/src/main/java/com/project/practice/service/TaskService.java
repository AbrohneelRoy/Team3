package com.project.practice.service;

import com.project.practice.model.Task;
import com.project.practice.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    /**
     * Fetches tasks based on the user ID.
     * 
     * @param userId The ID of the user.
     * @return A list of tasks associated with the given user ID.
     */
    public List<Task> getAllTasksByUserId(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    /**
     * Fetches important tasks.
     * 
     * @return A list of tasks marked as important.
     */
    public List<Task> getImportantTasks() {
        return taskRepository.findByImportant(true);
    }

    /**
     * Retrieves a task by its ID.
     * 
     * @param id The ID of the task.
     * @return An Optional containing the task if found, otherwise empty.
     */
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    /**
     * Saves a task to the database. If the task has an ID, it will update the existing task.
     * 
     * @param task The task to save.
     * @return The saved task.
     */
    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    /**
     * Deletes a task by its ID.
     * 
     * @param id The ID of the task to delete.
     */
    public void deleteTaskById(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Task with ID " + id + " does not exist.");
        }
    }
}
