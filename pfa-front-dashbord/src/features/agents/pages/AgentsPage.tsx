import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import { Search, UserCheck, UserX, Users } from "lucide-react";
import { Agent, ApiResponse } from "../../../types";

export default function AgentsPage() {
	const [agents, setAgents] = useState<Agent[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [search, setSearch] = useState<string>("");
	const [toggling, setToggling] = useState<number | null>(null);

	useEffect(() => {
		fetch();
	}, []);

	const fetch = async () => {
		try {
			const r = await api.get<ApiResponse<Agent>>("/agents/get-agents", {
				params: { page: 0, size: 100 },
			});
			setAgents(r.data?.content || []);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const toggle = async (a: Agent) => {
		setToggling(a.id);
		try {
			await api.put(`/agents/update-disponibilte/${a.id}`, !a.disponible);
			fetch();
		} catch (e) {
			console.error(e);
		} finally {
			setToggling(null);
		}
	};

	const filtered = agents.filter(
		(a) =>
			a.user?.nom?.toLowerCase().includes(search.toLowerCase()) ||
			a.user?.prenom?.toLowerCase().includes(search.toLowerCase()),
	);
	const dispo = agents.filter((a) => a.disponible).length;

	if (loading)
		return (
			<DashboardLayout>
				<div className="flex items-center justify-center h-[60vh]">
					<div className="w-8 h-8 border-[3px] border-slate-200 border-t-teal-600 rounded-full animate-spin" />
				</div>
			</DashboardLayout>
		);

	return (
		<DashboardLayout>
			<div className="mb-6">
				<p className="text-[13px] text-slate-400 font-medium uppercase tracking-wider mb-1">
					Gestion
				</p>
				<h1 className="text-[26px] font-bold text-slate-900 tracking-tight">
					Agents
				</h1>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
				{[
					{
						label: "Total",
						value: agents.length,
						icon: Users,
						bg: "bg-teal-50",
						iconBg: "bg-teal-100",
						iconColor: "text-teal-600",
					},
					{
						label: "Disponibles",
						value: dispo,
						icon: UserCheck,
						bg: "bg-emerald-50",
						iconBg: "bg-emerald-100",
						iconColor: "text-emerald-600",
					},
					{
						label: "Occupés",
						value: agents.length - dispo,
						icon: UserX,
						bg: "bg-amber-50",
						iconBg: "bg-amber-100",
						iconColor: "text-amber-600",
					},
				].map((c) => (
					<div
						key={c.label}
						className={`${c.bg} rounded-lg p-5 border border-slate-200`}
					>
						<div className="flex items-start justify-between">
							<div>
								<p className="text-[12px] text-slate-500 font-semibold uppercase tracking-wider">
									{c.label}
								</p>
								<p className="text-[28px] font-extrabold text-slate-900 mt-1 leading-none">
									{c.value}
								</p>
							</div>
							<div
								className={`w-10 h-10 rounded-md ${c.iconBg} flex items-center justify-center`}
							>
								<c.icon size={18} className={c.iconColor} />
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="relative mb-5">
				<Search
					size={15}
					className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
				/>
				<input
					type="text"
					placeholder="Rechercher..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full sm:w-[360px] h-10 bg-white border border-slate-200 rounded-md pl-10 pr-4 text-[13px] outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
				/>
			</div>

			<div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="bg-slate-50">
								{["Nom", "Prénom", "Email", "Statut"].map((h) => (
									<th
										key={h}
										className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider px-6 py-3"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{filtered.length === 0 ? (
								<tr>
									<td
										colSpan={4}
										className="text-center py-16 text-slate-400 text-[14px]"
									>
										Aucun agent
									</td>
								</tr>
							) : (
								filtered.map((a) => (
									<tr
										key={a.id}
										className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
									>
										<td className="px-6 py-3.5 text-[14px] text-slate-900 font-semibold">
											{a.user?.nom || "—"}
										</td>
										<td className="px-6 py-3.5 text-[14px] text-slate-600">
											{a.user?.prenom || "—"}
										</td>
										<td className="px-6 py-3.5 text-[13px] text-slate-500">
											{a.user?.email || "—"}
										</td>
										<td className="px-6 py-3.5">
											<button
												onClick={() => toggle(a)}
												disabled={toggling === a.id}
												className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-bold transition-all ${a.disponible ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100" : "bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100"}`}
											>
												{toggling === a.id ? (
													<div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
												) : a.disponible ? (
													<>
														<UserCheck size={13} /> Disponible
													</>
												) : (
													<>
														<UserX size={13} /> Occupé
													</>
												)}
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</DashboardLayout>
	);
}
