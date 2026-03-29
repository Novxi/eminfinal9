import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import fs from "fs";
import { galleryItems as initialGalleryItems } from "./lib/galleryData.js";
import { services as initialServices } from "./lib/servicesData.js";
import { loadDataFromFirebase, saveDataToFirebase, migrateDataIfNeeded } from "./lib/firebase-storage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory user store (Replace with database in production)
let users: any[] = [];

// Data Healing: Fix old mismatched customer IDs from Firebase
const fixMismatchedData = (persistedData: any) => {
  let needsSync = false;
  users.forEach(user => {
    if (user.role === 'user' && user.id) {
      const correctId = user.id.toString();
      // Find any services that belong to this user's email but have a different customerId
      if (persistedData?.customerServices) {
        persistedData.customerServices.forEach((s: any) => {
          if (s.customerEmail === user.email && s.customerId !== correctId) {
            s.customerId = correctId;
            needsSync = true;
          }
        });
      }
      if (persistedData?.purchasedServices) {
        persistedData.purchasedServices.forEach((s: any) => {
          if (s.customerEmail === user.email && s.customerId !== correctId) {
            s.customerId = correctId;
            needsSync = true;
          }
        });
      }
      if (persistedData?.customerPayments) {
        persistedData.customerPayments.forEach((p: any) => {
          if (p.customerEmail === user.email && p.customerId !== correctId) {
            p.customerId = correctId;
            needsSync = true;
          }
        });
      }
      if (persistedData?.employees) {
        persistedData.employees.forEach((e: any) => {
          if (e.customerId === "NDcOby6m7T2daLeATnnU" && user.email === "test43@gmail.com") {
            e.customerId = correctId;
            needsSync = true;
          }
        });
      }
      if (persistedData?.users) {
        persistedData.users.forEach((u: any) => {
          if (u.customerId === "NDcOby6m7T2daLeATnnU" && user.email === "test43@gmail.com") {
            u.customerId = correctId;
            needsSync = true;
          }
        });
      }
    }
  });
  if (needsSync) {
    console.log("Fixed mismatched customer IDs in data");
  }
};

// In-memory reset token store
const resetTokens: any[] = [];
// In-memory gallery store
let galleryItems: any[] = [...initialGalleryItems];
// In-memory services store
let servicesItems: any[] = [...initialServices];
// In-memory customer details stores
let customerServices: any[] = [];
let customerPayments: any[] = [];
let customerTransactions: any[] = [];
let customerDocuments: any[] = [];

// In-memory testimonials store
let testimonialsItems: any[] = [];

// In-memory settings store
let settings: any = {
  maintenanceMode: false,
  siteTitle: "Emin Bilgi İşlem",
  slogan: "Teknolojide Güvenilir Çözüm Ortağınız",
  description: "Emin Bilgi İşlem, kurumsal ve bireysel teknoloji ihtiyaçlarınız için profesyonel çözümler sunar.",
  email: "info@eminbilgiislem.com",
  phone: "+90 (555) 000 00 00",
  address: "Teknoloji Mah. Bilişim Sok. No:1, İstanbul",
  warrantyFee1Year: 1499,
  warrantyFee2Year: 2499,
  warrantyFee3Year: 3299,
  membershipFee: 150,
  aiCameraMonthlyFee: 250,
  packages: [
    { id: 'silver', name: 'Silver Paket', price: 999, features: ['Temel Teknik Destek', 'Yıllık 1 Bakım', 'Uzaktan Yardım', 'E-posta Desteği'] },
    { id: 'gold', name: 'Gold Paket', price: 1999, features: ['7/24 Teknik Destek', 'Yıllık 2 Bakım', 'Öncelikli Servis', 'Veri Yedekleme Çözümü'] },
    { id: 'platinum', name: 'Platinum Paket', price: 3999, features: ['VIP Teknik Destek', 'Sınırsız Bakım', 'Yerinde Servis', 'Siber Güvenlik Paketi', 'Sınırsız Bulut Depolama'] }
  ]
};

// Ensure packages exist in settings if it was loaded from an older file
if (!settings.packages || settings.packages.length === 0) {
  settings.packages = [
    { id: 'silver', name: 'Silver Paket', price: 999, features: ['Temel Teknik Destek', 'Yıllık 1 Bakım', 'Uzaktan Yardım', 'E-posta Desteği'] },
    { id: 'gold', name: 'Gold Paket', price: 1999, features: ['7/24 Teknik Destek', 'Yıllık 2 Bakım', 'Öncelikli Servis', 'Veri Yedekleme Çözümü'] },
    { id: 'platinum', name: 'Platinum Paket', price: 3999, features: ['VIP Teknik Destek', 'Sınırsız Bakım', 'Yerinde Servis', 'Siber Güvenlik Paketi', 'Sınırsız Bulut Depolama'] }
  ];
}

// In-memory quotes store
let quotes: any[] = [];

// In-memory employees store
let employees: any[] = [];

// In-memory purchasable services store (Admin managed)
let purchasableServices: any[] = [];

// In-memory purchased services store
let purchasedServices: any[] = [];

// In-memory refund requests store
let refundRequests: any[] = [];

// In-memory support tickets store
let supportTickets: any[] = [];
// In-memory support messages store
let supportMessages: any[] = [];

// Helper to sync all data to file
const syncData = () => {
  saveDataToFirebase({
    users,
    employees,
    settings,
    quotes,
    purchasableServices,
    purchasedServices,
    refundRequests,
    supportTickets,
    supportMessages,
    customerServices,
    customerPayments,
    customerTransactions,
    customerDocuments
  }).catch(e => console.error("Error in syncData:", e));
};

