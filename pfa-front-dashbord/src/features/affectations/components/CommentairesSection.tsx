import { MessageSquare, Send } from "lucide-react";
import { Commentaire, AuthUser } from "../../../types";

type Props = {
	commentaires: Commentaire[];
	message: string;
	setMessage: (value: string) => void;
	sendComment: () => void;
	sending: boolean;
	user: AuthUser | null;
};

export default function CommentairesSection({
	commentaires,
	message,
	setMessage,
	sendComment,
	sending,
	user,
}: Props) {
	const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (!sending && message.trim()) sendComment();
		}
	};

	return (
		<div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
			<div className="px-5 py-4 border-b border-white/5 flex items-center gap-2.5">
				<div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center">
					<MessageSquare size={15} className="text-indigo-400" />
				</div>
				<div>
					<h2 className="text-sm font-bold text-white">Commentaires</h2>
					<p className="text-[11px] text-gray-600">
						{commentaires.length} message{commentaires.length !== 1 ? "s" : ""}
					</p>
				</div>
			</div>

			<div className="p-5 space-y-4 max-h-[420px] overflow-y-auto scroll-smooth">
				{commentaires.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
							<MessageSquare size={20} className="text-gray-600" />
						</div>
						<p className="text-sm text-gray-600">
							Aucun commentaire pour le moment
						</p>
						<p className="text-xs text-gray-700 mt-1">
							Soyez le premier à commenter
						</p>
					</div>
				) : (
					commentaires.map((c) => {
						const isMine = c.user?.id === user?.userId;
						return (
							<div
								key={c.id}
								className={`flex ${isMine ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`max-w-[72%] ${isMine ? "items-end" : "items-start"} flex flex-col gap-1`}
								>
									<span className="text-[10px] font-semibold text-gray-600 px-1">
										{isMine
											? "Vous"
											: `${c.user?.nom || ""} ${c.user?.prenom || ""}`.trim()}
									</span>
									<div
										className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
											isMine
												? "bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-br-sm"
												: "bg-white/[0.05] border border-white/10 text-gray-200 rounded-bl-sm"
										}`}
									>
										{c.contenu}
									</div>
									<span className="text-[10px] text-gray-700 px-1">
										{c.dateCommentaire
											? new Date(c.dateCommentaire).toLocaleString("fr-FR", {
													hour: "2-digit",
													minute: "2-digit",
													day: "numeric",
													month: "short",
												})
											: ""}
									</span>
								</div>
							</div>
						);
					})
				)}
			</div>

			<div className="border-t border-white/5 p-4 bg-black/20">
				<div className="flex items-end gap-3">
					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={handleKey}
						placeholder="Écrire un commentaire... (Entrée pour envoyer)"
						rows={2}
						className="flex-1 bg-white/[0.04] border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/15 placeholder-gray-600 transition-all"
					/>
					<button
						onClick={sendComment}
						disabled={sending || !message.trim()}
						className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 text-white flex items-center justify-center hover:opacity-90 hover:scale-[1.05] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 transition-all shadow-lg shadow-violet-900/30 shrink-0"
					>
						{sending ? (
							<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						) : (
							<Send size={16} />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
