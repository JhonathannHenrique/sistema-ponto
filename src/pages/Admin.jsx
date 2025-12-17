// src/pages/Admin.jsx
import React, { useState } from 'react';
import { 
  Clock, LogOut, FileText, MapPin, Smartphone, Edit, 
  Info, AlertTriangle, Search, CheckCircle, Users, Activity,
  Wifi, Battery, Globe, Terminal
} from 'lucide-react';
import { Modal, PaperClipIcon } from '../components/Shared';
import { formatarData } from '../Utils/pontoUtils';

export default function Admin({ user, onLogout, registros, onSave }) {
  const [modalDetails, setModalDetails] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalPreview, setModalPreview] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  
  const [viewRecord, setViewRecord] = useState(null);
  const [editData, setEditData] = useState({ id: null, timestamp: '', motivo: '' });
  const [previewFile, setPreviewFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cálculos para os Cards de KPI
  const stats = {
    total: registros.length,
    gps: registros.filter(r => r.tipo === 'normal').length,
    manual: registros.filter(r => r.tipo === 'manual').length,
    editados: registros.filter(r => r.status === 'editado').length
  };

  // Filtragem
  const registrosFiltrados = registros.filter(r => 
    r.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice().reverse();

  const gerarPDF = () => {
    const w = window.open('', '', 'width=900,height=600');
    const html = `
      <html><head><title>Relatório Detalhado</title>
      <style>body{font-family:sans-serif;padding:30px;color:#333}h1{color:#6d28d9;border-bottom:2px solid #ddd;padding-bottom:10px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #e5e7eb;padding:12px;text-align:left;font-size:12px}th{background:#f9fafb;font-weight:bold;color:#4b5563}.tag{padding:4px 8px;border-radius:12px;font-size:10px;font-weight:bold;color:white}.gps{background:#10b981}.manual{background:#f59e0b}.edit{background:#ef4444}</style>
      </head><body>
      <h1>Relatório de Frequência</h1>
      <p>Gerado em: ${new Date().toLocaleString()}</p>
      <table><thead><tr><th>Colaborador</th><th>Data/Hora</th><th>Tipo</th><th>Local/IP</th></tr></thead>
      <tbody>${registrosFiltrados.map(r => `
        <tr>
          <td><b>${r.nome}</b><br><span style="color:#666">@${r.usuario}</span></td>
          <td>${formatarData(r.timestamp)} ${r.status === 'editado' ? '<span class="tag edit">EDITADO</span>' : ''}</td>
          <td><span class="tag ${r.tipo === 'normal' ? 'gps' : 'manual'}">${r.tipo.toUpperCase()}</span></td>
          <td>
            ${r.gps ? `Lat: ${r.gps.latitude.toFixed(5)}<br>Lon: ${r.gps.longitude.toFixed(5)}` : (r.dadosTecnicos?.rede?.ip || '-')}
          </td>
        </tr>
      `).join('')}</tbody></table>
      <script>window.onload=function(){window.print()}</script></body></html>`;
    w.document.write(html);
    w.document.close();
  };

  const salvarEdicao = () => {
    if (!editData.motivo) return alert('Motivo obrigatório');
    const novos = registros.map(r => r.id === editData.id ? {
      ...r, 
      timestamp: new Date(editData.timestamp).toISOString(), 
      status: 'editado', 
      historicoEdicao: { original: r.timestamp, editor: user.nome, motivo: editData.motivo, data: new Date().toISOString() }
    } : r);
    onSave(novos);
    setModalEdit(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* HEADER */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg text-white shadow-lg shadow-purple-200">
            <Clock size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Painel Admin</h1>
            <p className="text-xs text-gray-500 font-medium">Visão Geral Corporativa</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full border border-transparent focus-within:border-purple-300 focus-within:bg-white transition-all">
                <Search size={16} className="text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="bg-transparent border-none outline-none text-sm ml-2 w-48 text-gray-700 placeholder-gray-400"
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <button onClick={gerarPDF} className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-purple-100 transition">
                <FileText size={16}/> <span className="hidden sm:inline">Relatório</span>
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <button onClick={onLogout} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition" title="Sair">
                <LogOut size={20}/>
            </button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition cursor-default">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24}/></div>
                <div><p className="text-sm text-gray-500 font-medium">Total Registros</p><p className="text-2xl font-bold text-gray-800">{stats.total}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition cursor-default">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={24}/></div>
                <div><p className="text-sm text-gray-500 font-medium">GPS Validado</p><p className="text-2xl font-bold text-gray-800">{stats.gps}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition cursor-default">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><AlertTriangle size={24}/></div>
                <div><p className="text-sm text-gray-500 font-medium">Manuais</p><p className="text-2xl font-bold text-gray-800">{stats.manual}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition cursor-default">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Activity size={24}/></div>
                <div><p className="text-sm text-gray-500 font-medium">Editados</p><p className="text-2xl font-bold text-gray-800">{stats.editados}</p></div>
            </div>
        </div>

        {/* TABELA */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
             <h2 className="font-bold text-gray-700">Fluxo de Batidas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                    <th className="px-6 py-4">Colaborador</th>
                    <th className="px-6 py-4">Horário</th>
                    <th className="px-6 py-4">Dados Técnicos</th>
                    <th className="px-6 py-4">Localização</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {registrosFiltrados.map(reg => (
                  <tr key={reg.id} className="hover:bg-purple-50/30 transition group">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-purple-200">
                                {reg.nome.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{reg.nome}</p>
                                <p className="text-xs text-gray-400 font-medium">@{reg.usuario}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-700">{formatarData(reg.timestamp).split(',')[1]}</div>
                        <div className="text-xs text-gray-400">{formatarData(reg.timestamp).split(',')[0]}</div>
                        {reg.status === 'editado' && <span className="mt-1 inline-block px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold">EDITADO</span>}
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-xs text-gray-500 flex flex-col gap-1">
                             <div className="flex items-center gap-1"><Globe size={12}/> IP: {reg.dadosTecnicos?.rede?.ip || '?'}</div>
                             <div className="flex items-center gap-1"><Smartphone size={12}/> {reg.dadosTecnicos?.dispositivoInfo?.modelo}</div>
                        </div>
                    </td>
                    
                    {/* AQUI ESTÁ A ALTERAÇÃO: Link direto para o Mapa */}
                    <td className="px-6 py-4">
                        {reg.gps ? (
                             <a 
                                href={`https://maps.google.com/?q=${reg.gps.latitude},${reg.gps.longitude}`} 
                                target="_blank" 
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 inline-flex items-center gap-1.5 transition-colors"
                             >
                                <MapPin size={12}/> Ver no Mapa
                             </a>
                        ) : (
                            <span className="text-xs text-gray-400 italic">Sem GPS</span>
                        )}
                    </td>

                    <td className="px-6 py-4 text-right">
                        <button onClick={() => { setViewRecord(reg); setShowRawData(false); setModalDetails(true); }} className="px-3 py-1 bg-gray-100 hover:bg-purple-100 hover:text-purple-600 rounded text-xs font-bold transition">
                            Ver Detalhes
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ================= MODAIS ================= */}

      {/* MODAL DETALHES EMPRESARIAIS (RAIO-X COMPLETO) */}
      <Modal isOpen={modalDetails} onClose={() => setModalDetails(false)} title="Raio-X do Registro" size="xl">
        {viewRecord && (
          <div className="space-y-6 text-sm">
             
             {/* Cabeçalho do Colaborador */}
             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xl">{viewRecord.nome.charAt(0)}</div>
                     <div>
                         <h3 className="font-bold text-lg text-gray-800">{viewRecord.nome}</h3>
                         <div className="flex gap-2 text-gray-500 text-xs">
                             <span>@{viewRecord.usuario}</span> • <span>ID: {viewRecord.id}</span>
                         </div>
                     </div>
                 </div>
                 <div className="text-right">
                     <p className="text-2xl font-bold text-gray-800">{new Date(viewRecord.timestamp).toLocaleTimeString()}</p>
                     <p className="text-xs text-gray-400">{new Date(viewRecord.timestamp).toLocaleDateString()}</p>
                 </div>
             </div>

             {/* 1. SEÇÃO DE GEOLOCALIZAÇÃO (O mais importante) */}
             <div className="border border-blue-100 rounded-xl overflow-hidden">
                <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600"/>
                    <h4 className="font-bold text-blue-800">Geolocalização (GPS)</h4>
                </div>
                <div className="p-4 bg-white grid grid-cols-2 gap-4">
                    {viewRecord.gps ? (
                        <>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Latitude</p>
                                <p className="font-mono text-gray-800 font-bold">{viewRecord.gps.latitude}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Longitude</p>
                                <p className="font-mono text-gray-800 font-bold">{viewRecord.gps.longitude}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Precisão (Raio)</p>
                                <p className="text-gray-800">{viewRecord.gps.precisao?.toFixed(1)} metros</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Velocidade</p>
                                <p className="text-gray-800">{viewRecord.gps.velocidade || 0} m/s</p>
                            </div>
                            <div className="col-span-2 mt-2">
                                <a href={`https://maps.google.com/?q=${viewRecord.gps.latitude},${viewRecord.gps.longitude}`} target="_blank" className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                                    Abrir no Google Maps
                                </a>
                            </div>
                        </>
                    ) : (
                        <div className="col-span-2 text-center text-gray-400 py-4 italic">Dados de GPS não capturados (Registro Manual ou PC)</div>
                    )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* 2. DADOS DE REDE E IP */}
                 <div className="border border-purple-100 rounded-xl overflow-hidden h-full">
                    <div className="bg-purple-50 px-4 py-2 border-b border-purple-100 flex items-center gap-2">
                        <Wifi size={16} className="text-purple-600"/>
                        <h4 className="font-bold text-purple-800">Rede & Conexão</h4>
                    </div>
                    <div className="p-4 bg-white space-y-3">
                        <div className="flex justify-between border-b border-dashed pb-2">
                            <span className="text-gray-500">Endereço IP</span>
                            <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2 rounded">{viewRecord.dadosTecnicos?.rede?.ip || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed pb-2">
                            <span className="text-gray-500">Provedor (ISP)</span>
                            <span className="font-medium text-gray-800">{viewRecord.dadosTecnicos?.rede?.provedor || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed pb-2">
                            <span className="text-gray-500">Localização IP</span>
                            <span className="font-medium text-gray-800">
                                {viewRecord.dadosTecnicos?.rede?.cidade}/{viewRecord.dadosTecnicos?.rede?.estado}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Tipo Conexão</span>
                            <span className="font-medium text-gray-800">{viewRecord.dadosTecnicos?.rede?.tipoConexao || 'N/A'}</span>
                        </div>
                    </div>
                 </div>

                 {/* 3. DISPOSITIVO E HARDWARE */}
                 <div className="border border-gray-200 rounded-xl overflow-hidden h-full">
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                        <Smartphone size={16} className="text-gray-600"/>
                        <h4 className="font-bold text-gray-800">Hardware & Sistema</h4>
                    </div>
                    <div className="p-4 bg-white space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Modelo</span>
                            <span className="font-bold text-gray-800">{viewRecord.dadosTecnicos?.dispositivoInfo?.marca} {viewRecord.dadosTecnicos?.dispositivoInfo?.modelo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Sistema (OS)</span>
                            <span className="text-gray-800">{viewRecord.dadosTecnicos?.plataforma}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Navegador</span>
                            <span className="text-gray-800">{viewRecord.dadosTecnicos?.navegador}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Bateria</span>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{width: `${viewRecord.dadosTecnicos?.bateria?.nivel}%`}}></div>
                                </div>
                                <span className="text-xs font-bold">{viewRecord.dadosTecnicos?.bateria?.nivelTexto}</span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Tela</span>
                            <span className="text-gray-800 font-mono text-xs">{viewRecord.dadosTecnicos?.tela?.largura}x{viewRecord.dadosTecnicos?.tela?.altura}</span>
                        </div>
                    </div>
                 </div>
             </div>

             {/* 4. DADOS BRUTOS (USER AGENT) */}
             <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto border border-gray-800 shadow-inner">
                 <div className="flex items-center gap-2 text-gray-400 mb-2 border-b border-gray-700 pb-2">
                    <Terminal size={14}/> <span>User Agent String</span>
                 </div>
                 <p className="break-all">{viewRecord.dadosTecnicos?.userAgent}</p>
             </div>
             
             {/* BOTÕES DE AÇÃO DO MODAL */}
             <div className="flex gap-3 pt-2">
                 {viewRecord.tipo !== 'anexo' && (
                     <button onClick={() => { 
                         setModalDetails(false);
                         const d = new Date(viewRecord.timestamp); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                         setEditData({ id: viewRecord.id, timestamp: d.toISOString().slice(0, 16), motivo: '' }); 
                         setModalEdit(true); 
                     }} className="flex-1 bg-purple-100 text-purple-700 py-3 rounded-xl font-bold hover:bg-purple-200 transition">
                         Editar Registro
                     </button>
                 )}
                 {viewRecord.anexo && (
                     <button onClick={() => { setPreviewFile(viewRecord.anexo); setModalPreview(true); }} className="flex-1 bg-indigo-100 text-indigo-700 py-3 rounded-xl font-bold hover:bg-indigo-200 transition">
                        Ver Anexo
                     </button>
                 )}
             </div>

             {/* VISUALIZAÇÃO JSON (OPCIONAL) */}
             {showRawData && (
                 <div className="mt-4 p-4 bg-gray-100 rounded-xl text-xs font-mono overflow-auto max-h-60 border border-gray-200">
                     <pre>{JSON.stringify(viewRecord, null, 2)}</pre>
                 </div>
             )}

          </div>
        )}
      </Modal>

      {/* Modal Editar (Mantido igual) */}
      <Modal isOpen={modalEdit} onClose={() => setModalEdit(false)} title="Auditoria: Editar Registro">
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-sm text-amber-800 flex gap-3">
             <AlertTriangle size={20} className="shrink-0"/> 
             <div><strong>Atenção:</strong> A alteração será registrada permanentemente no histórico de auditoria.</div>
          </div>
          <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nova Data/Hora</label>
              <input type="datetime-local" className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-purple-500 transition" value={editData.timestamp} onChange={e => setEditData({...editData, timestamp: e.target.value})} />
          </div>
          <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Motivo da Edição</label>
              <textarea placeholder="Justifique..." className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-purple-500 transition" rows={3} value={editData.motivo} onChange={e => setEditData({...editData, motivo: e.target.value})} />
          </div>
          <button onClick={salvarEdicao} className="w-full bg-purple-600 text-white p-3 rounded-xl font-bold hover:bg-purple-700 transition">Confirmar Alteração</button>
        </div>
      </Modal>

      {/* Modal Preview Anexo */}
      <Modal isOpen={modalPreview} onClose={() => setModalPreview(false)} title="Anexo" size="lg">
        {previewFile && (
           <div className="text-center">
             <div className="p-2 bg-gray-100 rounded-lg mb-4 text-xs text-gray-500 break-all">{previewFile.nome}</div>
             {previewFile.tipo.startsWith('image/') ? <img src={previewFile.dados} className="max-w-full max-h-[500px] mx-auto rounded shadow-lg"/> : <iframe src={previewFile.dados} className="w-full h-96 border rounded-lg"/>}
             <a href={previewFile.dados} download={previewFile.nome} className="inline-block mt-6 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-purple-700 transition">Baixar Arquivo</a>
           </div>
        )}
      </Modal>

    </div>
  );
}