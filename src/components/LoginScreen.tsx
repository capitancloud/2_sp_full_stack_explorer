import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginScreen = () => {
  const { login } = useAuth();
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(code);
      if (!success) {
        setError('Codice di accesso non valido');
        setCode('');
      }
    } catch {
      setError('Si è verificato un errore');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background overflow-hidden relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-frontend/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-backend/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-central/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-panel border border-border/50 rounded-3xl p-8 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20"
            >
              <Lock className="w-10 h-10 text-primary" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-display font-bold text-foreground mb-2"
            >
              Full Stack Map
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-sm"
            >
              Inserisci il codice di accesso per continuare
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="relative">
              <Input
                type={showCode ? 'text' : 'password'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Codice di accesso"
                className="h-12 pl-4 pr-12 bg-secondary/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showCode ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={!code.trim() || isLoading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Accedi'
              )}
            </Button>
          </motion.form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-muted-foreground mt-6"
          >
            Il codice è protetto con crittografia SHA-256
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
