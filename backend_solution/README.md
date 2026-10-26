# Backend Setup Guide

## 1. Installation
```bash
npm install
```

## 2. Environment Variables
Create a `.env` file based on `.env.example`:
```env
PORT=3000
VERIFY_TOKEN=my_custom_secure_token
```

## 3. Run Server
```bash
npm start
```

## 4. Expose Server via Ngrok
```bash
ngrok http 3000
```
Use the generated HTTPS URL (e.g., `https://xxxx.ngrok-free.app/webhook`) in Meta Developer Dashboard.
