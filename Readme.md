# Meta Lead Ads + React Native Live Stream (PoC)

A real-time Proof of Concept (PoC) demonstrating instant lead synchronization. When a lead form is submitted via Meta Lead Ads (simulated using Meta's Lead Testing Tool), the lead payload is immediately received by a backend relay server and pushed in real-time to an active React Native app screen without requiring any manual user interaction or pulling on the mobile device.

---

## 🏗️ System Architecture

```text
[ Meta Lead Ads Testing Tool ]
               │
               │ (Simulated POST Webhook Payload)
               ▼
[ Public HTTPS Tunnel (Ngrok / LocalTunnel) ]
               │
               │ (Forward Payload)
               ▼
   [ Node.js + Express Backend ]
   ├── 1. Verification Endpoint (GET /webhook)
   ├── 2. Event Listener Endpoint (POST /webhook)
   └── 3. Socket.io WebServer (Emits 'new_lead')
               │
               │ (WebSockets Connection)
               ▼
[ React Native Mobile App (iOS / Android / Web) ]
   └── Socket.io Client (Instant state update on screen)

   🚀 Quick Setup & Installation GuidePrerequisitesNode.js (v18 or higher)npm or yarnNgrok or LocalTunnel (npx localtunnel --port 3000)Step 1: Backend SetupNavigate to the backend directory:Bashcd backend_solution
Install dependencies:Bashnpm install
Create a .env file based on .env.example:Code snippetPORT=3000
VERIFY_TOKEN=my_custom_secure_token
Start the server:Bashnpm start
Step 2: Expose Backend Server via Public TunnelIn a separate terminal tab, expose port 3000 to receive Meta webhooks:Bashnpx localtunnel --port 3000
(Or use Ngrok: npx ngrok http 3000)Copy the generated HTTPS URL (e.g., https://xxxx.loca.lt).Step 3: Configure Meta WebhooksGo to Meta for Developers.Open your App $\rightarrow$ Go to Webhooks $\rightarrow$ Select Page.Set Callback URL: https://YOUR-TUNNEL-URL/webhookSet Verify Token: my_custom_secure_tokenClick Verify and Save.Subscribe to the leadgen field and link your test Facebook Page.Step 4: Frontend React Native App SetupNavigate to the frontend directory:Bashcd frontend_solution
Install dependencies:Bashnpm install
Update the BACKEND_URL in App.js (line 14) with your public tunnel URL:JavaScriptconst BACKEND_URL = 'https://YOUR-TUNNEL-URL';
Start the React Native development server:Bashnpm start

🧪 Live Demonstration & TestingOpen Meta's Lead Ads Testing Tool.Select your test Facebook Page and Lead Form.Keep the React Native application open on your screen.Click Create Lead.The submitted lead will pop up live inside your React Native app stream without pressing anything on the device.

📌 Technical AssumptionsMeta Lead Ads Testing Tool: Used Meta's official Lead Testing Tool to simulate real-time lead creation without running paid ad campaigns.WebSockets (Socket.io): Implemented WebSockets instead of REST HTTP polling to achieve instant sub-second push updates onto the active client UI.HTTP Tunneling: Employed LocalTunnel / Ngrok to bridge local backend development servers with Meta's cloud webhook system.