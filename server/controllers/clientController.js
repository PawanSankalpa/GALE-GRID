import {
  getAllClients, getClientById, getClientByUserId,
  moveClientStage, createClient, updateClient, getLifecycleSummary,
} from "../services/clientService.js";

export async function listClients(req, res) {
  try {
    const [clients, lifecycle] = await Promise.all([getAllClients(), getLifecycleSummary()]);
    return res.json({ clients, lifecycle });
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function getClient(req, res) {
  try {
    const client = await getClientById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    return res.json(client);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function getMyClientData(req, res) {
  try {
    const client = await getClientByUserId(req.user.id);
    if (!client) return res.status(404).json({ message: "No client profile linked" });
    return res.json(client);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function changeClientStage(req, res) {
  try {
    const { stage } = req.body;
    if (!stage) return res.status(400).json({ message: "Stage is required" });
    const result = await moveClientStage(req.params.id, stage, req.user.id);
    if (result.error) return res.status(400).json({ message: result.error });
    return res.json(result.client);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function addClient(req, res) {
  try {
    const { company, contactName, contactEmail, notes } = req.body;
    if (!company) return res.status(400).json({ message: "Company name is required" });
    const result = await createClient({ company, contactName, contactEmail, notes, actorUserId: req.user.id });
    return res.status(201).json(result.client);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function editClient(req, res) {
  try {
    const result = await updateClient(req.params.id, req.body, req.user.id);
    if (result.error) return res.status(400).json({ message: result.error });
    return res.json(result.client);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}
