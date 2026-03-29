import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';

interface TicketReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTicket: any;
}

export const TicketReplyModal: React.FC<TicketReplyModalProps> = ({
  isOpen,
  onClose,
  selectedTicket,
}) => {
  return (
    <AnimatePresence>
      {isOpen && selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-2xl font-black text-foreground tracking-tight mb-2">Yanıtla: {selectedTicket.subject}</h3>
              <p className="text-sm text-muted-foreground mb-6">Talep ID: {selectedTicket.id}</p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                alert('Yanıt gönderildi!'); // Simulate reply
                onClose();
              }} className="space-y-4">
                <textarea 
                  rows={6}
                  required
                  placeholder="Yanıtınızı buraya yazın..."
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none text-foreground"
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="button"
                    variant="glass" 
                    onClick={onClose} 
                    className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit"
                    className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                  >
                    Yanıtı Gönder
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
