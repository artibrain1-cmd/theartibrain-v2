# TheArtiBrain - AI Blog Platform

A complete, production-ready AI blog, news, and tutorial platform built with Next.js, featuring a stunning glassmorphism dark theme and comprehensive admin dashboard for content management.

## 🚀 Features

### Public-Facing Site
- **Modern Design**: Glassmorphism dark theme with teal and indigo accents
- **Responsive Layout**: Mobile-first design that works perfectly on all devices
- **Hero Section**: Prominent featured article display
- **Article Grid**: Clean card-based layout for recent posts
- **Category Pages**: Organized content by topics
- **Author Pages**: Individual author profiles and their articles
- **Newsletter Signup**: Email subscription call-to-action
- **SEO Optimized**: Meta tags, structured data, and performance optimized

### Admin Dashboard
- **Secure Authentication**: Role-based access control (Admin, Editor, Author)
- **Dashboard Overview**: Statistics and quick actions
- **Post Management**: Create, edit, delete, and manage posts
- **Rich Text Editor**: Simplified content editor with image upload
- **Category & Tag Management**: Organize content effectively
- **User Management**: Admin can manage users and roles
- **Media Upload**: Secure file upload system

### Technical Features
- **Next.js 15**: Latest App Router with TypeScript
- **PostgreSQL**: Robust database with Prisma ORM
- **NextAuth.js**: Secure authentication system
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and micro-interactions
- **Docker**: Containerized for easy deployment
- **Performance**: Optimized for 90+ Lighthouse scores

## 🛠 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 20 or higher
- PostgreSQL 14 or higher
- Docker and Docker Compose (optional)

## 🚀 Quick Start

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd theartibrain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/theartibrain"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Set up the database**
   ```bash
   # Start PostgreSQL service
   sudo systemctl start postgresql
   
   # Create database and user
   sudo -u postgres psql -c "CREATE USER theartibrainuser WITH PASSWORD 'theartibrainpassword';"
   sudo -u postgres psql -c "CREATE DATABASE theartibraindb OWNER theartibrainuser;"
   sudo -u postgres psql -c "ALTER USER theartibrainuser CREATEDB;"
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Seed the database (optional)**
   ```bash
   npx prisma db seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Access the application**
   - Public site: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin
   - Login page: http://localhost:3000/auth/signin

### Option 2: Docker Development

1. **Clone and navigate to the project**
   ```bash
   git clone <repository-url>
   cd theartibrain
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations**
   ```bash
   docker-compose exec app npx prisma migrate dev
   docker-compose exec app npx prisma db seed
   ```

4. **Access the application**
   - Public site: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin

## 👥 Default User Accounts

The application comes with demo accounts for testing:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@theartibrain.com | admin123 |
| Editor | editor@theartibrain.com | editor123 |
| Author | author@theartibrain.com | author123 |

## 📁 Project Structure

```
theartibrain/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── posts/             # Public post pages
│   │   └── category/          # Category pages
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utility functions and configurations
│   └── types/                 # TypeScript type definitions
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
├── docker-compose.yml         # Docker development setup
├── Dockerfile                 # Container configuration
└── README.md                  # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/theartibrain"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: File upload configuration
UPLOAD_DIR="./public/uploads"
```

### Database Schema

The application uses the following main models:

- **User**: Admin, Editor, and Author accounts
- **Post**: Blog posts with rich content
- **Category**: Content organization
- **Tag**: Content tagging system
- **PostCategory**: Many-to-many relationship
- **PostTag**: Many-to-many relationship

## 🎨 Customization

### Theme Colors

The application uses a glassmorphism dark theme with these primary colors:

- **Primary**: Teal (teal-500)
- **Secondary**: Indigo (indigo-600)
- **Background**: Gray-900
- **Cards**: Gray-800 with transparency

To customize colors, update the Tailwind CSS classes in the components.

### Adding New Features

1. **API Routes**: Add new endpoints in `src/app/api/`
2. **Pages**: Create new pages in `src/app/`
3. **Components**: Add reusable components in `src/components/`
4. **Database**: Modify schema in `prisma/schema.prisma`

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Production

```bash
docker build -t theartibrain .
docker run -p 3000:3000 theartibrain
```

### Environment Setup

For production deployment:

1. Set up a PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build and deploy the application

## 🔒 Security

- **Authentication**: Secure session-based authentication with NextAuth.js
- **Authorization**: Role-based access control
- **Password Hashing**: bcrypt for secure password storage
- **File Uploads**: Validated and sanitized file uploads
- **CSRF Protection**: Built-in Next.js CSRF protection

## 📈 Performance

The application is optimized for performance:

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting and lazy loading
- **Caching**: Efficient caching strategies
- **Bundle Size**: Optimized bundle size with tree shaking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🎯 Roadmap

Future enhancements planned:

- [ ] Rich text editor integration (TipTap)
- [ ] Comment system
- [ ] Social media integration
- [ ] Advanced SEO features
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Advanced search functionality

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.

