import { 
  Camera, Flame, Lock, Network, Server, Zap, Wifi, Globe, 
  Smartphone, Fingerprint, Activity, Scan, Monitor, 
  Cpu, CheckCircle2, Shield, Wrench, MessageSquare, Image, Users,
  LucideIcon
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  Camera, Flame, Lock, Network, Server, Zap, Wifi, Globe, 
  Smartphone, Fingerprint, Activity, Scan, Monitor, 
  Cpu, CheckCircle2, Shield, Wrench, MessageSquare, Image, Users
};

export const getIcon = (name: string): LucideIcon => {
  return iconMap[name] || Shield;
};
