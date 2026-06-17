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

import{Historique} from "../../../types"

export default function HistoriquePage() {
	const [historiques, setHistoriques] = useState<Historique[]>([]);
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
					<div className="w-10 h-10 border-[3px] border-slate-200 border-t-teal-600 rounded-full animate-spin" />
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className="mb-6">
				<p className="text-[13px] text-teal-600 font-semibold uppercase tracking-wider mb-2">
					Administration
				</p>

				<h1 className="text-[26px] font-bold text-slate-900 tracking-tight">
					Historique
				</h1>

				<p className="text-slate-500 text-[14px] mt-2">
					Suivi des actions effectuées dans le système
				</p>
			</div>

			<div className="bg-white rounded-lg border border-slate-200 p-5 mb-6">
				<div className="flex items-center gap-2 mb-5">
					<Filter className="text-teal-600" size={18} />
					<h3 className="text-slate-900 font-semibold">Filtres avancés</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<label className="text-slate-500 text-sm block mb-2">Action</label>

						<input
							type="text"
							value={action}
							onChange={(e) => setAction(e.target.value)}
							placeholder="Ex: Changement statut"
							className="w-full bg-white border border-slate-200 rounded-md px-4 py-3 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
						/>
					</div>

					<div>
						<label className="text-slate-500 text-sm block mb-2">
							Date début
						</label>

						<input
							type="date"
							value={dateDebut}
							onChange={(e) => setDateDebut(e.target.value)}
							className="w-full bg-white border border-slate-200 rounded-md px-4 py-3 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
						/>
					</div>

					<div>
						<label className="text-slate-500 text-sm block mb-2">Date fin</label>

						<input
							type="date"
							value={dateFin}
							onChange={(e) => setDateFin(e.target.value)}
							className="w-full bg-white border border-slate-200 rounded-md px-4 py-3 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
						/>
					</div>

					<div className="flex items-end gap-3">
						<button
							onClick={appliquerFiltre}
							className="flex-1 bg-teal-600 text-white rounded-md px-4 py-3 font-medium flex items-center justify-center gap-2 hover:bg-teal-700 text-sm"
						>
							<Search size={16} />
							Filtrer
						</button>

						<button
							onClick={resetFiltres}
							className="px-4 py-3 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
						>
							Reset
						</button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
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
						className="bg-white rounded-lg border border-slate-200 p-4"
					>
						<div className="flex items-center gap-3 mb-3">
							<div className="w-10 h-10 rounded-md bg-teal-50 flex items-center justify-center">
								<Activity size={18} className="text-teal-600" />
							</div>

							<p className="text-slate-500 text-sm">{card.label}</p>
						</div>

						<p className="text-3xl font-bold text-slate-900">{card.value ?? 0}</p>
					</div>
				))}
			</div>

			<div className="relative">
				<div className="absolute left-6 top-0 bottom-0 w-[2px] bg-teal-200" />

				<div className="space-y-5">
					{historiques.map((h) => (
						<div key={h.id} className="relative pl-16">
							<div className="absolute left-[14px] top-8 w-6 h-6 rounded-full bg-teal-600 border-4 border-slate-50" />

							<div className="bg-white rounded-lg border border-slate-200 p-5">
								<div className="flex flex-col lg:flex-row lg:justify-between gap-4">
									<div>
										<div className="flex items-center gap-3 mb-3">
											<div className="w-10 h-10 rounded-md bg-teal-50 flex items-center justify-center">
												<User size={16} className="text-teal-600" />
											</div>

											<div>
												<h3 className="text-slate-900 font-bold">
													{h.user?.nom} {h.user?.prenom}
												</h3>

												<p className="text-teal-600 text-sm">{h.action}</p>
											</div>
										</div>

										<div className="flex items-center gap-3 flex-wrap">
											<span className="px-3 py-1 rounded-md bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
												{h.ancienStatus}
											</span>

											<ArrowRight size={15} className="text-slate-400" />

											<span className="px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold">
												{h.nouveauStatus}
											</span>
										</div>

										{h.reclamation && (
											<div className="mt-4 inline-flex px-3 py-2 rounded-md bg-teal-50 border border-teal-200 text-teal-700 text-sm">
												Réclamation #{h.reclamation.id}
											</div>
										)}
									</div>

									<div className="flex items-center gap-2 text-slate-500 text-sm">
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
						className="px-5 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 text-sm"
					>
						Précédent
					</button>

					<div className="px-4 py-2 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-sm">
						{page + 1} / {totalPages}
					</div>

					<button
						disabled={page >= totalPages - 1}
						onClick={() => setPage(page + 1)}
						className="px-5 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 text-sm"
					>
						Suivant
					</button>
				</div>
			)}
		</DashboardLayout>
	);
}
