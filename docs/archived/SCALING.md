# Scaling Roadmap

> **Last Updated:** October 3, 2025
> **Purpose:** Step-by-step guide to scale from 0 to 100,000+ concurrent users

---

## Overview

This document provides a phased approach to scaling your WebRTC voice chat application based on user growth.

**Key Insight:** Your app uses WebRTC peer-to-peer architecture, which means voice data flows directly between users. Your server only handles signaling, making it extremely cost-efficient to scale.

---

## Scaling Phases

### Phase 0: Current State (0-100 Concurrent Users)
### Phase 1: Optimization (100-200 Concurrent Users)
### Phase 2: Paid Railway (200-500 Concurrent Users)
### Phase 3: VPS Migration (500-10,000 Concurrent Users)
### Phase 4: Load Balancing (10,000-50,000 Concurrent Users)
### Phase 5: Multi-Region (50,000+ Concurrent Users)

---

## Phase 0: Current State (0-100 Users)

**Status:** ✅ Already Deployed
**Cost:** $0/month
**Capacity:** 50-100 concurrent users

### Current Infrastructure

```
┌─────────────┐
│   Users     │
└──────┬──────┘
       │
       ├──→ Vercel (Next.js Frontend)
       │
       └──→ Railway (Socket.IO Server)
               │
               └──→ Supabase (Database)
```

### What Works

- ✅ Railway free tier ($5 credits/month)
- ✅ Vercel free tier (100GB bandwidth)
- ✅ Supabase free tier (500MB database)
- ✅ WebRTC P2P (unlimited calls)

### Limitations

- ⚠️ Railway credits run out after ~20 days with 50-100 users
- ⚠️ Socket.IO configuration not optimized (200KB/connection)
- ⚠️ No monitoring or alerts set up

### Action Items

- [x] Deployed to production
- [ ] Set up monitoring (see Phase 1)
- [ ] Prepare optimization code changes (see Phase 1)

---

## Phase 1: Socket.IO Optimization (100-200 Users)

**Trigger:** Railway credits consistently >80% used OR 100+ concurrent users
**Timeline:** 1-2 hours implementation
**Cost:** Still $0/month
**Capacity Gain:** 3-4x (from 50-100 to 150-200 users)

### Optimizations to Implement

#### 1. Update Socket.IO Server Configuration

**File:** `src/lib/socket-server.js`

**Current Configuration (Lines 30-39):**
```javascript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingInterval: 2000,  // ❌ Too aggressive
  pingTimeout: 5000
});
```

**Optimized Configuration:**
```javascript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  // OPTIMIZATIONS START HERE
  pingInterval: 10000,         // ✅ 10s instead of 2s (-80% traffic)
  pingTimeout: 5000,
  transports: ['websocket'],   // ✅ Force WebSocket only
  perMessageDeflate: false,    // ✅ Disable compression
  maxHttpBufferSize: 1e6,      // 1MB message limit
  allowEIO3: false             // Disable old Engine.IO
});
```

**Impact:**
- Memory per connection: 200KB → 70KB (-65%)
- Network traffic: -80% heartbeat overhead
- CPU usage: -50-70%

#### 2. Update Socket.IO Client Configuration

**File:** `src/lib/webrtc/socket-client.ts`

**Current Configuration (Lines 59-70):**
```javascript
this.socket = io(socketUrl, {
  forceNew: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ['websocket'],      // ✅ Already optimized!
  auth: {
    sessionId: sessionId
  }
});
```

**Already optimized!** Your client is already using WebSocket-only transport.

#### 3. Install Performance Binaries

**Command:**
```bash
npm install --save-optional bufferutil utf-8-validate
```

**Impact:**
- +15-20% WebSocket frame processing speed
- Native C++ implementations for encoding/decoding

#### 4. Add Memory Monitoring

**File:** `src/lib/socket-server.js`