// Initialize default admin
const initializeDefaultAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  if (!users.find(u => u.email === "106077az@gmail.com")) {
    users.push({
      id: 1,
      name: "Süper Admin",
      email: "106077az@gmail.com",
      password: hashedPassword,
      role: "admin",
      permissions: ['overview', 'customers', 'quotes', 'payments', 'support', 'gallery', 'services', 'testimonials', 'admins', 'settings', 'purchased-services', 'refunds', 'purchasable-services']
    });
    syncData();
  }
};
initializeDefaultAdmin();

const JWT_SECRET = process.env.JWT_SECRET || "emin-bilgi-islem-secret-key-2024";
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";

// Nodemailer Transporter Configuration
// Set these in your .env file
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "user@example.com",
    pass: process.env.SMTP_PASS || "password",
  },
});

// Email Helper Function
async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const isSmtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST !== "smtp.example.com");

  if (!isSmtpConfigured) {
    console.log("--------------------------------------------------");
    console.log("🛠️  [DEV MODE] SMTP not configured. Email not sent.");
    console.log(`📧  To: ${to}`);
    console.log(`📧  Subject: ${subject}`);
    console.log("--------------------------------------------------");
    return true; // Return true to not break the flow in dev
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || '"Emin Bilgi İşlem" <noreply@eminbilgiislem.com>',
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

async function startServer() {
  await migrateDataIfNeeded();
  const persistedData = await loadDataFromFirebase();
  if (persistedData) {
    users = persistedData.users || [];
    employees = persistedData.employees || [];
    settings = persistedData.settings || settings;
    quotes = persistedData.quotes || [];
    purchasableServices = persistedData.purchasableServices || [];
    purchasedServices = persistedData.purchasedServices || [];
    refundRequests = persistedData.refundRequests || [];
    supportTickets = persistedData.supportTickets || [];
    supportMessages = persistedData.supportMessages || [];
    customerServices = persistedData.customerServices || [];
    customerPayments = persistedData.customerPayments || [];
    customerTransactions = persistedData.customerTransactions || [];
    customerDocuments = persistedData.customerDocuments || [];
    
    // Ensure packages exist in settings if it was loaded from an older file
    if (!settings.packages || settings.packages.length === 0) {
      settings.packages = [
        { id: 'silver', name: 'Silver Paket', price: 999, features: ['Temel Teknik Destek', 'Yıllık 1 Bakım', 'Uzaktan Yardım', 'E-posta Desteği'] },
        { id: 'gold', name: 'Gold Paket', price: 1999, features: ['7/24 Teknik Destek', 'Yıllık 2 Bakım', 'Öncelikli Servis', 'Veri Yedekleme Çözümü'] },
        { id: 'platinum', name: 'Platinum Paket', price: 3999, features: ['VIP Teknik Destek', 'Sınırsız Bakım', 'Yerinde Servis', 'Siber Güvenlik Paketi', 'Sınırsız Bulut Depolama'] }
      ];
    }
    
    fixMismatchedData(persistedData);
  }

  await initializeDefaultAdmin();

  const app = express();
  const PORT = parseInt(process.env.PORT || "3000");

  // Increase JSON payload limit for base64 image uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Emin Bilgi İşlem Backend is running." });
  });

  // Auth Routes
  app.post("/api/auth/check-email", (req, res) => {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ message: "E-posta adresi gereklidir." });
    }
    const user = users.find(u => u.email === email.toLowerCase().trim());
    res.json({ exists: !!user });
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { id, name, email, password } = req.body || {};
      console.log("Registering user:", { id, name, email });

      if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: "Bu e-posta adresi zaten kullanımda." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { id: id || Date.now().toString(), customerId: id || Date.now().toString(), name, email, password: hashedPassword, role: "user" };
      users.push(newUser);
      syncData();

      // Send Welcome Email
      await sendEmail({
        to: email,
        subject: "Emin Bilgi İşlem'e Hoş Geldiniz!",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #3b82f6;">Hoş Geldiniz, ${name}!</h2>
            <p>Emin Bilgi İşlem ailesine katıldığınız için mutluyuz. Hesabınız başarıyla oluşturuldu.</p>
            <p>Artık paneliniz üzerinden tekliflerinizi takip edebilir, destek talebi oluşturabilir ve hizmetlerimizi yönetebilirsiniz.</p>
            <div style="margin: 30px 0;">
              <a href="${APP_BASE_URL}/dashboard" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Panele Git</a>
            </div>
            <p style="color: #666; font-size: 12px;">Eğer bu hesabı siz oluşturmadıysanız, lütfen bizimle iletişime geçin.</p>
          </div>
        `
      });

      const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });

      res.status(201).json({ 
        success: true, 
        token, 
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } 
      });
    } catch (error) {
      res.status(500).json({ message: "Kayıt sırasında bir hata oluştu." });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body || {};
      const user = users.find(u => u.email === email.toLowerCase().trim());

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Geçersiz e-posta veya şifre." });
      }

      const token = jwt.sign({ 
        id: user.id, 
        email: user.email, 
        role: user.role || (user.email === '106077az@gmail.com' ? 'admin' : 'user'),
        permissions: user.permissions || []
      }, JWT_SECRET, { expiresIn: "7d" });

      res.json({ 
        success: true, 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role || (user.email === '106077az@gmail.com' ? 'admin' : 'user'),
          customerId: user.customerId || user.id, // Include customerId for all users
          permissions: user.permissions || (user.email === '106077az@gmail.com' ? ['overview', 'customers', 'quotes', 'payments', 'support', 'gallery', 'services', 'testimonials', 'admins', 'settings', 'purchased-services', 'refunds', 'purchasable-services'] : [])
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Giriş sırasında bir hata oluştu." });
    }
  });

  // Forgot Password Endpoint
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const email = req.body.email?.toLowerCase().trim();
      if (!email) return res.status(400).json({ message: "E-posta adresi gerekli." });

      const user = users.find(u => u.email === email);

      if (!user) {
        return res.json({ ok: true, registered: false, message: "Bu e-posta adresi kayıtlı değil." });
      }

      // Generate secure reset token
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

      // Invalidate previous tokens for this user
      const existingTokenIndex = resetTokens.findIndex(t => t.userId === user.id);
      if (existingTokenIndex !== -1) {
        resetTokens.splice(existingTokenIndex, 1);
      }

      // Store token hash
      resetTokens.push({
        userId: user.id,
        tokenHash,
        expiresAt,
        used: false
      });

      // Build reset link
      const resetLink = `${APP_BASE_URL}/reset-password?token=${rawToken}`;

      // Send Email
      const emailSent = await sendEmail({
        to: user.email,
        subject: "Şifre Sıfırlama Bağlantısı",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #3b82f6;">Şifre Sıfırlama İsteği</h2>
            <p>Merhaba ${user.name},</p>
            <p>Hesabınız için şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak şifrenizi sıfırlayabilirsiniz:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Şifremi Sıfırla</a>
            </div>
            <p>Bu bağlantı 15 dakika süreyle geçerlidir. Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">Emin Bilgi İşlem - Güvenli ve Hızlı Çözümler</p>
          </div>
        `,
      });

      // Log link to console for dev convenience
      console.log("🔗 [DEV] Reset Link:", resetLink);

      res.json({ ok: true, registered: true });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Bir hata oluştu." });
    }
  });

  // Reset Password Endpoint
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body || {};

      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token ve yeni şifre gereklidir." });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Şifre en az 8 karakter olmalıdır." });
      }

      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const resetEntry = resetTokens.find(t => t.tokenHash === tokenHash && t.expiresAt > Date.now() && !t.used);

      if (!resetEntry) {
        return res.status(400).json({ message: "Bağlantı geçersiz veya süresi dolmuş." });
      }

      const user = users.find(u => u.id === resetEntry.userId);
      if (!user) {
        return res.status(400).json({ message: "Kullanıcı bulunamadı." });
      }

      // Update password
      user.password = await bcrypt.hash(newPassword, 10);
      
      // Mark token as used
      resetEntry.used = true;
      resetEntry.usedAt = Date.now();

      res.json({ ok: true, message: "Şifreniz başarıyla güncellendi." });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Bir hata oluştu." });
    }
  });

  // Quotes API
  app.get("/api/quotes", (req, res) => {
    console.log("Fetching all quotes. Count:", quotes.length);
    res.json(quotes);
  });

  app.put("/api/quotes/:id", (req, res) => {
    const { id } = req.params;
    const index = quotes.findIndex(q => q.id === id);
    if (index !== -1) {
      quotes[index] = { ...quotes[index], ...req.body };
      res.json({ success: true, quote: quotes[index] });
    } else {
      res.status(404).json({ message: "Teklif bulunamadı." });
    }
  });

  app.delete("/api/quotes/:id", (req, res) => {
    const { id } = req.params;
    const index = quotes.findIndex(q => q.id === id);
    if (index !== -1) {
      quotes.splice(index, 1);
      syncData();
      res.json({ success: true });
    } else {
      res.status(404).json({ message: "Teklif bulunamadı." });
    }
  });

  // Quote Submission Route
  app.post("/api/quotes/submit", async (req, res) => {
    try {
      const quoteData = req.body;
      console.log("Received new quote submission:", JSON.stringify(quoteData, null, 2));
      
      if (!quoteData || !quoteData.id) {
        console.error("Invalid quote data received:", quoteData);
        return res.status(400).json({ message: "Geçersiz teklif verisi." });
      }

      // Save to in-memory store
      quotes.unshift(quoteData);
      syncData();
      console.log("Quote saved successfully. Total quotes:", quotes.length);

      // Send Confirmation Email to Customer
      await sendEmail({
        to: quoteData.email,
        subject: `Teklif Talebiniz Alındı - ${quoteData.id}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #3b82f6; margin: 0;">Emin Bilgi İşlem</h1>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">Teknolojide Güvenilir Çözüm Ortağınız</p>
            </div>
            
            <h2 style="color: #1f2937; font-size: 18px;">Sayın ${quoteData.customer},</h2>
            <p style="color: #4b5563; line-height: 1.6;">Teklif talebiniz başarıyla alınmıştır. Uzman ekibimiz talebinizi inceleyerek en kısa sürede size özel teklifimizi hazırlayacaktır.</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #e5e7eb;">
              <h3 style="margin-top: 0; font-size: 14px; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.05em;">Talep Özeti</h3>
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Talep No:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: bold; text-align: right;">${quoteData.id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Hizmetler:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: bold; text-align: right;">${quoteData.service}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Tarih:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: bold; text-align: right;">${quoteData.date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Tahmini Bütçe:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: bold; text-align: right;">${quoteData.budget}</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">Teklifinizin durumunu dilediğiniz zaman müşteri panelinizden takip edebilir, hazırlanan teklifleri onaylayabilirsiniz.</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${APP_BASE_URL}/dashboard" style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);">Müşteri Paneline Git</a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; color: #9ca3af; font-size: 12px; text-align: center;">
              <p>Bu bir otomatik bilgilendirme e-postasıdır. Lütfen yanıtlamayınız.</p>
              <p>&copy; 2024 Emin Bilgi İşlem. Tüm hakları saklıdır.</p>
            </div>
          </div>
        `
      });

      // Also notify admin
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@eminbilgiislem.com",
        subject: `Yeni Teklif Talebi: ${quoteData.id}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #3b82f6;">Yeni Bir Teklif Talebi Geldi!</h2>
            <p><strong>Müşteri:</strong> ${quoteData.customer}</p>
            <p><strong>E-posta:</strong> ${quoteData.email}</p>
            <p><strong>Telefon:</strong> ${quoteData.phone}</p>
            <p><strong>Hizmetler:</strong> ${quoteData.service}</p>
            <p><strong>Bütçe:</strong> ${quoteData.budget}</p>
            <hr />
            <a href="${APP_BASE_URL}/admin">Yönetim Paneline Git</a>
          </div>
        `
      });

      res.status(201).json({ success: true, message: "Teklif talebiniz alındı ve onay e-postası gönderildi." });
    } catch (error) {
      console.error("Quote submission error:", error);
      res.status(500).json({ message: "Teklif gönderilirken bir hata oluştu." });
    }
  });

  // Quote Preparation Route (Admin prepares a quote for a customer)
  app.post("/api/quotes/prepare", async (req, res) => {
    try {
      const preparedQuote = req.body;
      
      // In a real app, you'd update the database
      console.log("Quote Prepared for Customer:", preparedQuote.email);

      // Send Notification Email to Customer
      await sendEmail({
        to: preparedQuote.email,
        subject: `Teklifiniz Hazırlandı! - ${preparedQuote.id}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #3b82f6; margin: 0;">Emin Bilgi İşlem</h1>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">Teknolojide Güvenilir Çözüm Ortağınız</p>
            </div>
            
            <h2 style="color: #1f2937; font-size: 18px;">Sayın ${preparedQuote.customer},</h2>
            <p style="color: #4b5563; line-height: 1.6;">Talebiniz uzman ekibimiz tarafından incelenmiş ve size özel teklifimiz hazırlanmıştır.</p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #bae6fd;">
              <h3 style="margin-top: 0; font-size: 14px; color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;">Teklif Detayları</h3>
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Teklif No:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: bold; text-align: right;">${preparedQuote.id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Teklif Tutarı:</td>
                  <td style="padding: 8px 0; color: #0369a1; font-weight: 800; font-size: 18px; text-align: right;">${preparedQuote.price} ₺</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Geçerlilik Tarihi:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: bold; text-align: right;">${new Date(preparedQuote.expiryDate).toLocaleDateString('tr-TR')}</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">Teklif detaylarını incelemek ve onaylamak için lütfen müşteri panelinize giriş yapınız.</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${APP_BASE_URL}/dashboard" style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);">Teklifi İncele ve Onayla</a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; color: #9ca3af; font-size: 12px; text-align: center;">
              <p>Herhangi bir sorunuz olması durumunda bizimle iletişime geçmekten çekinmeyin.</p>
              <p>&copy; 2024 Emin Bilgi İşlem. Tüm hakları saklıdır.</p>
            </div>
          </div>
        `
      });

      res.json({ success: true, message: "Müşteriye teklif hazırlandığına dair e-posta gönderildi." });
    } catch (error) {
      console.error("Quote preparation error:", error);
      res.status(500).json({ message: "E-posta gönderilirken bir hata oluştu." });
    }
  });

  // Example contact endpoint
  app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body || {};
    console.log("Contact form submission:", { name, email, message });
    res.json({ success: true, message: "Mesajınız başarıyla alındı." });
  });

  // Admin Management Endpoints
  app.get("/api/admins", (req, res) => {
    const admins = users
      .filter(u => u.role === "admin" || u.email === "106077az@gmail.com")
      .map(u => ({ 
        id: u.id, 
        name: u.name, 
        email: u.email,
        permissions: u.permissions || ['overview', 'customers', 'quotes', 'payments', 'support', 'gallery', 'services', 'testimonials', 'admins', 'settings']
      }));
    
    // Add the default admin if not in the list
    if (!admins.find(a => a.email === "106077az@gmail.com")) {
      admins.unshift({ 
        id: 1, 
        name: "Süper Admin", 
        email: "106077az@gmail.com",
        permissions: ['overview', 'customers', 'quotes', 'payments', 'support', 'gallery', 'services', 'testimonials', 'admins', 'settings']
      });
    }
    
    res.json(admins);
  });

  app.post("/api/admins", async (req, res) => {
    try {
      const { name, email, password, permissions } = req.body || {};
      if (users.find(u => u.email === email) || email === "106077az@gmail.com") {
        return res.status(400).json({ message: "Bu e-posta adresi zaten kullanımda." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = { 
        id: Date.now(), 
        name, 
        email, 
        password: hashedPassword, 
        role: "admin",
        permissions: permissions || ['overview'] 
      };
      users.push(newAdmin);
      syncData();
      res.status(201).json({ 
        id: newAdmin.id, 
        name: newAdmin.name, 
        email: newAdmin.email,
        permissions: newAdmin.permissions
      });
    } catch (error) {
      res.status(500).json({ message: "Yönetici eklenirken hata oluştu." });
    }
  });

  app.delete("/api/admins/:id", (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id.toString() === id);
    if (index !== -1) {
      users.splice(index, 1);
      syncData();
    }
    res.json({ success: true });
  });

  app.put("/api/admins/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password, permissions } = req.body || {};
      const index = users.findIndex(u => u.id.toString() === id);
      
      if (index !== -1) {
        const updatedAdmin = { ...users[index] };
        if (name) updatedAdmin.name = name;
        if (email) updatedAdmin.email = email;
        if (permissions) updatedAdmin.permissions = permissions;
        if (password) {
          updatedAdmin.password = await bcrypt.hash(password, 10);
        }
        
        users[index] = updatedAdmin;
        syncData();
        res.json({ 
          id: updatedAdmin.id, 
          name: updatedAdmin.name, 
          email: updatedAdmin.email,
          permissions: updatedAdmin.permissions
        });
      } else {
        res.status(404).json({ message: "Yönetici bulunamadı." });
      }
    } catch (error) {
      res.status(500).json({ message: "Yönetici güncellenirken hata oluştu." });
    }
  });

  // Gallery API Endpoints
  app.get("/api/gallery", (req, res) => {
    res.json(galleryItems);
  });

  app.post("/api/gallery", (req, res) => {
    const newItem = req.body;
    if (!newItem.id) {
      newItem.id = Date.now().toString();
    }
    galleryItems = [newItem, ...galleryItems];
    res.status(201).json(newItem);
  });

  app.put("/api/gallery/:id", (req, res) => {
    const { id } = req.params;
    const updatedItem = req.body;
    const index = galleryItems.findIndex(item => item.id === id);
    
    if (index !== -1) {
      galleryItems[index] = { ...galleryItems[index], ...updatedItem };
      res.json(galleryItems[index]);
    } else {
      res.status(404).json({ message: "Proje bulunamadı." });
    }
  });

  app.delete("/api/gallery/:id", (req, res) => {
    const { id } = req.params;
    galleryItems = galleryItems.filter(item => item.id !== id);
    res.json({ success: true });
  });

  // Services API Endpoints
  app.get("/api/services", (req, res) => {
    res.json(servicesItems);
  });

  app.post("/api/services", (req, res) => {
    const newItem = req.body;
    if (!newItem.id) {
      newItem.id = Date.now().toString();
    }
    servicesItems = [newItem, ...servicesItems];
    res.status(201).json(newItem);
  });

  app.put("/api/services/:id", (req, res) => {
    const { id } = req.params;
    const updatedItem = req.body;
    const index = servicesItems.findIndex(item => item.id === id);
    
    if (index !== -1) {
      servicesItems[index] = { ...servicesItems[index], ...updatedItem };
      res.json(servicesItems[index]);
    } else {
      res.status(404).json({ message: "Hizmet bulunamadı." });
    }
  });

  app.delete("/api/services/:id", (req, res) => {
    const { id } = req.params;
    servicesItems = servicesItems.filter(item => item.id !== id);
    res.json({ success: true });
  });

  // Testimonials API Endpoints
  app.get("/api/testimonials", (req, res) => {
    res.json(testimonialsItems);
  });

  app.post("/api/testimonials", (req, res) => {
    const newItem = req.body;
    if (!newItem.id) {
      newItem.id = Date.now().toString();
    }
    testimonialsItems = [newItem, ...testimonialsItems];
    res.status(201).json(newItem);
  });

  app.put("/api/testimonials/:id", (req, res) => {
    const { id } = req.params;
    const updatedItem = req.body;
    const index = testimonialsItems.findIndex(item => item.id === id);
    
    if (index !== -1) {
      testimonialsItems[index] = { ...testimonialsItems[index], ...updatedItem };
      res.json(testimonialsItems[index]);
    } else {
      res.status(404).json({ message: "Geri dönüş bulunamadı." });
    }
  });

  app.delete("/api/testimonials/:id", (req, res) => {
    const { id } = req.params;
    testimonialsItems = testimonialsItems.filter(item => item.id !== id);
    res.json({ success: true });
  });

  // Purchasable Services API (Admin)
  app.get("/api/purchasable-services", (req, res) => {
    res.json(purchasableServices);
  });

  app.post("/api/purchasable-services", (req, res) => {
    const newItem = { ...req.body, id: `PS-${Date.now()}` };
    purchasableServices.push(newItem);
    syncData();
    res.status(201).json(newItem);
  });

  app.put("/api/purchasable-services/:id", (req, res) => {
    const { id } = req.params;
    const index = purchasableServices.findIndex(item => item.id === id);
    if (index !== -1) {
      purchasableServices[index] = { ...purchasableServices[index], ...req.body };
      res.json(purchasableServices[index]);
    } else {
      res.status(404).json({ message: "Hizmet bulunamadı." });
    }
  });

  app.delete("/api/purchasable-services/:id", (req, res) => {
    const { id } = req.params;
    purchasableServices = purchasableServices.filter(item => item.id !== id);
    syncData();
    res.json({ success: true });
  });

  // Purchased Services API
  app.get("/api/purchased-services", (req, res) => {
    const { customerId } = req.query;
    console.log("Server /api/purchased-services customerId:", customerId);
    console.log("Server purchasedServices:", JSON.stringify(purchasedServices, null, 2));
    if (customerId) {
      const services = purchasedServices.filter(s => String(s.customerId) === String(customerId));
      console.log("Server filtered services:", services);
      return res.json(services);
    }
    res.json(purchasedServices);
  });

  app.post("/api/purchased-services", (req, res) => {
    const { customerId, customerName, customerEmail, serviceId, serviceName, price, paymentMethod } = req.body || {};
    const newPurchase = {
      id: `PUR-${Date.now()}`,
      customerId,
      customerName,
      customerEmail,
      serviceId,
      serviceName,
      price,
      paymentMethod: paymentMethod || 'Kredi Kartı',
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'Ödeme Alındı'
    };
    purchasedServices.unshift(newPurchase);
    syncData();

    // Also add to customer services so it shows up in their dashboard
    customerServices.push({
      id: `SRV-${Date.now()}`,
      customerId: String(customerId),
      name: serviceName,
      status: 'Aktif',
      warrantyEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // Default 1 year
      lastMaintenance: new Date().toISOString().split('T')[0],
      price: price,
      icon: 'Shield',
      color: 'text-primary'
    });

    // Also add to customer payments
    customerPayments.unshift({
      id: `PAY-${Date.now()}`,
      customerId: String(customerId),
      amount: price,
      date: new Date().toISOString().split('T')[0],
      status: 'Tamamlandı',
      method: paymentMethod || 'Kredi Kartı',
      description: `${serviceName} Satın Alımı`
    });

    res.status(201).json(newPurchase);
  });

  // Support Chat API
  app.get("/api/support/tickets", (req, res) => {
    const { customerId, isAdmin } = req.query;
    
    if (isAdmin === 'true') {
      return res.json(supportTickets);
    }
    
    if (!customerId) {
      return res.status(400).json({ message: "Müşteri ID gereklidir." });
    }
    
    const userTickets = supportTickets.filter(t => t.customerId === customerId);
    res.json(userTickets);
  });

  app.post("/api/support/tickets", (req, res) => {
    const { customerId, customerName, customerEmail, subject, initialMessage, senderRole } = req.body || {};
    
    if (!customerId || !subject || !initialMessage) {
      return res.status(400).json({ message: "Eksik bilgi: Müşteri ID, konu ve mesaj gereklidir." });
    }

    const newTicket = {
      id: `TKT-${Date.now()}`,
      customerId: String(customerId),
      customerName: customerName || 'Bilinmeyen Müşteri',
      customerEmail: customerEmail || '',
      subject,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const firstMessage = {
      id: `MSG-${Date.now()}`,
      ticketId: newTicket.id,
      senderId: String(customerId),
      senderName: customerName || 'Bilinmeyen Müşteri',
      senderRole: senderRole || 'user',
      text: initialMessage,
      createdAt: new Date().toISOString()
    };
    
    supportTickets.unshift(newTicket);
    supportMessages.push(firstMessage);
    syncData();
    
    res.status(201).json(newTicket);
  });

  app.get("/api/support/tickets/:id/messages", (req, res) => {
    const { id } = req.params;
    const ticketMessages = supportMessages.filter(m => m.ticketId === id);
    res.json(ticketMessages);
  });

  app.post("/api/support/tickets/:id/messages", (req, res) => {
    const { id } = req.params;
    const { senderId, senderName, senderRole, text } = req.body || {};
    
    if (!text) {
      return res.status(400).json({ message: "Mesaj metni gereklidir." });
    }

    const newMessage = {
      id: `MSG-${Date.now()}`,
      ticketId: id,
      senderId: senderId ? String(senderId) : 'system',
      senderName: senderName || (senderRole === 'admin' ? 'Destek Ekibi' : 'Kullanıcı'),
      senderRole: senderRole || 'user',
      text,
      createdAt: new Date().toISOString()
    };
    
    supportMessages.push(newMessage);
    
    // Update ticket's updatedAt and status
    const ticketIndex = supportTickets.findIndex(t => t.id === id);
    if (ticketIndex !== -1) {
      supportTickets[ticketIndex].updatedAt = new Date().toISOString();
      if (senderRole === 'admin') {
        supportTickets[ticketIndex].status = 'pending'; // Waiting for customer
      } else {
        supportTickets[ticketIndex].status = 'open'; // Waiting for admin
      }
    }
    
    syncData();
    res.status(201).json(newMessage);
  });

  app.put("/api/support/tickets/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body || {};
    
    const ticketIndex = supportTickets.findIndex(t => t.id === id);
    if (ticketIndex !== -1) {
      supportTickets[ticketIndex].status = status;
      supportTickets[ticketIndex].updatedAt = new Date().toISOString();
      syncData();
      res.json(supportTickets[ticketIndex]);
    } else {
      res.status(404).json({ message: "Bilet bulunamadı." });
    }
  });

  app.put("/api/purchased-services/:id", (req, res) => {
    const { id } = req.params;
    const { customerId, customerName, customerEmail, serviceId, serviceName, price, status, purchaseDate } = req.body || {};
    const index = purchasedServices.findIndex(item => item.id === id);
    if (index !== -1) {
      purchasedServices[index] = {
        ...purchasedServices[index],
        customerId,
        customerName,
        customerEmail,
        serviceId,
        serviceName,
        price,
        status,
        purchaseDate
      };
      res.json(purchasedServices[index]);
    } else {
      res.status(404).json({ message: "Satış bulunamadı" });
    }
  });

  app.delete("/api/purchased-services/:id", (req, res) => {
    const { id } = req.params;
    purchasedServices = purchasedServices.filter(item => item.id !== id);
    syncData();
    res.json({ success: true });
  });

  // Refund Requests API
  app.get("/api/refund-requests", (req, res) => {
    res.json(refundRequests);
  });

  app.post("/api/refund-requests", (req, res) => {
    const { customerId, customerName, customerEmail, itemId, itemName, itemType, amount, reason } = req.body || {};

    // Check if a refund request already exists for this customer and item
    const existingRequest = refundRequests.find(r => r.customerId === customerId && r.itemId === itemId);
    if (existingRequest) {
      return res.status(400).json({ message: "Bu hizmet için zaten bir iade talebiniz bulunmaktadır." });
    }

    const newRequest = {
      id: `REF-${Date.now()}`,
      customerId,
      customerName,
      customerEmail,
      itemId,
      itemName,
      itemType, // 'Service' or 'Membership'
      amount,
      reason,
      status: 'Beklemede', // Beklemede, Onaylandı, Reddedildi
      requestDate: new Date().toISOString()
    };
    refundRequests.unshift(newRequest);
    syncData();
    res.status(201).json(newRequest);
  });

  app.put("/api/refund-requests/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body || {};
    const index = refundRequests.findIndex(r => r.id === id);
    if (index !== -1) {
      refundRequests[index].status = status;
      
      if (status === 'Onaylandı') {
        const serviceId = refundRequests[index].itemId;
        const paymentIndex = customerPayments.findIndex(p => p.serviceId === serviceId);
        if (paymentIndex !== -1) {
          customerPayments[paymentIndex].status = 'hizmet iade edildi';
        }
      }
      
      res.json(refundRequests[index]);
    } else {
      res.status(404).json({ message: "İade talebi bulunamadı" });
    }
  });

  app.delete("/api/refund-requests/:id", (req, res) => {
    const { id } = req.params;
    refundRequests = refundRequests.filter(r => r.id !== id);
    syncData();
    res.json({ success: true });
  });

  // Payments API
  app.get("/api/payments", (req, res) => {
    const { customerId } = req.query;
    if (customerId) {
      const payments = customerPayments.filter(p => String(p.customerId) === String(customerId));
      return res.json(payments);
    }
    res.json(customerPayments);
  });

  app.post("/api/payments", (req, res) => {
    const newPayment = { ...req.body, id: `PAY-${Date.now()}` };
    customerPayments.unshift(newPayment);
    res.status(201).json(newPayment);
  });

  app.delete("/api/payments/:id", (req, res) => {
    const { id } = req.params;
    customerPayments = customerPayments.filter(p => p.id !== id);
    res.json({ success: true });
  });

  app.put("/api/payments/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const index = customerPayments.findIndex(p => p.id === id);
    if (index !== -1) {
      customerPayments[index] = { ...customerPayments[index], ...updates };
      return res.json(customerPayments[index]);
    }
    res.status(404).json({ message: "Ödeme bulunamadı." });
  });

  // Customer Management Endpoints
  app.get("/api/customers", (req, res) => {
    // Only return users with role 'user' or 'customer'
    const customers = users.filter(u => u.role !== 'admin' && u.role !== 'Çalışan').map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      status: 'Aktif', // Default status
      joinDate: new Date(u.id).toISOString().split('T')[0], // Use ID as timestamp if possible, or current date
      services: customerServices.filter(s => s.customerId === u.id.toString()).length
    }));
    res.json(customers);
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const { name, email, password } = req.body || {};
      if (!name || !email || !password) {
        return res.status(400).json({ message: "İsim, e-posta ve şifre zorunludur." });
      }

      if (users.find(u => u.email === email.toLowerCase().trim())) {
        return res.status(400).json({ message: "Bu e-posta adresi zaten kullanımda." });
      }

      // Use the provided password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = {
        id: Date.now(),
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "user"
      };

      users.push(newUser);
      syncData();

      // Optionally send an email to the new customer with their password
      try {
        await sendEmail({
          to: email,
          subject: "Hesabınız Oluşturuldu - Emin Bilgi İşlem",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Hoş Geldiniz!</h2>
              <p>Merhaba <strong>${name}</strong>,</p>
              <p>Emin Bilgi İşlem müşteri hesabınız başarıyla oluşturulmuştur.</p>
              <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Giriş Bilgileriniz:</strong></p>
                <p style="margin: 0 0 5px 0;">E-posta: ${email}</p>
                <p style="margin: 0;">Şifre: <strong>${password}</strong></p>
              </div>
              <p><em>Güvenliğiniz için lütfen ilk girişinizden sonra şifrenizi değiştiriniz.</em></p>
            </div>
          `
        });
      } catch (emailError) {
        console.error("Müşteri karşılama e-postası gönderilemedi:", emailError);
      }

      res.status(201).json({ 
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        status: 'Aktif',
        joinDate: new Date().toISOString().split('T')[0],
        services: 0
      });
    } catch (error) {
      console.error("Müşteri eklenirken hata:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  });

  app.delete("/api/customers/:id", (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id.toString() === id);
    
    let deleted = false;
    if (index !== -1) {
      users.splice(index, 1);
      deleted = true;
    }

    // Also delete associated services, transactions, documents, etc.
    const initialServicesCount = customerServices.length;
    customerServices = customerServices.filter(s => String(s.customerId) !== String(id));
    customerTransactions = customerTransactions.filter(t => String(t.customerId) !== String(id));
    customerDocuments = customerDocuments.filter(d => String(d.customerId) !== String(id));
    customerPayments = customerPayments.filter(p => String(p.customerId) !== String(id));

    if (deleted || customerServices.length < initialServicesCount || String(id).startsWith('C-')) {
      res.json({ success: true });
    } else {
      res.status(404).json({ message: "Müşteri bulunamadı." });
    }
  });

  // Customer Details API Endpoints
  app.get("/api/customers/:id/details", (req, res) => {
    const { id } = req.params;
    const services = customerServices.filter(s => String(s.customerId) === String(id));
    const payments = customerPayments.filter(p => String(p.customerId) === String(id));
    const transactions = customerTransactions.filter(t => String(t.customerId) === String(id));
    const documents = customerDocuments.filter(d => String(d.customerId) === String(id));
    const customerEmployees = employees.filter(e => String(e.customerId) === String(id));
    res.json({ services, payments, transactions, documents, employees: customerEmployees });
  });

  app.post("/api/customers/:id/services", (req, res) => {
    const { id } = req.params;
    const newService = { ...req.body, id: Date.now().toString(), customerId: id };
    customerServices.push(newService);
    purchasedServices.push(newService);
    syncData();

    // Also create a payment record if price is provided
    if (newService.price && Number(newService.price) > 0) {
      const newPayment = {
        id: `PAY-${Date.now()}`,
        customerId: String(id),
        customerName: req.body.customerName || "Müşteri",
        customerEmail: req.body.customerEmail || "",
        serviceId: newService.id,
        serviceName: newService.name,
        amount: Number(newService.price),
        status: "Beklemede",
        date: new Date().toISOString().split('T')[0],
        type: "Hizmet Ödemesi"
      };
      customerPayments.push(newPayment);
      syncData();
    }

    res.status(201).json(newService);
  });

  app.put("/api/customers/:id/services/:serviceId", (req, res) => {
    const { serviceId } = req.params;
    const index = customerServices.findIndex(s => s.id === serviceId);
    if (index !== -1) {
      customerServices[index] = { ...customerServices[index], ...req.body };
      syncData();
      res.json(customerServices[index]);
    } else {
      res.status(404).json({ message: "Hizmet bulunamadı." });
    }
  });

  app.post("/api/customers/:id/payments", (req, res) => {
    const { id } = req.params;
    const newPayment = { ...req.body, id: Date.now().toString(), customerId: String(id) };
    customerPayments.push(newPayment);
    syncData();
    res.status(201).json(newPayment);
  });

  app.put("/api/customers/:id/payments/:paymentId", (req, res) => {
    const { paymentId } = req.params;
    const index = customerPayments.findIndex(p => p.id === paymentId);
    if (index !== -1) {
      customerPayments[index] = { ...customerPayments[index], ...req.body };
      syncData();
      res.json(customerPayments[index]);
    } else {
      res.status(404).json({ message: "Ödeme bulunamadı." });
    }
  });

  app.delete("/api/customers/:id/payments/:paymentId", (req, res) => {
    const { paymentId } = req.params;
    customerPayments = customerPayments.filter(p => p.id !== paymentId);
    syncData();
    res.json({ success: true });
  });

  app.post("/api/customers/:id/transactions", (req, res) => {
    const { id } = req.params;
    const newTransaction = { ...req.body, id: Date.now().toString(), customerId: id };
    customerTransactions.push(newTransaction);
    syncData();
    res.status(201).json(newTransaction);
  });

  app.put("/api/customers/:id/transactions/:transactionId", (req, res) => {
    const { transactionId } = req.params;
    const index = customerTransactions.findIndex(t => t.id === transactionId);
    if (index !== -1) {
      customerTransactions[index] = { ...customerTransactions[index], ...req.body };
      syncData();
      res.json(customerTransactions[index]);
    } else {
      res.status(404).json({ message: "İşlem bulunamadı." });
    }
  });

  app.post("/api/customers/:id/documents", (req, res) => {
    const { id } = req.params;
    const { name, type, url, fileData } = req.body || {};
    
    // If fileData is provided (base64), use it as the URL for simulation
    const documentUrl = fileData || url;
    
    const newDoc = { 
      id: Date.now().toString(), 
      customerId: id, 
      name, 
      type, 
      url: documentUrl, 
      date: new Date().toISOString().split('T')[0] 
    };
    customerDocuments.push(newDoc);
    syncData();
    res.status(201).json(newDoc);
  });

  app.delete("/api/customers/:id/documents/:docId", (req, res) => {
    const { docId } = req.params;
    customerDocuments = customerDocuments.filter(d => d.id !== docId);
    syncData();
    res.json({ success: true });
  });

  // Settings API Endpoints
  app.get("/api/settings", (req, res) => {
    res.json(settings);
  });

  app.put("/api/settings", (req, res) => {
    settings = { ...settings, ...req.body };
    syncData();
    res.json(settings);
  });

  // Employee Management Endpoints
  app.get("/api/employees", (req, res) => {
    const customerId = req.query.customerId;
    if (!customerId) return res.status(400).json({ message: "Müşteri ID gerekli." });
    
    const filteredEmployees = employees.filter(e => String(e.customerId) === String(customerId));
    res.json(filteredEmployees);
  });

  app.post("/api/employees", async (req, res) => {
    const { customerId, name, email, role, permissions, password } = req.body || {};
    if (!customerId || !name || !email) return res.status(400).json({ message: "Eksik bilgi." });

    if (users.find(u => u.email === email.toLowerCase().trim())) {
      return res.status(400).json({ message: "Bu e-posta adresi zaten kayıtlı." });
    }

    const hashedPassword = await bcrypt.hash(password || "123456", 10);
    const userId = `U-${Date.now()}`;

    const newEmployeeUser = {
      id: userId,
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'Çalışan',
      customerId,
      permissions: permissions || ['overview']
    };

    users.push(newEmployeeUser);

    const newEmployee = {
      id: `E-${Date.now()}`,
      userId,
      customerId: String(customerId),
      name,
      email,
      role: role || 'Çalışan',
      permissions: permissions || ['overview'],
      status: 'Aktif'
    };

    employees.push(newEmployee);
    syncData();
    res.status(201).json(newEmployee);
  });

  app.put("/api/employees/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, role, permissions, status } = req.body || {};
    
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) return res.status(404).json({ message: "Çalışan bulunamadı." });

    employees[index] = {
      ...employees[index],
      name: name || employees[index].name,
      email: email || employees[index].email,
      role: role || employees[index].role,
      permissions: permissions || employees[index].permissions,
      status: status || employees[index].status
    };

    syncData();
    res.json(employees[index]);
  });

  app.delete("/api/employees/:id", (req, res) => {
    const { id } = req.params;
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) return res.status(404).json({ message: "Çalışan bulunamadı." });

    employees.splice(index, 1);
    syncData();
    res.json({ success: true, message: "Çalışan silindi." });
  });

  // Handle 404 for API routes specifically
  app.use("/api/*all", (req, res) => {
    res.status(404).json({ message: "API endpoint not found" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
