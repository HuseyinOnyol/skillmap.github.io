# SkillMap - SAP Uzman Katalog Sistemi

SkillMap, SAP uzmanlarını kategorize etmek, filtrelemek ve eşleştirmek için geliştirilmiş modern bir web uygulamasıdır. Sistem, üç farklı kullanıcı rolü (Owner, Partner, Müşteri) ile çalışır ve PII maskeleme özelliği sunar.

## 🚀 Özellikler

### Temel Özellikler
- **Rol Tabanlı Erişim Kontrolü (RBAC)**: Owner, Partner Admin, Partner User rolleri
- **PII Maskeleme**: Müşteri görünümü için kişisel bilgilerin maskelenmesi
- **Gelişmiş Filtreleme**: Tag tabanlı arama ve skorlama sistemi
- **Public Katalog**: Girişsiz erişim ile profil arama
- **İletişim Talebi Sistemi**: Müşterilerden gelen taleplerin yönetimi

### Roller ve Yetkiler

#### Owner
- Partner organizasyonları ekler/siler
- Tüm profilleri görüntüler ve düzenler
- Tag sözlüğünü yönetir
- İletişim taleplerini işler
- Sistem genelinde tam yetki

#### Partner Admin
- Kendi organizasyonunun profillerini yönetir
- Yeni çalışan profilleri ekler
- Diğer organizasyonların profillerini maskeli görür

#### Partner User
- Sadece kendi profilini görüntüler ve düzenler

#### Müşteri (Public)
- Girişsiz katalog araması
- Maskeli profil kartları görür
- İletişim talebi gönderir

## 🛠 Teknoloji Yığını

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Backend**: Next.js API Routes, Supabase
- **Veritabanı**: PostgreSQL (Supabase)
- **Kimlik Doğrulama**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Bileşenleri**: Custom UI components
- **Icons**: Lucide React

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Supabase hesabı

### Adımlar

1. **Projeyi klonlayın**
   ```bash
   git clone <repo-url>
   cd skillmap-inopeak
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Environment variables'ları ayarlayın**
   `.env.local` dosyası oluşturun:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://rwvcngqooxdvsmgyqluz.supabase.co/
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3dmNuZ3Fvb3hkdnNtZ3lxbHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMDQ0MDksImV4cCI6MjA3MzU4MDQwOX0.GZLipQ8-1av8SK1xc6K5clJnc6vK0Q1j-y84h62q494
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Supabase veritabanını kurun**
   ```bash
   # Supabase CLI ile migration'ları çalıştırın
   supabase db reset
   
   # Veya manuel olarak SQL dosyalarını çalıştırın:
   # 1. supabase/migrations/001_initial_schema.sql
   # 2. supabase/migrations/002_rls_policies.sql
   # 3. supabase/seed.sql (test verileri için)
   ```

5. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

   Uygulama http://localhost:3000 adresinde çalışacaktır.

## 📊 Veritabanı Şeması

### Ana Tablolar
- `organizations`: Organizasyon bilgileri (Owner/Partner)
- `users`: Kullanıcı hesapları ve rolleri
- `profiles`: Çalışan profilleri (PII + mesleki bilgiler)
- `experiences`: Proje deneyimleri
- `tags`: Master tag sözlüğü (modül, teknoloji, rol, vs.)
- `profile_tags`: Profil-tag ilişkileri (N:N)
- `contact_requests`: Müşteri iletişim talepleri
- `audit_logs`: Sistem aktivite kayıtları

### Tag Kategorileri
- **module**: SAP-MM, SAP-FI, SAP-SD, vs.
- **tech**: ABAP-OO, Fiori, BTP, CDS, vs.
- **role**: Lead, Senior, Mid, Junior, vs.
- **scope**: FullCycle, Support
- **sector**: Pharma, E-Commerce, Automotive, vs.
- **lang**: TR-Native, EN-B1, EN-B2, vs.
- **level**: 1y+, 3y+, 5y+, 8y+

## 🔒 Güvenlik Özellikleri

### Row Level Security (RLS)
- Supabase RLS politikaları ile veri erişim kontrolü
- Kullanıcı rolüne göre otomatik filtreleme
- Organizasyon bazlı veri izolasyonu

### PII Maskeleme
- İsim maskeleme: "Ahmet Yılmaz" → "A* Y***"
- E-posta maskeleme: "user@domain.com" → "u***@d***"
- Müşteri adı maskeleme: Sektör genellemesi
- Telefon maskeleme: Tam gizleme

### Audit Logging
- Tüm CRUD operasyonları kayıt altına alınır
- Kullanıcı aktiviteleri izlenir
- Metadata ile detaylı log tutma

## 📱 Kullanım

### Public Katalog (Ana Sayfa)
1. http://localhost:3000 adresine gidin
2. Arama çubuğuna teknoloji/modül yazın
3. "Filtrele" butonu ile gelişmiş filtreleri açın
4. SAP modülleri, teknolojiler, deneyim seviyesi seçin
5. Sonuçları görüntüleyin ve "İletişim" butonuna tıklayın

### Owner Paneli
1. `/login` sayfasından giriş yapın (owner hesabıyla)
2. Dashboard'dan hızlı erişim menüsünü kullanın
3. Partner yönetimi, tag sözlüğü, profil yönetimi
4. İletişim taleplerini inceleyin ve yanıtlayın

### Partner Paneli
1. Partner admin hesabıyla giriş yapın
2. "Çalışanlarım" bölümünden profilleri yönetin
3. "Yeni Profil Ekle" ile CV ekleme sihirbazını kullanın
4. 3 adımlı süreç: Temel bilgiler → Deneyimler → Tag seçimi

## 🔧 Geliştirme

### Proje Yapısı
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard sayfaları
│   ├── login/            # Auth sayfaları
│   └── page.tsx          # Ana sayfa (Public katalog)
├── components/
│   └── ui/               # UI bileşenleri
├── contexts/             # React contexts
├── lib/                  # Utility fonksiyonları
├── types/               # TypeScript tipleri
└── styles/              # CSS dosyaları

supabase/
├── migrations/          # Veritabanı migration'ları
└── seed.sql            # Test verileri
```

### API Endpoints
- `GET /api/tags` - Tag listesi
- `GET /api/profiles` - Profil arama (filtreleme destekli)
- `POST /api/profiles` - Yeni profil oluşturma
- `GET /api/contact-requests` - İletişim talepleri (Owner)
- `POST /api/contact-requests` - Yeni iletişim talebi

### Skorlama Algoritması
```
Skor = (Module eşleşmesi × 3) + 
       (Tech eşleşmesi × 2) + 
       (Role eşleşmesi × 2) + 
       (Scope eşleşmesi × 2) + 
       (Sector eşleşmesi × 1) + 
       (Language eşleşmesi × 1) + 
       (Kıdem yakınlığı × 1) + 
       (Güncellik bonusu × 1)
```

## 🧪 Test Verileri

Sistem, `supabase/seed.sql` dosyasında tanımlı test verileri ile gelir:
- 1 Owner organizasyonu (InoPeak Technologies)
- 2 Partner organizasyonu (TechPartner A, ConsultCorp B)
- 5 kullanıcı (farklı rollerle)
- 6 örnek profil (farklı uzmanlık alanları)
- Kapsamlı tag sözlüğü
- Örnek iletişim talepleri

## 🚀 Production Deployment

### Vercel + Supabase
1. Vercel hesabınıza projeyi import edin
2. Environment variables'ları Vercel dashboard'da ayarlayın
3. Supabase production veritabanını kurun
4. Migration'ları production'da çalıştırın

### Environment Variables (Production)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için issue oluşturabilirsiniz.