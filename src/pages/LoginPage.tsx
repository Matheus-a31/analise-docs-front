import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { FileText, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || '';
const IS_PRODUCTION = import.meta.env.PROD;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithDevProfile } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      showToast({
        type: 'error',
        title: 'Falha na autenticação Google',
        description: 'Nenhuma credencial retornada pelo Google OAuth.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithGoogle({ credential: credentialResponse.credential });
      showToast({
        type: 'success',
        title: 'Bem-vindo(a) à Jus Digital!',
        description: 'Login com Google realizado com sucesso.',
      });
      navigate('/app/documentos', { replace: true });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro ao autenticar com Google',
        description:
          error instanceof Error ? error.message : 'Verifique as configurações do OAuth.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDevLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithDevProfile();
      showToast({
        type: 'success',
        title: 'Sessão iniciada com sucesso!',
        description: 'Conectado como Dra. Mariana Gomes.',
      });
      navigate('/app/documentos', { replace: true });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Falha ao iniciar sessão',
        description:
          error instanceof Error
            ? error.message
            : 'Certifique-se de que o Back-end está rodando na porta 3000.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F9FAFB]">
      {/* Left Brand Panel */}
      <div className="md:w-[44%] bg-[#2E9E5B] text-white p-8 md:p-14 flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg text-white shadow-sm">
              j
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight block leading-none">
                Jus Digital
              </span>
              <span className="text-xs text-white/80">
                Seu escritório muito mais inteligente com IA
              </span>
            </div>
          </div>

          <div className="mt-14 md:mt-20 max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
              Gestão e análise jurídica de documentos com IA.
            </h1>
            <p className="mt-4 text-sm md:text-base text-white/85 leading-relaxed">
              Anexe contratos, petições, imagens ou relatórios e receba análises
              instantâneas geradas por Inteligência Artificial sob medida para sua
              instrução.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white/85">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white shrink-0" />
            <span>Acesso via Google OAuth</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-white shrink-0" />
            <span>Armazenamento AWS S3</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white shrink-0" />
            <span>Análise com GPT-4o-mini</span>
          </div>
        </div>
      </div>

      {/* Right Login Card Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[400px] bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Acesse sua conta
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Utilize sua conta Google para acessar seus documentos e análises.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {/* Official Google OAuth 2.0 Button when Client ID is provided */}
            {GOOGLE_CLIENT_ID ? (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    showToast({
                      type: 'error',
                      title: 'Erro no Google OAuth',
                      description: 'Não foi possível concluir o login com o Google.',
                    })
                  }
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="330"
                />
              </div>
            ) : null}

            {/* Show Dev/Demo button only in development or when Google Client ID is not configured */}
            {(!IS_PRODUCTION || !GOOGLE_CLIENT_ID) && (
              <button
                type="button"
                onClick={handleDevLogin}
                disabled={isSubmitting}
                data-testid="btn-google-login"
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium text-[14px] px-4 py-3 rounded-xl border border-gray-300 shadow-sm transition-all disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#2E9E5B]" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span>
                  {GOOGLE_CLIENT_ID
                    ? 'Entrar como Dra. Mariana Gomes (Demo)'
                    : 'Entrar com Google'}
                </span>
              </button>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-gray-400 leading-relaxed">
            Seus dados de perfil (foto, nome e e-mail) são sincronizados automaticamente
            na barra lateral.
          </p>
        </div>
      </div>
    </div>
  );
};
