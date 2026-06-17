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
					<div className="w-10 h-10 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin" />
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className="mb-6">
				<p className="text-xs uppercase tracking-widest text-teal-600 font-semibold">
					Centre de notifications
				</p>

				<div className="flex items-center justify-between mt-2">
					<h1 className="text-[26px] font-bold text-slate-900">Notifications</h1>

					{unread > 0 && (
						<button
							onClick={markAllRead}
							title="Tout marquer comme lu"
							className="w-10 h-10 flex items-center justify-center rounded-md bg-teal-600 hover:bg-teal-700 text-white transition-all"
						>
							<CheckCheck size={18} />
						</button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

				<div className="bg-white rounded-lg p-5 border border-slate-200">
					<p className="text-xs text-slate-500 uppercase tracking-widest">
						Total notifications
					</p>
					<h2 className="text-3xl font-bold text-slate-900 mt-2">
						{notifs.length}
					</h2>
				</div>

				<div className="bg-white rounded-lg p-5 border border-teal-200">
					<p className="text-xs text-slate-500 uppercase tracking-widest">
						Non lues
					</p>
					<h2 className="text-3xl font-bold text-teal-600 mt-2">{unread}</h2>
				</div>

				<div className="bg-white rounded-lg p-5 border border-emerald-200">
					<p className="text-xs text-slate-500 uppercase tracking-widest">
						Lues
					</p>
					<h2 className="text-3xl font-bold text-emerald-600 mt-2">{read}</h2>
				</div>
			</div>

			<div className="bg-white rounded-lg p-4 border border-slate-200 mb-6">
				<div className="flex flex-col md:flex-row gap-4 justify-between">
					<div className="relative w-full md:w-80">
						<Search
							size={16}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
						/>
						<input
							type="text"
							placeholder="Rechercher..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-9 pr-4 py-2.5 rounded-md bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
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
									className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
										active
											? "bg-teal-600 text-white"
											: "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
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
					<div className="bg-white rounded-lg p-20 text-center border border-slate-200">
						<Bell size={44} className="mx-auto text-slate-200 mb-4" />
						<p className="text-slate-500">Aucune notification trouvée</p>
					</div>
				) : (
					filteredNotifications.map((n) => (
						<div
							key={n.id}
							className={`rounded-lg p-4 border transition-all duration-200 hover:border-teal-300 ${
								!n.lue
									? "bg-teal-50 border-teal-200"
									: "bg-white border-slate-200"
							}`}
						>
							<div className="flex items-center gap-4">
								<div
									className={`w-12 h-12 rounded-md flex-shrink-0 flex items-center justify-center ${
										!n.lue ? "bg-teal-100" : "bg-slate-50"
									}`}
								>
									<Bell
										size={18}
										className={!n.lue ? "text-teal-600" : "text-slate-400"}
									/>
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										{!n.lue && (
											<span className="w-2 h-2 rounded-full bg-teal-600 flex-shrink-0" />
										)}
										<p
											className={`text-sm truncate ${
												!n.lue ? "text-slate-900 font-medium" : "text-slate-500"
											}`}
										>
											{n.message}
										</p>
									</div>
									<div className="flex items-center gap-1.5 text-slate-400 text-xs">
										<Clock size={11} />
										<span>{timeAgo(n.dateEnvoi)}</span>
									</div>
								</div>

								<div className="flex items-center gap-2 flex-shrink-0">
									{!n.lue && (
										<button
											onClick={() => markRead(n.id)}
											title="Marquer comme lu"
											className="w-9 h-9 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition"
										>
											<CheckCheck size={16} />
										</button>
									)}
									<button
										onClick={() => del(n.id)}
										disabled={deleting === n.id}
										title="Supprimer"
										className="w-9 h-9 rounded-md bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition disabled:opacity-40"
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
