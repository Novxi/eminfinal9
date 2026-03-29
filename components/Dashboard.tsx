import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Shield, 
  Wrench, 
  FileText, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  History,
  User,
  Users,
  UserPlus,
  Trash2,
  Edit3,
  CreditCard,
  Smartphone,
  ArrowRight,
  X,
  MessageSquare,
  ShieldAlert,
  Save,
  Mail,
  Lock,
  Briefcase,
  ShieldCheck,
  Sparkles,
  RefreshCcw,
  Undo2,
  Package,
  Zap,
  Check
} from 'lucide-react';
import { SupportChat } from './admin/SupportChat';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { apiFetch } from '../lib/api';
import { getIcon } from '../lib/iconMap';

// Mock Data
const initialServices: any[] = [];

const supportTickets: any[] = [];

export const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState(initialServices);
  const [tickets, setTickets] = useState(supportTickets);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preparedQuotes, setPreparedQuotes] = useState<any[]>([]);
  const [pendingQuotes, setPendingQuotes] = useState<any[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isTicketReplyModalOpen, setIsTicketReplyModalOpen] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({
    serviceType: 'Akıllı Bina Otomasyonu',
    budget: '₺10,000 - ₺50,000',
    details: ''
  });
  
  // Warranty Extension State
  const [selectedService, setSelectedService] = useState<any>(null);
  const [warrantyStep, setWarrantyStep] = useState<'select' | 'payment' | 'success'>('select');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [purchasableServices, setPurchasableServices] = useState<any[]>([]);
  const [purchasedServices, setPurchasedServices] = useState<any[]>([]);
  const [selectedPurchasable, setSelectedPurchasable] = useState<any>(null);
  const [purchaseStep, setPurchaseStep] = useState<'select' | 'payment' | 'success'>('select');

  // Package Purchase State
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [packageStep, setPackageStep] = useState<'select' | 'payment' | 'success'>('select');

  // Quote Payment State
  const [selectedQuoteForPayment, setSelectedQuoteForPayment] = useState<any>(null);
  const [quotePaymentStep, setQuotePaymentStep] = useState<'payment' | 'success'>('payment');

  // Refund State
  const [refundRequests, setRefundRequests] = useState<any[]>([]);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedRefundItem, setSelectedRefundItem] = useState<any>(null);
  const [refundReason, setRefundReason] = useState('');
  const [payments, setPayments] = useState<any[]>([]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Yok';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('tr-TR');
  };

  const stats = useMemo(() => {
    if (!services || services.length === 0) {
      return {
        remainingWarranty: '0 Gün',
        lastMaintenance: 'Yok'
      };
    }

    const now = new Date();
    let maxRemainingDays = 0;
    let latestMaintenanceDate: Date | null = null;

    services.forEach(service => {
      if (service.warrantyEnd) {
        const wDate = new Date(service.warrantyEnd);
        const diffTime = wDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > maxRemainingDays) {
          maxRemainingDays = diffDays;
        }
      }

      if (service.lastMaintenance) {
        const mDate = new Date(service.lastMaintenance);
        if (!latestMaintenanceDate || mDate > latestMaintenanceDate) {
          latestMaintenanceDate = mDate;
        }
      }
    });

    return {
      remainingWarranty: `${maxRemainingDays > 0 ? maxRemainingDays : 0} Gün`,
      lastMaintenance: latestMaintenanceDate ? latestMaintenanceDate.toLocaleDateString('tr-TR') : 'Yok'
    };
  }, [services]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const packageId = params.get('packageId');

    if (tab === 'packages') {
      setActiveTab('packages');
      if (packageId && systemSettings?.packages) {
        const pkg = systemSettings.packages.find((p: any) => p.id === packageId);
        if (pkg) {
          setSelectedPackage(pkg);
          setPackageStep('select');
        }
      }
    }
  }, [systemSettings]);

  // Fetch Functions
  const fetchPurchased = async () => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;
    const parsedUser = JSON.parse(savedUser);
    const customerId = parsedUser.customerId || parsedUser.id;
    console.log("Dashboard fetchPurchased customerId:", customerId);
    if (customerId) {
      try {
        const response = await apiFetch(`/api/purchased-services?customerId=${customerId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Dashboard fetchPurchased data:", data);
          setPurchasedServices(data);
        }
      } catch (error) {
        console.error("Satın alınan hizmetler yüklenirken hata:", error);
      }
    }
  };

  const fetchPayments = async () => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;
    const parsedUser = JSON.parse(savedUser);
    const customerId = parsedUser.customerId || parsedUser.id;
    if (customerId) {
      try {
        const response = await apiFetch(`/api/payments?customerId=${customerId}`);
        if (response.ok) setPayments(await response.json());
      } catch (error) {
        console.error("Ödemeler yüklenirken hata:", error);
      }
    }
  };

  const fetchRefunds = async () => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;
    const parsedUser = JSON.parse(savedUser);
    const customerId = parsedUser.customerId || parsedUser.id;
    if (customerId) {
      try {
        const response = await apiFetch(`/api/refund-requests`);
        if (response.ok) {
          const allRefunds = await response.json();
          setRefundRequests(allRefunds.filter((r: any) => r.customerId === customerId));
        }
      } catch (error) {
        console.error("İade talepleri yüklenirken hata:", error);
      }
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await apiFetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSystemSettings(data);
      }
    } catch (error) {
      console.error("Ayarlar yüklenirken hata oluştu:", error);
    }
  };

  const fetchCustomerDetails = async () => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;
    const parsedUser = JSON.parse(savedUser);
    const customerId = parsedUser.customerId || parsedUser.id;
    if (customerId) {
      try {
        const response = await apiFetch(`/api/customers/${customerId}/details`);
        if (response.ok) {
          const data = await response.json();
          setCustomerDetails(data);
          if (data.services) {
            setServices(data.services);
          }
        }
      } catch (error) {
        console.error("Müşteri detayları yüklenirken hata oluştu:", error);
      }
    }
  };

  const fetchEmployees = async () => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;
    const parsedUser = JSON.parse(savedUser);
    const customerId = parsedUser.role === 'Çalışan' ? parsedUser.customerId : parsedUser.id;
    if (customerId) {
      try {
        const response = await apiFetch(`/api/employees?customerId=${customerId}`);
        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
        }
      } catch (error) {
        console.error("Çalışanlar yüklenirken hata oluştu:", error);
      }
    }
  };

  const loadQuotes = async () => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;
    const parsedUser = JSON.parse(savedUser);
    try {
      const response = await apiFetch('/api/quotes');
      if (response.ok) {
        const allQuotes = await response.json();
        const userPrepared = allQuotes.filter((q: any) => q.email === parsedUser.email && q.status === 'Teklif Hazırlandı');
        const userPending = allQuotes.filter((q: any) => q.email === parsedUser.email && q.status === 'Yeni');
        setPreparedQuotes(userPrepared);
        setPendingQuotes(userPending);
      }
    } catch (error) {
      console.error("Teklifler yüklenirken hata oluştu:", error);
    }
  };

  const fetchPurchasable = async () => {
    try {
      const response = await apiFetch('/api/purchasable-services');
      if (response.ok) setPurchasableServices(await response.json());
    } catch (error) {
      console.error("Hizmetler yüklenirken hata:", error);
    }
  };

  // Employee Management State
  const [employees, setEmployees] = useState<any[]>([]);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [customerDetails, setCustomerDetails] = useState<any>({ services: [], payments: [], transactions: [], documents: [] });
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: '', 
    permissions: ['overview'] as string[] 
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    
    // Check for tab in URL
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }

    // Auto-hide welcome message after 10 seconds
    const timer = setTimeout(() => setShowWelcome(false), 10000);

    fetchSettings();
    fetchCustomerDetails();
    fetchEmployees();
    loadQuotes();
    fetchPurchasable();
    fetchPurchased();
    fetchRefunds();
    fetchPayments();

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleAcceptQuote = (quote: any) => {
    setSelectedQuoteForPayment(quote);
    setQuotePaymentStep('payment');
    setCardData({ number: '', name: '', expiry: '', cvv: '' });
  };

  const handleRejectQuote = async (quote: any) => {
    const confirm = window.confirm('Bu teklifi reddetmek istediğinizden emin misiniz?');
    if (!confirm) return;

    try {
      const response = await apiFetch(`/api/quotes/${quote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Reddedildi' })
      });

      if (response.ok) {
        setPreparedQuotes(prev => prev.filter(q => q.id !== quote.id));
        alert('Teklif reddedildi.');
      }
    } catch (error) {
      console.error("Teklif reddedilirken hata oluştu:", error);
    }
  };

  const handleViewQuoteDetails = (quote: any) => {
    setSelectedQuote(quote);
    setIsQuoteModalOpen(true);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const customerId = user.role === 'Çalışan' ? user.customerId : user.id;
      const quoteId = `QR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newQuote = {
        id: quoteId,
        customerId: customerId,
        customer: user.name,
        email: user.email,
        phone: user.phone || '',
        company: user.company || '',
        service: quoteFormData.serviceType,
        date: new Date().toLocaleDateString('tr-TR'),
        status: 'Yeni',
        budget: quoteFormData.budget,
        details: {
          ...quoteFormData,
          selectedServices: [quoteFormData.serviceType]
        }
      };

      // Submit to backend
      const response = await apiFetch('/api/quotes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuote)
      });

      if (response.ok) {
        // Update state
        setPendingQuotes(prev => [newQuote, ...prev]);
        setQuoteFormData({
          serviceType: 'Akıllı Bina Otomasyonu',
          budget: '₺10,000 - ₺50,000',
          details: ''
        });
        
        alert('Teklif talebiniz başarıyla gönderildi!');
      } else {
        throw new Error('Teklif gönderilemedi');
      }
    } catch (error) {
      console.error("Teklif gönderme hatası:", error);
      alert('Teklif gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/');
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiFetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEmployee, customerId: user.id })
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees([...employees, data]);
        setShowAddEmployeeModal(false);
        setNewEmployee({ name: '', email: '', password: '', role: '', permissions: ['overview'] });
      }
    } catch (error) {
      console.error("Çalışan eklenirken hata oluştu:", error);
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiFetch(`/api/employees/${editingEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEmployee)
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(employees.map(emp => emp.id === data.id ? data : emp));
        setShowEditEmployeeModal(false);
        setEditingEmployee(null);
      }
    } catch (error) {
      console.error("Çalışan güncellenirken hata oluştu:", error);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      const response = await apiFetch(`/api/employees/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setEmployees(employees.filter(emp => emp.id !== id));
      }
    } catch (error) {
      console.error("Çalışan silinirken hata oluştu:", error);
    }
  };

  const togglePermission = (permissionId: string, isEditing = false) => {
    if (isEditing) {
      const current = editingEmployee.permissions || [];
      const updated = current.includes(permissionId)
        ? current.filter((p: string) => p !== permissionId)
        : [...current, permissionId];
      setEditingEmployee({ ...editingEmployee, permissions: updated });
    } else {
      const current = newEmployee.permissions;
      const updated = current.includes(permissionId)
        ? current.filter(p => p !== permissionId)
        : [...current, permissionId];
      setNewEmployee({ ...newEmployee, permissions: updated });
    }
  };

  const handleExtendWarranty = (service: any) => {
    setSelectedService(service);
    setWarrantyStep('select');
    setSelectedPlan(null);
    setCardData({ number: '', name: '', expiry: '', cvv: '' });
  };

  const handleViewDocuments = (service: any) => {
    setSelectedService(service);
    setShowDocumentsModal(true);
  };

  const processServicePurchase = async () => {
    setIsSubmitting(true);
    try {
      const customerId = user.role === 'Çalışan' ? user.customerId : user.id;
      const purchaseData = {
        customerId,
        customerName: user.name,
        customerEmail: user.email,
        serviceId: selectedPurchasable.id,
        serviceName: selectedPurchasable.name,
        price: selectedPurchasable.price
      };

      const response = await apiFetch('/api/purchased-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseData)
      });

      if (!response.ok) {
        throw new Error('Hizmet satın alınamadı');
      }

      const newPurchase = await response.json();
      setPurchasedServices(prev => [newPurchase, ...prev]);
      fetchCustomerDetails(); // Refresh active services
      fetchPayments(); // Refresh payments list
      setIsSubmitting(false);
      setPurchaseStep('success');
    } catch (error) {
      console.error("Hizmet satın alma hatası:", error);
      alert("Hizmet satın alınırken bir hata oluştu. Lütfen tekrar deneyin.");
      setIsSubmitting(false);
    }
  };

  const processPackagePurchase = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const customerId = user.role === 'Çalışan' ? user.customerId : user.id;

      const response = await apiFetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          customerName: user.name,
          customerEmail: user.email,
          amount: selectedPackage.price,
          type: 'Paket Satın Alma',
          description: `${selectedPackage.name} Üyelik Paketi`,
          date: new Date().toISOString(),
          status: 'Başarılı'
        })
      });

      if (response.ok) {
        setPackageStep('success');
        fetchPayments();
        // Update user's package in local storage and state
        const updatedUser = { ...user, package: selectedPackage.id };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        throw new Error('Paket satın alınamadı');
      }
    } catch (error) {
      console.error("Paket satın alma hatası:", error);
      alert("Paket satın alınırken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const processQuotePayment = async () => {
    setIsSubmitting(true);
    try {
      const customerId = user.role === 'Çalışan' ? user.customerId : user.id;

      // 1. Create Purchased Service (this also creates payment and adds to active services)
      const purchaseResponse = await apiFetch('/api/purchased-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          customerName: user.name,
          customerEmail: user.email,
          serviceId: selectedQuoteForPayment.id,
          serviceName: selectedQuoteForPayment.serviceType || selectedQuoteForPayment.service,
          price: selectedQuoteForPayment.price,
          paymentMethod: 'Kredi Kartı'
        })
      });

      if (!purchaseResponse.ok) throw new Error('Hizmet satın alınamadı');

      // 2. Update Quote Status
      const quoteResponse = await apiFetch(`/api/quotes/${selectedQuoteForPayment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Kabul Edildi' })
      });

      if (quoteResponse.ok) {
        setPreparedQuotes(prev => prev.filter(q => q.id !== selectedQuoteForPayment.id));
        setQuotePaymentStep('success');
        fetchCustomerDetails(); // Refresh active services
        fetchPurchased(); // Refresh purchase history
        fetchPayments(); // Refresh payments list
      } else {
        throw new Error('Teklif durumu güncellenemedi');
      }
    } catch (error) {
      console.error("Teklif ödeme hatası:", error);
      alert("Ödeme sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRefundItem || !refundReason.trim()) return;

    setIsSubmitting(true);
    try {
      const customerId = user.role === 'Çalışan' ? user.customerId : user.id;
      const refundData = {
        customerId,
        customerName: user.name,
        customerEmail: user.email,
        itemId: selectedRefundItem.id,
        itemName: selectedRefundItem.name || selectedRefundItem.serviceName || 'Üyelik',
        itemType: selectedRefundItem.serviceName ? 'Hizmet' : 'Üyelik',
        amount: selectedRefundItem.price || selectedRefundItem.amount || 0,
        reason: refundReason
      };

      const response = await apiFetch('/api/refund-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refundData)
      });

      if (response.ok) {
        const newRequest = await response.json();
        setRefundRequests(prev => [newRequest, ...prev]);
        setIsRefundModalOpen(false);
        setRefundReason('');
        setSelectedRefundItem(null);
        alert('İade talebiniz başarıyla gönderildi. En kısa sürede incelenecektir.');
      } else {
        const errorData = await response.json();
        alert(errorData.message || "İade talebi gönderilirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("İade talebi gönderilirken hata:", error);
      alert("İade talebi gönderilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const processPayment = async () => {
    setIsSubmitting(true);
    try {
      // 1. Record the payment in the backend
      const customerId = user.role === 'Çalışan' ? user.customerId : user.id;
      const paymentData = {
        customerId,
        customer: user.name, // Assuming user object has name
        amount: selectedPlan.price,
        date: new Date().toISOString().split('T')[0],
        status: 'Tamamlandı',
        method: 'Kredi Kartı',
        description: `${selectedService.name} - ${selectedPlan.label}`
      };

      const paymentResponse = await apiFetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (!paymentResponse.ok) {
        throw new Error('Ödeme kaydedilemedi');
      }

      // 2. Update service warranty date
      const yearsToAdd = selectedPlan.years;
      const currentEnd = new Date(selectedService.warrantyEnd);
      currentEnd.setFullYear(currentEnd.getFullYear() + yearsToAdd);
      
      const updatedService = { 
        ...selectedService, 
        warrantyEnd: currentEnd.toISOString().split('T')[0] 
      };

      const serviceResponse = await apiFetch(`/api/services/${selectedService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedService)
      });

      if (!serviceResponse.ok) {
        throw new Error('Garanti güncellenemedi');
      }

      setServices(prev => prev.map(s => s.id === selectedService.id ? updatedService : s));
      fetchPayments(); // Refresh payments list
      setIsSubmitting(false);
      setWarrantyStep('success');
    } catch (error) {
      console.error("Ödeme işlemi sırasında hata oluştu:", error);
      alert("Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const sidebarLinks = [
    { id: 'overview', label: 'Panelim', icon: LayoutDashboard },
    { id: 'services', label: 'Hizmetlerim', icon: Shield },
    { id: 'team', label: 'Ekibim', icon: Users },
    { id: 'support', label: 'Destek', icon: Wrench },
    { id: 'billing', label: 'Ödemeler', icon: FileText },
    { id: 'packages', label: 'Paketler', icon: Package },
    { id: 'purchasable-services', label: 'Hizmet Satın Al', icon: Sparkles },
    { id: 'refunds', label: 'İade Talepleri', icon: Undo2 },
    { id: 'quotes', label: 'Teklif Al', icon: MessageSquare },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ].filter(link => {
    // If user is an employee, filter by permissions
    if (user.role === 'Çalışan' && user.permissions) {
      return user.permissions.includes(link.id);
    }
    return true;
  });

  const isAdmin = user?.email === "106077az@gmail.com" || user?.role === 'admin';

  const getWarrantyProgress = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const start = new Date('2023-01-01').getTime();
    const total = end - start;
    const current = now - start;
    return Math.min(Math.max(Math.round((current / total) * 100), 0), 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex overflow-hidden transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>
      {/* Service Purchase Modal */}
      <AnimatePresence>
        {selectedPurchasable && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPurchasable(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] border border-border overflow-hidden shadow-2xl"
            >
              <div className="p-0">
                <AnimatePresence mode="wait">
                  {purchaseStep === 'select' ? (
                    <motion.div 
                      key="select-step"
                      initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                      className="p-8 space-y-6"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#E1F5FE] flex items-center justify-center text-[#03A9F4]">
                            <Sparkles size={24} />
                          </div>
                          <h2 className="text-2xl font-black text-[#1A237E]">Hizmet Detayları</h2>
                        </div>
                        <button onClick={() => setSelectedPurchasable(null)} className="p-2 hover:bg-accent/10 rounded-full transition-colors">
                          <X size={20} className="text-[#1A237E]" />
                        </button>
                      </div>

                      <div className="p-6 bg-[#F1F8FE] rounded-3xl border border-[#E1F5FE] flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#03A9F4] shadow-sm">
                          <Sparkles size={28} />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-[#1A237E]">{selectedPurchasable.name}</div>
                          <div className="text-xs text-[#1A237E]/60 font-black uppercase tracking-widest">Hizmet Bedeli: ₺{Number(String(selectedPurchasable.price || 0).replace(/[₺\s]/g, '').replace(',', '.')).toLocaleString('tr-TR')}</div>
                        </div>
                      </div>

                      <div className="p-6 bg-white rounded-3xl border border-[#E1F5FE]">
                        <h4 className="text-sm font-black text-[#1A237E] uppercase tracking-widest mb-2">Hizmet Açıklaması</h4>
                        <p className="text-sm text-[#1A237E]/70 leading-relaxed">
                          {selectedPurchasable.description}
                        </p>
                      </div>

                      <Button 
                        onClick={() => setPurchaseStep('payment')}
                        className="w-full py-6 rounded-[24px] text-base font-black uppercase tracking-widest bg-[#03A9F4] hover:bg-[#039BE5] text-white shadow-xl shadow-[#03A9F4]/20 transition-all"
                      >
                        Ödeme Bilgilerine Geç
                      </Button>
                    </motion.div>
                  ) : purchaseStep === 'payment' ? (
                    <motion.div 
                      key="payment-step"
                      initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                      className="p-8"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#E1F5FE] flex items-center justify-center text-[#03A9F4]">
                            <CreditCard size={24} />
                          </div>
                          <h2 className="text-2xl font-black text-[#1A237E]">Paket Satın Al</h2>
                        </div>
                        <button onClick={() => setSelectedPurchasable(null)} className="p-2 hover:bg-accent/10 rounded-full transition-colors">
                          <X size={20} className="text-[#1A237E]" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-8 text-[#1A237E]/60 cursor-pointer hover:text-[#1A237E] transition-colors" onClick={() => setPurchaseStep('select')}>
                        <ChevronLeft size={20} />
                        <span className="text-sm font-black uppercase tracking-widest">KART BİLGİLERİ</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column: Card Preview & Total */}
                        <div className="space-y-8">
                          <div className="relative h-56 w-full perspective-1000">
                            <motion.div 
                              animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                              transition={{ type: "spring", damping: 20, stiffness: 100 }}
                              className="relative w-full h-full preserve-3d"
                            >
                              {/* Front */}
                              <div className="absolute inset-0 bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-[32px] p-8 text-[#1A237E] backface-hidden shadow-xl border border-white/50 overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full -mr-32 -mt-32" />
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                  <div className="flex justify-between items-start">
                                    <div className="w-14 h-10 bg-[#FFD54F]/80 rounded-lg shadow-inner" />
                                    <div className="text-2xl font-black italic opacity-20 italic tracking-tighter">VISA</div>
                                  </div>
                                  <div className="space-y-6">
                                    <div className="text-2xl font-mono tracking-[0.25em] text-[#1A237E]/80">
                                      {cardData.number || '•••• •••• •••• ••••'}
                                    </div>
                                    <div className="flex justify-between items-end">
                                      <div className="space-y-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40">KART SAHİBİ</div>
                                        <div className="text-base font-black tracking-wider uppercase">{cardData.name || 'AD SOYAD'}</div>
                                      </div>
                                      <div className="space-y-1 text-right">
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40">S.K.T</div>
                                        <div className="text-base font-black tracking-wider">{cardData.expiry || 'MM/YY'}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Back */}
                              <div className="absolute inset-0 bg-gradient-to-br from-[#1A237E] to-[#0D47A1] rounded-[32px] text-white backface-hidden shadow-xl rotate-y-180 overflow-hidden">
                                <div className="mt-8 h-12 w-full bg-black/40" />
                                <div className="p-8 space-y-6">
                                  <div className="flex justify-end">
                                    <div className="bg-white text-[#1A237E] px-5 py-2 rounded-lg font-mono text-lg font-bold shadow-inner">{cardData.cvv || '•••'}</div>
                                  </div>
                                  <div className="text-[9px] uppercase tracking-widest opacity-40 leading-relaxed font-medium">
                                    Bu kart Emin Bilgi İşlem güvenli ödeme altyapısı tarafından korunmaktadır. 
                                    İzinsiz kullanımı yasaktır.
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>

                          <div className="bg-[#F1F8FE] rounded-[32px] p-6 flex items-center justify-between border border-[#E1F5FE]">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-[#E1F5FE] flex items-center justify-center text-[#03A9F4]">
                                <ShieldCheck size={20} />
                              </div>
                              <span className="text-sm font-black text-[#1A237E]/70 uppercase tracking-widest">Güvenli Ödeme</span>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] font-black text-[#1A237E]/40 uppercase tracking-widest mb-1">TOPLAM</div>
                              <div className="text-2xl font-black text-[#03A9F4]">₺{Number(String(selectedPurchasable.price || 0).replace(/[₺\s]/g, '').replace(',', '.')).toLocaleString('tr-TR')}</div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#1A237E]/60 uppercase tracking-widest ml-1">KART SAHİBİ</label>
                            <input 
                              value={cardData.name}
                              onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                              className="w-full bg-[#E1F5FE]/50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#03A9F4]/20 transition-all placeholder:text-[#1A237E]/20 text-[#1A237E]" 
                              placeholder="KART ÜZERİNDEKİ İSİM" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#1A237E]/60 uppercase tracking-widest ml-1">KART NUMARASI</label>
                            <input 
                              value={cardData.number}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                                const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                                setCardData({ ...cardData, number: formatted });
                              }}
                              className="w-full bg-[#E1F5FE]/50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#03A9F4]/20 transition-all placeholder:text-[#1A237E]/20 text-[#1A237E] font-mono tracking-widest" 
                              placeholder="0000 0000 0000 0000" 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#1A237E]/60 uppercase tracking-widest ml-1">S.K.T</label>
                              <input 
                                value={cardData.expiry}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '').substring(0, 4);
                                  const formatted = val.length >= 2 ? `${val.substring(0, 2)}/${val.substring(2)}` : val;
                                  setCardData({ ...cardData, expiry: formatted });
                                }}
                                className="w-full bg-[#E1F5FE]/50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#03A9F4]/20 transition-all placeholder:text-[#1A237E]/20 text-[#1A237E]" 
                                placeholder="MM/YY" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#1A237E]/60 uppercase tracking-widest ml-1">CVV</label>
                              <input 
                                value={cardData.cvv}
                                onFocus={() => setIsCardFlipped(true)}
                                onBlur={() => setIsCardFlipped(false)}
                                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) })}
                                className="w-full bg-[#E1F5FE]/50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#03A9F4]/20 transition-all placeholder:text-[#1A237E]/20 text-[#1A237E]" 
                                placeholder="***" 
                              />
                            </div>
                          </div>

                          <div className="pt-6">
                            <Button 
                              disabled={isSubmitting || !cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv}
                              onClick={processServicePurchase}
                              className="w-full py-6 rounded-[24px] text-base font-black uppercase tracking-widest bg-[#03A9F4] hover:bg-[#039BE5] text-white shadow-xl shadow-[#03A9F4]/20 transition-all active:scale-[0.98]"
                            >
                              {isSubmitting ? 'İşleniyor...' : 'ÖDEMEYİ TAMAMLA'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="success-step"
                      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      className="py-16 text-center space-y-8"
                    >
                      <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto text-success shadow-[0_0_40px_rgba(var(--success),0.2)]">
                        <CheckCircle2 size={56} />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-3xl font-black text-[#1A237E] tracking-tight">Satın Alma Başarılı!</h4>
                        <p className="text-[#1A237E]/60 text-base font-medium max-w-sm mx-auto leading-relaxed">
                          Hizmet başarıyla satın alındı. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.
                        </p>
                      </div>
                      <Button onClick={() => setSelectedPurchasable(null)} className="px-12 py-4 rounded-2xl font-black uppercase tracking-widest bg-[#03A9F4] hover:bg-[#039BE5] text-white">
                        Panele Dön
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Package Purchase Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPackage(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                      <CreditCard size={20} />
                    </div>
                    <h3 className="text-xl font-black text-foreground tracking-tight">Paket Satın Al</h3>
                  </div>
                  <button onClick={() => setSelectedPackage(null)} className="p-2 hover:bg-accent/10 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {packageStep === 'select' ? (
                    <motion.div 
                      key="select-step"
                      initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                      className="space-y-6"
                    >
                      <div className="p-6 bg-card/50 rounded-3xl border border-border flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-border">
                          <Sparkles size={28} />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground">{selectedPackage.name}</div>
                          <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Paket Bedeli: ₺{Number(selectedPackage.price || 0).toLocaleString('tr-TR')} / yıl</div>
                        </div>
                      </div>

                      <div className="p-6 bg-muted/30 rounded-3xl border border-border">
                        <h4 className="text-sm font-bold text-foreground mb-4">Paket Özellikleri</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedPackage.features.map((feature: string, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <Check size={14} className="text-primary" />
                              <span className="text-xs text-muted-foreground font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        onClick={() => setPackageStep('payment')}
                        className="w-full py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                      >
                        Ödeme Bilgilerine Geç
                      </Button>
                    </motion.div>
                  ) : packageStep === 'payment' ? (
                    <motion.div 
                      key="payment-step"
                      initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-10"
                    >
                      <div className="space-y-8">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setPackageStep('select')} className="p-2 hover:bg-accent/10 rounded-full text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowRight size={18} className="rotate-180" />
                          </button>
                          <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Kart Bilgileri</span>
                        </div>

                        {/* Visual Credit Card */}
                        <div className="relative w-full aspect-[1.586/1] perspective-1000">
                          <motion.div 
                            animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            style={{ transformStyle: 'preserve-3d' }}
                            className="relative w-full h-full"
                          >
                            <div 
                              style={{ backfaceVisibility: 'hidden' }}
                              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-card to-muted p-6 border border-border shadow-2xl overflow-hidden"
                            >
                              <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                  <div className="w-12 h-10 bg-warning/20 rounded-lg border border-warning/20 flex items-center justify-center overflow-hidden">
                                    <div className="w-8 h-6 bg-warning/40 rounded flex flex-col gap-1 p-1">
                                      <div className="h-0.5 w-full bg-warning/20" />
                                      <div className="h-0.5 w-full bg-warning/20" />
                                      <div className="h-0.5 w-full bg-warning/20" />
                                    </div>
                                  </div>
                                  <div className="text-muted-foreground/20 font-black italic text-xl">VISA</div>
                                </div>
                                <div className="space-y-4">
                                  <div className="text-xl font-mono tracking-[0.2em] text-foreground drop-shadow-md">
                                    {cardData.number || '•••• •••• •••• ••••'}
                                  </div>
                                  <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                      <div className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest">Kart Sahibi</div>
                                      <div className="text-xs font-bold text-foreground uppercase tracking-tight truncate max-w-[150px]">
                                        {cardData.name || 'AD SOYAD'}
                                      </div>
                                    </div>
                                    <div className="space-y-1 text-right">
                                      <div className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest">S.K.T</div>
                                      <div className="text-xs font-bold text-foreground">{cardData.expiry || 'MM/YY'}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div 
                              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-card to-muted border border-border shadow-2xl overflow-hidden flex flex-col"
                            >
                              <div className="mt-8 h-12 w-full bg-foreground/80" />
                              <div className="px-6 mt-6">
                                <div className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest mb-2">Güvenlik Kodu</div>
                                <div className="h-10 w-full bg-muted/50 rounded-lg flex items-center justify-end px-4 border border-border/5">
                                  <span className="text-foreground font-mono italic tracking-widest">{cardData.cvv || '•••'}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>

                        <div className="p-5 bg-primary/5 rounded-3xl border border-primary/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <Shield size={16} />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground">Güvenli Ödeme</span>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Toplam</div>
                            <div className="text-xl font-black text-primary">₺{Number(selectedPackage.price || 0).toLocaleString('tr-TR')}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Kart Sahibi</label>
                          <input 
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                            className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground text-foreground" 
                            placeholder="KART ÜZERİNDEKİ İSİM" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Kart Numarası</label>
                          <input 
                            value={cardData.number}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                              const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                              setCardData({ ...cardData, number: formatted });
                            }}
                            className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground text-foreground" 
                            placeholder="0000 0000 0000 0000" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">S.K.T</label>
                            <input 
                              value={cardData.expiry}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').substring(0, 4);
                                const formatted = val.length >= 2 ? `${val.substring(0, 2)}/${val.substring(2)}` : val;
                                setCardData({ ...cardData, expiry: formatted });
                              }}
                              className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground text-foreground" 
                              placeholder="MM/YY" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">CVV</label>
                            <input 
                              value={cardData.cvv}
                              onFocus={() => setIsCardFlipped(true)}
                              onBlur={() => setIsCardFlipped(false)}
                              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) })}
                              className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground text-foreground" 
                              placeholder="***" 
                            />
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button 
                            disabled={isSubmitting || !cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv}
                            onClick={processPackagePurchase}
                            className="w-full py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                          >
                            {isSubmitting ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="success-step"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-16 text-center space-y-8"
                    >
                      <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto text-success shadow-[0_0_40px_rgba(var(--success),0.2)]">
                        <CheckCircle2 size={56} />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-3xl font-black text-foreground tracking-tight">Paket Satın Alma Başarılı!</h4>
                        <p className="text-muted-foreground text-base font-medium max-w-sm mx-auto leading-relaxed">
                          {selectedPackage.name} üyelik paketiniz başarıyla tanımlandı. Avantajlarınızdan hemen yararlanmaya başlayabilirsiniz.
                        </p>
                      </div>
                      <Button onClick={() => setSelectedPackage(null)} className="px-12 py-4 rounded-2xl font-black uppercase tracking-widest">
                        Kapat
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                      <CreditCard size={20} />
                    </div>
                    <h3 className="text-xl font-black text-foreground tracking-tight">Güvenli Ödeme</h3>
                  </div>
                  <button onClick={() => setSelectedService(null)} className="p-2 hover:bg-accent/10 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {warrantyStep === 'select' ? (
                    <motion.div 
                      key="select-step"
                      initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                      transition={{ type: "spring", damping: 20, stiffness: 100 }}
                      className="space-y-6"
                    >
                      <div className="p-6 bg-card/50 rounded-3xl border border-border flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl bg-card flex items-center justify-center ${selectedService.color} shadow-sm border border-border`}>
                          {React.createElement(getIcon(selectedService.icon), { size: 28 })}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground">{selectedService.name}</div>
                          <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Mevcut Garanti Bitiş: {formatDate(selectedService.warrantyEnd)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { id: 1, years: 1, price: `₺${(systemSettings?.warrantyFee1Year || 1499).toLocaleString('tr-TR')}`, label: '+1 Yıl Uzatma', desc: 'Standart teknik destek dahil' },
                          { id: 2, years: 2, price: `₺${(systemSettings?.warrantyFee2Year || 2499).toLocaleString('tr-TR')}`, label: '+2 Yıl Uzatma', popular: true, desc: 'Öncelikli destek ve yıllık bakım' },
                          { id: 3, years: 3, price: `₺${(systemSettings?.warrantyFee3Year || 3299).toLocaleString('tr-TR')}`, label: '+3 Yıl Uzatma', desc: 'VIP destek ve parça değişim garantisi' },
                        ].map((plan, idx) => (
                          <motion.button
                            key={`plan-option-${plan.id}-${idx}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setSelectedPlan(plan)}
                            className={`p-5 rounded-3xl border transition-all flex items-center justify-between group relative overflow-hidden ${
                              selectedPlan?.id === plan.id 
                                ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]' 
                                : 'bg-muted/30 border-border hover:border-primary/20'
                            }`}
                          >
                            <div className="flex items-center gap-4 relative z-10">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selectedPlan?.id === plan.id ? 'border-primary bg-primary' : 'border-border'
                              }`}>
                                {selectedPlan?.id === plan.id && <CheckCircle2 size={14} className="text-primary-foreground" />}
                              </div>
                              <div className="text-left">
                                <div className="text-base font-bold text-foreground">{plan.label}</div>
                                <div className="text-xs text-muted-foreground font-medium">{plan.desc}</div>
                              </div>
                            </div>
                            <div className="text-right relative z-10">
                              <div className="text-lg font-black text-foreground">{plan.price}</div>
                              {plan.popular && (
                                <span className="inline-block px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest">
                                  En Popüler
                                </span>
                              )}
                            </div>
                            {selectedPlan?.id === plan.id && (
                              <motion.div 
                                layoutId="plan-glow"
                                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"
                              />
                            )}
                          </motion.button>
                        ))}
                      </div>

                      <Button 
                        disabled={!selectedPlan}
                        onClick={() => setWarrantyStep('payment')}
                        className="w-full py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                      >
                        Ödeme Bilgilerine Geç
                      </Button>
                    </motion.div>
                  ) : warrantyStep === 'payment' ? (
                    <motion.div 
                      key="payment-step"
                      initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                      transition={{ type: "spring", damping: 20, stiffness: 100 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-10"
                    >
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                      >
                        <div className="flex items-center gap-2">
                          <button onClick={() => setWarrantyStep('select')} className="p-2 hover:bg-accent/10 rounded-full text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowRight size={18} className="rotate-180" />
                          </button>
                          <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Kart Bilgileri</span>
                        </div>

                        {/* Visual Credit Card */}
                        <div className="relative w-full aspect-[1.586/1] perspective-1000">
                          <motion.div 
                            animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            style={{ transformStyle: 'preserve-3d' }}
                            className="relative w-full h-full"
                          >
                            {/* Front Side */}
                            <div 
                              style={{ backfaceVisibility: 'hidden' }}
                              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-card to-muted p-6 border border-border shadow-2xl overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -mr-20 -mt-20" />
                              <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                  <div className="w-12 h-10 bg-warning/20 rounded-lg border border-warning/20 flex items-center justify-center overflow-hidden">
                                    <div className="w-8 h-6 bg-warning/40 rounded flex flex-col gap-1 p-1">
                                      <div className="h-0.5 w-full bg-warning/20" />
                                      <div className="h-0.5 w-full bg-warning/20" />
                                      <div className="h-0.5 w-full bg-warning/20" />
                                    </div>
                                  </div>
                                  <div className="text-muted-foreground/20 font-black italic text-xl">VISA</div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div className="text-xl font-mono tracking-[0.2em] text-foreground drop-shadow-md">
                                    {cardData.number || '•••• •••• •••• ••••'}
                                  </div>
                                  <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                      <div className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest">Kart Sahibi</div>
                                      <div className="text-xs font-bold text-foreground uppercase tracking-tight truncate max-w-[150px]">
                                        {cardData.name || 'AD SOYAD'}
                                      </div>
                                    </div>
                                    <div className="space-y-1 text-right">
                                      <div className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest">S.K.T</div>
                                      <div className="text-xs font-bold text-foreground">
                                        {cardData.expiry || 'MM/YY'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Back Side */}
                            <div 
                              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-card to-muted border border-border shadow-2xl overflow-hidden flex flex-col"
                            >
                              <div className="mt-8 h-12 w-full bg-foreground/80" />
                              <div className="px-6 mt-6">
                                <div className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest mb-2">Güvenlik Kodu</div>
                                <div className="h-10 w-full bg-muted/50 rounded-lg flex items-center justify-end px-4 border border-border/5">
                                  <span className="text-foreground font-mono italic tracking-widest">{cardData.cvv || '•••'}</span>
                                </div>
                              </div>
                              <div className="mt-auto p-6 flex justify-between items-center">
                                <div className="text-[10px] font-bold text-muted-foreground/10 uppercase tracking-tighter">Authorized Signature</div>
                                <div className="text-muted-foreground/10 font-black italic text-lg">VISA</div>
                              </div>
                            </div>
                          </motion.div>
                        </div>

                        <div className="p-5 bg-primary/5 rounded-3xl border border-primary/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <Shield size={16} />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground">Güvenli Ödeme</span>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Toplam</div>
                            <div className="text-xl font-black text-primary">{selectedPlan.price}</div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-5"
                      >
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Kart Sahibi</label>
                          <input 
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                            className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground text-foreground" 
                            placeholder="KART ÜZERİNDEKİ İSİM" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Kart Numarası</label>
                          <div className="relative">
                            <input 
                              value={cardData.number}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                                const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                                setCardData({ ...cardData, number: formatted });
                              }}
                              className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground pl-14 text-foreground" 
                              placeholder="0000 0000 0000 0000" 
                            />
                            <CreditCard size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">S.K.T</label>
                            <input 
                              value={cardData.expiry}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').substring(0, 4);
                                const formatted = val.length >= 2 ? `${val.substring(0, 2)}/${val.substring(2)}` : val;
                                setCardData({ ...cardData, expiry: formatted });
                              }}
                              className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground text-foreground" 
                              placeholder="MM/YY" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">CVV</label>
                            <input 
                              value={cardData.cvv}
                              onFocus={() => setIsCardFlipped(true)}
                              onBlur={() => setIsCardFlipped(false)}
                              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) })}
                              className="w-full bg-input/50 border border-input rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground text-foreground" 
                              placeholder="***" 
                            />
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button 
                            disabled={isSubmitting || !cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv}
                            onClick={processPayment}
                            className="w-full py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 group relative overflow-hidden"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {isSubmitting ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                  İşleniyor...
                                </>
                              ) : (
                                <>
                                  <Shield size={18} />
                                  Ödemeyi Güvenle Tamamla
                                </>
                              )}
                            </span>
                          </Button>
                          <p className="text-[10px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-widest">
                            256-bit SSL şifreleme ile korunmaktadır
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : warrantyStep === 'success' ? (
                    <motion.div 
                      key="success-step"
                      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                      transition={{ type: "spring", damping: 20, stiffness: 100 }}
                      className="py-16 text-center space-y-8"
                    >
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12, delay: 0.2 }}
                        className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto text-success shadow-[0_0_40px_rgba(var(--success),0.2)]"
                      >
                        <CheckCircle2 size={56} />
                      </motion.div>
                      <div className="space-y-3">
                        <h4 className="text-3xl font-black text-foreground tracking-tight">Ödeme Başarılı!</h4>
                        <p className="text-muted-foreground text-base font-medium max-w-sm mx-auto leading-relaxed">
                          Sisteminizin garanti süresi başarıyla uzatıldı. Yeni bitiş tarihiniz: <br />
                          <span className="text-success font-black text-lg">{formatDate(services.find(s => s.id === selectedService.id)?.warrantyEnd)}</span>
                        </p>
                      </div>
                      <div className="pt-4">
                        <Button 
                          onClick={() => setSelectedService(null)}
                          className="px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest"
                        >
                          Panele Dön
                        </Button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quote Payment Modal */}
      <AnimatePresence>
        {selectedQuoteForPayment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuoteForPayment(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] border border-border overflow-hidden shadow-2xl"
            >
              <div className="p-0">
                <AnimatePresence mode="wait">
                  {quotePaymentStep === 'payment' ? (
                    <motion.div 
                      key="payment-step"
                      initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                      className="p-8"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#E1F5FE] flex items-center justify-center text-[#03A9F4]">
                            <CreditCard size={24} />
                          </div>
                          <h2 className="text-2xl font-black text-[#1A237E]">Paket Satın Al</h2>
                        </div>
                        <button onClick={() => setSelectedQuoteForPayment(null)} className="p-2 hover:bg-accent/10 rounded-full transition-colors">
                          <X size={20} className="text-[#1A237E]" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-8 text-[#1A237E]/60 cursor-pointer hover:text-[#1A237E] transition-colors" onClick={() => setSelectedQuoteForPayment(null)}>
                        <ChevronLeft size={20} />
                        <span className="text-sm font-black uppercase tracking-widest">KART BİLGİLERİ</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column: Card Preview & Total */}
                        <div className="space-y-8">
                          <div className="relative h-56 w-full perspective-1000">
                            <motion.div 
                              animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                              transition={{ type: "spring", damping: 20, stiffness: 100 }}
                              className="relative w-full h-full preserve-3d"
                            >
                              {/* Front */}
                              <div className="absolute inset-0 bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-[32px] p-8 text-[#1A237E] backface-hidden shadow-xl border border-white/50 overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full -mr-32 -mt-32" />
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                  <div className="flex justify-between items-start">
                                    <div className="w-14 h-10 bg-[#FFD54F]/80 rounded-lg shadow-inner" />
                                    <div className="text-2xl font-black italic opacity-20 italic tracking-tighter">VISA</div>
                                  </div>
                                  <div className="space-y-6">
                                    <div className="text-2xl font-mono tracking-[0.25em] text-[#1A237E]/80">
                                      {cardData.number || '•••• •••• •••• ••••'}
                                    </div>
                                    <div className="flex justify-between items-end">
                                      <div className="space-y-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40">KART SAHİBİ</div>
                                        <div className="text-base font-black tracking-wider uppercase">{cardData.name || 'AD SOYAD'}</div>
                                      </div>
                                      <div className="space-y-1 text-right">
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40">S.K.T</div>
                                        <div className="text-base font-black tracking-wider">{cardData.expiry || 'MM/YY'}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Back */}
                              <div className="absolute inset-0 bg-gradient-to-br from-[#1A237E] to-[#0D47A1] rounded-[32px] text-white backface-hidden shadow-xl rotate-y-180 overflow-hidden">
                                <div className="mt-8 h-12 w-full bg-black/40" />
                                <div className="p-8 space-y-6">
                                  <div className="flex justify-end">
                                    <div className="bg-white text-[#1A237E] px-5 py-2 rounded-lg font-mono text-lg font-bold shadow-inner">{cardData.cvv || '•••'}</div>
                                  </div>
                                  <div className="text-[9px] uppercase tracking-widest opacity-40 leading-relaxed font-medium">
                                    Bu kart Emin Bilgi İşlem güvenli ödeme altyapısı tarafından korunmaktadır. 
                                    İzinsiz kullanımı yasaktır.
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>

                          <div className="bg-[#F1F8FE] rounded-[32px] p-6 flex items-center justify-between border border-[#E1F5FE]">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-[#E1F5FE] flex items-center justify-center text-[#03A9F4]">
                                <ShieldCheck size={20} />
                              </div>
                              <span className="text-sm font-black text-[#1A237E]/70 uppercase tracking-widest">Güvenli Ödeme</span>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] font-black text-[#1A237E]/40 uppercase tracking-widest mb-1">TOPLAM</div>
                              <div className="text-2xl font-black text-[#03A9F4]">₺{Number(String(selectedQuoteForPayment.price || 0).replace(/[₺\s]/g, '').replace(',', '.')).toLocaleString('tr-TR')}</div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#1A237E]/60 uppercase tracking-widest ml-1">KART SAHİBİ</label>
                            <input 
                              value={cardData.name}
                              onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                              className="w-full bg-[#E1F5FE]/50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#03A9F4]/20 transition-all placeholder:text-[#1A237E]/20 text-[#1A237E]" 
                              placeholder="KART ÜZERİNDEKİ İSİM" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#1A237E]/60 uppercase tracking-widest ml-1">KART NUMARASI</label>
                            <input 
                              value={cardData.number}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                                const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                                setCardData({ ...cardData, number: formatted });
                              }}
                              className="w-full bg-[#E1F5FE]/50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#03A9F4]/20 transition-all placeholder:text-[#1A237E]/20 text-[#1A237E] font-mono tracking-widest" 
                              placeholder="0000 0000 0000 0000" 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#1A237E]/60 uppercase tracking-widest ml-1">S.K.T</label>
                              <input 
                                value={cardData.expiry}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '').substring(0, 4);
                                  const formatted = val.length >= 2 ? `${val.substring(0, 2)}/${val.substring(2)}` : val;
                                  setCardData({ ...cardData, expiry: formatted });
                                }}
                                className="w-full bg-[#E1F5FE]/50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#03A9F4]/20 transition-all placeholder:text-[#1A237E]/20 text-[#1A237E]" 
                                placeholder="MM/YY" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#1A237E]/60 uppercase tracking-widest ml-1">CVV</label>
                              <input 
                                value={cardData.cvv}
                                onFocus={() => setIsCardFlipped(true)}
                                onBlur={() => setIsCardFlipped(false)}
                                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) })}
                                className="w-full bg-[#E1F5FE]/50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#03A9F4]/20 transition-all placeholder:text-[#1A237E]/20 text-[#1A237E]" 
                                placeholder="***" 
                              />
                            </div>
                          </div>

                          <div className="pt-6">
                            <Button 
                              disabled={isSubmitting || !cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv}
                              onClick={processQuotePayment}
                              className="w-full py-6 rounded-[24px] text-base font-black uppercase tracking-widest bg-[#03A9F4] hover:bg-[#039BE5] text-white shadow-xl shadow-[#03A9F4]/20 transition-all active:scale-[0.98]"
                            >
                              {isSubmitting ? 'İşleniyor...' : 'ÖDEMEYİ TAMAMLA'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : quotePaymentStep === 'success' ? (
                    <motion.div 
                      key="success-step"
                      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                      className="py-16 text-center space-y-8"
                    >
                      <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto text-success shadow-[0_0_40px_rgba(var(--success),0.2)]">
                        <CheckCircle2 size={56} />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-3xl font-black text-[#1A237E] tracking-tight">Ödeme Başarılı!</h4>
                        <p className="text-[#1A237E]/60 text-base font-medium max-w-sm mx-auto leading-relaxed">
                          Teklif ödemeniz başarıyla alındı. Uzman ekibimiz en kısa sürede kurulum ve detaylar için sizinle iletişime geçecektir.
                        </p>
                      </div>
                      <Button onClick={() => setSelectedQuoteForPayment(null)} className="px-12 py-4 rounded-2xl font-black uppercase tracking-widest bg-[#03A9F4] hover:bg-[#039BE5] text-white">
                        Panele Dön
                      </Button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col z-50 transition-all duration-300 overflow-y-auto ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 mb-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative group-hover:scale-105 transition-transform duration-300 w-16 h-16">
              <img src="/logo.png" alt="Logo" className="absolute -top-12 -left-12 h-40 w-auto object-contain z-10" referrerPolicy="no-referrer" />
            </div>
            <span className="font-black text-lg tracking-tighter text-foreground">EMİN BİLGİ İŞLEM</span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {sidebarLinks.map((link, idx) => (
            <button
              key={`sidebar-link-${link.id}-${idx}`}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === link.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <link.icon size={18} className={activeTab === link.id ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'} />
              <span className="font-bold text-sm">{link.label}</span>
            </button>
          ))}
          
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-primary hover:bg-primary/10 transition-all duration-200 group mt-4 border border-primary/20"
            >
              <LayoutDashboard size={18} className="text-primary" />
              <span className="font-bold text-sm">Yönetici Paneli</span>
            </button>
          )}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-muted/50 rounded-2xl p-4 border border-border mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Bell size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Duyuru</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Sistem bakımları Pazar günü 02:00 - 04:00 arası yapılacaktır.
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut size={18} />
            <span className="font-bold text-sm">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-background relative transition-colors duration-300">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-muted rounded-xl text-muted-foreground transition-colors lg:hidden"
            >
              <LayoutDashboard size={24} />
            </button>
            <h1 className="text-lg font-black tracking-tight text-foreground">
              {sidebarLinks.find(l => l.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-foreground">{user.name}</div>
                <div className="text-[10px] text-primary font-black uppercase tracking-widest">Premium Üye</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-primary">
                {user.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-6xl w-full mx-auto">
          <AnimatePresence mode="wait">
            {/* Welcome Message Banner */}
            {showWelcome && activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-8 p-6 rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden group"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1 tracking-tight">Hoş Geldiniz, {user.name?.split(' ')[0] || ''}! 👋</h2>
                    <p className="text-primary-foreground/80 text-sm font-medium max-w-md">
                      Emin Bilgi İşlem Müşteri Paneli'ne hoş geldiniz. Tüm sistemleriniz güvende ve optimize edilmiş durumda.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowWelcome(false)}
                    className="p-2 hover:bg-accent/10 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
              </motion.div>
            )}

            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Aktif Sistem', val: services.length.toString(), icon: Shield, color: 'text-primary' },
                    { label: 'Kalan Garanti', val: stats.remainingWarranty, icon: Clock, color: 'text-success' },
                    { label: 'Son Bakım', val: stats.lastMaintenance, icon: CheckCircle2, color: 'text-blue-400' },
                    { label: 'Destek Talebi', val: tickets.filter(t => t.status !== 'Çözüldü').length.toString(), icon: AlertCircle, color: 'text-warning' },
                  ].map((stat, i) => (
                    <div key={`overview-stat-${stat.label}-${i}`} className="bg-card p-5 rounded-2xl border border-border flex items-center gap-4 shadow-sm">
                      <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                        <stat.icon size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                        <div className="text-lg font-black text-foreground">{stat.val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Services Inventory */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black tracking-tight text-foreground">Sistem Envanterim</h2>
                    <button onClick={() => setActiveTab('services')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">Tümünü Gör</button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {services.length === 0 ? (
                      <div className="bg-card rounded-2xl border border-dashed border-border p-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                          <Shield size={32} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-foreground">Henüz Bir Sisteminiz Bulunmuyor</h3>
                          <p className="text-sm text-muted-foreground max-w-xs">
                            Sistemleriniz kurulduğunda ve admin tarafından tanımlandığında burada listelenecektir.
                          </p>
                        </div>
                      </div>
                    ) : services.slice(0, 2).map((service, idx) => {
                      const progress = getWarrantyProgress(service.warrantyEnd);
                      return (
                        <div key={`overview-service-${service.id}-${idx}`} className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-all duration-300 group shadow-sm">
                          <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${service.color} shrink-0`}>
                              {React.createElement(getIcon(service.icon), { size: 24 })}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-foreground">{service.name}</h3>
                                <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                                  service.status === 'Aktif' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                }`}>
                                  {service.status}
                                </span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                  <span>Garanti Durumu</span>
                                  <span>{formatDate(service.warrantyEnd)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${100 - progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={`h-full rounded-full ${progress > 80 ? 'bg-destructive' : progress > 50 ? 'bg-warning' : 'bg-primary'}`}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="primary" 
                                onClick={() => handleExtendWarranty(service)}
                                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest"
                              >
                                Garanti Uzat
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Son Destek Talepleri</h3>
                    <div className="space-y-4">
                      {tickets.slice(0, 2).map((ticket, idx) => (
                        <div key={`ticket-overview-${ticket.id}-${idx}`} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${ticket.status === 'Çözüldü' ? 'bg-success' : 'bg-warning'} animate-pulse`} />
                            <div>
                              <div className="text-xs font-bold text-foreground">{ticket.subject}</div>
                              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{ticket.id}</div>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setActiveTab('support')} className="w-full mt-6 py-3 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all">
                      Tüm Talepler & Yeni Talep
                    </button>
                  </div>

                  <div className="bg-card rounded-2xl border border-border p-6 flex flex-col justify-between shadow-sm">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Hızlı İşlemler</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setActiveTab('billing')} className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-all flex flex-col items-center gap-2 text-center group">
                          <CreditCard size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-[10px] font-bold text-muted-foreground">Fatura Öde</span>
                        </button>
                        <button onClick={() => setActiveTab('settings')} className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-all flex flex-col items-center gap-2 text-center group">
                          <User size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-[10px] font-bold text-muted-foreground">Profil Düzenle</span>
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone size={20} className="text-primary" />
                        <div className="text-[10px] font-bold text-muted-foreground">Mobil Uygulamayı İndir</div>
                      </div>
                      <ArrowRight size={16} className="text-primary" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-black text-foreground">Tüm Hizmetlerim</h2>
                <div className="grid grid-cols-1 gap-6">
                  {services.length === 0 ? (
                    <div className="bg-card rounded-[2.5rem] border border-dashed border-border p-20 flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center text-muted-foreground">
                        <Shield size={40} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-foreground">Kayıtlı Hizmet Bulunamadı</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                          Hesabınıza tanımlanmış herhangi bir aktif hizmet veya sistem bulunmamaktadır. 
                          Bir hizmet satın aldıysanız lütfen aktivasyon için bekleyin veya destek ekibiyle iletişime geçin.
                        </p>
                      </div>
                      <Button variant="primary" onClick={() => setActiveTab('overview')} className="px-8">
                        Panele Dön
                      </Button>
                    </div>
                  ) : services.map((service, idx) => (
                    <div key={`service-card-${service.id}-${idx}`} className="bg-card p-8 rounded-3xl border border-border flex flex-col md:flex-row gap-8 items-start md:items-center shadow-sm">
                      <div className={`w-16 h-16 rounded-2xl bg-muted flex items-center justify-center ${service.color} shrink-0 shadow-sm border border-border`}>
                        {React.createElement(getIcon(service.icon), { size: 32 })}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-foreground">{service.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            service.status === 'Aktif' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                          }`}>
                            {service.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          <div>
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Garanti Bitiş</div>
                            <div className="text-sm font-bold text-muted-foreground">{formatDate(service.warrantyEnd)}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Son Bakım</div>
                            <div className="text-sm font-bold text-muted-foreground">{formatDate(service.lastMaintenance)}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Servis No</div>
                            <div className="text-sm font-bold text-muted-foreground">EBJ-{service.id}00{service.id}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <Button 
                          variant="primary" 
                          onClick={() => handleExtendWarranty(service)}
                          className="flex-1 md:flex-none px-6 py-3 text-xs font-black uppercase tracking-widest"
                        >
                          Garanti Uzat
                        </Button>
                        <Button 
                          variant="glass" 
                          onClick={() => handleViewDocuments(service)}
                          className="flex-1 md:flex-none px-6 py-3 text-xs font-black uppercase tracking-widest"
                        >
                          Belgeler
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div
                key="team"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tight">Ekibim</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Sisteme erişimi olan çalışma arkadaşlarınızı yönetin.</p>
                  </div>
                  <Button onClick={() => setShowAddEmployeeModal(true)} className="gap-2 px-6 py-3 rounded-2xl shadow-xl shadow-primary/20">
                    <UserPlus size={20} /> Yeni Çalışan Ekle
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {employees.map((employee, idx) => (
                    <motion.div
                      key={`employee-card-${employee.id}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative bg-card/40 border border-border rounded-[2.5rem] p-8 hover:border-primary/40 transition-all duration-500 shadow-xl hover:shadow-primary/5 overflow-hidden"
                    >
                      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-colors duration-700" />
                      
                      <div className="relative z-10 flex items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-2xl shadow-inner border border-primary/20 group-hover:scale-105 transition-transform duration-500">
                              {employee.name?.charAt(0)?.toLowerCase() || '?'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background border-2 border-primary/20 rounded-lg flex items-center justify-center text-primary shadow-lg">
                              <Shield size={12} />
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{employee.name}</div>
                            <div className="text-xs text-muted-foreground font-bold flex flex-col gap-1 mt-1">
                              <span className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                {employee.email}
                              </span>
                              <span className="text-[10px] text-primary/70 uppercase tracking-widest">{employee.role}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => { setEditingEmployee(employee); setShowEditEmployeeModal(true); }}
                            className="p-3 hover:bg-primary/10 rounded-2xl text-muted-foreground hover:text-primary transition-all duration-300 group/btn"
                            title="Düzenle"
                          >
                            <Settings size={20} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="p-3 hover:bg-destructive/10 rounded-2xl text-muted-foreground hover:text-destructive transition-all duration-300"
                            title="Sil"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {employees.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-card/20 border-2 border-dashed border-border rounded-[2.5rem]">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                        <Users size={32} />
                      </div>
                      <h3 className="text-lg font-black text-foreground">Henüz çalışan eklenmemiş</h3>
                      <p className="text-muted-foreground text-sm mt-1">Ekibinizi yönetmeye başlamak için yeni bir çalışan ekleyin.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'support' && (
              <motion.div
                key="support"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-foreground">Destek & Canlı Sohbet</h2>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    Destek Ekibi Aktif
                  </div>
                </div>
                <SupportChat user={user} />
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-black text-foreground">Ödemeler & Faturalar</h2>
                <div className="bg-card rounded-3xl border border-border overflow-x-auto shadow-sm">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fatura No</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tarih</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tutar</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Durum</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {payments.length > 0 ? (
                        payments.map((inv, idx) => {
                          const refund = refundRequests.find(r => r.itemId === inv.serviceId && r.status === 'Onaylandı');
                          const isRefunded = inv.status === 'hizmet iade edildi' || inv.status === 'İade Edildi' || !!refund;
                          
                          return (
                            <tr key={`payment-row-${inv.id}-${idx}`} className="hover:bg-muted/50 transition-colors">
                              <td className="px-6 py-4 text-sm font-bold text-foreground">{inv.id}</td>
                              <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(inv.date).toLocaleDateString('tr-TR')}</td>
                              <td className="px-6 py-4 text-sm font-black text-foreground">₺{Number(inv.amount).toLocaleString('tr-TR')}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                                  isRefunded ? 'bg-destructive/10 text-destructive' :
                                  inv.status === 'Tamamlandı' ? 'bg-success/10 text-success' : 
                                  inv.status === 'İşlemde' ? 'bg-primary/10 text-primary' :
                                  inv.status === 'İptal Edildi' ? 'bg-destructive/10 text-destructive' :
                                  'bg-warning/10 text-warning'
                                }`}>
                                  {isRefunded ? 'İade Edildi' : inv.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase">{inv.description || inv.method}</div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                            Henüz kayıtlı bir ödeme bulunmuyor.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'purchasable-services' && (
              <motion.div
                key="purchasable-services"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">Hizmet Satın Al</h2>
                    <p className="text-muted-foreground font-medium">İhtiyacınız olan ek hizmetleri buradan hızlıca satın alabilirsiniz.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {purchasableServices.map((service, idx) => (
                    <motion.div
                      key={`purchasable-service-${service.id}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm hover:border-primary/50 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                      
                      <div className="relative z-10">
                        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                          <Sparkles size={32} />
                        </div>
                        <h3 className="text-xl font-black text-foreground mb-3 tracking-tight">{service.name}</h3>
                        <p className="text-sm text-muted-foreground font-medium mb-8 leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between pt-8 border-t border-border/50">
                          <div className="text-2xl font-black text-primary">₺{service.price.toLocaleString('tr-TR')}</div>
                          <Button 
                            onClick={() => {
                              setSelectedPurchasable(service);
                              setPurchaseStep('select');
                              setCardData({ number: '', name: '', expiry: '', cvv: '' });
                            }}
                            className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                          >
                            Satın Al
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {purchasableServices.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-muted/20 rounded-[2.5rem] border border-dashed border-border">
                      <p className="text-muted-foreground font-medium">Şu anda satın alınabilir hizmet bulunmuyor.</p>
                    </div>
                  )}
                </div>

                {purchasedServices.length > 0 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center text-success">
                        <CheckCircle2 size={20} />
                      </div>
                      <h3 className="text-xl font-black text-foreground tracking-tight">Satın Aldığım Hizmetler</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {purchasedServices.map((purchase, idx) => (
                        <div key={`purchase-card-${purchase.id}-${idx}`} className="p-6 bg-card/50 rounded-3xl border border-border flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success border border-success/20">
                              <Sparkles size={24} />
                            </div>
                            <div>
                              <div className="text-base font-bold text-foreground">{purchase.serviceName}</div>
                              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">
                                {new Date(purchase.purchaseDate).toLocaleDateString('tr-TR')} • ₺{purchase.price.toLocaleString('tr-TR')}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 text-[8px] font-black uppercase rounded-full tracking-widest ${
                              purchase.status === 'İş Tamamlandı' || purchase.status === 'Ödeme Alındı / İş Tamamlandı' ? 'bg-success/10 text-success' : 
                              purchase.status === 'Ödeme Alındı' ? 'bg-primary/10 text-primary' : 
                              'bg-warning/10 text-warning'
                            }`}>
                              {purchase.status || 'Ödeme Alındı / İş Tamamlandı'}
                            </div>
                            {refundRequests.some(r => r.itemId === purchase.id) ? (
                              <div className="w-8 h-8 flex items-center justify-center text-warning" title="İade Talebi Mevcut">
                                <History size={14} />
                              </div>
                            ) : (
                              <Button 
                                variant="glass" 
                                className="w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  setSelectedRefundItem(purchase);
                                  setIsRefundModalOpen(true);
                                }}
                                title="İade Talebi Oluştur"
                              >
                                <Undo2 size={14} />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'quotes' && (
              <motion.div
                key="quotes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {/* Prepared Quotes Section */}
                {preparedQuotes.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Hazırlanan Teklifler</h3>
                        <p className="text-xs text-muted-foreground font-medium">Sizin için hazırladığımız özel teklifleri inceleyin.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {preparedQuotes.map((quote, idx) => (
                        <motion.div
                          key={`prepared-quote-${quote.id}-${idx}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:border-primary/30 transition-all group relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
                          
                          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-primary border border-border group-hover:scale-110 transition-transform">
                                <Sparkles size={24} />
                              </div>
                              <div>
                                <div className="text-lg font-bold text-foreground">{quote.serviceType || quote.service}</div>
                                <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Hazırlanma: {new Date(quote.preparedAt).toLocaleDateString('tr-TR')}</div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                              <div className="text-right">
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Teklif Tutarı</div>
                                <div className="text-xl font-black text-primary">₺{Number(String(quote.price || 0).replace(/[₺\s]/g, '').replace(',', '.')).toLocaleString('tr-TR')}</div>
                              </div>
                              <div className="h-10 w-px bg-border hidden lg:block" />
                              <div className="text-right">
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Geçerlilik</div>
                                <div className="text-sm font-bold text-foreground">{new Date(quote.expiryDate).toLocaleDateString('tr-TR')}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button 
                                onClick={() => handleViewQuoteDetails(quote)}
                                className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl"
                              >
                                Detaylar
                              </Button>
                              <Button 
                                onClick={() => handleAcceptQuote(quote)}
                                variant="glass" 
                                className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border-success/20 text-success hover:bg-success/10"
                              >
                                Kabul Et
                              </Button>
                              <Button 
                                onClick={() => handleRejectQuote(quote)}
                                variant="glass" 
                                className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10"
                              >
                                Reddet
                              </Button>
                            </div>
                          </div>

                          {quote.message && (
                            <div className="mt-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                              <p className="text-xs text-muted-foreground italic leading-relaxed">
                                " {quote.message} "
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Quotes Section */}
                {pendingQuotes.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center text-warning">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Bekleyen Talepler</h3>
                        <p className="text-xs text-muted-foreground font-medium">Yönetici onayı bekleyen teklif talepleriniz.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {pendingQuotes.map((quote, idx) => (
                        <motion.div
                          key={`pending-quote-${quote.id}-${idx}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-card/50 border border-border border-dashed rounded-3xl p-6 shadow-sm transition-all group relative"
                        >
                          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground border border-border">
                                <Clock size={24} />
                              </div>
                              <div>
                                <div className="text-lg font-bold text-foreground/70">{quote.service}</div>
                                <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Talep Tarihi: {quote.date}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="px-4 py-2 bg-warning/10 border border-warning/20 rounded-full">
                                <span className="text-[10px] font-black text-warning uppercase tracking-widest">İnceleniyor</span>
                              </div>
                              <Button 
                                onClick={() => handleViewQuoteDetails(quote)}
                                variant="glass" 
                                className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl"
                              >
                                Talebi Gör
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-black text-foreground tracking-tight mb-4">Yeni Proje Teklifi Al</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                      İhtiyaç duyduğunuz yeni sistemler veya mevcut altyapınızın modernizasyonu için uzman ekibimizden detaylı teklif alabilirsiniz.
                    </p>
                  </div>

                  <form onSubmit={handleQuoteSubmit} className="space-y-6 bg-card border border-border p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Hizmet Türü</label>
                        <select 
                          value={quoteFormData.serviceType}
                          onChange={(e) => setQuoteFormData({ ...quoteFormData, serviceType: e.target.value })}
                          className="w-full bg-input border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all appearance-none text-foreground"
                        >
                          <option>Akıllı Bina Otomasyonu</option>
                          <option>Endüstriyel Güvenlik Sistemleri</option>
                          <option>Fiber Optik Altyapı</option>
                          <option>Veri Merkezi Çözümleri</option>
                          <option>Diğer</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tahmini Bütçe</label>
                        <select 
                          value={quoteFormData.budget}
                          onChange={(e) => setQuoteFormData({ ...quoteFormData, budget: e.target.value })}
                          className="w-full bg-input border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all appearance-none text-foreground"
                        >
                          <option>₺10,000 - ₺50,000</option>
                          <option>₺50,000 - ₺100,000</option>
                          <option>₺100,000 - ₺250,000</option>
                          <option>₺250,000+</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Proje Detayları</label>
                      <textarea 
                        rows={5}
                        value={quoteFormData.details}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, details: e.target.value })}
                        className="w-full bg-input border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground text-foreground" 
                        placeholder="Projeniz hakkında kısa bir bilgi verin..."
                        required
                      />
                    </div>

                    <div className="pt-4">
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-500/20"
                      >
                        {isSubmitting ? 'Gönderiliyor...' : 'Teklif Talebini Gönder'}
                      </Button>
                      <p className="text-[10px] text-center text-muted-foreground mt-6 font-bold uppercase tracking-widest">
                        Talebiniz 24 saat içerisinde uzmanlarımız tarafından incelenecektir.
                      </p>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'refunds' && (
              <motion.div
                key="refunds"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">İade Taleplerim</h2>
                  <p className="text-muted-foreground font-medium">Gönderdiğiniz iade taleplerinin durumunu buradan takip edebilirsiniz.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {refundRequests.length > 0 ? (
                    refundRequests.map((request, idx) => (
                      <motion.div
                        key={`refund-request-${request.id}-${idx}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-card rounded-[2rem] border border-border p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                            request.status === 'Onaylandı' ? 'bg-success/10 text-success border-success/20' :
                            request.status === 'Reddedildi' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                            'bg-warning/10 text-warning border-warning/20'
                          }`}>
                            <Undo2 size={24} />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-foreground">{request.itemName}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                {new Date(request.requestDate).toLocaleDateString('tr-TR')} • ₺{Number(request.amount).toLocaleString('tr-TR')}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                {request.itemType}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:items-end gap-2">
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            request.status === 'Onaylandı' ? 'bg-success/10 text-success' :
                            request.status === 'Reddedildi' ? 'bg-destructive/10 text-destructive' :
                            'bg-warning/10 text-warning'
                          }`}>
                            {request.status}
                          </div>
                          <p className="text-xs text-muted-foreground italic max-w-xs md:text-right">
                            "{request.reason}"
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-[2.5rem] border border-dashed border-border">
                      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                        <Undo2 className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <h4 className="text-lg font-medium mb-2">İade Talebi Bulunmuyor</h4>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Henüz herhangi bir iade talebinde bulunmadınız. Satın aldığınız hizmetler üzerinden iade talebi oluşturabilirsiniz.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'packages' && (
              <motion.div
                key="packages"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Üyelik Paketleri</h2>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Size özel avantajlardan yararlanmak için paketinizi seçin.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {systemSettings?.packages?.map((pkg: any) => (
                    <motion.div 
                      key={pkg.id}
                      whileHover={{ y: -5 }}
                      className={`relative group rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                        pkg.id === 'platinum' 
                          ? 'border-primary/30 bg-primary/5 shadow-xl shadow-primary/5' 
                          : 'border-border bg-card shadow-sm hover:shadow-md'
                      } p-8`}
                    >
                      {/* Decorative Glow */}
                      <div className={`absolute -top-20 -right-20 w-40 h-40 blur-[50px] opacity-20 transition-opacity group-hover:opacity-40 ${
                        pkg.id === 'silver' ? 'bg-slate-400' :
                        pkg.id === 'gold' ? 'bg-amber-400' :
                        'bg-primary'
                      }`} />

                      <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl ${
                          pkg.id === 'silver' ? 'bg-slate-100 dark:bg-slate-800' :
                          pkg.id === 'gold' ? 'bg-amber-100 dark:bg-amber-900/30' :
                          'bg-primary/20'
                        } flex items-center justify-center shadow-inner border border-white/10`}>
                          {pkg.id === 'silver' ? <Shield className="text-slate-400" size={28} /> :
                           pkg.id === 'gold' ? <Zap className="text-amber-400" size={28} /> :
                           <Sparkles className="text-primary" size={28} />}
                        </div>
                        {pkg.id === 'platinum' && (
                          <div className="relative">
                            <div className="absolute inset-0 bg-primary blur-sm opacity-50 animate-pulse" />
                            <span className="relative text-[10px] font-black uppercase tracking-widest text-primary-foreground bg-primary px-4 py-1.5 rounded-full shadow-lg">Premium</span>
                          </div>
                        )}
                      </div>

                      <div className="relative z-10">
                        <h3 className="text-2xl font-black text-foreground mb-1 tracking-tight">{pkg.name}</h3>
                        <div className="flex items-baseline gap-1 mb-8">
                          <span className="text-4xl font-black text-foreground tracking-tighter">₺{pkg.price}</span>
                          <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-60">/ yıl</span>
                        </div>

                        <div className="space-y-4 mb-10">
                          {pkg.features.map((feature: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 group/item">
                              <div className={`w-5 h-5 rounded-full ${pkg.id === 'platinum' ? 'bg-primary/20' : 'bg-muted'} flex items-center justify-center shrink-0`}>
                                <Check size={12} className={pkg.id === 'platinum' ? 'text-primary' : 'text-muted-foreground'} />
                              </div>
                              <span className="text-xs text-muted-foreground font-semibold group-hover/item:text-foreground transition-colors">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button 
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setPackageStep('select');
                          }}
                          variant={pkg.id === 'platinum' ? 'primary' : 'glass'}
                          className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] ${
                            pkg.id === 'platinum' ? 'shadow-lg shadow-primary/20' : 'border-border'
                          }`}
                        >
                          Hemen Satın Al
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl space-y-8"
              >
                <h2 className="text-2xl font-black text-foreground">Hesap Ayarları</h2>
                <div className="bg-card p-8 rounded-3xl border border-border space-y-8 shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-3xl font-black text-primary-foreground shadow-xl shadow-primary/20">
                      {user.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
                      <p className="text-muted-foreground text-sm">{user.email}</p>
                      <button className="mt-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors">Fotoğrafı Değiştir</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ad Soyad</label>
                      <input defaultValue={user.name} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">E-posta</label>
                      <input defaultValue={user.email} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Telefon</label>
                      <input placeholder="+90 5xx xxx xx xx" className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Şirket</label>
                      <input placeholder="Şirket Adı" className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground" />
                    </div>
                  </div>
                  <div className="pt-4 flex gap-4">
                    <Button className="px-8 py-3 text-xs font-black uppercase tracking-widest">Değişiklikleri Kaydet</Button>
                    <Button variant="glass" className="px-8 py-3 text-xs font-black uppercase tracking-widest border-border">Şifre Değiştir</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddEmployeeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddEmployeeModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-scroll"
            >
              {/* Header with Gradient */}
              <div className="relative p-6 sm:p-8 border-b border-border overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner shrink-0">
                      <UserPlus className="text-primary" size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2 truncate">
                        Yeni Çalışan
                        <Sparkles size={16} className="text-primary animate-pulse hidden xs:block" />
                      </h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5 truncate">Ekibinize yeni bir profesyonel dahil edin.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAddEmployeeModal(false)} 
                    className="p-2 hover:bg-muted rounded-full transition-all hover:rotate-90 shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddEmployee} className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                <div className="space-y-4 sm:space-y-5">
                  {/* Name Input */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">Ad Soyad</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        required
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        placeholder="Örn: Ahmet Yılmaz"
                        className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-4 py-3 sm:py-4 text-sm focus:outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/5 transition-all text-foreground font-medium"
                      />
                    </div>
                  </div>

                  {/* Email & Password Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">E-posta</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          required
                          type="email"
                          value={newEmployee.email}
                          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                          placeholder="ahmet@sirket.com"
                          className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-4 py-3 sm:py-4 text-sm focus:outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/5 transition-all text-foreground font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">Giriş Şifresi</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          required
                          type="password"
                          value={newEmployee.password}
                          onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-4 py-3 sm:py-4 text-sm focus:outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/5 transition-all text-foreground font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role Input */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">Pozisyon / Rol</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        required
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                        placeholder="Örn: Tekniker, Yönetici"
                        className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-4 py-3 sm:py-4 text-sm focus:outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/5 transition-all text-foreground font-medium"
                      />
                    </div>
                  </div>

                  {/* Permissions Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Erişim Yetkileri</label>
                      <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {newEmployee.permissions.length} Seçildi
                      </span>
                    </div>
                    <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                      {[
                        { id: 'overview', label: 'Panelim', icon: LayoutDashboard },
                        { id: 'services', label: 'Hizmetler', icon: Shield },
                        { id: 'purchasable-services', label: 'Hizmet Satın Al', icon: Sparkles },
                        { id: 'refunds', label: 'İade Talepleri', icon: RefreshCcw },
                        { id: 'team', label: 'Ekibim', icon: Users },
                        { id: 'support', label: 'Destek', icon: Wrench },
                        { id: 'billing', label: 'Ödemeler', icon: FileText },
                        { id: 'quotes', label: 'Teklif Al', icon: MessageSquare },
                        { id: 'settings', label: 'Ayarlar', icon: Settings }
                      ].map((perm, idx) => {
                        const Icon = perm.icon;
                        const isSelected = newEmployee.permissions.includes(perm.id);
                        return (
                          <motion.button
                            key={`new-perm-${perm.id}-${idx}`}
                            type="button"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => togglePermission(perm.id)}
                            className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border transition-all duration-300 ${
                              isSelected
                                ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]'
                                : 'bg-muted/30 border-border hover:border-primary/30'
                            }`}
                          >
                            <div className={`p-1.5 rounded-xl transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                              <Icon size={14} />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-wider text-center ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                              {perm.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button 
                    type="button" 
                    variant="glass" 
                    onClick={() => setShowAddEmployeeModal(false)} 
                    className="w-full sm:flex-1 py-3 sm:py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border-border"
                  >
                    Vazgeç
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full sm:flex-1 py-3 sm:py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-[0_20px_40px_-12px_rgba(var(--primary),0.3)] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary),0.4)] transition-all"
                  >
                    Çalışanı Kaydet
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Employee Modal */}
      <AnimatePresence>
        {showEditEmployeeModal && editingEmployee && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditEmployeeModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              {/* Header with Gradient */}
              <div className="relative p-6 sm:p-8 border-b border-border overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner shrink-0">
                      <Edit3 className="text-primary" size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight truncate">Çalışanı Düzenle</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5 truncate">{editingEmployee.name} bilgilerini güncelleyin.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowEditEmployeeModal(false)} 
                    className="p-2 hover:bg-muted rounded-full transition-all hover:rotate-90 shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpdateEmployee} className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                <div className="space-y-4 sm:space-y-5">
                  {/* Name Input */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">Ad Soyad</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        required
                        value={editingEmployee.name}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                        className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-4 py-3 sm:py-4 text-sm focus:outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/5 transition-all text-foreground font-medium"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">E-posta</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        required
                        type="email"
                        value={editingEmployee.email}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                        className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-4 py-3 sm:py-4 text-sm focus:outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/5 transition-all text-foreground font-medium"
                      />
                    </div>
                  </div>

                  {/* Role & Status Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">Pozisyon</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          required
                          value={editingEmployee.role}
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                          className="w-full bg-muted/30 border border-border rounded-2xl pl-12 pr-4 py-3 sm:py-4 text-sm focus:outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/5 transition-all text-foreground font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">Durum</label>
                      <select 
                        value={editingEmployee.status}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value })}
                        className="w-full bg-muted/30 border border-border rounded-2xl px-4 py-3 sm:py-4 text-sm focus:outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/5 transition-all text-foreground font-medium appearance-none"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Pasif">Pasif</option>
                      </select>
                    </div>
                  </div>

                  {/* Permissions Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Erişim Yetkileri</label>
                    </div>
                    <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                      {[
                        { id: 'overview', label: 'Panelim', icon: LayoutDashboard },
                        { id: 'services', label: 'Hizmetler', icon: Shield },
                        { id: 'purchasable-services', label: 'Hizmet Satın Al', icon: Sparkles },
                        { id: 'refunds', label: 'İade Talepleri', icon: RefreshCcw },
                        { id: 'team', label: 'Ekibim', icon: Users },
                        { id: 'support', label: 'Destek', icon: Wrench },
                        { id: 'billing', label: 'Ödemeler', icon: FileText },
                        { id: 'quotes', label: 'Teklif Al', icon: MessageSquare },
                        { id: 'settings', label: 'Ayarlar', icon: Settings }
                      ].map((perm, idx) => {
                        const Icon = perm.icon;
                        const isSelected = (editingEmployee.permissions || []).includes(perm.id);
                        return (
                          <motion.button
                            key={`edit-perm-${perm.id}-${idx}`}
                            type="button"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => togglePermission(perm.id, true)}
                            className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border transition-all duration-300 ${
                              isSelected
                                ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]'
                                : 'bg-muted/30 border-border hover:border-primary/30'
                            }`}
                          >
                            <div className={`p-1.5 rounded-xl transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                              <Icon size={14} />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-wider text-center ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                              {perm.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button 
                    type="button" 
                    variant="glass" 
                    onClick={() => setShowEditEmployeeModal(false)} 
                    className="w-full sm:flex-1 py-3 sm:py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border-border"
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full sm:flex-1 py-3 sm:py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-[0_20px_40px_-12px_rgba(var(--primary),0.3)] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary),0.4)] transition-all"
                  >
                    Güncelle
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quote Details Modal */}
      <AnimatePresence>
        {isQuoteModalOpen && selectedQuote && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <div className="relative p-8 border-b border-border overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                      <FileText className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-foreground tracking-tight">Teklif Detayları</h3>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">#{selectedQuote.id} numaralı teklif incelemesi.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsQuoteModalOpen(false)} 
                    className="p-2 hover:bg-muted rounded-full transition-all hover:rotate-90"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Hizmet Bilgisi</h4>
                      <p className="text-lg font-bold text-foreground">{selectedQuote.serviceType || selectedQuote.service}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Durum</h4>
                      <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{selectedQuote.status}</span>
                      </div>
                    </div>
                    {selectedQuote.price && (
                      <div>
                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Teklif Tutarı</h4>
                        <p className="text-2xl font-black text-primary">₺{Number(String(selectedQuote.price || 0).replace(/[₺\s]/g, '').replace(',', '.')).toLocaleString('tr-TR')}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Tarih Bilgileri</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Oluşturulma:</span>
                          <span className="font-bold text-foreground">{selectedQuote.preparedAt ? new Date(selectedQuote.preparedAt).toLocaleDateString('tr-TR') : selectedQuote.date}</span>
                        </div>
                        {selectedQuote.expiryDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Geçerlilik:</span>
                            <span className="font-bold text-foreground">{new Date(selectedQuote.expiryDate).toLocaleDateString('tr-TR')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedQuote.message && (
                  <div className="p-6 bg-muted/30 rounded-3xl border border-border/50">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Yönetici Notu</h4>
                    <p className="text-sm text-foreground italic leading-relaxed">
                      " {selectedQuote.message} "
                    </p>
                  </div>
                )}

                {selectedQuote.details && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Talep Detayları</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedQuote.details.selectedServices && (
                        <div className="p-4 bg-muted/20 rounded-2xl border border-border/30">
                          <p className="text-xs text-muted-foreground mb-1">Seçilen Hizmetler</p>
                          <p className="text-sm font-bold text-foreground">{selectedQuote.service}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-border bg-muted/10">
                <div className="flex gap-4">
                  <Button 
                    variant="glass" 
                    onClick={() => setIsQuoteModalOpen(false)} 
                    className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                  >
                    Kapat
                  </Button>
                  {selectedQuote.status === 'Teklif Hazırlandı' && (
                    <>
                      <Button 
                        onClick={() => {
                          handleRejectQuote(selectedQuote);
                          setIsQuoteModalOpen(false);
                        }}
                        variant="glass" 
                        className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border-destructive/20 text-destructive"
                      >
                        Reddet
                      </Button>
                      <Button 
                        onClick={() => {
                          handleAcceptQuote(selectedQuote);
                          setIsQuoteModalOpen(false);
                        }}
                        className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                      >
                        Kabul Et
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Documents Modal */}
      <AnimatePresence>
        {showDocumentsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowDocumentsModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Müşteri Belgeleri</h3>
                  <p className="text-sm text-muted-foreground mt-1">Size ait tüm belgeler ve faturalar</p>
                </div>
                <Button variant="glass" onClick={() => setShowDocumentsModal(false)} className="rounded-full p-2">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {customerDetails.documents && customerDetails.documents.length > 0 ? (
                  <div className="space-y-4">
                    {customerDetails.documents.map((doc: any, idx: number) => (
                      <div key={`doc-item-${doc.id}-${idx}`} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{new Date(doc.date).toLocaleDateString('tr-TR')}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wider font-semibold">
                                {doc.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="glass" className="text-xs font-semibold p-2" onClick={() => window.open(doc.url || doc.fileData, '_blank')}>
                          Görüntüle
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">Belge Bulunamadı</h4>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Size ait henüz yüklenmiş bir belge bulunmuyor.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ticket Reply Modal */}
      <AnimatePresence>
        {isTicketReplyModalOpen && selectedTicket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTicketReplyModalOpen(false)}
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
                  setIsTicketReplyModalOpen(false);
                }} className="space-y-4">
                  <textarea 
                    rows={6}
                    required
                    placeholder="Yanıtınızı buraya yazın..."
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none text-foreground"
                  />
                  <div className="flex gap-4">
                    <Button 
                      type="button"
                      variant="glass" 
                      onClick={() => setIsTicketReplyModalOpen(false)} 
                      className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                    >
                      İptal
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]"
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
      {/* Refund Request Modal */}
      <AnimatePresence>
        {isRefundModalOpen && selectedRefundItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRefundModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <div className="p-8">
                <div className="w-16 h-16 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive mb-6">
                  <Undo2 size={32} />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight mb-2">İade Talebi Oluştur</h3>
                <p className="text-sm text-muted-foreground mb-8">
                  <span className="font-bold text-foreground">{selectedRefundItem.name || selectedRefundItem.serviceName || 'Üyelik'}</span> için iade talebi oluşturuyorsunuz. Lütfen iade nedeninizi belirtin.
                </p>
                
                <form onSubmit={handleRefundSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">İade Nedeni</label>
                    <textarea 
                      rows={4}
                      required
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      placeholder="İade talebinizin nedenini detaylıca açıklayın..."
                      className="w-full bg-input border border-border rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all resize-none text-foreground"
                    />
                  </div>

                  <div className="bg-muted/30 rounded-2xl p-4 border border-border">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">İade Edilecek Tutar:</span>
                      <span className="font-black text-foreground">₺{Number(selectedRefundItem.price || selectedRefundItem.amount || 0).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="button"
                      variant="glass" 
                      onClick={() => setIsRefundModalOpen(false)} 
                      className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                    >
                      Vazgeç
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isSubmitting ? 'Gönderiliyor...' : 'Talebi Gönder'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
