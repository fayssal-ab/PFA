
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
	return (
		<div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
			<div className="px-6 py-5 border-b border-white/10 flex items-center gap-2">
				<MessageSquare size={18} className="text-indigo-400" />

				<h2 className="text-lg font-bold text-white">Commentaires</h2>
			</div>

			<div className="p-6 space-y-5 max-h-[500px] overflow-y-auto bg-[#0f172a]/40">
				{commentaires.length === 0 ? (
					<div className="text-center text-sm text-gray-500 py-10">
						Aucun commentaire
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
									className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-lg ${
										isMine
											? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
											: "bg-[#1e293b] border border-white/10 text-gray-200"
									}`}
								>
									<div className="text-[11px] font-semibold mb-1 opacity-80">
										{isMine
											? "Vous"
											: `${c.user?.nom || ""} ${c.user?.prenom || ""}`}
									</div>

									<p className="text-sm leading-relaxed">{c.contenu}</p>

									<div className="text-[10px] opacity-70 mt-2">
										{c.dateCommentaire
											? new Date(c.dateCommentaire).toLocaleString("fr-FR")
											: ""}
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>

			<div className="border-t border-white/10 p-4 bg-[#111827] flex items-end gap-3">
				<textarea
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Écrire un commentaire..."
					rows={2}
					className="flex-1 bg-[#0f172a] border border-white/10 text-white rounded-2xl p-4 text-sm outline-none resize-none focus:border-indigo-500"
				/>

				<button
					onClick={sendComment}
					disabled={sending}
					className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 transition-all flex items-center justify-center"
				>
					{sending ? (
						<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
					) : (
						<Send size={18} />
					)}
				</button>
			</div>
		</div>
	);
}
