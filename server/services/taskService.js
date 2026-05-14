import { db } from "../db/pool.js";

function normaliseTask(row) {
  return {
    id:          row.id,
    projectId:   row.project_id,
    projectName: row.project_name || "—",
    assigneeId:  row.assignee_id,
    assigneeName:row.assignee_name || "—",
    title:       row.title,
    priority:    row.priority,
    status:      row.status,
    dueDate:     row.due_date,
    createdAt:   row.created_at,
  };
}

export async function getTasksForUser(userId) {
  const { rows } = await db.query(`
    SELECT t.*, p.name AS project_name
    FROM   tasks t
    LEFT JOIN projects p ON p.id = t.project_id
    WHERE  t.assignee_id = $1
    ORDER BY t.created_at DESC
  `, [userId]);
  return rows.map(normaliseTask);
}

export async function getAllTasks() {
  const { rows } = await db.query(`
    SELECT t.*, p.name AS project_name, u.name AS assignee_name
    FROM   tasks t
    LEFT JOIN projects p ON p.id = t.project_id
    LEFT JOIN users    u ON u.id = t.assignee_id
    ORDER BY t.created_at DESC
  `);
  return rows.map(normaliseTask);
}

export async function createTask({ projectId, assigneeId, title, priority, dueDate, actorUserId }) {
  const id = `t_${Date.now()}`;
  const today = new Date().toISOString().split("T")[0];

  const { rows } = await db.query(`
    INSERT INTO tasks (id, project_id, assignee_id, title, priority, status, due_date, created_at)
    VALUES ($1,$2,$3,$4,$5,'todo',$6,$7)
    RETURNING *
  `, [id, projectId, assigneeId, title, priority || "medium", dueDate || null, today]);

  await db.query(
    "INSERT INTO activity_log (id, user_id, action, timestamp) VALUES ($1,$2,$3,NOW())",
    [`act_${Date.now()}`, actorUserId || assigneeId, `new task assigned: "${title}"`]
  );

  return { task: normaliseTask(rows[0]) };
}

export async function updateTaskStatus(taskId, newStatus, userId) {
  const valid = ["todo","in-progress","review","completed"];
  if (!valid.includes(newStatus)) return { error: `Invalid status. Must be: ${valid.join(", ")}` };

  const { rows } = await db.query(
    "UPDATE tasks SET status=$1 WHERE id=$2 RETURNING *", [newStatus, taskId]
  );
  if (!rows[0]) return { error: "Task not found" };

  await db.query(
    "INSERT INTO activity_log (id, user_id, action, timestamp) VALUES ($1,$2,$3,NOW())",
    [`act_${Date.now()}`, userId, `updated task "${rows[0].title}" to ${newStatus}`]
  );

  return { task: normaliseTask(rows[0]) };
}
