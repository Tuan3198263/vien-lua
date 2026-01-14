# 📚 Tài liệu Dự án

## 🚀 Hướng dẫn Deploy

- [EC2_SETUP.md](EC2_SETUP.md) - Hướng dẫn setup ứng dụng trên EC2
- [GITHUB_SETUP.md](GITHUB_SETUP.md) - Hướng dẫn setup GitHub và CI/CD

## 📖 Tài liệu khác

- [PRODUCTION_ENV_GUIDE.md](../PRODUCTION_ENV_GUIDE.md) - Hướng dẫn quản lý Environment Variables
- [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) - Cấu trúc dự án

## 🎯 Quick Start

### Local Development

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

### Production Deploy

```bash
# Trên EC2
docker compose -f docker-compose.prod.yml up -d
```

### CI/CD Auto Deploy

Push code lên GitHub → Tự động deploy lên EC2

---

**Happy Coding!** 💻
