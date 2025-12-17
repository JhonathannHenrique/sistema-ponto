// src/pages/Colaborador.jsx
import React, { useState, useEffect } from 'react';
import { 
  LogOut, AlertTriangle, MapPin, Fingerprint, Calendar, 
  FileText, History, X, CheckCircle, AlertCircle 
} from 'lucide-react';
import { Modal, PaperClipIcon } from '../components/Shared';
import { obterDadosCompletos, fileToBase64, formatarData } from '../Utils/pontoUtils';

export default function Colaborador({ user, onLogout, registros, onSave }) {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Estado para Notificação (Toast)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Modais
  const [modalJustify, setModalJustify] = useState(false);
  const [modalAttach, setModalAttach] = useState(false);
  const [modalHistory, setModalHistory] = useState(false);
  const [modalDetails, setModalDetails] = useState(false);
  
  const [viewRecord, setViewRecord] = useState(null);
  const [formData, setFormData] = useState({ data: '', hora: '', motivo: '', arquivo: null, descricao: '' });

  const meusRegs = registros.filter(r => r.usuario === user.username);
  const ultimoRegistro = meusRegs.length > 0 ? meusRegs[meusRegs.length - 1] : null;

  // Função auxiliar para mostrar notificação
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 4000); // Some após 4 segundos
  };

  // Relógio em Tempo Real
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer Cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  // Verificar Cooldown inicial
  useEffect(() => {
    const regsNormais = meusRegs.filter(r => r.tipo === 'normal').sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (regsNormais.length > 0) {
      const diff = Math.floor((Date.now() - new Date(regsNormais[0].timestamp).getTime()) / 1000);
      if (diff < 60) setCooldown(60 - diff);
    }
  }, []);

  const baterPonto = async () => {
    if (cooldown > 0) return;
    setLoading(true);

    if (!("geolocation" in navigator)) { 
      setLoading(false); 
      return showToast('Seu navegador não suporta geolocalização.', 'error'); 
    }

    const dadosPromise = obterDadosCompletos();
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const dados = await dadosPromise;
      const novo = {
        id: Date.now(),
        usuario: user.username,
        nome: user.nome,
        timestamp: new Date().toISOString(),
        tipo: 'normal',
        status: 'valido',
        gps: {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          precisao: pos.coords.accuracy,
          velocidade: pos.coords.speed
        },
        dadosTecnicos: dados
      };
      onSave([...registros, novo]);
      setLoading(false);
      setCooldown(60);
      showToast('Ponto registrado com sucesso!', 'success');
    }, (err) => { 
      setLoading(false); 
      showToast('Erro ao obter localização: ' + err.message, 'error'); 
    });
  };

  const enviarForm = async (e, tipo) => {
    e.preventDefault();
    setLoading(true);
    const dados = await obterDadosCompletos();
    let anexo = null;
    
    if (formData.arquivo) {
      if (formData.arquivo.size > 500000) { 
        setLoading(false); 
        return showToast('O arquivo deve ter no máximo 500KB.', 'error'); 
      }
      anexo = { nome: formData.arquivo.name, dados: await fileToBase64(formData.arquivo), tipo: formData.arquivo.type };
    }

    const novo = {
      id: Date.now(),
      usuario: user.username,
      nome: user.nome,
      timestamp: tipo === 'manual' ? new Date(`${formData.data}T${formData.hora}`).toISOString() : new Date().toISOString(),
      tipo: tipo,
      status: 'pendente',
      justificativa: formData.motivo,
      descricao: formData.descricao,
      anexo: anexo,
      gps: null,
      dadosTecnicos: { ...dados, nota: tipo }
    };

    onSave([...registros, novo]);
    setLoading(false);
    setModalJustify(false);
    setModalAttach(false);
    setFormData({ data: '', hora: '', motivo: '', arquivo: null, descricao: '' });
    showToast('Solicitação enviada com sucesso!', 'success');
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col relative overflow-hidden">
      
      {/* NOTIFICAÇÃO TOAST (MODERNA) */}
      {toast.show && (
        <div className={`
          absolute top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border animate-bounce-in
          ${toast.type === 'success' 
            ? 'bg-white/90 border-green-200 text-green-800' 
            : 'bg-white/90 border-red-200 text-red-800'
          }
        `}>
          <div className={`p-1 rounded-full ${toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          </div>
          <span className="font-medium text-sm">{toast.message}</span>
          <button onClick={() => setToast({...toast, show: false})} className="ml-2 opacity-50 hover:opacity-100"><X size={16}/></button>
        </div>
      )}

      {/* HEADER MINIMALISTA */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-start z-10">
        <div>
          <h2 className="font-bold text-2xl text-gray-800">Olá, {user.nome.split(' ')[0]}</h2>
          <p className="text-sm text-purple-600 font-medium">@{user.username}</p>
        </div>
        <button onClick={onLogout} className="bg-white p-2 rounded-full shadow-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition">
          <LogOut size={20} />
        </button>
      </header>

      {/* CENTRO - RELÓGIO */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-0">
        {/* Círculo decorativo fundo */}
        <div className="absolute w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

        <div className="text-center z-10">
          <div className="text-7xl lg:text-9xl font-bold text-gray-800 tracking-tighter tabular-nums">
            {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-2xl text-gray-400 font-light mt-2">
            {currentTime.toLocaleTimeString('pt-BR', { second: '2-digit' })}s
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-purple-600 bg-purple-50 px-4 py-2 rounded-full inline-flex font-medium">
            <Calendar size={16} />
            {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          
          {/* Card Último Registro */}
          {ultimoRegistro && (
            <div className="mt-8 bg-white/60 backdrop-blur-sm border border-white p-4 rounded-2xl shadow-sm max-w-xs mx-auto animate-fade-in-up">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Último Registro</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${ultimoRegistro.tipo === 'normal' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                <span className="text-gray-800 font-semibold">{formatarData(ultimoRegistro.timestamp)}</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* RODAPÉ - AÇÕES E BOTÃO PRINCIPAL */}
      <footer className="relative z-10 pb-8 pt-4 px-6">
        <div className="flex items-end justify-between max-w-md mx-auto relative">
          
          {/* Botão Esquerda: Justificar */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <button onClick={() => setModalJustify(true)} className="w-12 h-12 bg-white rounded-full shadow-lg text-orange-500 flex items-center justify-center hover:scale-110 transition border border-gray-100">
              <AlertTriangle size={20} />
            </button>
            <span className="text-xs font-medium text-gray-500">Justificar</span>
          </div>

          {/* BOTÃO PRINCIPAL CENTRAL (REDONDO) */}
          <div className="relative -top-2 mx-4">
            {/* Efeito de Pulse Atrás */}
            {cooldown === 0 && !loading && (
              <span className="absolute inset-0 rounded-full bg-purple-400 opacity-30 animate-ping"></span>
            )}
            
            <button 
              onClick={baterPonto} 
              disabled={cooldown > 0 || loading}
              className={`
                w-24 h-24 rounded-full shadow-2xl shadow-purple-500/40 flex flex-col items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95
                ${cooldown > 0 
                  ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-br from-purple-600 to-pink-600'
                }
              `}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              ) : cooldown > 0 ? (
                <span className="text-2xl font-bold">{cooldown}</span>
              ) : (
                <Fingerprint size={40} strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* Botão Direita: Histórico */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <button onClick={() => setModalHistory(true)} className="w-12 h-12 bg-white rounded-full shadow-lg text-purple-600 flex items-center justify-center hover:scale-110 transition border border-gray-100">
              <History size={20} />
            </button>
            <span className="text-xs font-medium text-gray-500">Histórico</span>
          </div>

        </div>

        {/* Link Pequeno para Atestado */}
        <div className="text-center mt-4">
            <button onClick={() => setModalAttach(true)} className="text-xs text-gray-400 hover:text-purple-600 flex items-center justify-center gap-1 mx-auto transition">
                <PaperClipIcon className="w-3 h-3"/> Enviar Atestado / Documento
            </button>
        </div>
      </footer>

      {/* ================= MODAIS ================= */}

      {/* Modal Histórico (Estilizado) */}
      <Modal isOpen={modalHistory} onClose={() => setModalHistory(false)} title="Meu Histórico">
        <div className="space-y-4">
            {meusRegs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">Nenhum registro encontrado.</div>
            ) : (
                meusRegs.slice().reverse().map(reg => (
                    <div key={reg.id} onClick={() => { setViewRecord(reg); setModalDetails(true); }} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${reg.tipo === 'normal' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {reg.tipo === 'normal' ? <MapPin size={16} /> : <FileText size={16} />}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{new Date(reg.timestamp).toLocaleDateString()}</p>
                                <p className="text-xs text-gray-500">{new Date(reg.timestamp).toLocaleTimeString()} • {reg.tipo}</p>
                            </div>
                        </div>
                        <div className="text-gray-400">
                             👉
                        </div>
                    </div>
                ))
            )}
        </div>
      </Modal>

      {/* Modal Justificativa */}
      <Modal isOpen={modalJustify} onClose={() => setModalJustify(false)} title="Justificar Ausência/Atraso">
        <form onSubmit={e => enviarForm(e, 'manual')} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Data</label>
                <input type="date" required className="border-2 border-gray-100 p-3 rounded-xl w-full focus:border-purple-500 outline-none" onChange={e => setFormData({...formData, data: e.target.value})} />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Hora</label>
                <input type="time" required className="border-2 border-gray-100 p-3 rounded-xl w-full focus:border-purple-500 outline-none" onChange={e => setFormData({...formData, hora: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Motivo</label>
            <textarea placeholder="Escreva aqui..." rows={3} required className="border-2 border-gray-100 p-3 rounded-xl w-full focus:border-purple-500 outline-none" onChange={e => setFormData({...formData, motivo: e.target.value})} />
          </div>
          <button className="w-full bg-purple-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-purple-700 transition">Enviar Justificativa</button>
        </form>
      </Modal>

      {/* Modal Anexo */}
      <Modal isOpen={modalAttach} onClose={() => setModalAttach(false)} title="Enviar Documento">
        <form onSubmit={e => enviarForm(e, 'anexo')} className="space-y-4">
          <input type="text" placeholder="Descrição (Ex: Atestado Médico)" className="border-2 border-gray-100 p-3 rounded-xl w-full focus:border-purple-500 outline-none" onChange={e => setFormData({...formData, descricao: e.target.value})} />
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center">
             <input type="file" required className="w-full text-sm text-gray-500" onChange={e => setFormData({...formData, arquivo: e.target.files[0]})} />
             <p className="text-xs text-gray-400 mt-2">Max: 500KB (Imagem ou PDF)</p>
          </div>
          <button className="w-full bg-purple-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-purple-700 transition">Enviar Documento</button>
        </form>
      </Modal>

      {/* Modal Detalhes */}
      <Modal isOpen={modalDetails} onClose={() => setModalDetails(false)} title="Detalhes do Ponto">
        {viewRecord && (
           <div className="space-y-4">
             <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <p className="text-3xl font-bold text-purple-700">{new Date(viewRecord.timestamp).toLocaleTimeString()}</p>
                <p className="text-sm text-purple-400">{new Date(viewRecord.timestamp).toLocaleDateString()}</p>
             </div>
             
             <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between border-b py-2">
                    <span>Tipo:</span>
                    <span className="font-bold uppercase">{viewRecord.tipo}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                    <span>Status:</span>
                    <span className="font-bold uppercase">{viewRecord.status}</span>
                </div>
                {viewRecord.justificativa && (
                     <div className="py-2">
                        <span className="block mb-1">Justificativa:</span>
                        <p className="bg-gray-100 p-2 rounded-lg italic">"{viewRecord.justificativa}"</p>
                    </div>
                )}
             </div>

             {viewRecord.gps && (
                 <a href={`https://maps.google.com/?q=${viewRecord.gps.latitude},${viewRecord.gps.longitude}`} target="_blank" className="block w-full text-center bg-blue-50 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-100 transition">
                    Ver Localização no Mapa
                 </a>
             )}
           </div>
        )}
      </Modal>
    </div>
  );
}