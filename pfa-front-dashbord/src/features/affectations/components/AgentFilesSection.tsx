import { FileText, Paperclip, Download, Trash2, Upload, ChevronLeft, ChevronRight } from "lucide-react";
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
		<div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
			<div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
						<FileText size={15} className="text-emerald-400" />
					</div>
					<div>
						<h2 className="text-sm font-bold text-white">
							{isAgent ? "Mes pièces jointes" : "Pièces jointes agent"}
						</h2>
						<p className="text-[11px] text-gray-600">{agentFiles.length} fichier{agentFiles.length !== 1 ? "s" : ""}</p>
					</div>
				</div>

				{isAgent && (
					<label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
						uploading
							? "bg-white/5 text-gray-500 cursor-wait"
							: "bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/25"
					}`}>
						{uploading ? (
							<>
								<div className="w-3 h-3 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
								Envoi...
							</>
						) : (
							<>
								<Upload size={12} />
								Ajouter
							</>
						)}
						<input type="file" className="hidden" onChange={uploadFile} disabled={uploading} />
					</label>
				)}
			</div>

			<div className="p-4 space-y-2">
				{agentFiles.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-10 text-center">
						<div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
							<Paperclip size={20} className="text-gray-600" />
						</div>
						<p className="text-sm text-gray-600">Aucun fichier joint</p>
						{isAgent && (
							<p className="text-xs text-gray-700 mt-1">Cliquez sur "Ajouter" pour joindre un fichier</p>
						)}
					</div>
				) : (
					agentFiles.map((f) => (
						<div
							key={f.id}
							className="flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/20 rounded-xl px-3 py-2.5 transition-all group"
						>
							<div className="flex items-center gap-3 min-w-0">
								<div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
									<Paperclip size={13} className="text-emerald-400" />
								</div>
								<p className="text-sm text-gray-300 truncate font-medium">{f.fichier}</p>
							</div>
							<div className="flex items-center gap-1.5 shrink-0 ml-2">
								<button
									onClick={() => downloadFile(f.fichier)}
									title="Télécharger"
									className="w-8 h-8 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-500 hover:text-emerald-300 flex items-center justify-center transition-all"
								>
									<Download size={14} />
								</button>
								{isAgent && (
									<button
										onClick={() => deleteFile(f.id)}
										title="Supprimer"
										className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 flex items-center justify-center transition-all"
									>
										<Trash2 size={14} />
									</button>
								)}
							</div>
						</div>
					))
				)}
			</div>

			{totalPages > 1 && (
				<div className="px-4 pb-4 flex items-center justify-center gap-2">
					<button
						disabled={page === 0}
						onClick={() => onPageChange(page - 1)}
						className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
					>
						<ChevronLeft size={14} />
					</button>
					<span className="text-xs text-gray-500 font-medium px-2">
						{page + 1} / {Math.max(totalPages, 1)}
					</span>
					<button
						disabled={page + 1 >= totalPages}
						onClick={() => onPageChange(page + 1)}
						className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
					>
						<ChevronRight size={14} />
					</button>
				</div>
			)}
		</div>
	);
}