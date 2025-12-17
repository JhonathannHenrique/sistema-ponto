// src/utils/pontoUtils.js

export const formatarData = (iso) => new Date(iso).toLocaleString('pt-BR');

export const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

// Coleta avançada de dados
export const obterDadosCompletos = async () => {
  const nav = navigator;
  const win = window;
  
  const info = {
    timestamp: new Date().toISOString(),
    userAgent: nav.userAgent,
    plataforma: nav.platform,
    navegador: nav.appName,
    idioma: nav.language,
    memoriaRAM: nav.deviceMemory ? `${nav.deviceMemory} GB` : 'N/A',
    nucleosCPU: nav.hardwareConcurrency || 'N/A',
  };

  // Detectar dispositivo simplificado para brevidade
  const ua = nav.userAgent;
  info.dispositivoInfo = { marca: 'Desconhecida', modelo: 'Desconhecido', tipo: 'desktop' };
  
  if (/iPhone|iPad|iPod/i.test(ua)) {
    info.dispositivoInfo.marca = 'Apple';
    info.dispositivoInfo.tipo = 'mobile';
  } else if (/Android/i.test(ua)) {
    info.dispositivoInfo.marca = 'Android';
    info.dispositivoInfo.tipo = 'mobile';
  } else if (/Windows/i.test(ua)) info.dispositivoInfo.marca = 'Microsoft';

  // Tela
  info.tela = {
    largura: win.screen.width,
    altura: win.screen.height,
    touchScreen: nav.maxTouchPoints > 0
  };

  // Bateria
  if (nav.getBattery) {
    try {
      const bat = await nav.getBattery();
      info.bateria = {
        nivel: Math.round(bat.level * 100),
        nivelTexto: `${Math.round(bat.level * 100)}%`,
        carregando: bat.charging,
        carregandoTexto: bat.charging ? 'Sim' : 'Não'
      };
    } catch (e) { info.bateria = { erro: 'Indisponível', nivel: 0 }; }
  } else { info.bateria = { erro: 'API não suportada', nivel: 0 }; }

  // Rede e IP
  info.rede = {};
  try {
    const res = await fetch('https://ipapi.co/json/', { timeout: 5000 });
    if (res.ok) {
      const data = await res.json();
      info.rede.ip = data.ip;
      info.rede.provedor = data.org;
      info.rede.cidade = data.city;
      info.rede.estado = data.region;
    }
  } catch (e) { info.rede.ip = 'Não detectado'; }

  return info;
};