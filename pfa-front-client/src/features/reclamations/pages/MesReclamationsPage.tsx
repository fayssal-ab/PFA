import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import {
	Plus,
	Search,
	AlertTriangle,
	Clock,
	CheckCircle2,
	ArrowLeft,
	Send,
	MessageCircle,
	Paperclip,
	X,
} from "lucide-react";
import {
	Reclamation,
	ApiResponse,
	CategorieReclamation,
	Priority,
	Status,
	ReponseReclamation,
	Commentaire,
} from "../../../types";
import { useAuth } from "../../../features/auth/hooks/useAuth";

export default function MesReclamationsPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [reclamations, setReclamations] = useState<Reclamation[]>([]);
	const [selectedReclamation, setSelectedReclamation] =
		useState<Reclamation | null>(null);
	const [categories, setCategories] = useState<CategorieReclamation[]>([]);
	const [priorities, setPriorities] = useState<Priority[]>([]);
	const [statuses, setStatuses] = useState<Status[]>([]);
	const [reponses, setReponses] = useState<Commentaire[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [search, setSearch] = useState("");
	const [formData, setFormData] = useState({
		titre: "",
		description: "",
		categorieId: "",
		priorityId: "",
	});
	const [newReponse, setNewReponse] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const { user } = useAuth();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		loadData();
		loadFilters();
	}, []);

	useEffect(() => {
		if (id) {
			loadReclamationDetail(parseInt(id));
		}
	}, [id]);

	const loadData = async () => {
		setLoading(true);
		try {
			const res = await api.get<ApiResponse<Reclamation>>(
				"/reclamations/mes-reclamations",
				{
					params: { page: 0, size: 100 },
				},
			);
			setReclamations(res.data?.content || []);
		} catch (error) {
			console.error("Error loading reclamations:", error);
		} finally {
			setLoading(false);
		}
	};

	const loadReclamationDetail = async (reclamationId: number) => {
		setLoading(true);
		try {
			const [recRes, repRes] = await Promise.all([
				api.get<Reclamation>(`/reclamations/get-reclamation/${reclamationId}`),
				api.get<Commentaire[]>(
					`/commentaires/get-commentaires/${reclamationId}`,
					{
						params: { page: 0, size: 50 },
					},
				),
			]);
			setSelectedReclamation(recRes.data);
			setReponses(repRes.data || []);
		} catch (error) {
			console.error("Error loading reclamation detail:", error);
		} finally {
			setLoading(false);
		}
	};

	const loadFilters = async () => {
		try {
			const [catRes, priRes, statRes] = await Promise.all([
				api.get<CategorieReclamation[]>("/categorie/get-categorie"),
				api.get<Priority[]>("/priorities/get-priority"),
				api.get<Status[]>("/status/get-status"),
			]);
			setCategories(catRes.data || []);
			setPriorities(priRes.data || []);
			setStatuses(statRes.data || []);
		} catch (error) {
			console.error("Error loading filters:", error);
		}
	};

	const uploadFile = async (
		e: React.ChangeEvent<HTMLInputElement>,
		id: number,
	) => {
		const file = e.target.files?.[0];

		if (!file) return;

		const formData = new FormData();

		formData.append("file", file);

		setUploading(true);

		try {
			await api.post(`/piece-jointes/upload/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
		} catch (e) {
			console.error(e);
		} finally {
			setUploading(false);
		}
	};

	const handleCreateReclamation = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const recResponse = await api.post("/reclamations/add-reclamation", {
				titre: formData.titre,
				description: formData.description,
				client: {
					id: user?.clientId,
				},
				categorie: { id: parseInt(formData.categorieId) },
				priority: { id: parseInt(formData.priorityId) },
			});
			const reclamationId = recResponse.data.id;

			if (selectedFile) {
				const fileData = new FormData();

				fileData.append("file", selectedFile);

				await api.post(`/piece-jointes/upload/${reclamationId}`, fileData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
			}
			setShowForm(false);
			setFormData({
				titre: "",
				description: "",
				categorieId: "",
				priorityId: "",
			});
			loadData();
		} catch (error) {
			console.error("Error creating reclamation:", error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleSendReponse = async () => {
		if (!newReponse.trim() || !selectedReclamation) return;
		setSubmitting(true);
		try {
			await api.post("/commentaires/add-commentaire", {
				contenu: newReponse,
				reclamation: { id: selectedReclamation.id },
				user: { id: user?.userId },
			});
			setNewReponse("");
			loadReclamationDetail(selectedReclamation.id);
		} catch (error) {
			console.error("Error sending response:", error);
		} finally {
			setSubmitting(false);
		}
	};

	const statusColor = (status?: string) => {
		if (status === "résolu") return "bg-emerald-100 text-emerald-700";
		if (status === "en cours") return "bg-amber-100 text-amber-700";
		return "bg-indigo-100 text-indigo-700";
	};

	const priorityColor = (priority?: string) => {
		if (priority === "haute" || priority === "urgent")
			return "bg-red-100 text-red-700";
		if (priority === "moyenne") return "bg-amber-100 text-amber-700";
		return "bg-gray-100 text-gray-600";
	};

	const filteredReclamations = reclamations.filter(
		(r) =>
			r.titre?.toLowerCase().includes(search.toLowerCase()) ||
			r.description?.toLowerCase().includes(search.toLowerCase()),
	);

	if (loading && !selectedReclamation) {
		return (
			<DashboardLayout title="Mes réclamations">
				<div className="flex items-center justify-center h-64">
					<div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
				</div>
			</DashboardLayout>
		);
	}

	// Detail View
	if (selectedReclamation) {
		return (
			<DashboardLayout
				title={selectedReclamation.titre}
				subtitle={`Réclamation #${selectedReclamation.id}`}
				actions={
					<button
						onClick={() => setSelectedReclamation(null)}
						className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
					>
						<ArrowLeft size={16} />
						Retour
					</button>
				}
			>
				<div className="space-y-6">
					{/* Reclamation Info */}
					<div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-5">
						<div className="flex flex-wrap gap-3 mb-4">
							<span
								className={`text-xs px-2 py-1 rounded-full ${statusColor(selectedReclamation.status?.status)}`}
							>
								{selectedReclamation.status?.status || "—"}
							</span>
							<span
								className={`text-xs px-2 py-1 rounded-full ${priorityColor(selectedReclamation.priority?.priority)}`}
							>
								{selectedReclamation.priority?.priority || "Normal"}
							</span>
							<span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
								{selectedReclamation.categorie?.categorie || "—"}
							</span>
						</div>
						<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
							{selectedReclamation.description}
						</p>
						<p className="text-xs text-gray-400 mt-4">
							Déposée le{" "}
							{selectedReclamation.dateDepot
								? new Date(selectedReclamation.dateDepot).toLocaleDateString(
										"fr-FR",
									)
								: "—"}
						</p>
					</div>

					{/* Responses Section */}
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Échanges
						</h3>

						<div className="space-y-4">
							{reponses.map((rep) => {
								const isMine = rep.user?.id === user?.userId;

								return (
									<div
										key={rep.id}
										className={`flex ${
											isMine ? "justify-end" : "justify-start"
										}`}
									>
										<div
											className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
												isMine
													? "bg-indigo-600 text-white"
													: "bg-white border border-gray-100 text-gray-700 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-200"
											}`}
										>
											<div className="text-[11px] font-semibold mb-1 opacity-80">
												{isMine
													? "Vous"
													: `${rep.user?.nom || ""} ${rep.user?.prenom || ""} (${rep.user?.role?.name || ""})`}
											</div>

											<p className="text-sm leading-relaxed">{rep.contenu}</p>

											<div className="text-[10px] opacity-70 mt-2">
												{rep.dateCommentaire
													? new Date(rep.dateCommentaire).toLocaleString(
															"fr-FR",
														)
													: ""}
											</div>
										</div>
									</div>
								);
							})}

							{reponses.length === 0 && (
								<div className="text-center py-8 text-gray-400">
									<MessageCircle
										size={32}
										className="mx-auto mb-2 opacity-30"
									/>
									<p>Aucun message pour le moment</p>
								</div>
							)}
						</div>
					</div>
					{/* Reply Form */}
					{selectedReclamation.status?.status !== "résolu" && (
						<div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4">
							<textarea
								value={newReponse}
								onChange={(e) => setNewReponse(e.target.value)}
								placeholder="Ajouter un commentaire..."
								rows={3}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
							/>
							<div className="flex justify-end mt-3">
								<button
									onClick={handleSendReponse}
									disabled={submitting || !newReponse.trim()}
									className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center gap-2"
								>
									{submitting ? (
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									) : (
										<>
											<Send size={14} />
											Envoyer
										</>
									)}
								</button>
								<label className="h-10 px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium cursor-pointer hover:bg-indigo-700 transition-all flex items-center gap-2">
									<Paperclip size={15} />

									{uploading ? "Upload..." : "Ajouter"}

									<input
										type="file"
										className="hidden"
										onChange={(e) => uploadFile(e, selectedReclamation.id)}
									/>
								</label>
							</div>
						</div>
					)}
				</div>
			</DashboardLayout>
		);
	}

	// List View
	return (
		<DashboardLayout
			title="Mes réclamations"
			subtitle="Client"
			actions={
				<button
					onClick={() => setShowForm(true)}
					className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium flex items-center gap-2 hover:from-indigo-600 hover:to-purple-700 transition-all"
				>
					<Plus size={16} />
					Nouvelle réclamation
				</button>
			}
		>
			{/* Search Bar */}
			<div className="relative mb-6">
				<Search
					size={18}
					className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
				/>
				<input
					type="text"
					placeholder="Rechercher une réclamation..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
				/>
			</div>

			{/* Reclamations List */}
			<div className="space-y-3">
				{filteredReclamations.map((rec) => (
					<div
						key={rec.id}
						onClick={() => loadReclamationDetail(rec.id)}
						className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
					>
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-2">
									<span className="text-xs font-mono text-gray-400">
										#{rec.id}
									</span>
									<span
										className={`text-xs px-2 py-0.5 rounded-full ${statusColor(rec.status?.status)}`}
									>
										{rec.status?.status || "—"}
									</span>
									<span
										className={`text-xs px-2 py-0.5 rounded-full ${priorityColor(rec.priority?.priority)}`}
									>
										{rec.priority?.priority || "Normal"}
									</span>
								</div>
								<h4 className="font-medium text-gray-900 dark:text-white">
									{rec.titre}
								</h4>
								<p className="text-sm text-gray-500 line-clamp-1 mt-1">
									{rec.description}
								</p>
								<div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
									<span className="flex items-center gap-1">
										<Clock size={12} />
										{rec.dateDepot
											? new Date(rec.dateDepot).toLocaleDateString("fr-FR")
											: "—"}
									</span>
									<span className="flex items-center gap-1">
										<MessageCircle size={12} />
										{rec.categorie?.categorie || "—"}
									</span>
								</div>
							</div>
							<div className="text-indigo-500">
								<ArrowLeft size={18} className="rotate-180" />
							</div>
						</div>
					</div>
				))}

				{filteredReclamations.length === 0 && (
					<div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
						<AlertTriangle size={48} className="mx-auto mb-3 text-gray-300" />
						<p className="text-gray-500">Aucune réclamation trouvée</p>
						<button
							onClick={() => setShowForm(true)}
							className="mt-4 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-600 transition-colors"
						>
							Créer une réclamation
						</button>
					</div>
				)}
			</div>

			{/* Create Reclamation Modal */}
			{showForm && (
				<div
					className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
					onClick={() => setShowForm(false)}
				>
					<div
						className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between mb-5">
							<h3 className="text-xl font-bold text-gray-900 dark:text-white">
								Nouvelle réclamation
							</h3>
							<button
								onClick={() => setShowForm(false)}
								className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
							>
								<X size={20} />
							</button>
						</div>
						<form onSubmit={handleCreateReclamation} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Titre
								</label>
								<input
									type="text"
									value={formData.titre}
									onChange={(e) =>
										setFormData({ ...formData, titre: e.target.value })
									}
									required
									className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Description
								</label>
								<textarea
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									required
									rows={4}
									className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Catégorie
								</label>
								<select
									value={formData.categorieId}
									onChange={(e) =>
										setFormData({ ...formData, categorieId: e.target.value })
									}
									required
									className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
								>
									<option value="">Sélectionner une catégorie</option>
									{categories.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.categorie}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Priorité
								</label>
								<select
									value={formData.priorityId}
									onChange={(e) =>
										setFormData({ ...formData, priorityId: e.target.value })
									}
									required
									className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
								>
									<option value="">Sélectionner une priorité</option>
									{priorities.map((pri) => (
										<option key={pri.id} value={pri.id}>
											{pri.priority}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Pièce jointe
								</label>

								<input
									type="file"
									onChange={(e) => {
										if (e.target.files && e.target.files.length > 0) {
											setSelectedFile(e.target.files[0]);
										}
									}}
									className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
								/>
							</div>
							<div className="flex gap-3 pt-3">
								<button
									type="button"
									onClick={() => setShowForm(false)}
									className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
								>
									Annuler
								</button>
								<button
									type="submit"
									disabled={submitting}
									className="flex-1 px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50"
								>
									{submitting ? (
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
									) : (
										"Envoyer"
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</DashboardLayout>
	);
}
