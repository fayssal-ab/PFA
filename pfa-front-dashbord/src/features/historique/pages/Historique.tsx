import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";

import {
	Activity,
	Calendar,
	User,
	ArrowRight,
	Filter,
	Search,
} from "lucide-react";

export default function HistoriquePage() {
	const [historiques, setHistoriques] = useState<any[]>([]);
	const [stats, setStats] = useState<any>(null);

	const [loading, setLoading] = useState(true);

	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

	const [action, setAction] = useState("");
	const [dateDebut, setDateDebut] = useState("");
	const [dateFin, setDateFin] = useState("");
	const [filters, setFilters] = useState({
		action: "",
		dateDebut: "",
		dateFin: "",
	});

	useEffect(() => {
		loadData();
	}, [page, filters]);

	const loadData = async () => {
		try {
			setLoading(true);

			const [histRes, statRes] = await Promise.all([
				api.get("/historiques/get-historiques", {
					params: {
						page,
						size: 10,
						action: filters.action || undefined,
						dateDebut: filters.dateDebut || undefined,
						dateFin: filters.dateFin || undefined,
					},
				}),
				api.get("/historiques/get-statistiques"),
			]);

			setHistoriques(histRes.data.content || []);

			setTotalPages(
				histRes.data.page?.totalPages || histRes.data.totalPages || 0,
			);

			setStats(statRes.data);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const appliquerFiltre = () => {
		setFilters({
			action,
			dateDebut,
			dateFin,
		});
		setPage(0);
	};
	const resetFiltres = () => {
		setAction("");
		setDateDebut("");
		setDateFin("");

		setFilters({
			action: "",
			dateDebut: "",
			dateFin: "",
		});

		setPage(0);
	};

	if (loading) {
		return (
			<DashboardLayout>
				<div className="flex items-center justify-center h-[60vh]">
					<div className="w-10 h-10 border-[3px] border-white/10 border-t-indigo-500 rounded-full animate-spin" />
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className="mb-8">
				<p className="text-[13px] text-indigo-400 font-semibold uppercase tracking-[0.25em] mb-2">
					Administration
				</p>

				<h1 className="text-[34px] font-bold text-white tracking-tight">
					Historique
				</h1>

				<p className="text-gray-400 text-[15px] mt-2">
					Suivi des actions effectuées dans le système
				</p>
			</div>


			<div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-8">
				<div className="flex items-center gap-2 mb-5">
					<Filter className="text-indigo-400" size={18} />
					<h3 className="text-white font-semibold">Filtres avancés</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<label className="text-gray-400 text-sm block mb-2">Action</label>

						<input
							type="text"
							value={action}
							onChange={(e) => setAction(e.target.value)}
							placeholder="Ex: Changement statut"
							className="w-full bg-[#020817] border border-white/10 rounded-xl px-4 py-3 text-white"
						/>
					</div>

					<div>
						<label className="text-gray-400 text-sm block mb-2">
							Date début
						</label>

						<input
							type="date"
							value={dateDebut}
							onChange={(e) => setDateDebut(e.target.value)}
							className="w-full bg-[#020817] border border-white/10 rounded-xl px-4 py-3 text-white"
						/>
					</div>

					<div>
						<label className="text-gray-400 text-sm block mb-2">Date fin</label>

						<input
							type="date"
							value={dateFin}
							onChange={(e) => setDateFin(e.target.value)}
							className="w-full bg-[#020817] border border-white/10 rounded-xl px-4 py-3 text-white"
						/>
					</div>

					<div className="flex items-end gap-3">
						<button
							onClick={appliquerFiltre}
							className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-4 py-3 font-medium flex items-center justify-center gap-2"
						>
							<Search size={16} />
							Filtrer
						</button>

						<button
							onClick={resetFiltres}
							className="px-4 py-3 rounded-xl border border-white/10 text-white bg-[#020817]"
						>
							Reset
						</button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
				{[
					{
						label: "Total Actions",
						value: stats?.totalActions,
					},
					{
						label: "Aujourd'hui",
						value: stats?.actionsAujourdHui,
					},
					{
						label: "Cette semaine",
						value: stats?.actionsCetteSemaine,
					},
					{
						label: "Statuts modifiés",
						value: stats?.changementsStatus,
					},
					{
						label: "Réclamations",
						value: stats?.reclamationsImpactees,
					},
				].map((card, index) => (
					<div
						key={index}
						className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-5"
					>
						<div className="flex items-center gap-3 mb-3">
							<div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
								<Activity size={18} className="text-indigo-400" />
							</div>

							<p className="text-gray-400 text-sm">{card.label}</p>
						</div>

						<p className="text-3xl font-bold text-white">{card.value ?? 0}</p>
					</div>
				))}
			</div>

			<div className="relative">
				<div className="absolute left-6 top-0 bottom-0 w-[2px] bg-indigo-500/20" />

				<div className="space-y-5">
					{historiques.map((h) => (
						<div key={h.id} className="relative pl-16">
							<div className="absolute left-[14px] top-8 w-6 h-6 rounded-full bg-indigo-500 border-4 border-[#020817]" />

							<div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
								<div className="flex flex-col lg:flex-row lg:justify-between gap-4">
									<div>
										<div className="flex items-center gap-3 mb-3">
											<div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
												<User size={16} className="text-indigo-300" />
											</div>

											<div>
												<h3 className="text-white font-bold">
													{h.user?.nom} {h.user?.prenom}
												</h3>

												<p className="text-indigo-300 text-sm">{h.action}</p>
											</div>
										</div>

										<div className="flex items-center gap-3 flex-wrap">
											<span className="px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold">
												{h.ancienStatus}
											</span>

											<ArrowRight size={15} className="text-gray-500" />

											<span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
												{h.nouveauStatus}
											</span>
										</div>

										{h.reclamation && (
											<div className="mt-4 inline-flex px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm">
												Réclamation #{h.reclamation.id}
											</div>
										)}
									</div>

									<div className="flex items-center gap-2 text-gray-500 text-sm">
										<Calendar size={15} />

										{new Date(h.dateAction).toLocaleString("fr-FR")}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-4 mt-8">
					<button
						disabled={page === 0}
						onClick={() => setPage(page - 1)}
						className="px-5 py-2 rounded-2xl bg-[#111827] border border-white/10 text-white disabled:opacity-40"
					>
						Précédent
					</button>

					<div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white">
						{page + 1} / {totalPages}
					</div>

					<button
						disabled={page >= totalPages - 1}
						onClick={() => setPage(page + 1)}
						className="px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white disabled:opacity-40"
					>
						Suivant
					</button>
				</div>
			)}
		</DashboardLayout>
	);
}
