import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import UsersPage from "./features/users/pages/UsersPage";
import AgentsPage from "./features/agents/pages/AgentsPage";
import ManagersPage from "./features/managers/pages/ManagersPage";
import ReclamationsPage from "./features/reclamations/pages/ReclamationsPage";
import NotificationsPage from "./features/notifications/pages/NotificationsPage";
import SettingsPage from "./features/settings/pages/SettingsPage";
import MesAffectationsPage from "./features/affectations/pages/MesAffectationsPage";
import ProtectedRoute from "./middleware/ProtectedRoute";
import AffectationDetailPage from "features/affectations/pages/AffectationDetailPage";
import MesReponsesPage from "features/agents/pages/mesReponses";
import ReclamationDetailPage from "features/reclamations/pages/DetailReclamation";
import HistoriquePage from "features/historique/pages/Historique";
export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute allowedRoles={["admin", "manager", "agent"]}>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/users"
					element={
						<ProtectedRoute allowedRoles={["admin"]}>
							<UsersPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/agents"
					element={
						<ProtectedRoute allowedRoles={["admin", "manager"]}>
							<AgentsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/managers"
					element={
						<ProtectedRoute allowedRoles={["admin"]}>
							<ManagersPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/reclamations"
					element={
						<ProtectedRoute allowedRoles={["admin", "manager"]}>
							<ReclamationsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/mes-affectations"
					element={
						<ProtectedRoute allowedRoles={["agent"]}>
							<MesAffectationsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/notifications"
					element={
						<ProtectedRoute allowedRoles={["admin", "manager", "agent"]}>
							<NotificationsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/settings"
					element={
						<ProtectedRoute allowedRoles={["admin"]}>
							<SettingsPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/agent/affectations/:id"
					element={
						<ProtectedRoute allowedRoles={["agent"]}>
							<AffectationDetailPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/agent/reponses/:reclamationId"
					element={
						<ProtectedRoute allowedRoles={["agent"]}>
							<MesReponsesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/detail-reclamations/:id"
					element={
						<ProtectedRoute allowedRoles={["admin", "manager"]}>
							<ReclamationDetailPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/historique"
					element={
						<ProtectedRoute allowedRoles={["admin"]}>
							<HistoriquePage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}
