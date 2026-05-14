import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  canAccessProjectByRole,
} from "../services/projectService.js";

export async function listProjects(req, res) {
  try {
    return res.json({ projects: await getAllProjects() });
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function getProject(req, res) {
  try {
    const hasAccess = await canAccessProjectByRole({
      userId: req.user.id,
      role: req.user.role,
      projectId: req.params.id,
    });
    if (!hasAccess) return res.status(403).json({ message: "Forbidden" });

    const project = await getProjectById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    return res.json(project);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function addProject(req, res) {
  try {
    const { clientId, name, teamMemberIds, priority, deadline } = req.body;
    if (!clientId || !name) return res.status(400).json({ message: "clientId and name are required" });
    const result = await createProject({ clientId, name, teamMemberIds, priority, deadline, actorUserId: req.user.id });
    return res.status(201).json(result.project);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function editProject(req, res) {
  try {
    const result = await updateProject(req.params.id, req.body, req.user.id);
    if (result.error) return res.status(400).json({ message: result.error });
    return res.json(result.project);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}
