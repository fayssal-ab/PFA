import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";

import {
	MessageSquare,
	Calendar,
	User,
	Trash2,
} from "lucide-react";

export default function MesReponsesPage() {
	const { reclamationId } = useParams();

	const [reponses, setReponses] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

	useEffect(() => {
		loadReponses();
	}, [page]);

	const loadReponses = async () => {
		try {
			setLoading(true);

			const res = await api.get(
				`/reponse-reclamations/get-reponse/${reclamationId}`,
				{
					params: {
						page,
						size: 10,
					},
				},
			);

			setReponses(res.data.content || []);
			setTotalPages(res.data.totalPages || 0);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const deleteReponse = async (id: number) => {
		try {
			await api.delete(`reponse-reclamations/delete-reponse/${id}`);

			setReponses((prev) =>
				prev.filter((r) => r.id !== id),
			);
		} catch (error) {
			console.error(error);
			alert("Erreur lors de la suppression");
		}
	};

	if (loading) {
		return (
			<DashboardLayout>
				<div className="flex justify-center py-24">
					<div className="w-10 h-10 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin" />
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className="mb-6">
				<p className="text-[13px] text-teal-600 font-semibold uppercase tracking-wider">
					Espace Agent
				</p>

				<h1 className="text-[26px] font-bold text-slate-900 mt-2">
					Mes Réponses
				</h1>

				<p className="text-slate-500 mt-2">
					Historique des réponses envoyées
				</p>
			</div>

			{reponses.length === 0 ? (
				<div className="bg-white rounded-lg border border-slate-200 py-24 flex flex-col items-center">
					<div className="w-20 h-20 rounded-lg bg-teal-50 flex items-center justify-center mb-5">
						<MessageSquare
							size={40}
							className="text-teal-600"
						/>
					</div>

					<p className="text-slate-900 text-lg font-bold">
						Aucune réponse
					</p>

					<p className="text-slate-500 mt-2">
						Vous n'avez encore envoyé aucune réponse
					</p>
				</div>
			) : (
				<div className="space-y-5">
					{reponses.map((r) => (
						<div
							key={r.id}
							className="bg-white rounded-lg border border-slate-200 p-5"
						>
							<div className="flex justify-between items-start mb-5">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 rounded-md bg-teal-50 flex items-center justify-center">
										<User
											size={18}
											className="text-teal-600"
										/>
									</div>

									<div>
										<p className="text-slate-900 font-semibold">
											{r.agent?.user?.nom}{" "}
											{r.agent?.user?.prenom}
										</p>

										<p className="text-xs text-slate-500">
											Agent
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<div className="flex items-center gap-2 text-sm text-slate-500">
										<Calendar size={15} />

										{r.dateCreation
											? new Date(
													r.dateCreation,
												).toLocaleDateString(
													"fr-FR",
													{
														day: "numeric",
														month: "short",
														year: "numeric",
													},
												)
											: "—"}
									</div>

									<button
										onClick={() =>
											deleteReponse(r.id)
										}
										className="w-10 h-10 rounded-md bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-all"
									>
										<Trash2
											size={16}
											className="text-red-500"
										/>
									</button>
								</div>
							</div>

							<div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
								<p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
									{r.reponse}
								</p>
							</div>
						</div>
					))}
				</div>
			)}

			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-3 mt-8">
					<button
						onClick={() =>
							setPage(Math.max(0, page - 1))
						}
						disabled={page === 0}
						className="h-8 px-5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 text-xs"
					>
						Précédent
					</button>

					<div className="px-4 py-2 rounded-md bg-slate-50 border border-slate-200 text-sm text-slate-700">
						{page + 1} / {totalPages}
					</div>

					<button
						onClick={() =>
							setPage(
								Math.min(
									totalPages - 1,
									page + 1,
								),
							)
						}
						disabled={page >= totalPages - 1}
						className="h-8 px-5 rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 text-xs"
					>
						Suivant
					</button>
				</div>
			)}
		</DashboardLayout>
	);
}