**Add after line 283 (before shutdown handlers):**
```javascript
// Memory and connection monitoring
setInterval(() => {
  const used = process.memoryUsage();
  const connectedUsers = io.engine.clientsCount;
  const activeConnections = activeConnections.size;
  const queueSize = waitingQueue.length;

  console.log('📊 Server Stats:', {
    connectedUsers,
    activeConnections,
    queueSize,
    memory: {
      rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`
    }
  });
}, 60000); // Every 1 minute
```

#### 5. Add Cleanup for Stale Connections

**File:** `src/lib/socket-server.js`

**Add after monitoring code:**
```javascript
// Clean up orphaned connections every 5 minutes
setInterval(() => {
  let cleanedCount = 0;

  // Clean up activeConnections
  for (const [socketId, connection] of activeConnections.entries()) {
    const socketExists = io.sockets.sockets.has(socketId);
    if (!socketExists) {
      activeConnections.delete(socketId);
      cleanedCount++;
    }
  }

  // Clean up waitingQueue
  const originalQueueSize = waitingQueue.length;
  waitingQueue = waitingQueue.filter(socket => {
    return io.sockets.sockets.has(socket.id);
  });
  cleanedCount += originalQueueSize - waitingQueue.length;

  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned up ${cleanedCount} orphaned connections`);
  }
}, 300000); // Every 5 minutes
```

### Deployment Steps

1. **Make code changes** (above)
2. **Test locally** with two browser tabs
3. **Commit and push** to GitHub
   ```bash
   git add .
   git commit -m "perf: optimize Socket.IO configuration for 3-4x capacity"
   git push origin main
   ```
4. **Railway auto-deploys** (wait 2-3 minutes)
5. **Test production** with production URL
6. **Monitor Railway dashboard** for memory/CPU changes

### Expected Results

**Before Optimization:**
- 50-100 concurrent users
- Railway credits last ~20 days
- 200KB memory per connection

**After Optimization:**
- 150-200 concurrent users
- Railway credits last full month
- 70KB memory per connection
- Server can handle 3-4x more users on same hardware

---

## Phase 2: Paid Railway (200-500 Users)

**Trigger:** Optimized Railway still running out of credits OR 200+ concurrent users
**Timeline:** 5 minutes
**Cost:** $5-15/month
**Capacity:** 200-500 concurrent users

### Steps

1. **Add Credit Card to Railway**
   - Go to Railway dashboard
   - Settings → Billing
   - Add payment method
   - Set spending limit: $20/month

2. **Monitor Costs**
   - Check Railway dashboard weekly
   - If consistently >$20/month, move to Phase 3

### When to Skip This Phase

**Skip if:**
- You're already paying $20+/month
- You have time to migrate (2-3 hours)
- You want more control over infrastructure

**Move directly to Phase 3** (Hetzner VPS) - it's cheaper and more powerful.

---

## Phase 3: VPS Migration (500-10,000 Users)

**Trigger:** Railway costs >$20/month OR 500+ concurrent users
**Timeline:** 2-3 hours (one-time migration)
**Cost:** $5.50/month (Hetzner CX11) → saves money vs Railway!
**Capacity:** 10,000-15,000 concurrent users (with optimizations)

### Recommended Platform: Hetzner Cloud

**Why Hetzner:**
- €5/month (~$5.50) for 2GB RAM
- 20TB bandwidth included
- Reliable ("boringly reliable" - developer favorite)
- Easy to scale up

**Alternative Platforms:**
- DigitalOcean: $6/month (1GB RAM, less bandwidth)
- Linode: $5/month (1GB RAM, great support)
- Vultr: $2.50/month (512MB RAM, minimal)

### Migration Steps

#### Step 1: Create Hetzner Server (30 minutes)

1. **Sign up for Hetzner Cloud**
   - Go to https://www.hetzner.com/cloud
   - Create account
   - Verify email

2. **Create New Server**
   - Click "Add Server"
   - **Location:** Choose closest to your users (US, Europe, or Singapore)
   - **Image:** Ubuntu 22.04 LTS
   - **Type:** Shared vCPU
   - **Plan:** CX11 (€4.51/month - 1 vCPU, 2GB RAM, 20GB disk)
   - **SSH Key:** Add your public SSH key
   - **Name:** airtalk-socket-server
   - Click "Create & Buy Now"

3. **Note Server IP Address**
   - Copy the IPv4 address (e.g., 95.217.123.456)

#### Step 2: Set Up Server (45 minutes)

1. **SSH into Server**
   ```bash
   ssh root@YOUR_SERVER_IP
   ```

2. **Install Node.js 22.x**
   ```bash
   # Update system
   apt update && apt upgrade -y

   # Install Node.js 22.x
   curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
   apt install -y nodejs

   # Verify installation
   node --version  # Should show v22.x.x
   npm --version
   ```

3. **Install Git**
   ```bash
   apt install -y git
   ```

4. **Clone Your Repository**
   ```bash
   cd /opt
   git clone https://github.com/YOUR_USERNAME/call_app_1.git
   cd call_app_1
   ```

5. **Install Dependencies**
   ```bash
   npm install
   ```

6. **Create Environment File**
   ```bash
   nano .env.local
   ```

   **Paste your environment variables:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://skyffnybsqwfbbkbqcxy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=false
   FRONTEND_URL=https://call-app-1.vercel.app
   PORT=3001
   ```

   **Save:** Ctrl+X, Y, Enter

7. **Install PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   ```

8. **Start Socket.IO Server with PM2**
   ```bash
   pm2 start src/lib/socket-server.js --name airtalk-socket
   pm2 save
   pm2 startup
   # Follow the command it outputs
   ```

9. **Configure Firewall**
   ```bash
   # Allow SSH, HTTP, and Socket.IO port
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw allow 3001/tcp
   ufw enable
   ```

10. **Test Server**
    ```bash
    curl http://localhost:3001/health
    # Should return "OK"
    ```

#### Step 3: Update Vercel Environment Variables (10 minutes)

1. **Go to Vercel Dashboard**
   - Select your project
   - Settings → Environment Variables

2. **Update NEXT_PUBLIC_SOCKET_URL**
   - Change from: `https://callapp1-production.up.railway.app`
   - Change to: `http://YOUR_HETZNER_IP:3001`

3. **Redeploy Vercel**
   - Deployments tab → Click "Redeploy" on latest deployment

#### Step 4: Test Production (10 minutes)

1. **Open Vercel URL** in browser
2. **Check browser console** - should connect to Hetzner IP
3. **Test call** between two tabs
4. **Monitor Hetzner server**
   ```bash
   ssh root@YOUR_SERVER_IP
   pm2 logs airtalk-socket
   ```

#### Step 5: Set Up SSL (Optional but Recommended) (30 minutes)

**Why:** HTTPS frontend connecting to HTTP backend causes mixed content warnings

1. **Get Domain Name** (e.g., socket.yourdomain.com)

2. **Point Domain to Hetzner IP**
   - Add A record in DNS settings

3. **Install Nginx**
   ```bash
   apt install -y nginx certbot python3-certbot-nginx
   ```

4. **Configure Nginx**
   ```bash
   nano /etc/nginx/sites-available/airtalk-socket
   ```

   **Paste configuration:**
   ```nginx
   server {
       listen 80;
       server_name socket.yourdomain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

   **Save and enable:**
   ```bash
   ln -s /etc/nginx/sites-available/airtalk-socket /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

5. **Get SSL Certificate**
   ```bash
   certbot --nginx -d socket.yourdomain.com
   # Follow prompts, choose "Redirect HTTP to HTTPS"
   ```

6. **Update Vercel Environment Variable**
   - Change `NEXT_PUBLIC_SOCKET_URL` to: `https://socket.yourdomain.com`

### Maintenance

**Weekly:**
- Check PM2 status: `pm2 status`
- Check logs: `pm2 logs airtalk-socket --lines 100`

**Monthly:**
- Update packages: `cd /opt/call_app_1 && git pull && npm install && pm2 restart airtalk-socket`
- Update system: `apt update && apt upgrade -y`

**Automated Deployments:**
```bash
# Set up webhook or GitHub Actions for auto-deploy
# Example: Pull latest code on push to main branch
```

---

## Phase 4: Load Balancing (10,000-50,000 Users)

**Trigger:** Single Hetzner server approaching limits (8,000+ concurrent users)
**Timeline:** 1-2 weeks
**Cost:** $30-70/month
**Capacity:** 50,000-100,000 concurrent users

### Architecture Changes Needed

```
┌─────────────┐
│   Users     │
└──────┬──────┘
       │
       ├──→ Vercel (Frontend)
       │
       └──→ Load Balancer (Nginx/HAProxy)
              │
              ├──→ Socket.IO Server 1 (Hetzner CPX11)
              ├──→ Socket.IO Server 2 (Hetzner CPX11)
              └──→ Socket.IO Server 3 (Hetzner CPX11)
                     │
                     └──→ Redis (for Socket.IO adapter)
```

### Required Components

1. **Redis Server** (for Socket.IO cross-server communication)
2. **Load Balancer** with sticky sessions
3. **Multiple Socket.IO servers**
4. **Socket.IO Redis adapter**

### Implementation Steps

#### 1. Set Up Redis

**Option A: Upstash (Managed, Free Tier)**
- 10,000 commands/day free
- Easy setup
- Go to https://upstash.com

**Option B: Self-Hosted Redis (Hetzner CX11)**
```bash
# On new Hetzner server
apt update && apt install -y redis-server
systemctl enable redis-server
systemctl start redis-server
```

#### 2. Install Socket.IO Redis Adapter

**Update package.json:**
```bash
cd /opt/call_app_1
npm install @socket.io/redis-adapter redis
```

**Update socket-server.js:**
```javascript
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

// ... existing code ...

const io = new Server(httpServer, {
  // ... existing config ...
});

// Add Redis adapter
const pubClient = createClient({ url: 'redis://YOUR_REDIS_URL:6379' });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  console.log('Redis adapter connected');
});

// ... rest of code ...
```

#### 3. Set Up Load Balancer

**Nginx Configuration (with Sticky Sessions):**
```nginx
upstream socket_backend {
    ip_hash;  # Sticky sessions based on IP
    server SERVER1_IP:3001;
    server SERVER2_IP:3001;
    server SERVER3_IP:3001;
}

server {
    listen 80;
    server_name socket.yourdomain.com;

    location / {
        proxy_pass http://socket_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4. Deploy Multiple Servers

Repeat Phase 3 setup for 2-3 servers, all connecting to same Redis instance.

### Cost Breakdown

| Component | Provider | Monthly Cost |
|-----------|----------|--------------|
| Socket.IO Server 1 | Hetzner CPX11 | $11 |
| Socket.IO Server 2 | Hetzner CPX11 | $11 |
| Socket.IO Server 3 | Hetzner CPX11 | $11 |
| Redis | Hetzner CX11 | $5.50 |
| Load Balancer | Hetzner CX11 | $5.50 |
| **Total** | | **$44/month** |

**Capacity:** 50,000-100,000 concurrent users

---

## Phase 5: Multi-Region (50,000+ Users)

**Trigger:** Global user base, need low latency worldwide
**Timeline:** 2-4 weeks
**Cost:** $100-300/month
**Capacity:** 100,000-500,000+ concurrent users

### Architecture

```
Global Users
    │
    ├──→ US Region
    │      ├─ Load Balancer
    │      └─ 3x Socket.IO Servers
    │
    ├──→ EU Region
    │      ├─ Load Balancer
    │      └─ 3x Socket.IO Servers
    │
    └──→ Asia Region
           ├─ Load Balancer
           └─ 3x Socket.IO Servers
```

### Considerations

- **GeoDNS** for routing users to nearest region
- **Cross-region Redis** for global user state
- **Database replication** (Supabase Pro with read replicas)
- **Monitoring** across all regions

**At this scale, consider managed services or hiring DevOps engineer.**

---

## Quick Reference: When to Upgrade

| Concurrent Users | Action | Cost/Month | Timeline |
|-----------------|--------|------------|----------|
| **0-100** | Current setup | $0 | Done ✅ |
| **100-200** | Implement optimizations | $0 | 1-2 hours |
| **200-500** | Add Railway payment | $5-15 | 5 minutes |
| **500-1,000** | Migrate to Hetzner CX11 | $5.50 | 2-3 hours |
| **1,000-10,000** | Upgrade to CPX11 | $11 | 30 minutes |
| **10,000-50,000** | Load balancing + Redis | $44 | 1-2 weeks |
| **50,000+** | Multi-region deployment | $100+ | 2-4 weeks |

---

## Rollback Plans

### Phase 1 Optimization → Rollback to Current

```bash
git revert HEAD
git push origin main
# Railway auto-deploys old config
```

### Phase 3 Hetzner Migration → Rollback to Railway

1. Update Vercel `NEXT_PUBLIC_SOCKET_URL` back to Railway URL
2. Redeploy Vercel
3. Keep Hetzner server as backup

---

## Summary

**Your scaling path is straightforward and cost-effective:**

1. **Optimize first** (Phase 1) - 3-4x capacity gain for free
2. **Migrate to Hetzner at $5.50/mo** (Phase 3) - handles 10,000 users
3. **Add load balancing at $44/mo** (Phase 4) - handles 50,000 users
4. **Multi-region at $100+/mo** (Phase 5) - handles 100,000+ users

**Most apps never need Phase 4 or 5.** Your WebRTC P2P architecture is extremely efficient compared to media relay servers.

**See [CAPACITY.md](./CAPACITY.md) for detailed cost analysis and [DEPLOYMENT.md](./DEPLOYMENT.md) for platform-specific deployment instructions.**
