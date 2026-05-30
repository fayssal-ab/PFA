import { FileText, Paperclip, Download, Trash } from "lucide-react";
import { PieceJointe } from "../../../types";
import { useAuth } from "../../../features/auth/hooks/useAuth";

type Props = {
	agentFiles: PieceJointe[];
	downloadFile: (filename?: string) => void;
	uploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
	uploading: boolean;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	deleteFile: (id: number) => void;
};

export default function AgentFilesSection({
	agentFiles,
	downloadFile,
	uploadFile,
	uploading,
	page,
	totalPages,
	onPageChange,
	deleteFile,
}: Props) {
	const { user } = useAuth();

	const isAgent = user?.role === "agent" || user?.role?.includes("agent");

	return (
		<div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
			<div className="flex items-center justify-between mb-5">
				<div className="flex items-center gap-2">
					<FileText size={18} className="text-emerald-400" />

					<div>
						<h2 className="text-lg font-bold text-white">
							{isAgent ? "Mes Pièces jointes" : "Pièces jointes de l'agent"}
						</h2>

					</div>
				</div>

				{isAgent && (
					<label className="h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium cursor-pointer hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20">
						<Paperclip size={15} />

						{uploading ? "Upload..." : "Ajouter"}

						<input type="file" className="hidden" onChange={uploadFile} />
					</label>
				)}
			</div>

			<div className="space-y-3">
				{agentFiles.length === 0 ? (
					<div className="text-sm text-gray-500">Aucun fichier</div>
				) : (
					agentFiles.map((f) => (
						<div
							key={f.id}
							className="flex items-center justify-between border border-white/10 bg-[#0f172a]/50 rounded-2xl px-4 py-3 hover:border-indigo-500/40 transition-all"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
									<Paperclip size={16} className="text-emerald-300" />
								</div>

								<div>
									<p className="text-sm font-semibold text-white">
										{f.fichier}
									</p>

				
								</div>
							</div>

							<div className="flex items-center gap-2">
								<button
									onClick={() => downloadFile(f.fichier)}
									title="Télécharger"
									className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 flex items-center justify-center transition-all duration-200"
								>
									<Download size={17} />
								</button>

								{isAgent && (
									<button
										onClick={() => deleteFile(f.id)}
										title="Supprimer"
										className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 flex items-center justify-center transition-all duration-200"
									>
										<Trash size={17} />
									</button>
								)}
							</div>
						</div>
					))
				)}
			</div>

			<div className="flex items-center justify-center gap-4 mt-5">
				<button
					disabled={page === 0}
					onClick={() => onPageChange(page - 1)}
					className="px-4 py-2 rounded-xl bg-slate-700 text-white disabled:opacity-50"
				>
					Précédent
				</button>

				<span className="text-white font-medium">
					{page + 1} / {Math.max(totalPages, 1)}
				</span>

				<button
					disabled={page + 1 >= totalPages}
					onClick={() => onPageChange(page + 1)}
					className="px-4 py-2 rounded-xl bg-slate-700 text-white disabled:opacity-50"
				>
					Suivant
				</button>
			</div>
		</div>
	);
}
