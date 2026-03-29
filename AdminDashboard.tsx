import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  CreditCard, 
  Wrench, 
  MessageSquare, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  LogOut,
  Settings,
  Bell,
  ChevronRight,
  Briefcase,
  Image,
  Edit2,
  Save,
  X,
  UserPlus,
  User,
  Mail,
  Lock,
  Layers,
  Zap,
  MapPin,
  ClipboardList,
  Star,
  FileText,
  Receipt,
  History,
  Calendar,
  Upload,
  Building2,
  Phone,
  ExternalLink,
  ShoppingCart,
  Undo2,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/ui/Button';
import { SupportChat } from './components/admin/SupportChat';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { apiFetch } from './lib/api';
import { galleryItems as initialGalleryItems, GalleryItem, galleryCategories } from './lib/galleryData';
import { Service } from './lib/servicesData';
import { iconMap } from './lib/iconMap';
import { ServiceModal } from './components/admin/ServiceModal';
import { DetailEditModal } from './components/admin/DetailEditModal';
import { QuoteModal } from './components/admin/QuoteModal';
import { AddCustomerModal } from './components/admin/AddCustomerModal';
import { CustomerDetailsModal } from './components/admin/CustomerDetailsModal';
import { PurchasableModal } from './components/admin/PurchasableModal';
import { PurchaseModal } from './components/admin/PurchaseModal';
import { TicketReplyModal } from './components/admin/TicketReplyModal';
import { WarrantyModal } from './components/admin/WarrantyModal';

