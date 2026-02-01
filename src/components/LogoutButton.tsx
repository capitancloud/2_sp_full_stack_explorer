import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-xs">Esci</span>
      </Button>
    </motion.div>
  );
};

export default LogoutButton;
