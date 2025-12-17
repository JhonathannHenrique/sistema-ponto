// src/pages/Login.jsx
import React, { useState } from 'react';
import { Send, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react'; // Ícone Send = Avião de Papel

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e && e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            const usuarios = {
                'admin': { senha: 'admin123', tipo: 'admin', nome: 'Administrador' },
                'jhonathan': { senha: 'jhonathan123', tipo: 'colaborador', nome: 'Jhonathan Henrique' },
                'laura': { senha: 'laura123', tipo: 'colaborador', nome: 'Laura Geronimo' }
            };

            const u = usuarios[username.toLowerCase().trim()];

            if (u && u.senha === password) {
                onLogin({ username: username.toLowerCase(), ...u });
            } else {
                setError('Usuário ou senha incorretos.');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen flex w-full bg-white">

            <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center">
                {/* Efeitos de Fundo */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900 via-violet-900 to-black opacity-90 z-10"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-20 text-white p-12 max-w-lg text-center">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-full shadow-2xl mb-8 inline-flex items-center justify-center w-32 h-32">
                        {/* Ícone Avião de Papel */}
                        <Send className="w-16 h-16 text-purple-300 ml-1 mt-1" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
                        Gestão de Ponto Inteligente
                    </h1>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        Decole sua produtividade. Controle sua jornada de trabalho com precisão, segurança e geolocalização em tempo real.
                    </p>

                    <div className="mt-12 flex items-center justify-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-400" /> Dados Seguros
                        </div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div>Acesso Rápido</div>
                    </div>
                </div>
            </div>

            {/* LADO DIREITO - FORMULÁRIO */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="max-w-md w-full">

                    <div className="text-center lg:text-left mb-10">
                        <div className="lg:hidden flex justify-center mb-4">
                            <div className="bg-purple-600 p-4 rounded-full shadow-lg">
                                <Send className="w-8 h-8 text-white ml-1 mt-1" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Bem-vindo de volta!</h2>
                        <p className="text-gray-500 mt-2">Por favor, insira suas credenciais para acessar.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Input Usuário */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Usuário</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm hover:border-gray-300"
                                    placeholder="Seu nome de usuário"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Input Senha */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Senha</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    className="block w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm hover:border-gray-300"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Mensagem de Erro */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-fade-in">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Botão de Login ROXO */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full group relative flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all shadow-lg hover:shadow-purple-500/30 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Acessar Sistema <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    {/* TERMINAL / GITBASH STYLE FOOTER */}
                    <div className="mt-8 rounded-xl overflow-hidden shadow-2xl bg-[#1e1e1e] font-mono text-xs border border-gray-800">

                        {/* Barra de Título do Terminal */}
                        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-black/50">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-red-600 transition-colors"></div>
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-yellow-600 transition-colors"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-green-600 transition-colors"></div>
                            <div className="ml-2 text-gray-400 select-none">MINGW64:/c/usuarios de teste</div>
                        </div>

                        {/* Conteúdo do Terminal */}
                        <div className="p-4 text-gray-300 leading-relaxed">

                            {/* Linha de Comando */}
                            <div>
                                <span className="text-[#00ff00]">user@sistema</span>
                                <span className="text-[#bd93f9]"> MINGW64 </span>
                                <span className="text-[#f1fa8c]">~/credentials</span>
                            </div>
                            <div className="mb-2">
                                <span className="text-gray-400">$</span> <span className="text-white">cat users.json</span>
                            </div>

                            {/* Saída (Output) - Lista de Usuários */}
                            <div className="pl-2 border-l-2 border-gray-700 ml-1 space-y-1 opacity-90">
                                <div className="flex gap-2">
                                    <span className="text-blue-400 font-bold">"admin":</span>
                                    <span className="text-green-300">"admin123"</span>,
                                    <span className="text-gray-500">// Acesso Total - Painel Empresarial</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-blue-400 font-bold">"jhonathan":</span>
                                    <span className="text-green-300">"jhonathan123"</span>
                                    <span className="text-gray-500">// Painel Colaborador</span>
                                </div>
                            </div>

                            {/* Cursor Piscando */}
                            <div className="mt-3">
                                <span className="text-[#00ff00]">user@sistema</span>
                                <span className="text-[#bd93f9]"> MINGW64 </span>
                                <span className="text-[#f1fa8c]">~/credentials</span>
                                <br />
                                <span className="text-gray-400">$</span> <span className="animate-pulse bg-gray-400 w-2 h-4 inline-block align-middle ml-1"></span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}