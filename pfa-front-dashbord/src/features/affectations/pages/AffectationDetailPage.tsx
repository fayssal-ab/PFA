import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../components/layouts/DashboardLayout";

import api from "../../../lib/axiosInstance";

import {Reclamation, Commentaire, PieceJointe, ApiResponse} from "../../../types";

import { useAuth } from "../../../features/auth/hooks/useAuth";

import {ArrowLeft, Send, Paperclip, Download, User, Clock, MessageSquare, FileText} from "lucide-react";


export default function AffectationDetailPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [reclamation, setReclamation] = useState<Reclamation | null>(null);

  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);

  const [clientFiles, setClientFiles] = useState<PieceJointe[]>([]);

  const [agentFiles, setAgentFiles] = useState<PieceJointe[]>([]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const [sending, setSending] = useState(false);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      loadAll();
    }
  }, [id]);

  const loadAll = async () => {

    setLoading(true);

    try {

      await Promise.all([
        loadReclamation(),
        loadCommentaires(),
        loadClientFiles(),
        loadAgentFiles()
      ]);

    } catch (e) {

      console.error(e);

    } finally {

      setLoading(false);
    }
  };

  const loadReclamation = async () => {

    try {

      const res = await api.get<Reclamation>( `/reclamations/get-reclamation/${id}`);

      setReclamation(res.data);

    } catch (e) {

      console.error(e);
    }
  };

  const loadCommentaires = async () => {

    try {

      const res = await api.get<Commentaire[]>( `/commentaires/get-commentaires/${id}`);

      setCommentaires(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (e) {

      console.error(e);
    }
  };

  const loadClientFiles = async () => {

    try {

      const res =
        await api.get<ApiResponse<PieceJointe>>(`/piece-jointes/reclamation/${id}`,
          {
            params: {
              role: "client",
              page: 0,
              size: 20
            }
          }
        );

      setClientFiles(
        res.data?.content || []
      );

    } catch (e) {

      console.error(e);
    }
  };

  const loadAgentFiles = async () => {

    try {

      const res =
        await api.get<ApiResponse<PieceJointe>>(`/piece-jointes/reclamation/${id}`,
          {
            params: {
              role: "agent",
              page: 0,
              size: 20
            }
          }
        );

      setAgentFiles(
        res.data?.content || []
      );

    } catch (e) {

      console.error(e);
    }
  };

  const sendComment = async () => {

    if (!message.trim()) return;

    setSending(true);

    try {

      await api.post( "/commentaires/add-commentaire",
        {
          contenu: message,

          reclamation: {
            id
          },

          user: {
            id: user?.userId
          }
        }
      );

      setMessage("");

      await loadCommentaires();

    } catch (e) {

      console.error(e);

    } finally {

      setSending(false);
    }
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    setUploading(true);

    try {

      await api.post(`/piece-jointes/upload/${id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      await loadAgentFiles();

    } catch (e) {

      console.error(e);

    } finally {

      setUploading(false);
    }
  };
    const downloadFile = async ( filename?: string ) => {

        if (!filename) return;

         try {

        const response = await api.get( `/piece-jointes/download/${filename}`,
        {
            responseType: "blob"
        }
        );

        const url = window.URL.createObjectURL( new Blob([response.data]) );

        const link =document.createElement("a");

        link.href = url;

        link.setAttribute( "download", filename );

        document.body.appendChild(link);

        link.click();

        link.remove();

        } catch (e) {

        console.error(e);
        }
    };
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="w-8 h-8 border-[3px] border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="space-y-6">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <button
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

            <div className="flex-1">

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-gray-400 font-bold">
                  #{reclamation?.id}
                </span>

                <span className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-semibold">
                  {reclamation?.status?.status}
                </span>

                <span className="px-2 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-semibold">
                  {reclamation?.priority?.priority}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-[#1a1a2e] mb-3">
                {reclamation?.titre}
              </h1>

              <p className="text-sm text-gray-600 leading-relaxed">
                {reclamation?.description}
              </p>
            </div>

            <div className="space-y-2">

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User size={15} />
                {reclamation?.client?.user?.nom}
                {" "}
                {reclamation?.client?.user?.prenom}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={15} />
                {reclamation?.dateDepot
                  ? new Date(
                      reclamation.dateDepot
                    ).toLocaleString("fr-FR")
                  : ""}
              </div>

              <div className="inline-flex px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold">
                {reclamation?.categorie?.categorie}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

            <div className="flex items-center gap-2 mb-5">
              <FileText size={18} className="text-indigo-500" />

              <h2 className="text-lg font-bold text-[#1a1a2e]">
                Pièces jointes client
              </h2>
            </div>

            <div className="space-y-3">

              {clientFiles.length === 0 ? (

                <div className="text-sm text-gray-400">
                  Aucun fichier
                </div>

              ) : (

                clientFiles.map((f) => (

                  <div
                    key={f.id}
                    className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <Paperclip size={16} className="text-indigo-500" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#1a1a2e]">
                          {f.fichier}
                        </p>
                      </div>
                    </div>

                    <button
                        onClick={() => downloadFile(f.fichier)}
                         className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-indigo-50 flex items-center justify-center transition-colors"
                    >
                    <Download size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-2">
                <FileText size={18} className="text-emerald-500" />

                <h2 className="text-lg font-bold text-[#1a1a2e]">
                 Mes Pièces jointes 
                </h2>
              </div>

              <label className="h-10 px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium cursor-pointer hover:bg-indigo-700 transition-all flex items-center gap-2">

                <Paperclip size={15} />

                {uploading
                  ? "Upload..."
                  : "Ajouter"}

                <input
                  type="file"
                  className="hidden"
                  onChange={uploadFile}
                />
              </label>
            </div>

            <div className="space-y-3">

              {agentFiles.length === 0 ? (

                <div className="text-sm text-gray-400">
                  Aucun fichier
                </div>

              ) : (

                agentFiles.map((f) => (

                  <div
                    key={f.id}
                    className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Paperclip size={16} className="text-emerald-500" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#1a1a2e]">
                          {f.fichier}
                        </p>
                      </div>
                    </div>
                    <button
                        onClick={() => downloadFile(f.fichier)}
                         className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-indigo-50 flex items-center justify-center transition-colors"
                    >
                    <Download size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

       
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-500" />

            <h2 className="text-lg font-bold text-[#1a1a2e]">
              Commentaires
            </h2>
          </div>

          <div className="p-6 space-y-5 max-h-[500px] overflow-y-auto bg-gray-50/50">

            {commentaires.length === 0 ? (

              <div className="text-center text-sm text-gray-400 py-10">
                Aucun commentaire
              </div>

            ) : (

              commentaires.map((c) => {

                const isMine =
                  c.user?.id === user?.userId;

                return (

                  <div
                    key={c.id}
                    className={`flex ${
                      isMine
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                        isMine
                          ? "bg-indigo-600 text-white"
                          : "bg-white border border-gray-100 text-gray-700"
                      }`}
                    >

                      <div className="text-[11px] font-semibold mb-1 opacity-80">
                    {isMine
                     ? "Vous"
                     : `${c.user?.nom || ""} ${c.user?.prenom || ""} (${c.user?.role?.name || ""})`}

                      </div>

                      <p className="text-sm leading-relaxed">
                        {c.contenu}
                      </p>

                      <div className="text-[10px] opacity-70 mt-2">
                        {c.dateCommentaire
                          ? new Date(
                              c.dateCommentaire
                            ).toLocaleString("fr-FR")
                          : ""}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-gray-100 p-4 bg-white flex items-end gap-3">

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Écrire un commentaire..."
              rows={2}
              className="flex-1 border border-gray-200 rounded-2xl p-4 text-sm outline-none resize-none focus:border-indigo-400"
            />

            <button
              onClick={sendComment}
              disabled={sending}
              className="w-12 h-12 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center justify-center"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}