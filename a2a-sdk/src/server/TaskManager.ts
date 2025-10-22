/**
 * Task Manager
 * Manages task lifecycle and state
 */

import { Task, TaskStatus, TaskArtifact, TaskError } from '../types/Task';
import { generateTaskId, generateArtifactId } from '../utils/id-generator';
import { EventEmitter } from 'events';

export class TaskManager extends EventEmitter {
  private tasks: Map<string, Task>;

  constructor() {
    super();
    this.tasks = new Map();
  }

  /**
   * Create a new task
   */
  createTask(submission: {
    skill: string;
    parameters: Record<string, any>;
    clientAgentId: string;
    remoteAgentId: string;
  }): Task {
    const task: Task = {
      taskId: generateTaskId(),
      clientAgentId: submission.clientAgentId,
      remoteAgentId: submission.remoteAgentId,
      skill: submission.skill,
      parameters: submission.parameters,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      retryCount: 0,
    };

    this.tasks.set(task.taskId, task);
    this.emit('task:created', task);

    return task;
  }

  /**
   * Get a task by ID
   */
  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Update task status
   */
  updateStatus(taskId: string, status: TaskStatus): void {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    task.status = status;
    task.updatedAt = new Date();

    if (status === 'IN_PROGRESS' && !task.startedAt) {
      task.startedAt = new Date();
    }

    if (status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELLED') {
      task.completedAt = new Date();
    }

    this.emit('task:updated', task);
  }

  /**
   * Set task artifact (result)
   */
  setArtifact(taskId: string, content: any, contentType: string = 'application/json'): void {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const artifact: TaskArtifact = {
      artifactId: generateArtifactId(),
      taskId,
      contentType,
      content,
      createdAt: new Date(),
    };

    task.artifact = artifact;
    task.updatedAt = new Date();

    this.emit('task:artifact', task, artifact);
  }

  /**
   * Set task error
   */
  setError(taskId: string, code: string, message: string, details?: any): void {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const error: TaskError = {
      code,
      message,
      details,
    };

    task.error = error;
    task.status = 'FAILED';
    task.completedAt = new Date();
    task.updatedAt = new Date();

    this.emit('task:error', task, error);
  }

  /**
   * Complete a task with success
   */
  completeTask(taskId: string, result: any): void {
    this.setArtifact(taskId, result);
    this.updateStatus(taskId, 'COMPLETED');
  }

  /**
   * Fail a task
   */
  failTask(taskId: string, message: string, code: string = 'EXECUTION_ERROR'): void {
    this.setError(taskId, code, message);
  }

  /**
   * Cancel a task
   */
  cancelTask(taskId: string): void {
    this.updateStatus(taskId, 'CANCELLED');
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: TaskStatus): Task[] {
    return Array.from(this.tasks.values()).filter((task) => task.status === status);
  }

  /**
   * Clean up old completed tasks
   */
  cleanup(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    const tasksToDelete: string[] = [];

    for (const [taskId, task] of this.tasks.entries()) {
      if (
        (task.status === 'COMPLETED' || task.status === 'FAILED' || task.status === 'CANCELLED') &&
        task.completedAt &&
        now - task.completedAt.getTime() > maxAge
      ) {
        tasksToDelete.push(taskId);
      }
    }

    tasksToDelete.forEach((taskId) => {
      this.tasks.delete(taskId);
      this.emit('task:deleted', taskId);
    });
  }
}

