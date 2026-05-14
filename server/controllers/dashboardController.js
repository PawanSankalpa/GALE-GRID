import {
  getAdminData, getClientData, getOverviewForRole, getTeamData,
} from "../services/dashboardService.js";

export async function overviewController(req, res) {
  try { return res.status(200).json(await getOverviewForRole(req.user)); }
  catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function adminDataController(req, res) {
  try { return res.status(200).json(await getAdminData()); }
  catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function teamDataController(req, res) {
  try { return res.status(200).json(await getTeamData(req.user)); }
  catch (e) { return res.status(500).json({ message: e.message }); }
}

export async function clientDataController(req, res) {
  try { return res.status(200).json(await getClientData(req.user)); }
  catch (e) { return res.status(500).json({ message: e.message }); }
}
