import { getTasksForUser, getAllTasks, createTask, updateTaskStatus } from "../services/taskService.js";

export async function listMyTasks(req, res) {
  try { return res.json({ tasks: await getTasksForUser(req.user.id) }); }
  catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function listAllTasks(req, res) {
  try { return res.json({ tasks: await getAllTasks() }); }
  catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function addTask(req, res) {
  try {
    const { projectId, assigneeId, title, priority, dueDate } = req.body;
    if (!projectId || !assigneeId || !title) return res.status(400).json({ message: "projectId, assigneeId, and title are required" });
    const result = await createTask({ projectId, assigneeId, title, priority, dueDate, actorUserId: req.user.id });
    return res.status(201).json(result.task);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function changeTaskStatus(req, res) {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    const result = await updateTaskStatus(req.params.id, status, req.user.id);
    if (result.error) return res.status(400).json({ message: result.error });
    return res.json(result.task);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}