// Mock Data for Admin
const initialCustomers: any[] = [];
const initialPayments: any[] = [];
const initialQuoteRequests: any[] = [];
const initialTickets: any[] = [];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isTicketReplyModalOpen, setIsTicketReplyModalOpen] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [purchasableServices, setPurchasableServices] = useState<any[]>([]);
  const [purchasedServices, setPurchasedServices] = useState<any[]>([]);
  const [isPurchasableModalOpen, setIsPurchasableModalOpen] = useState(false);
  const [editingPurchasable, setEditingPurchasable] = useState<any>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<any>(null);
  const [refundRequests, setRefundRequests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerDetails, setCustomerDetails] = useState<any>({
    services: [],
    payments: [],
    transactions: [],
    documents: []
  });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsTab, setDetailsTab] = useState('services');
  const [isEditingDetail, setIsEditingDetail] = useState<any>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Admin Management State
  const [admins, setAdmins] = useState<any[]>([]);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [newAdmin, setNewAdmin] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    permissions: ['overview'] as string[] 
  });
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Services Management State
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Testimonials Management State
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quotePrice, setQuotePrice] = useState<string>('');

  const combinedServices = [
    ...services.map(s => ({ ...s, type: 'Service' })),
    ...purchasableServices.map(s => ({ ...s, type: 'Market' }))
  ];

  const handlePrepareQuote = async () => {
    if (!selectedQuote) return;

    // Create a prepared quote object
    const preparedQuote = {
      ...selectedQuote,
      preparedAt: new Date().toISOString(),
      status: 'Teklif Hazırlandı',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days expiry
      price: quotePrice || selectedQuote.budget, // Use entered price or fallback to budget
      items: selectedQuote.details?.selectedServices || [],
      message: "Talebiniz incelenmiş ve size özel teklifimiz hazırlanmıştır. Detayları aşağıda görebilirsiniz."
    };

    try {
      // Update quote via API
      const response = await apiFetch(`/api/quotes/${selectedQuote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparedQuote)
      });

      if (response.ok) {
        // Send notification email via API
        await apiFetch('/api/quotes/prepare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preparedQuote)
        });

        // Update the local state of quotes to reflect the status change
        setQuotes(prev => prev.map(q => q.id === selectedQuote.id ? { ...q, ...preparedQuote } : q));
        
        // Reset state and close modal
        setQuotePrice('');
        setIsQuoteModalOpen(false);
        setSelectedQuote(null);
        
        alert('Teklif başarıyla hazırlandı ve müşteri paneline gönderildi!');
      } else {
        alert('Teklif hazırlanırken bir hata oluştu.');
      }
    } catch (error) {
      console.error("Failed to prepare quote:", error);
      alert('Teklif hazırlanırken bir hata oluştu.');
    }
  };

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    siteTitle: '',
    slogan: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    warrantyFee1Year: 1499,
    warrantyFee2Year: 2499,
    warrantyFee3Year: 3299,
    membershipFee: 150,
    aiCameraMonthlyFee: 250,
    packages: [] as any[]
  });

  const fetchAllPayments = async () => {
    try {
      const response = await apiFetch('/api/payments');
      if (response.ok) {
        setPayments(await response.json());
      }
    } catch (error) {
      console.error("Ödemeler yüklenirken hata oluştu:", error);
    }
  };

  // Check if user is admin (simulated)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== 'admin' && user.email !== "106077az@gmail.com") {
      navigate('/dashboard');
      return;
    }
    
    // Ensure main admin has all permissions
    if (user.email === "106077az@gmail.com") {
      const allIds = [
        'overview', 'customers', 'quotes', 'payments', 'support', 
        'purchased-services', 'refunds', 'packages', 'purchasable-services', 
        'gallery', 'testimonials', 'admins', 'settings'
      ];
      
      if (!user.permissions) {
        user.permissions = allIds;
      } else {
        // Add missing ones
        allIds.forEach(id => {
          if (!user.permissions.includes(id)) {
            user.permissions.push(id);
          }
        });
      }
    }
    
    setCurrentUser(user);
    
    // If user has permissions, and current tab is not allowed, switch to first allowed tab
    if (user.permissions && !user.permissions.includes(activeTab)) {
      setActiveTab(user.permissions[0] || 'overview');
    }

    // Load System Settings
    const fetchSettings = async () => {
      try {
        const response = await apiFetch('/api/settings');
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            setSystemSettings(data);
          }
        }
      } catch (error) {
        console.error("Ayarlar yüklenirken hata oluştu:", error);
      }
    };
    fetchSettings();

    // Load Data from Firestore
    const fetchData = async () => {
      try {
        const [quotesSnapshot, customersSnapshot, paymentsSnapshot, ticketsSnapshot] = await Promise.all([
          getDocs(collection(db, 'quotes')),
          getDocs(collection(db, 'customers')),
          getDocs(collection(db, 'payments')),
          getDocs(collection(db, 'tickets'))
        ]);
        
        setQuotes(quotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCustomers(customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setPayments(paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setTickets(ticketsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Veriler yüklenirken hata oluştu:", error);
      }
    };
    fetchData();

    // Load Gallery Items from Backend
    const fetchGallery = async () => {
      try {
        const response = await apiFetch('/api/gallery');
        if (response.ok) {
          const data = await response.json();
          setGalleryItems(data);
        }
      } catch (error) {
        console.error("Galeri yüklenirken hata oluştu:", error);
      }
    };
    fetchGallery();

    // Load Purchasable Services
    const fetchPurchasable = async () => {
      try {
        const response = await apiFetch('/api/purchasable-services');
        if (response.ok) setPurchasableServices(await response.json());
      } catch (error) {
        console.error("Satın alınabilir hizmetler yüklenirken hata:", error);
      }
    };
    fetchPurchasable();

    // Load Purchased Services
    const fetchPurchased = async () => {
      try {
        const response = await apiFetch('/api/purchased-services');
        if (response.ok) setPurchasedServices(await response.json());
      } catch (error) {
        console.error("Satın alınan hizmetler yüklenirken hata:", error);
      }
    };
    fetchPurchased();
    // Load Admins from Backend
    const fetchAdmins = async () => {
      try {
        const response = await apiFetch('/api/admins');
        if (response.ok) {
          const data = await response.json();
          setAdmins(data);
        }
      } catch (error) {
        console.error("Yöneticiler yüklenirken hata oluştu:", error);
      }
    };
    fetchAdmins();

    // Load Services from Backend
    const fetchServices = async () => {
      try {
        const response = await apiFetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error("Hizmetler yüklenirken hata oluştu:", error);
      }
    };
    fetchServices();

    // Load Testimonials from Backend
    const fetchTestimonials = async () => {
      try {
        const response = await apiFetch('/api/testimonials');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data);
        }
      } catch (error) {
        console.error("Geri dönüşler yüklenirken hata oluştu:", error);
      }
    };
    fetchTestimonials();

    // Load Refund Requests
    const fetchRefunds = async () => {
      try {
        const response = await apiFetch('/api/refund-requests');
        if (response.ok) setRefundRequests(await response.json());
      } catch (error) {
        console.error("İade talepleri yüklenirken hata:", error);
      }
    };
    fetchRefunds();
  }, [navigate]);

  const fetchCustomerDetails = async (customerId: string) => {
    try {
      const response = await apiFetch(`/api/customers/${customerId}/details`);
      if (response.ok) {
        const data = await response.json();
        setCustomerDetails(data);
      }
    } catch (error) {
      console.error("Müşteri detayları yüklenirken hata oluştu:", error);
    }
  };

  const handleDeletePurchase = async (id: string) => {
    if (!window.confirm('Bu satış kaydını silmek istediğinizden emin misiniz?')) return;
    try {
      const response = await apiFetch(`/api/purchased-services/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPurchasedServices(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Satış kaydı silinirken hata:", error);
    }
  };

  const calculateRemainingWarranty = (warrantyDate: string) => {
    if (!warrantyDate) return 'Belirsiz';
    const end = new Date(warrantyDate);
    const now = new Date();
    if (end < now) return 'Süresi Dolmuş';
    
    const diffTime = Math.abs(end.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      const months = Math.floor(remainingDays / 30);
      return `${years} yıl ${months > 0 ? `${months} ay ` : ''}kaldı`;
    } else if (diffDays > 30) {
      const months = Math.floor(diffDays / 30);
      const days = diffDays % 30;
      return `${months} ay ${days > 0 ? `${days} gün ` : ''}kaldı`;
    } else {
      return `${diffDays} gün kaldı`;
    }
  };

  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Create customer in server.ts
      const customerResponse = await apiFetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await customerResponse.json();
      
      if (!customerResponse.ok) {
        throw new Error(data.message || 'Müşteri eklenirken bir hata oluştu.');
      }

      setCustomers(prev => [data, ...prev]);
      setShowAddModal(false);
    } catch (error: any) {
      console.error("Error adding customer:", error);
      alert(error.message || "Müşteri eklenirken bir hata oluştu.");
    }
  };

  const handleAddCustomerService = async (service: any) => {
    try {
      const response = await apiFetch(`/api/customers/${selectedCustomer.id}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...service,
          customerName: selectedCustomer.name,
          customerEmail: selectedCustomer.email
        })
      });
      if (response.ok) {
        fetchCustomerDetails(selectedCustomer.id);
        setIsEditingDetail(null);
      }
    } catch (error) {
      console.error("Hizmet eklenirken hata oluştu:", error);
    }
  };

  const handleUpdateCustomerService = async (serviceId: string, updates: any) => {
    try {
      const response = await apiFetch(`/api/customers/${selectedCustomer.id}/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        fetchCustomerDetails(selectedCustomer.id);
        setIsEditingDetail(null);
      }
    } catch (error) {
      console.error("Hizmet güncellenirken hata oluştu:", error);
    }
  };

  const handleAddCustomerPayment = async (payment: any) => {
    try {
      const response = await apiFetch(`/api/customers/${selectedCustomer.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      });
      if (response.ok) {
        fetchCustomerDetails(selectedCustomer.id);
        fetchAllPayments(); // Sync main payments list
        setIsEditingDetail(null);
      }
    } catch (error) {
      console.error("Ödeme eklenirken hata oluştu:", error);
    }
  };

  const handleUpdateCustomerPayment = async (paymentId: string, updates: any) => {
    try {
      const response = await apiFetch(`/api/customers/${selectedCustomer.id}/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        fetchCustomerDetails(selectedCustomer.id);
        fetchAllPayments(); // Sync main payments list
        setIsEditingDetail(null);
      }
    } catch (error) {
      console.error("Ödeme güncellenirken hata oluştu:", error);
    }
  };

  const handleDeleteCustomerPayment = async (paymentId: string) => {
    if (!window.confirm('Bu ödeme kaydını silmek istediğinize emin misiniz?')) return;
    try {
      const response = await apiFetch(`/api/customers/${selectedCustomer.id}/payments/${paymentId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchCustomerDetails(selectedCustomer.id);
        fetchAllPayments(); // Sync main payments list
      }
    } catch (error) {
      console.error("Ödeme silinirken hata oluştu:", error);
    }
  };

  const handleUpdatePayment = async (paymentId: string, updates: any) => {
    try {
      const response = await apiFetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        fetchAllPayments();
        if (selectedCustomer) fetchCustomerDetails(selectedCustomer.id);
      }
    } catch (error) {
      console.error("Ödeme güncellenirken hata oluştu:", error);
    }
  };

  const handleAddCustomerTransaction = async (transaction: any) => {
    try {
      const response = await apiFetch(`/api/customers/${selectedCustomer.id}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      });
      if (response.ok) {
        fetchCustomerDetails(selectedCustomer.id);
        setIsEditingDetail(null);
      }
    } catch (error) {
      console.error("İşlem eklenirken hata oluştu:", error);
    }
  };

  const handleUpdateCustomerTransaction = async (transactionId: string, updates: any) => {
    try {
      const response = await apiFetch(`/api/customers/${selectedCustomer.id}/transactions/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        fetchCustomerDetails(selectedCustomer.id);
        setIsEditingDetail(null);
      }
    } catch (error) {
      console.error("İşlem güncellenirken hata oluştu:", error);
    }
  };

  const handleUploadDocument = async (doc: any) => {
    try {
      const response = await apiFetch(`/api/customers/${selectedCustomer.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      });
      if (response.ok) {
        fetchCustomerDetails(selectedCustomer.id);
        setIsEditingDetail(null);
      }
    } catch (error) {
      console.error("Belge yüklenirken hata oluştu:", error);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (window.confirm('Bu belgeyi silmek istediğinize emin misiniz?')) {
      try {
        const response = await apiFetch(`/api/customers/${selectedCustomer.id}/documents/${docId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchCustomerDetails(selectedCustomer.id);
        }
      } catch (error) {
        console.error("Belge silinirken hata oluştu:", error);
      }
    }
  };

  const handleAddEmployee = async (employee: any) => {
    try {
      const response = await apiFetch(`/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...employee, customerId: selectedCustomer.id })
      });
      if (response.ok) {
        fetchCustomerDetails(selectedCustomer.id);
        setIsEditingDetail(null);
      }
    } catch (error) {
      console.error("Çalışan eklenirken hata oluştu:", error);
    }
  };

  const handleUpdateEmployee = async (id: string, employee: any) => {
    try {
      const response = await apiFetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      if (response.ok) {
        fetchCustomerDetails(selectedCustomer.id);
        setIsEditingDetail(null);
      }
    } catch (error) {
      console.error("Çalışan güncellenirken hata oluştu:", error);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Bu çalışanı silmek istediğinize emin misiniz?')) {
      try {
        const response = await apiFetch(`/api/employees/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchCustomerDetails(selectedCustomer.id);
        }
      } catch (error) {
        console.error("Çalışan silinirken hata oluştu:", error);
      }
    }
  };

  const handleUpdateSettings = async (updates: any) => {
    try {
      const response = await apiFetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...systemSettings, ...updates })
      });
      if (response.ok) {
        const data = await response.json();
        setSystemSettings(data);
      }
    } catch (error) {
      console.error("Ayarlar güncellenirken hata oluştu:", error);
    }
  };

  // Admin CRUD Operations
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiFetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      });
      if (response.ok) {
        const created = await response.json();
        setAdmins([...admins, created]);
        setShowAddAdminModal(false);
        setNewAdmin({ name: '', email: '', password: '', permissions: ['overview'] });
      } else {
        const data = await response.json();
        alert(data.message || "Yönetici eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Yönetici eklenirken hata oluştu:", error);
    }
  };

  const togglePermission = (permId: string) => {
    setNewAdmin(prev => {
      const perms = prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: perms };
    });
  };

  const toggleAllPermissions = () => {
    setNewAdmin(prev => {
      const allIds = sidebarLinks.map(l => l.id);
      const isAllSelected = prev.permissions.length === allIds.length;
      return { ...prev, permissions: isAllSelected ? [] : allIds };
    });
  };

  const handleEditAdmin = (admin: any) => {
    setEditingAdmin({ ...admin, password: '' });
    setShowEditAdminModal(true);
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiFetch(`/api/admins/${editingAdmin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAdmin)
      });
      if (response.ok) {
        const updated = await response.json();
        setAdmins(admins.map(a => a.id === updated.id ? updated : a));
        setShowEditAdminModal(false);
        setEditingAdmin(null);
      } else {
        const data = await response.json();
        alert(data.message || "Yönetici güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Yönetici güncellenirken hata oluştu:", error);
    }
  };

  const toggleEditPermission = (permId: string) => {
    setEditingAdmin((prev: any) => {
      const perms = prev.permissions.includes(permId)
        ? prev.permissions.filter((p: string) => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: perms };
    });
  };

  const toggleAllEditPermissions = () => {
    setEditingAdmin((prev: any) => {
      const allIds = sidebarLinks.map(l => l.id);
      const isAllSelected = prev.permissions.length === allIds.length;
      return { ...prev, permissions: isAllSelected ? [] : allIds };
    });
  };

  const handleDeleteAdmin = async (id: string) => {
    if (window.confirm('Bu yöneticiyi silmek istediğinize emin misiniz?')) {
      try {
        const response = await apiFetch(`/api/admins/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setAdmins(admins.filter(a => a.id.toString() !== id.toString()));
        }
      } catch (error) {
        console.error("Yönetici silinirken hata oluştu:", error);
      }
    }
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingItem(prev => ({ ...prev!, src: reader.result as string }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleTestimonialImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingTestimonial((prev: any) => ({ ...prev!, image: reader.result as string }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Gallery CRUD Operations
  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const newItem: Partial<GalleryItem> = {
      title: editingItem.title || '',
      category: editingItem.category || 'Diğer',
      src: editingItem.src || '',
      description: editingItem.description || '',
      tags: editingItem.tags || [],
      date: editingItem.date || new Date().toISOString().split('T')[0],
      width: editingItem.width || 800,
      height: editingItem.height || 600,
      featured: editingItem.featured || false
    };

    try {
      if (editingItem.id) {
        // Update existing
        const response = await apiFetch(`/api/gallery/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
        if (response.ok) {
          const updated = await response.json();
          setGalleryItems(galleryItems.map(item => item.id === updated.id ? updated : item));
        }
      } else {
        // Create new
        const response = await apiFetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
        if (response.ok) {
          const created = await response.json();
          setGalleryItems([created, ...galleryItems]);
        }
      }
      setIsGalleryModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Proje kaydedilirken hata oluştu:", error);
      alert("Proje kaydedilirken bir hata oluştu.");
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (window.confirm('Bu projeyi silmek istediğinize emin misiniz?')) {
      try {
        const response = await apiFetch(`/api/gallery/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setGalleryItems(galleryItems.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error("Proje silinirken hata oluştu:", error);
      }
    }
  };

  const openEditModal = (item?: GalleryItem) => {
    if (item) {
      setEditingItem(item);
    } else {
      setEditingItem({
        title: '',
        category: galleryCategories[1], // Default to first real category
        src: '',
        description: '',
        tags: [],
        featured: false
      });
    }
    setIsGalleryModalOpen(true);
  };

  // Services CRUD Operations
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const newService: Partial<Service> = {
      id: editingService.id || editingService.title?.toLowerCase().replace(/\s+/g, '-') || '',
      title: editingService.title || '',
      category: editingService.category || 'Güvenlik',
      tagline: editingService.tagline || '',
      problem: editingService.problem || '',
      solution: editingService.solution || '',
      features: editingService.features || [],
      process_steps: editingService.process_steps || [],
      deliverables: editingService.deliverables || [],
      faq: editingService.faq || [],
      icon: editingService.icon || 'Shield',
      color: editingService.color || '#3b82f6',
      metrics: editingService.metrics || []
    };

    try {
      if (editingService.id) {
        // Update existing
        const response = await apiFetch(`/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newService)
        });
        if (response.ok) {
          const updated = await response.json();
          setServices(services.map(item => item.id === updated.id ? updated : item));
        }
      } else {
        // Create new
        const response = await apiFetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newService)
        });
        if (response.ok) {
          const created = await response.json();
          setServices([created, ...services]);
        }
      }
      setIsServiceModalOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error("Hizmet kaydedilirken hata oluştu:", error);
      alert("Hizmet kaydedilirken bir hata oluştu.");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Bu hizmeti silmek istediğinize emin misiniz?')) {
      try {
        const response = await apiFetch(`/api/services/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setServices(services.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error("Hizmet silinirken hata oluştu:", error);
      }
    }
  };

  const openServiceModal = (item?: Service) => {
    if (item) {
      setEditingService(item);
    } else {
      setEditingService({
        title: '',
        category: 'Güvenlik',
        tagline: '',
        problem: '',
        solution: '',
        features: [],
        process_steps: [],
        deliverables: [],
        faq: [],
        icon: 'Shield',
        color: '#3b82f6',
        metrics: []
      });
    }
    setIsServiceModalOpen(true);
  };

  // Testimonials CRUD Operations
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    try {
      if (editingTestimonial.id) {
        // Update existing
        const response = await apiFetch(`/api/testimonials/${editingTestimonial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingTestimonial)
        });
        if (response.ok) {
          const updated = await response.json();
          setTestimonials(testimonials.map(item => item.id === updated.id ? updated : item));
        }
      } else {
        // Create new
        const response = await apiFetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingTestimonial)
        });
        if (response.ok) {
          const created = await response.json();
          setTestimonials([created, ...testimonials]);
        }
      }
      setIsTestimonialModalOpen(false);
      setEditingTestimonial(null);
    } catch (error) {
      console.error("Geri dönüş kaydedilirken hata oluştu:", error);
      alert("Geri dönüş kaydedilirken bir hata oluştu.");
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Bu geri dönüşü silmek istediğinize emin misiniz?')) {
      try {
        const response = await apiFetch(`/api/testimonials/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setTestimonials(testimonials.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error("Geri dönüş silinirken hata oluştu:", error);
      }
    }
  };

  const openTestimonialModal = (item?: any) => {
    if (item) {
      setEditingTestimonial(item);
    } else {
      setEditingTestimonial({
        name: '',
        role: '',
        content: '',
        rating: 5,
        image: `https://picsum.photos/seed/${Math.random()}/100/100`
      });
    }
    setIsTestimonialModalOpen(true);
  };

  const openPurchasableModal = (item?: any) => {
    if (item) {
      setEditingPurchasable(item);
    } else {
      setEditingPurchasable({
        name: '',
        description: '',
        price: 0,
        icon: 'Briefcase'
      });
    }
    setIsPurchasableModalOpen(true);
  };

  const handleSavePurchasable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPurchasable.id) {
        const response = await apiFetch(`/api/purchasable-services/${editingPurchasable.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingPurchasable)
        });
        if (response.ok) {
          const updated = await response.json();
          setPurchasableServices(purchasableServices.map(s => s.id === updated.id ? updated : s));
        }
      } else {
        const response = await apiFetch('/api/purchasable-services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingPurchasable)
        });
        if (response.ok) {
          const created = await response.json();
          setPurchasableServices([created, ...purchasableServices]);
        }
      }
      setIsPurchasableModalOpen(false);
      setEditingPurchasable(null);
    } catch (error) {
      console.error("Hizmet kaydedilirken hata:", error);
    }
  };

  const handleDeletePurchasable = async (id: string) => {
    if (window.confirm('Bu hizmeti silmek istediğinize emin misiniz?')) {
      try {
        const response = await apiFetch(`/api/purchasable-services/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setPurchasableServices(purchasableServices.filter(s => s.id !== id));
        }
      } catch (error) {
        console.error("Hizmet silinirken hata:", error);
      }
    }
  };

  const openPurchaseModal = (purchase?: any) => {
    if (purchase) {
      setEditingPurchase(purchase);
    } else {
      setEditingPurchase({
        customerId: '',
        customerName: '',
        customerEmail: '',
        serviceId: '',
        serviceName: '',
        price: 0,
        status: 'Ödeme Alındı',
        purchaseDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsPurchaseModalOpen(true);
  };

  const handleSavePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingPurchase.id;
    const url = isEditing ? `/api/purchased-services/${editingPurchase.id}` : '/api/purchased-services';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPurchase)
      });

      if (response.ok) {
        const savedPurchase = await response.json();
        if (isEditing) {
          setPurchasedServices(prev => prev.map(item => item.id === savedPurchase.id ? savedPurchase : item));
        } else {
          setPurchasedServices(prev => [savedPurchase, ...prev]);
        }
        setIsPurchaseModalOpen(false);
      }
    } catch (error) {
      console.error("Satış kaydetme hatası:", error);
    }
  };

  const handleUpdateRefundStatus = async (id: string, status: string) => {
    try {
      const response = await apiFetch(`/api/refund-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        const updated = await response.json();
        setRefundRequests(prev => prev.map(r => r.id === id ? updated : r));
        alert(`İade talebi ${status.toLowerCase()} olarak güncellendi.`);
      }
    } catch (error) {
      console.error("İade durumu güncellenirken hata:", error);
    }
  };

  const handleDeleteRefund = async (id: string) => {
    if (window.confirm('Bu iade talebini silmek istediğinize emin misiniz?')) {
      try {
        const response = await apiFetch(`/api/refund-requests/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setRefundRequests(prev => prev.filter(r => r.id !== id));
        }
      } catch (error) {
        console.error("İade silme hatası:", error);
      }
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'customers', id));
        setCustomers(customers.filter(c => String(c.id) !== String(id)));
      } catch (error) {
        console.error('Müşteri silinirken hata:', error);
        alert('Müşteri silinirken bir hata oluştu.');
      }
    }
  };

  const totalRevenue = payments.reduce((sum, p) => {
    if (p.status === 'İptal Edildi' || p.status === 'İade Edildi') return sum;
    if (typeof p.amount === 'number') return sum + p.amount;
    if (typeof p.amount === 'string') {
      // Remove currency symbol and thousands separator (comma or dot)
      const amount = parseFloat(p.amount.replace(/[^0-9.]/g, ""));
      return sum + (isNaN(amount) ? 0 : amount);
    }
    return sum;
  }, 0);

  const activeCustomers = customers.filter(c => c.status === 'Aktif').length;
  const pendingQuotes = quotes.filter(q => q.status === 'Yeni' || q.status === 'İnceleniyor').length;
  const openTickets = tickets.filter(t => t.status === 'Açık' || t.status === 'İşleniyor').length;

  const stats = [
    { label: 'Toplam Gelir', value: `₺${totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, icon: CreditCard, color: 'text-success', trend: '+12.5%', isUp: true },
    { label: 'Aktif Müşteriler', value: activeCustomers.toString(), icon: Users, color: 'text-primary', trend: '+5.2%', isUp: true },
    { label: 'Bekleyen Teklifler', value: pendingQuotes.toString(), icon: MessageSquare, color: 'text-warning', trend: '-2.4%', isUp: false },
    { label: 'Açık Talepler', value: openTickets.toString(), icon: Wrench, color: 'text-destructive', trend: '+1', isUp: true },
  ];

  const sidebarLinks = [
    { id: 'overview', label: 'Genel Bakış', icon: LayoutDashboard },
    { id: 'customers', label: 'Müşteri Yönetimi', icon: Users },
    { id: 'quotes', label: 'Teklif Talepleri', icon: MessageSquare },
    { id: 'payments', label: 'Ödemeler', icon: CreditCard },
    { id: 'support', label: 'Destek Masası', icon: Wrench },
    { id: 'purchased-services', label: 'Satış Kayıtları', icon: ShoppingCart },
    { id: 'refunds', label: 'İade Talepleri', icon: Undo2 },
    { id: 'packages', label: 'Paket Yönetimi', icon: Package },
    { id: 'purchasable-services', label: 'Hizmet Marketi (Genel)', icon: Briefcase },
    { id: 'gallery', label: 'Galeri Yönetimi', icon: Image },
    { id: 'testimonials', label: 'Müşteri Yorumları', icon: MessageSquare },
    { id: 'admins', label: 'Yöneticiler', icon: Shield },
    { id: 'settings', label: 'Sistem Ayarları', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-muted-foreground font-sans selection:bg-primary/30 transition-colors duration-300">
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

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-72 bg-card/50 border-r border-border backdrop-blur-2xl z-50 flex flex-col transition-all duration-300 overflow-y-auto ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-8">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative group-hover:scale-105 transition-transform duration-300 w-16 h-16">
              <img src="/logo.png" alt="Logo" className="absolute -top-4 -left-4 h-24 w-auto object-contain z-10" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="text-foreground font-black tracking-tighter text-xl leading-none">EMİN BİLGİ İŞLEM</h1>
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-1">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarLinks
            .filter(link => !currentUser?.permissions || currentUser.permissions.includes(link.id))
            .map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                activeTab === link.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <link.icon size={20} className={activeTab === link.id ? 'text-primary-foreground' : 'group-hover:text-foreground'} />
              <span className="text-sm font-bold tracking-tight">{link.label}</span>
              {activeTab === link.id && (
                <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-border">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-bold">Müşteri Paneline Dön</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 p-8 lg:p-12 bg-background transition-colors duration-300">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="lg:hidden">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground transition-colors"
              >
                <LayoutDashboard size={24} />
              </button>
            </div>
            <div className="md:hidden">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="relative group-hover:scale-105 transition-transform duration-300 w-16 h-16 shrink-0">
                  <img src="/logo.png" alt="Logo" className="absolute -top-4 -left-4 h-24 w-auto object-contain z-10" referrerPolicy="no-referrer" />
                </div>
                <h1 className="text-foreground font-black tracking-tighter text-lg truncate max-w-[120px] xs:max-w-none">EMİN BİLGİ İŞLEM</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">
                {sidebarLinks.find(l => l.id === activeTab)?.label}
              </h2>
              <p className="text-muted-foreground text-sm font-medium">Sistem durumu: <span className="text-success font-bold">Operasyonel</span></p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="text" 
                placeholder="Hızlı arama..." 
                className="bg-card/50 border border-border rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all w-64 text-foreground"
              />
            </div>
            <button className="p-3 bg-card/50 border border-border rounded-2xl text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[1px]">
              <div className="w-full h-full rounded-[15px] bg-card flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-8 h-8" />
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={`stat-overview-${stat.label}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 bg-card/40 border border-border rounded-[2rem] relative overflow-hidden group shadow-sm"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                    <div className="relative z-10 flex flex-col gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-card flex items-center justify-center ${stat.color} shadow-sm dark:shadow-lg border border-border`}>
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                        <div className="flex items-end gap-3">
                          <h3 className="text-2xl font-black text-foreground tracking-tight">{stat.value}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${stat.isUp ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                            {stat.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                            {stat.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="xl:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-foreground tracking-tight">Son Ödemeler</h3>
                    <button onClick={() => setActiveTab('payments')} className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                      Tümünü Gör <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="bg-card/40 border border-border rounded-[2rem] overflow-x-auto shadow-sm">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border bg-card/50">
                          <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Müşteri</th>
                          <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Miktar</th>
                          <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tarih</th>
                          <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment, idx) => (
                          <tr key={`payment-row-${payment.id}-${idx}`} className="border-b border-border hover:bg-muted/50 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center text-muted-foreground font-bold text-xs border border-border">
                                  {payment.customer?.charAt(0) || '?'}
                                </div>
                                <span className="text-sm font-bold text-foreground">{payment.customer}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-sm font-black text-foreground">{payment.amount}</td>
                            <td className="px-8 py-5 text-sm text-muted-foreground font-medium">{payment.date}</td>
                            <td className="px-8 py-5 text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                payment.status === 'Tamamlandı' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                              }`}>
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Actions / System Health */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-foreground tracking-tight">Sistem Sağlığı</h3>
                  <div className="p-8 bg-card/40 border border-border rounded-[2rem] space-y-8 shadow-sm">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground">Sunucu Kapasitesi</span>
                        <span className="text-xs font-black text-success">24%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[24%] bg-success rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground">Veritabanı Yükü</span>
                        <span className="text-xs font-black text-primary">12%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[12%] bg-primary rounded-full" />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <AlertCircle size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-foreground uppercase tracking-widest">Güncelleme</p>
                          <p className="text-[10px] text-muted-foreground font-medium mt-1">Sistem v2.4.0 hazır.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'customers' && (
            <motion.div 
              key="customers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    type="text" 
                    placeholder="Müşteri ara (isim, email, ID)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-card/50 border border-border rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border-border">
                    <Download size={16} /> Dışa Aktar
                  </Button>
                  <Button onClick={() => setShowAddModal(true)} className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Plus size={16} /> Yeni Müşteri
                  </Button>
                </div>
              </div>

              <div className="bg-card/40 border border-border rounded-[2rem] overflow-x-auto shadow-2xl">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border bg-card/50">
                      <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Müşteri Bilgisi</th>
                      <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Durum</th>
                      <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hizmetler</th>
                      <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Kayıt Tarihi</th>
                      <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase())).map((customer, idx) => (
                      <tr key={`customer-row-${customer.id}-${idx}`} className="border-b border-border hover:bg-muted/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center text-primary font-black text-lg shadow-inner border border-border">
                              {customer.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <div className="text-sm font-black text-foreground">{customer.name}</div>
                              <div className="flex flex-col gap-0.5 mt-0.5">
                                <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                  <Mail size={10} /> {customer.email}
                                </div>
                                {customer.phone && (
                                  <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                    <Phone size={10} /> {customer.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            customer.status === 'Aktif' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${customer.status === 'Aktif' ? 'bg-success' : 'bg-warning'}`} />
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <Shield size={14} className="text-muted-foreground" />
                            <span className="text-sm font-bold text-foreground">{customer.services} Hizmet</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-muted-foreground font-medium">{customer.joinDate}</td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setSelectedCustomer(customer);
                                fetchCustomerDetails(customer.id);
                                setIsDetailsModalOpen(true);
                              }}
                              className="p-2.5 hover:bg-primary/10 rounded-xl text-muted-foreground hover:text-primary transition-colors"
                              title="Müşteri Detayları"
                            >
                              <ClipboardList size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedCustomer(customer);
                                fetchCustomerDetails(customer.id);
                                setShowWarrantyModal(true);
                              }}
                              className="p-2.5 hover:bg-primary/10 rounded-xl text-muted-foreground hover:text-primary transition-colors"
                              title="Garantileri Düzenle"
                            >
                              <Shield size={18} />
                            </button>
                            <button className="p-2.5 hover:bg-primary/10 rounded-xl text-muted-foreground hover:text-primary transition-colors">
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="p-2.5 hover:bg-destructive/10 rounded-xl text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button className="p-2.5 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'quotes' && (
            <motion.div 
              key="quotes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {quotes.map((quote, idx) => (
                  <div key={`quote-card-${quote.id}-${idx}`} className="p-8 bg-card/40 border border-border rounded-[2.5rem] relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 p-8">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        quote.status === 'Yeni' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'
                      }`}>
                        {quote.status}
                      </span>
                    </div>
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-card flex items-center justify-center text-primary shadow-sm dark:shadow-xl border border-border">
                          <Briefcase size={28} />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-foreground tracking-tight">{quote.service}</h4>
                          <p className="text-sm text-muted-foreground font-medium">{quote.customer}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Tahmini Bütçe</p>
                          <p className="text-sm font-bold text-foreground">{quote.budget}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Talep Tarihi</p>
                          <p className="text-sm font-bold text-foreground">{quote.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <Button 
                          onClick={() => {
                            setSelectedQuote(quote);
                            setQuotePrice(quote.budget); // Pre-fill with budget
                            setIsQuoteModalOpen(true);
                          }}
                          className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest"
                        >
                          Detayları Gör
                        </Button>
                        <Button variant="secondary" className="px-6 py-4 rounded-2xl border-border">
                          <MoreVertical size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Ödemeler</h2>
                  <p className="text-muted-foreground text-sm font-medium mt-1">Finansal işlemleri ve ödeme geçmişini takip edin.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" className="gap-2 px-6 py-3 rounded-2xl border-border">
                    <Download size={20} /> Rapor İndir
                  </Button>
                  <Button className="gap-2 px-6 py-3 rounded-2xl shadow-xl shadow-primary/20">
                    <Plus size={20} /> Yeni Ödeme Kaydı
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Toplam Tahsilat', value: `₺${payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0).toLocaleString('tr-TR')}`, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
                  { label: 'Bekleyen Ödemeler', value: `₺${payments.filter(p => p.status !== 'Tamamlandı').reduce((acc, p) => acc + (Number(p.amount) || 0), 0).toLocaleString('tr-TR')}`, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
                  { label: 'İşlem Sayısı', value: payments.length.toString(), icon: History, color: 'text-primary', bg: 'bg-primary/10' }
                ].map((stat) => (
                  <div key={`payment-stat-${stat.label}`} className="bg-card/40 border-2 border-primary/10 rounded-[2rem] p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                        <div className="text-2xl font-black text-foreground">{stat.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card/40 border-2 border-primary/10 rounded-[2.5rem] overflow-x-auto shadow-xl">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Müşteri</th>
                      <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tutar</th>
                      <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Yöntem / Açıklama</th>
                      <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tarih</th>
                      <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {payments.length > 0 ? (
                      payments.map((payment, idx) => {
                        const refund = refundRequests.find(r => r.itemId === payment.serviceId && r.status === 'Onaylandı');
                        const isRefunded = payment.status === 'hizmet iade edildi' || payment.status === 'İade Edildi' || !!refund;
                        
                        return (
                          <tr key={`payment-row-all-${payment.id}-${idx}`} className="hover:bg-muted/20 transition-colors group">
                            <td className="px-8 py-5">
                              {(() => {
                                const customer = customers.find(c => String(c.id) === String(payment.customerId));
                                return (
                                  <div 
                                    className="cursor-pointer group/customer" 
                                    onClick={() => {
                                      if (customer) {
                                        setSelectedCustomer(customer);
                                        fetchCustomerDetails(customer.id);
                                        setIsDetailsModalOpen(true);
                                      }
                                    }}
                                  >
                                    <div className="text-sm font-bold text-foreground group-hover/customer:text-primary transition-colors">
                                      {customer?.name || payment.customer || payment.customerId}
                                    </div>
                                    <div className="flex flex-col gap-0.5 mt-1">
                                      {customer?.email && (
                                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                          <Mail size={10} />
                                          {customer.email}
                                        </div>
                                      )}
                                      {customer?.phone && (
                                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                          <Phone size={10} />
                                          {customer.phone}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="px-8 py-5">
                              <div className="text-sm font-black text-foreground">₺{Number(payment.amount).toLocaleString('tr-TR')}</div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="text-xs font-medium text-muted-foreground">{payment.description || payment.method}</div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="text-xs font-medium text-muted-foreground">{new Date(payment.date).toLocaleDateString('tr-TR')}</div>
                            </td>
                            <td className="px-8 py-5">
                              <select 
                                value={payment.status}
                                onChange={(e) => handleUpdatePayment(payment.id, { status: e.target.value })}
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer ${
                                  isRefunded ? 'bg-destructive/10 text-destructive' :
                                  payment.status === 'Tamamlandı' ? 'bg-success/10 text-success' : 
                                  payment.status === 'Beklemede' || payment.status === 'Bekliyor' ? 'bg-warning/10 text-warning' : 
                                  payment.status === 'İşlemde' ? 'bg-primary/10 text-primary' :
                                  'bg-destructive/10 text-destructive'
                                }`}
                              >
                                <option value="Bekliyor" className="bg-background text-foreground">Bekliyor</option>
                                <option value="İşlemde" className="bg-background text-foreground">İşlemde</option>
                                <option value="Tamamlandı" className="bg-background text-foreground">Tamamlandı</option>
                                <option value="İptal Edildi" className="bg-background text-foreground">İptal Edildi</option>
                                <option value="İade Edildi" className="bg-background text-foreground">İade Edildi</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-12 text-center text-muted-foreground italic">
                          Henüz kayıtlı bir ödeme bulunmuyor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'support' && (
            <motion.div 
              key="support"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">Destek Masası</h2>
                  <p className="text-sm text-muted-foreground font-medium">Müşterilerden gelen talepleri yanıtlayın ve canlı sohbet edin.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Sistem Çevrimiçi
                </div>
              </div>
              <SupportChat 
                user={currentUser || { id: 'admin', name: 'Yönetici', email: 'admin@example.com' }} 
                isAdminView={true} 
              />
            </motion.div>
          )}

          {/* Quote Details Modal */}
          <AnimatePresence>
            <QuoteModal 
              isOpen={isQuoteModalOpen}
              onClose={() => setIsQuoteModalOpen(false)}
              selectedQuote={selectedQuote}
              quotePrice={quotePrice}
              setQuotePrice={setQuotePrice}
              onPrepareQuote={handlePrepareQuote}
            />
          </AnimatePresence>

          {/* Gallery Management Tab */}
          {/* Gallery Management Tab */}
          {activeTab === 'purchased-services' && (
            <motion.div
              key="purchased-services"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">Satış Kayıtları</h2>
                  <p className="text-sm text-muted-foreground font-medium">Müşterilerin satın aldığı hizmetlerin geçmişi ve takibi.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="glass" onClick={() => setActiveTab('purchasable-services')} className="gap-2">
                    <Briefcase size={18} /> Marketi Yönet
                  </Button>
                  <Button onClick={() => openPurchaseModal()} className="gap-2">
                    <Plus size={18} /> Manuel Satış Ekle
                  </Button>
                </div>
              </div>

              <div className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Müşteri</th>
                        <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hizmet</th>
                        <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tutar</th>
                        <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tarih</th>
                        <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Durum</th>
                        <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {purchasedServices.map((purchase, idx) => (
                        <tr key={`purchase-row-${purchase.id}-${idx}`} className="hover:bg-muted/20 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {purchase.customerName?.charAt(0) || '?'}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-foreground">{purchase.customerName}</div>
                                <div className="text-[10px] text-muted-foreground font-medium">{purchase.customerEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="text-sm font-bold text-foreground">{purchase.serviceName}</div>
                          </td>
                          <td className="p-6">
                            <div className="text-sm font-black text-primary">₺{purchase.price.toLocaleString('tr-TR')}</div>
                          </td>
                          <td className="p-6">
                            <div className="text-sm text-muted-foreground font-medium">{new Date(purchase.purchaseDate).toLocaleDateString('tr-TR')}</div>
                          </td>
                          <td className="p-6">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${
                              purchase.status === 'İş Tamamlandı' || purchase.status === 'Ödeme Alındı / İş Tamamlandı' ? 'bg-success/10 text-success' : 
                              purchase.status === 'Ödeme Alındı' ? 'bg-primary/10 text-primary' : 
                              'bg-warning/10 text-warning'
                            }`}>
                              {purchase.status || 'Ödeme Alındı / İş Tamamlandı'}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => openPurchaseModal(purchase)}
                                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeletePurchase(purchase.id)}
                                className="p-2 hover:bg-muted rounded-xl text-destructive hover:text-destructive/80 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {purchasedServices.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-muted-foreground font-medium">Henüz hizmet satışı bulunmuyor.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'refunds' && (
            <motion.div
              key="refunds"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">İade Talepleri</h2>
                  <p className="text-sm text-muted-foreground font-medium">Müşterilerden gelen iade isteklerini buradan yönetin.</p>
                </div>
              </div>

              <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Müşteri</th>
                        <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hizmet/Üyelik</th>
                        <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tutar</th>
                        <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Neden</th>
                        <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Durum</th>
                        <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {refundRequests.map((request, idx) => (
                        <tr key={`refund-row-${request.id}-${idx}`} className="hover:bg-muted/20 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {request.customerName?.charAt(0) || '?'}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-foreground">{request.customerName}</div>
                                <div className="text-[10px] text-muted-foreground font-medium">{request.customerEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="text-sm font-bold text-foreground">{request.itemName}</div>
                            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{request.itemType}</div>
                          </td>
                          <td className="p-6">
                            <div className="text-sm font-black text-primary">₺{request.amount.toLocaleString('tr-TR')}</div>
                          </td>
                          <td className="p-6">
                            <div className="text-xs text-muted-foreground font-medium max-w-xs truncate" title={request.reason}>
                              {request.reason}
                            </div>
                          </td>
                          <td className="p-6">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${
                              request.status === 'Onaylandı' ? 'bg-success/10 text-success' : 
                              request.status === 'Reddedildi' ? 'bg-destructive/10 text-destructive' : 
                              'bg-warning/10 text-warning'
                            }`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {request.status === 'Beklemede' && (
                                <>
                                  <button 
                                    onClick={() => handleUpdateRefundStatus(request.id, 'Onaylandı')}
                                    className="p-2 hover:bg-success/10 rounded-xl text-success transition-colors"
                                    title="Onayla"
                                  >
                                    <CheckCircle2 size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateRefundStatus(request.id, 'Reddedildi')}
                                    className="p-2 hover:bg-destructive/10 rounded-xl text-destructive transition-colors"
                                    title="Reddet"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              )}
                              <button 
                                onClick={() => handleDeleteRefund(request.id)}
                                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                                title="Sil"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {refundRequests.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-muted-foreground font-medium">Henüz iade talebi bulunmuyor.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
                  <h2 className="text-2xl font-black text-foreground tracking-tight">Paket Yönetimi</h2>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Üyelik paketlerini ve avantajlarını buradan yönetin.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {systemSettings.packages?.map((pkg: any, pkgIndex: number) => (
                  <div key={pkg.id} className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${
                        pkg.id === 'silver' ? 'bg-slate-100 dark:bg-slate-800' :
                        pkg.id === 'gold' ? 'bg-amber-100 dark:bg-amber-900/30' :
                        'bg-primary/20'
                      } flex items-center justify-center`}>
                        <Package className={pkg.id === 'platinum' ? 'text-primary' : 'text-muted-foreground'} size={24} />
                      </div>
                      <div>
                        <input 
                          value={pkg.name}
                          onChange={(e) => {
                            const newPackages = [...systemSettings.packages];
                            newPackages[pkgIndex].name = e.target.value;
                            handleUpdateSettings({ packages: newPackages });
                          }}
                          className="text-lg font-bold text-foreground bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{pkg.id}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fiyat (₺)</label>
                        <input 
                          type="number"
                          value={pkg.price}
                          onChange={(e) => {
                            const newPackages = [...systemSettings.packages];
                            newPackages[pkgIndex].price = Number(e.target.value);
                            handleUpdateSettings({ packages: newPackages });
                          }}
                          className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Avantajlar</label>
                        <div className="space-y-2">
                          {pkg.features.map((feature: string, featureIndex: number) => (
                            <div key={featureIndex} className="flex gap-2">
                              <input 
                                value={feature}
                                onChange={(e) => {
                                  const newPackages = [...systemSettings.packages];
                                  newPackages[pkgIndex].features[featureIndex] = e.target.value;
                                  handleUpdateSettings({ packages: newPackages });
                                }}
                                className="flex-1 bg-input border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors text-foreground"
                              />
                              <button 
                                onClick={() => {
                                  const newPackages = [...systemSettings.packages];
                                  newPackages[pkgIndex].features.splice(featureIndex, 1);
                                  handleUpdateSettings({ packages: newPackages });
                                }}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const newPackages = [...systemSettings.packages];
                              newPackages[pkgIndex].features.push('Yeni Avantaj');
                              handleUpdateSettings({ packages: newPackages });
                            }}
                            className="w-full py-2 border border-dashed border-border rounded-xl text-[10px] font-bold text-muted-foreground hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
                          >
                            <Plus size={12} /> Avantaj Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'purchasable-services' && (
            <motion.div
              key="purchasable-services"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">Hizmet Marketi (Genel)</h2>
                  <p className="text-sm text-muted-foreground font-medium">Buraya eklediğiniz her hizmet tüm müşterilerin panelinde "Hizmet Satın Al" kısmında görünür.</p>
                </div>
                <Button onClick={() => openPurchasableModal()} className="gap-2">
                  <Plus size={18} /> Yeni Hizmet Tanımla
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasableServices.map((service, idx) => (
                  <div key={`purchasable-card-${service.id}-${idx}`} className="bg-card rounded-[2rem] border border-border p-6 shadow-sm hover:border-primary/50 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Briefcase size={28} />
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openPurchasableModal(service)}
                          className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeletePurchasable(service.id)}
                          className="p-2 hover:bg-muted rounded-xl text-destructive hover:text-destructive/80 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{service.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium mb-6 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-border">
                      <div className="text-2xl font-black text-primary">₺{service.price.toLocaleString('tr-TR')}</div>
                    </div>
                  </div>
                ))}
                {purchasableServices.length === 0 && (
                  <div className="col-span-full p-12 text-center bg-muted/20 rounded-[2rem] border border-dashed border-border text-muted-foreground font-medium">
                    Henüz eklenmiş bir hizmet bulunmuyor.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-foreground">Galeri Yönetimi</h2>
                <Button onClick={() => openEditModal()} className="gap-2">
                  <Plus size={18} /> Yeni Proje Ekle
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item, idx) => (
                  <div key={`gallery-card-${item.id}-${idx}`} className="bg-card rounded-2xl border border-border overflow-hidden group hover:border-primary/50 transition-all shadow-sm">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="p-2 bg-white text-black rounded-full hover:bg-primary hover:text-white transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="p-2 bg-white text-destructive rounded-full hover:bg-destructive hover:text-white transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {item.featured && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded-md shadow-lg">
                          Öne Çıkan
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{item.category}</div>
                      <h3 className="font-bold text-foreground mb-2 line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, tIdx) => (
                          <span key={`tag-${item.id}-${tag}-${tIdx}`} className="px-2 py-0.5 bg-muted rounded text-[10px] text-muted-foreground">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit/Create Modal */}
              <AnimatePresence>
                {isGalleryModalOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsGalleryModalOpen(false)}
                      className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative w-full max-w-2xl bg-card rounded-[2rem] border border-border overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                      <form onSubmit={handleSaveGalleryItem} className="p-8 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-black text-foreground">
                            {editingItem?.id ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
                          </h3>
                          <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="p-2 hover:bg-accent/10 rounded-full">
                            <X size={20} />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Proje Başlığı</label>
                            <input 
                              required
                              value={editingItem?.title}
                              onChange={(e) => setEditingItem(prev => ({ ...prev!, title: e.target.value }))}
                              className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                              placeholder="Örn: Kurumsal Web Sitesi"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kategori</label>
                              <select 
                                value={editingItem?.category}
                                onChange={(e) => setEditingItem(prev => ({ ...prev!, category: e.target.value }))}
                                className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                              >
                                {galleryCategories.filter(c => c !== 'Tümü').map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tarih</label>
                              <input 
                                type="date"
                                value={editingItem?.date}
                                onChange={(e) => setEditingItem(prev => ({ ...prev!, date: e.target.value }))}
                                className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Görsel</label>
                            <div className="flex flex-col gap-3">
                              <label className="cursor-pointer">
                                <div className="flex items-center justify-center gap-2 w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 border-dashed rounded-xl px-4 py-3 text-sm font-bold transition-colors">
                                  <Image size={18} />
                                  {isUploading ? 'Yükleniyor...' : 'Bilgisayardan Görsel Seç'}
                                </div>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={handleImageUpload}
                                  disabled={isUploading}
                                />
                              </label>
                              
                              {editingItem?.src && (
                                <div className="w-full h-48 rounded-xl overflow-hidden border border-border shrink-0 bg-muted/30 flex items-center justify-center">
                                  <img src={editingItem.src} alt="Preview" className="w-full h-full object-contain" />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Açıklama</label>
                            <textarea 
                              required
                              rows={3}
                              value={editingItem?.description}
                              onChange={(e) => setEditingItem(prev => ({ ...prev!, description: e.target.value }))}
                              className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
                              placeholder="Proje hakkında kısa bilgi..."
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Etiketler (Virgül ile ayırın)</label>
                            <input 
                              value={editingItem?.tags?.join(', ')}
                              onChange={(e) => setEditingItem(prev => ({ ...prev!, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
                              className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                              placeholder="web, tasarım, kurumsal"
                            />
                          </div>

                          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border">
                            <input 
                              type="checkbox"
                              id="featured"
                              checked={editingItem?.featured}
                              onChange={(e) => setEditingItem(prev => ({ ...prev!, featured: e.target.checked }))}
                              className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                            />
                            <label htmlFor="featured" className="text-sm font-bold text-foreground cursor-pointer">
                              Öne Çıkan Proje Olarak İşaretle
                            </label>
                          </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                          <Button type="button" variant="secondary" onClick={() => setIsGalleryModalOpen(false)} className="flex-1">
                            İptal
                          </Button>
                          <Button type="submit" variant="primary" className="flex-1 gap-2">
                            <Save size={18} /> Kaydet
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          {/* Services Management Tab */}
          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-foreground">Hizmet Yönetimi</h2>
                <Button onClick={() => openServiceModal()} className="gap-2">
                  <Plus size={18} /> Yeni Hizmet Ekle
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((item, idx) => {
                  const Icon = iconMap[item.icon] || Shield;
                  return (
                    <div key={`service-card-${item.id}-${idx}`} className="bg-card rounded-2xl border border-border overflow-hidden group hover:border-primary/50 transition-all shadow-sm flex flex-col">
                      <div className="p-6 flex-grow">
                        <div className="flex items-start justify-between mb-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: `${item.color}15`, color: item.color }}
                          >
                            <Icon size={24} />
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openServiceModal(item)}
                              className="p-2 bg-muted text-foreground rounded-full hover:bg-primary hover:text-white transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteService(item.id)}
                              className="p-2 bg-muted text-destructive rounded-full hover:bg-destructive hover:text-white transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{item.category}</div>
                        <h3 className="font-bold text-foreground mb-2 line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{item.tagline}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Edit/Create Service Modal */}
              <AnimatePresence>
                <ServiceModal 
                  isOpen={isServiceModalOpen}
                  onClose={() => setIsServiceModalOpen(false)}
                  editingService={editingService}
                  onSave={handleSaveService}
                  setEditingService={setEditingService}
                />
              </AnimatePresence>
            </motion.div>
          )}
          {/* Testimonials Management Tab */}
          {activeTab === 'testimonials' && (
            <motion.div
              key="testimonials"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-foreground">Müşteri Yorumları</h2>
                <Button onClick={() => openTestimonialModal()} className="gap-2">
                  <Plus size={18} /> Yeni Yorum Ekle
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((item, idx) => (
                  <div key={`testimonial-card-${item.id}-${idx}`} className="bg-card rounded-2xl border border-border overflow-hidden group hover:border-primary/50 transition-all shadow-sm flex flex-col p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-border">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-sm">{item.name}</h4>
                          <p className="text-[10px] text-muted-foreground font-medium">{item.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openTestimonialModal(item)}
                          className="p-2 bg-muted text-foreground rounded-full hover:bg-primary hover:text-white transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteTestimonial(item.id)}
                          className="p-2 bg-muted text-destructive rounded-full hover:bg-destructive hover:text-white transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={`star-${item.id}-${i}`} size={12} className="fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground italic line-clamp-4">"{item.content}"</p>
                  </div>
                ))}
              </div>

              {/* Edit/Create Testimonial Modal */}
              <AnimatePresence>
                {isTestimonialModalOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsTestimonialModalOpen(false)}
                      className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative w-full max-w-xl bg-card rounded-[2rem] border border-border overflow-hidden shadow-2xl"
                    >
                      <form onSubmit={handleSaveTestimonial} className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black text-foreground">
                            {editingTestimonial?.id ? 'Yorumu Düzenle' : 'Yeni Yorum Ekle'}
                          </h3>
                          <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="p-2 hover:bg-accent/10 rounded-full">
                            <X size={20} />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ad Soyad</label>
                              <input 
                                value={editingTestimonial?.name}
                                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                                className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                placeholder="Örn: Ahmet Yılmaz"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ünvan / Şirket</label>
                              <input 
                                value={editingTestimonial?.role}
                                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                                className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                placeholder="Örn: CEO, Şirket Adı"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Yorum İçeriği</label>
                            <textarea 
                              required
                              rows={4}
                              value={editingTestimonial?.content}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                              className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
                              placeholder="Müşterinin geri dönüşü..."
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Puan (1-5)</label>
                              <input 
                                type="number"
                                min="1"
                                max="5"
                                required
                                value={editingTestimonial?.rating}
                                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) })}
                                className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profil Görseli</label>
                              <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-xl border border-border overflow-hidden bg-muted flex-shrink-0">
                                  {editingTestimonial?.image ? (
                                    <img src={editingTestimonial.image} className="w-full h-full object-cover" alt="Preview" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                      <Image size={20} />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 relative">
                                  <input 
                                    type="file"
                                    accept="image/*"
                                    onChange={handleTestimonialImageUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                  />
                                  <div className="w-full bg-input/50 border border-dashed border-input rounded-xl px-4 py-3 text-xs font-medium text-muted-foreground flex items-center justify-center gap-2">
                                    {isUploading ? 'Yükleniyor...' : 'Dosya Seç'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profil Görseli URL (Alternatif)</label>
                            <input 
                              value={editingTestimonial?.image}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, image: e.target.value })}
                              className="w-full bg-input/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                              placeholder="https://... veya dosya yükleyin"
                            />
                          </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                          <Button type="button" variant="secondary" onClick={() => setIsTestimonialModalOpen(false)} className="flex-1">
                            İptal
                          </Button>
                          <Button type="submit" variant="primary" className="flex-1 gap-2">
                            <Save size={18} /> Kaydet
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          {/* Admins Management Tab */}
          {activeTab === 'admins' && (
            <motion.div
              key="admins"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Yönetici Yönetimi</h2>
                  <p className="text-muted-foreground text-sm font-medium mt-1">Sistem erişimi olan yetkili personelleri yönetin.</p>
                </div>
                <Button onClick={() => setShowAddAdminModal(true)} className="gap-2 px-6 py-3 rounded-2xl shadow-xl shadow-primary/20">
                  <UserPlus size={20} /> Yeni Yönetici Ekle
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {admins.map((admin, idx) => (
                  <motion.div
                    key={`admin-card-${admin.id}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-card/40 border-2 border-primary/10 rounded-[2.5rem] p-8 hover:border-primary/40 transition-all duration-500 shadow-xl hover:shadow-primary/5 overflow-hidden"
                  >
                    {/* Background Decorative Element */}
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-colors duration-700" />
                    
                    <div className="relative z-10 flex items-center justify-between gap-8">
                      {/* Admin Info */}
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-2xl shadow-inner border border-primary/20 group-hover:scale-105 transition-transform duration-500">
                            {admin.name?.charAt(0)?.toLowerCase() || '?'}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background border-2 border-primary/20 rounded-lg flex items-center justify-center text-primary shadow-lg">
                            <Shield size={12} />
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{admin.name}</div>
                          <div className="text-xs text-muted-foreground font-bold flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            {admin.email}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleEditAdmin(admin)}
                          className="p-3 hover:bg-primary/10 rounded-2xl text-muted-foreground hover:text-primary transition-all duration-300 group/btn"
                          title="Düzenle"
                        >
                          <Settings size={20} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                        </button>
                        {admin.email !== '106077az@gmail.com' && (
                          <button 
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="p-3 hover:bg-destructive/10 rounded-2xl text-muted-foreground hover:text-destructive transition-all duration-300"
                            title="Sil"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Admin Modal */}
              <AnimatePresence>
                {showAddAdminModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowAddAdminModal(false)}
                      className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative w-full max-w-2xl bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-2xl flex flex-col md:flex-row"
                    >
                      {/* Left Side: Visual/Info */}
                      <div className="md:w-1/3 bg-primary p-8 text-primary-foreground flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                            <Shield size={24} />
                          </div>
                          <h3 className="text-2xl font-black leading-tight mb-2">Güvenli Yönetim</h3>
                          <p className="text-sm text-primary-foreground/70 font-medium">Yeni bir yönetici ekleyerek operasyonel gücünüzü artırın.</p>
                        </div>
                        
                        <div className="relative z-10 space-y-4">
                          <div className="flex items-center gap-3 text-xs font-bold">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">1</div>
                            <span>Bilgileri Girin</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-bold">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">2</div>
                            <span>Yetkileri Tanımlayın</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-bold">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">3</div>
                            <span>Erişimi Başlatın</span>
                          </div>
                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
                      </div>

                      {/* Right Side: Form */}
                      <form onSubmit={handleAddAdmin} className="md:w-2/3 p-8 space-y-6 bg-card">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="text-lg font-black text-foreground">Yönetici Detayları</h4>
                            <p className="text-xs text-muted-foreground">Hesap bilgilerini ve erişim seviyesini belirleyin.</p>
                          </div>
                          <button type="button" onClick={() => setShowAddAdminModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <X size={20} />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ad Soyad</label>
                              <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                                <input 
                                  required
                                  value={newAdmin.name}
                                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                  className="w-full bg-muted/30 border border-border rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                  placeholder="Ali Yılmaz"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">E-posta</label>
                              <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                                <input 
                                  required
                                  type="email"
                                  value={newAdmin.email}
                                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                  className="w-full bg-muted/30 border border-border rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                  placeholder="admin@example.com"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Şifre</label>
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                              <input 
                                required
                                type="password"
                                minLength={8}
                                value={newAdmin.password}
                                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                className="w-full bg-muted/30 border border-border rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                placeholder="••••••••"
                              />
                            </div>
                          </div>

                          <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Erişim Yetkileri</label>
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                  {newAdmin.permissions.length} Seçildi
                                </span>
                                <button 
                                  type="button"
                                  onClick={toggleAllPermissions}
                                  className="text-[9px] font-bold text-primary hover:underline"
                                >
                                  {newAdmin.permissions.length === sidebarLinks.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                              {sidebarLinks.map(link => (
                                <button 
                                  key={link.id}
                                  type="button"
                                  onClick={() => togglePermission(link.id)}
                                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                                    newAdmin.permissions.includes(link.id)
                                      ? 'bg-primary/5 border-primary text-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]'
                                      : 'bg-muted/20 border-border text-muted-foreground hover:border-muted-foreground/30'
                                  }`}
                                >
                                  <div className={`p-1.5 rounded-lg ${newAdmin.permissions.includes(link.id) ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                    <link.icon size={12} />
                                  </div>
                                  <span className="text-[11px] font-bold truncate">{link.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                          <Button type="button" variant="secondary" onClick={() => setShowAddAdminModal(false)} className="flex-1 rounded-2xl py-6">
                            İptal
                          </Button>
                          <Button type="submit" variant="primary" className="flex-1 gap-2 rounded-2xl py-6 shadow-lg shadow-primary/20">
                            <UserPlus size={18} /> Yöneticiyi Oluştur
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Edit Admin Modal */}
              <AnimatePresence>
                {showEditAdminModal && editingAdmin && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => { setShowEditAdminModal(false); setEditingAdmin(null); }}
                      className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="relative w-full max-w-xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                      <form onSubmit={handleUpdateAdmin} className="p-10 space-y-8">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-2xl font-black text-foreground tracking-tight">Yöneticiyi Düzenle</h3>
                            <p className="text-muted-foreground text-xs font-medium mt-1">Yönetici bilgilerini ve yetkilerini güncelleyin.</p>
                          </div>
                          <button type="button" onClick={() => { setShowEditAdminModal(false); setEditingAdmin(null); }} className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                            <Plus className="rotate-45" size={24} />
                          </button>
                        </div>

                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ad Soyad</label>
                              <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                                <input 
                                  required
                                  type="text"
                                  value={editingAdmin.name}
                                  onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                                  className="w-full bg-muted/30 border border-border rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                  placeholder="Ali Yılmaz"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">E-posta</label>
                              <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                                <input 
                                  required
                                  type="email"
                                  value={editingAdmin.email}
                                  onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                                  className="w-full bg-muted/30 border border-border rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                  placeholder="admin@example.com"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Yeni Şifre (Değiştirmek istemiyorsanız boş bırakın)</label>
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                              <input 
                                type="password"
                                minLength={8}
                                value={editingAdmin.password}
                                onChange={(e) => setEditingAdmin({ ...editingAdmin, password: e.target.value })}
                                className="w-full bg-muted/30 border border-border rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                placeholder="••••••••"
                              />
                            </div>
                          </div>

                          <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Erişim Yetkileri</label>
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                  {editingAdmin.permissions.length} Seçildi
                                </span>
                                <button 
                                  type="button"
                                  onClick={toggleAllEditPermissions}
                                  className="text-[9px] font-bold text-primary hover:underline"
                                >
                                  {editingAdmin.permissions.length === sidebarLinks.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                              {sidebarLinks.map(link => (
                                <button 
                                  key={link.id}
                                  type="button"
                                  onClick={() => toggleEditPermission(link.id)}
                                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                                    editingAdmin.permissions.includes(link.id)
                                      ? 'bg-primary/5 border-primary text-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]'
                                      : 'bg-muted/20 border-border text-muted-foreground hover:border-muted-foreground/30'
                                  }`}
                                >
                                  <div className={`p-1.5 rounded-lg ${editingAdmin.permissions.includes(link.id) ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                    <link.icon size={12} />
                                  </div>
                                  <span className="text-[11px] font-bold truncate">{link.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                          <Button type="button" variant="secondary" onClick={() => { setShowEditAdminModal(false); setEditingAdmin(null); }} className="flex-1 rounded-2xl py-6">
                            İptal
                          </Button>
                          <Button type="submit" variant="primary" className="flex-1 gap-2 rounded-2xl py-6 shadow-lg shadow-primary/20">
                            <Save size={18} /> Değişiklikleri Kaydet
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          {/* System Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Sistem Ayarları</h2>
                  <p className="text-muted-foreground text-sm font-medium mt-1">Platform genelindeki yapılandırmaları ve tercihleri yönetin.</p>
                </div>
                <Button 
                  onClick={() => handleUpdateSettings(systemSettings)}
                  className="gap-2 px-6 py-3 rounded-2xl shadow-xl shadow-primary/20"
                >
                  <Save size={20} /> Tüm Ayarları Kaydet
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Settings */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-card/40 border-2 border-primary/10 rounded-[2.5rem] p-8 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Settings size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Genel Yapılandırma</h3>
                        <p className="text-muted-foreground text-xs font-medium">Site başlığı, açıklaması ve temel bilgiler.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Site Başlığı</label>
                        <input 
                          className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-primary transition-all" 
                          value={systemSettings.siteTitle}
                          onChange={(e) => setSystemSettings({ ...systemSettings, siteTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Slogan</label>
                        <input 
                          className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-primary transition-all" 
                          value={systemSettings.slogan}
                          onChange={(e) => setSystemSettings({ ...systemSettings, slogan: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Site Açıklaması (Meta Description)</label>
                        <textarea 
                          rows={3}
                          className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-primary transition-all resize-none" 
                          value={systemSettings.description}
                          onChange={(e) => setSystemSettings({ ...systemSettings, description: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card/40 border-2 border-primary/10 rounded-[2.5rem] p-8 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Mail size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">İletişim Bilgileri</h3>
                        <p className="text-muted-foreground text-xs font-medium">Müşterilerin size ulaşabileceği kanallar.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">E-posta Adresi</label>
                        <input 
                          className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-primary transition-all" 
                          value={systemSettings.email}
                          onChange={(e) => setSystemSettings({ ...systemSettings, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Telefon Numarası</label>
                        <input 
                          className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-primary transition-all" 
                          value={systemSettings.phone}
                          onChange={(e) => setSystemSettings({ ...systemSettings, phone: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ofis Adresi</label>
                        <input 
                          className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-primary transition-all" 
                          value={systemSettings.address}
                          onChange={(e) => setSystemSettings({ ...systemSettings, address: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card/40 border-2 border-primary/10 rounded-[2.5rem] p-8 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Ücretlendirme Ayarları</h3>
                        <p className="text-muted-foreground text-xs font-medium">Garanti, üyelik ve ek hizmet ücretlerini yönetin.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">1 Yıllık Garanti Uzatma (₺)</label>
                        <input 
                          type="number"
                          className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-primary transition-all" 
                          value={systemSettings.warrantyFee1Year}
                          onChange={(e) => setSystemSettings({ ...systemSettings, warrantyFee1Year: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">2 Yıllık Garanti Uzatma (₺)</label>
                        <input 
                          type="number"
                          className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-primary transition-all" 
                          value={systemSettings.warrantyFee2Year}
                          onChange={(e) => setSystemSettings({ ...systemSettings, warrantyFee2Year: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">3 Yıllık Garanti Uzatma (₺)</label>
                        <input 
                          type="number"
                          className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-primary transition-all" 
                          value={systemSettings.warrantyFee3Year}
                          onChange={(e) => setSystemSettings({ ...systemSettings, warrantyFee3Year: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Aylık Üyelik Ücreti (₺)</label>
                        <input 
                          type="number"
                          className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-primary transition-all" 
                          value={systemSettings.membershipFee}
                          onChange={(e) => setSystemSettings({ ...systemSettings, membershipFee: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">AI Kamera Aylık Ücreti (₺)</label>
                        <input 
                          type="number"
                          className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-primary transition-all" 
                          value={systemSettings.aiCameraMonthlyFee}
                          onChange={(e) => setSystemSettings({ ...systemSettings, aiCameraMonthlyFee: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-8">
                  <div className="bg-card/40 border-2 border-primary/10 rounded-[2.5rem] p-8 shadow-xl">
                    <h3 className="text-lg font-black text-foreground tracking-tight mb-6">Bakım Modu</h3>
                    <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border">
                      <div>
                        <div className="text-sm font-bold">Durum</div>
                        <div className="text-[10px] text-muted-foreground">Siteyi ziyaretçilere kapatır.</div>
                      </div>
                      <div 
                        onClick={() => handleUpdateSettings({ maintenanceMode: !systemSettings.maintenanceMode })}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${systemSettings.maintenanceMode ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <motion.div 
                          animate={{ x: systemSettings.maintenanceMode ? 24 : 4 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card/40 border-2 border-primary/10 rounded-[2.5rem] p-8 shadow-xl">
                    <h3 className="text-lg font-black text-foreground tracking-tight mb-6">Güvenlik Ayarları</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 hover:bg-muted/30 rounded-xl transition-colors cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <Lock size={16} />
                        </div>
                        <span className="text-xs font-bold">SSL Sertifikası</span>
                        <CheckCircle2 size={14} className="ml-auto text-success" />
                      </div>
                      <div className="flex items-center gap-3 p-3 hover:bg-muted/30 rounded-xl transition-colors cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <Shield size={16} />
                        </div>
                        <span className="text-xs font-bold">İki Faktörlü Doğrulama</span>
                        <div className="ml-auto text-[10px] font-black text-muted-foreground uppercase">Pasif</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary to-primary/80 rounded-[2.5rem] p-8 text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                      <h3 className="text-lg font-black mb-2">Sistem Güncel</h3>
                      <p className="text-xs text-primary-foreground/70 font-medium mb-6">Versiyon v2.4.0 - Tüm modüller stabil çalışıyor.</p>
                      <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90 border-none rounded-xl py-2 text-[10px] font-black uppercase tracking-widest">
                        Güncellemeleri Denetle
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Customer Modal */}
      <AddCustomerModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCustomer}
      />

        {/* Warranty Management Modal */}
        <WarrantyModal 
          isOpen={showWarrantyModal}
          onClose={() => setShowWarrantyModal(false)}
          customer={selectedCustomer}
          services={customerDetails.services}
          onUpdateService={handleUpdateCustomerService}
          onAddService={() => setIsEditingDetail({ type: 'service' })}
          calculateRemainingWarranty={calculateRemainingWarranty}
        />

        {/* Customer Details Modal */}
        <CustomerDetailsModal 
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          selectedCustomer={selectedCustomer}
          detailsTab={detailsTab}
          setDetailsTab={setDetailsTab}
          customerDetails={customerDetails}
          setIsEditingDetail={setIsEditingDetail}
          calculateRemainingWarranty={calculateRemainingWarranty}
          refundRequests={refundRequests}
          handleUpdatePayment={handleUpdatePayment}
          handleDeleteCustomerPayment={handleDeleteCustomerPayment}
          handleDeleteDocument={handleDeleteDocument}
          handleDeleteEmployee={handleDeleteEmployee}
        />

        {/* Detail Edit/Add Modal */}
        <AnimatePresence>
          <DetailEditModal 
            isOpen={!!isEditingDetail}
            onClose={() => setIsEditingDetail(null)}
            editingDetail={isEditingDetail}
            combinedServices={combinedServices}
            onAddService={handleAddCustomerService}
            onUpdateService={handleUpdateCustomerService}
            onAddTransaction={handleAddCustomerTransaction}
            onUpdateTransaction={handleUpdateCustomerTransaction}
            onAddPayment={handleAddCustomerPayment}
            onUpdatePayment={handleUpdateCustomerPayment}
            onUploadDocument={handleUploadDocument}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
          />
        </AnimatePresence>

      {/* Ticket Reply Modal */}
      <TicketReplyModal 
        isOpen={isTicketReplyModalOpen}
        onClose={() => setIsTicketReplyModalOpen(false)}
        selectedTicket={selectedTicket}
      />

      {/* Purchased Service Modal */}
      <PurchaseModal 
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        editingPurchase={editingPurchase}
        setEditingPurchase={setEditingPurchase}
        handleSavePurchase={handleSavePurchase}
        combinedServices={combinedServices}
      />

      {/* Purchasable Service Modal */}
      <PurchasableModal 
        isOpen={isPurchasableModalOpen}
        onClose={() => setIsPurchasableModalOpen(false)}
        editingPurchasable={editingPurchasable}
        setEditingPurchasable={setEditingPurchasable}
        handleSavePurchasable={handleSavePurchasable}
      />
    </div>
  );
};
