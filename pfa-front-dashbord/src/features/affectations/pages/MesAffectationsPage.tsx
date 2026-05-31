import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";

import { ClipboardList, Clock, MessageSquare, User, Eye } from "lucide-react";

import { Affectation, ApiResponse } from "../../../types";

import { useNavigate } from "react-router-dom";

export default function MesAffectationsPage() {
	const [affectations, setAffectations] = useState<Affectation[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [page, setPage] = useState<number>(0);

	const [totalPages, setTotalPages] = useState<number>(0);

	const navigate = useNavigate();

	useEffect(() => {
		load();
	}, [page]);

	const load = async () => {
		setLoading(true);

		try {
			const r = await api.get<ApiResponse<Affectation>>(
				"/affectations/mes-affectations",
				{
					params: {
						page,
						size: 10,
					},
				},
			);

			setAffectations(r.data?.content || []);

			setTotalPages(r.data?.page.totalPages || 0);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const statusColor = (s?: string): string => {
		const n = s?.toLowerCase() || "";

		if (n.includes("résolu") || n.includes("resolu") || n.includes("fermé"))
			return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20";

		if (n.includes("cours") || n.includes("traitement"))
			return "bg-amber-500/20 text-amber-300 border border-amber-500/20";

		if (n.includes("ouvert") || n.includes("nouveau"))
			return "bg-blue-500/20 text-blue-300 border border-blue-500/20";

		return "bg-gray-500/20 text-gray-300 border border-gray-500/20";
	};

	const priorityColor = (p?: string): string => {
		const n = p?.toLowerCase() || "";

		if (n.includes("haute") || n.includes("high") || n.includes("urgent"))
			return "bg-red-500/20 text-red-300 border border-red-500/20";

		if (n.includes("moyenne") || n.includes("medium"))
			return "bg-amber-500/20 text-amber-300 border border-amber-500/20";

		return "bg-gray-500/20 text-gray-300 border border-gray-500/20";
	};

	if (loading && affectations.length === 0)
		return (
			<DashboardLayout>
				<div className="min-h-screen bg-[#020817] flex items-center justify-center">
					<div className="w-10 h-10 border-[3px] border-white/10 border-t-indigo-500 rounded-full animate-spin" />
				</div>
			</DashboardLayout>
		);

	return (
		<DashboardLayout>
			<div className="mb-8">
				<p className="text-[13px] text-indigo-400 font-semibold uppercase tracking-[0.25em] mb-2">
					Espace agent
				</p>

				<h1 className="text-[34px] font-bold text-white tracking-tight">
					Mes Affectations
				</h1>

				<p className="text-gray-400 text-[15px] mt-2">
					Les réclamations qui vous ont été assignées
				</p>
			</div>

			{affectations.length === 0 ? (
				<div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center py-24">
					<div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-5">
						<ClipboardList size={38} className="text-indigo-400" />
					</div>

					<p className="text-[18px] font-bold text-white">Aucune affectation</p>

					<p className="text-[14px] text-gray-400 mt-2">
						Vous n'avez pas encore de réclamations assignées
					</p>
				</div>
			) : (
				<div className="space-y-5">
					{affectations.map((a) => (
						<div
							key={a.id}
							className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 hover:border-indigo-500/30 hover:shadow-indigo-500/10 transition-all duration-300"
						>
							<div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-4 flex-wrap">
										<span className="text-[12px] font-mono font-bold text-gray-500">
											#{a.reclamation?.id}
										</span>

										<span
											className={`inline-flex px-3 py-1 rounded-xl text-[11px] font-bold ${statusColor(
												a.reclamation?.status?.status,
											)}`}
										>
											{a.reclamation?.status?.status || "—"}
										</span>

										<span
											className={`inline-flex px-3 py-1 rounded-xl text-[11px] font-bold ${priorityColor(
												a.reclamation?.priority?.priority,
											)}`}
										>
											{a.reclamation?.priority?.priority || "—"}
										</span>
									</div>

									<h3 className="text-[20px] font-bold text-white mb-3">
										{a.reclamation?.titre || "Sans titre"}
									</h3>

									<p className="text-[14px] text-gray-400 leading-relaxed line-clamp-2">
										{a.reclamation?.description || "Pas de description"}
									</p>
								</div>

								<div className="flex flex-col gap-3 shrink-0 xl:items-end">
									<div className="flex items-center gap-2 text-[13px] text-gray-400">
										<div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
											<Clock size={14} className="text-orange-300" />
										</div>

										<span>
											{a.dateAffectation
												? new Date(a.dateAffectation).toLocaleDateString(
														"fr-FR",
														{
															day: "numeric",
															month: "short",
															year: "numeric",
														},
													)
												: "—"}
										</span>
									</div>

									{a.reclamation?.client?.user && (
										<div className="flex items-center gap-2 text-[13px] text-gray-400">
											<div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center">
												<User size={14} className="text-cyan-300" />
											</div>

											<span>
												{a.reclamation.client.user.nom}{" "}
												{a.reclamation.client.user.prenom}
											</span>
										</div>
									)}

									<div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[12px] text-gray-300 text-center">
										{a.reclamation?.categorie?.categorie || "—"}
									</div>

									<button
										onClick={() =>
											navigate(`/agent/affectations/${a.reclamation?.id}`)
										}
										className="h-11 px-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[14px] font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
									>
										<Eye size={16} />
										Détails
									</button>
									<button
										onClick={() =>
											navigate(`/agent/reponses/${a.reclamation?.id}`)
										}
										className="h-11 px-5 rounded-2xl bg-emerald-500 text-white text-[14px] font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
									>
										<MessageSquare size={16} />
										Mes réponses
									</button>
								</div>
							</div>
						</div>
					))}

					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-3 pt-6">
							<button
								onClick={() => setPage(Math.max(0, page - 1))}
								disabled={page === 0}
								className="h-11 px-5 rounded-2xl border border-white/10 bg-[#111827] text-gray-300 hover:bg-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
							>
								Précédent
							</button>

							<div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-300 font-medium">
								{page + 1} / {totalPages}
							</div>

							<button
								onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
								disabled={page >= totalPages - 1}
								className="h-11 px-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
							>
								Suivant
							</button>
						</div>
					)}
				</div>
			)}
		</DashboardLayout>
	);
}
