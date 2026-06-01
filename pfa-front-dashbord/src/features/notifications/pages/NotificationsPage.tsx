import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import api from "../../../lib/axiosInstance";
import { Bell, Trash2, CheckCheck, Clock, Search } from "lucide-react";
import { Notification } from "../../../types";
import { useAuth } from "../../../features/auth/hooks/useAuth";

export default function NotificationsPage() {
	const [notifs, setNotifs] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState<number | null>(null);
	const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
	const [search, setSearch] = useState("");

	const { user } = useAuth();

	useEffect(() => {
		load();
	}, []);

	const load = async () => {
		try {
			const r = await api
				.get<Notification[]>(
					`/notifications/get-notifications-by-client/${user?.userId}`,
				)
				.catch(() => ({ data: [] }));
			setNotifs(Array.isArray(r.data) ? r.data : []);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const markRead = async (id: number) => {
		try {
			await api.post(`/notifications/mark-as-read/${id}`);
			window.dispatchEvent(new Event("notification-updated"));
			load();
		} catch (e) {
			console.error(e);
		}
	};

	const markAllRead = async () => {
		try {
			const unreadNotifications = notifs.filter((n) => !n.lue);
			await Promise.all(
				unreadNotifications.map((n) =>
					api.post(`/notifications/mark-as-read/${n.id}`),
				),
			);
			window.dispatchEvent(new Event("notification-updated"));
			load();
		} catch (e) {
			console.error(e);
		}
	};

	const del = async (id: number) => {
		setDeleting(id);
		try {
			await api.delete(`/notifications/delete-notification/${id}`);
			window.dispatchEvent(new Event("notification-updated"));
			load();
		} catch (e) {
			console.error(e);
		} finally {
			setDeleting(null);
		}
	};

	const unread = notifs.filter((n) => !n.lue).length;
	const read = notifs.length - unread;

	const filteredNotifications = useMemo(() => {
		let data = [...notifs];
		if (filter === "unread") data = data.filter((n) => !n.lue);
		if (filter === "read") data = data.filter((n) => n.lue);
		if (search.trim())
			data = data.filter((n) =>
				n.message?.toLowerCase().includes(search.toLowerCase()),
			);
		return data;
	}, [notifs, filter, search]);

	const timeAgo = (d?: string): string => {
		if (!d) return "";
		const date = new Date(d);
		const now = Date.now();
		const diff = Math.floor((now - date.getTime()) / 1000);
		if (diff < 60) return "À l'instant";
		if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
		if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
		return `Il y a ${Math.floor(diff / 86400)}j`;
	};

	if (loading) {
		return (
			<DashboardLayout>
				<div className="flex items-center justify-center h-[60vh]">
					<div className="w-10 h-10 border-4 border-white/10 border-t-violet-500 rounded-full animate-spin" />
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className="mb-8">
				<p className="text-xs uppercase tracking-widest text-violet-400 font-semibold">
					Centre de notifications
				</p>

				<div className="flex items-center justify-between mt-2">
					<h1 className="text-4xl font-bold text-white">Notifications</h1>

					{unread > 0 && (
						<button
							onClick={markAllRead}
							title="Tout marquer comme lu"
							className="w-10 h-10 flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-900/40"
						>
							<CheckCheck size={18} />
						</button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
			
				<div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
					<p className="text-xs text-gray-400 uppercase tracking-widest">
						Total notifications
					</p>
					<h2 className="text-4xl font-bold text-white mt-2">
						{notifs.length}
					</h2>
				</div>

				<div className="bg-[#1a1a2e] rounded-2xl p-6 border border-violet-500/20">
					<p className="text-xs text-gray-400 uppercase tracking-widest">
						Non lues
					</p>
					<h2 className="text-4xl font-bold text-violet-400 mt-2">{unread}</h2>
				</div>

				<div className="bg-[#1a1a2e] rounded-2xl p-6 border border-emerald-500/20">
					<p className="text-xs text-gray-400 uppercase tracking-widest">
						Lues
					</p>
					<h2 className="text-4xl font-bold text-emerald-400 mt-2">{read}</h2>
				</div>
			</div>

			<div className="bg-[#1a1a2e] rounded-2xl p-4 border border-white/5 mb-6">
				<div className="flex flex-col md:flex-row gap-4 justify-between">
					<div className="relative w-full md:w-80">
						<Search
							size={16}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
						/>
						<input
							type="text"
							placeholder="Rechercher..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition"
						/>
					</div>

					<div className="flex gap-2">
						{(["all", "unread", "read"] as const).map((f) => {
							const labels = {
								all: "Toutes",
								unread: "Non lues",
								read: "Lues",
							};
							const active = filter === f;
							return (
								<button
									key={f}
									onClick={() => setFilter(f)}
									className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
										active
											? "bg-violet-600 text-white shadow shadow-violet-900/50"
											: "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
									}`}
								>
									{labels[f]}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<div className="space-y-3">
				{filteredNotifications.length === 0 ? (
					<div className="bg-[#1a1a2e] rounded-2xl p-20 text-center border border-white/5">
						<Bell size={44} className="mx-auto text-white/10 mb-4" />
						<p className="text-gray-500">Aucune notification trouvée</p>
					</div>
				) : (
					filteredNotifications.map((n) => (
						<div
							key={n.id}
							className={`rounded-2xl p-4 border transition-all duration-200 hover:border-violet-500/30 hover:bg-white/[0.03] ${
								!n.lue
									? "bg-violet-900/10 border-violet-500/20"
									: "bg-[#1a1a2e] border-white/5"
							}`}
						>
							<div className="flex items-center gap-4">
								<div
									className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${
										!n.lue ? "bg-violet-600/20" : "bg-white/5"
									}`}
								>
									<Bell
										size={18}
										className={!n.lue ? "text-violet-400" : "text-gray-500"}
									/>
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										{!n.lue && (
											<span className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
										)}
										<p
											className={`text-sm truncate ${
												!n.lue ? "text-white font-medium" : "text-gray-400"
											}`}
										>
											{n.message}
										</p>
									</div>
									<div className="flex items-center gap-1.5 text-gray-600 text-xs">
										<Clock size={11} />
										<span>{timeAgo(n.dateEnvoi)}</span>
									</div>
								</div>

								<div className="flex items-center gap-2 flex-shrink-0">
									{!n.lue && (
										<button
											onClick={() => markRead(n.id)}
											title="Marquer comme lu"
											className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition"
										>
											<CheckCheck size={16} />
										</button>
									)}
									<button
										onClick={() => del(n.id)}
										disabled={deleting === n.id}
										title="Supprimer"
										className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition disabled:opacity-40"
									>
										<Trash2 size={16} />
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</DashboardLayout>
	);
}
