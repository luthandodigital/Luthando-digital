import { useState, useRef, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

const NAV_LINKS = ["Services", "Pricing", "About", "Chat", "Contact"];

const SERVICES = [
  { icon: "🤖", title: "AI Chatbots", desc: "Smart assistants that answer questions instantly, qualify leads, and engage visitors 24/7 without lifting a finger." },
  { icon: "📈", title: "Growth Marketing", desc: "Data-driven social campaigns and brand strategies engineered to expand your audience and convert followers into customers." },
  { icon: "🌐", title: "Website Branding", desc: "Premium, conversion-focused websites that make a lasting first impression and position your brand as an industry leader." },
  { icon: "✍️", title: "AI Content Creation", desc: "Automated copywriting, email sequences, and social posts — high-quality content at scale, powered by AI." },
  { icon: "📊", title: "Analytics & Insights", desc: "Real-time dashboards and reports that translate raw data into decisions that drive measurable ROI." },
  { icon: "🎯", title: "Ad Campaign AI", desc: "AI-optimized paid ad campaigns on Meta, Google, and TikTok that adapt in real time for maximum performance." },
];

const PLANS = [
  {
    name: "Starter",
    price: "299",
    desc: "Perfect for solo creators and small businesses just getting started.",
    color: "border-white/10",
    badge: null,
    features: [
      "1 AI Chatbot setup",
      "Social media strategy",
      "5 AI-generated posts/month",
      "Basic analytics dashboard",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "599",
    desc: "For growing brands ready to scale their marketing with AI.",
    color: "border-cyan-400",
    badge: "Most Popular",
    features: [
      "3 AI Chatbots",
      "Full social media management",
      "20 AI-generated posts/month",
      "Meta & Google ad campaigns",
      "Advanced analytics & reports",
      "Priority support",
    ],
  },
  {
    name: "Premium",
    price: "999",
    desc: "Full-service AI marketing for ambitious brands that want it all.",
    color: "border-indigo-400",
    badge: "Best Value",
    features: [
      "Unlimited AI Chatbots",
      "Complete brand management",
      "Unlimited AI content",
      "All ad platforms managed",
      "Custom website build",
      "Dedicated account manager",
      "Weekly strategy calls",
    ],
  },
];

const TESTIMONIALS = [
  { name: "Amara Osei", role: "E-commerce founder", text: "Luthando Digital grew my Instagram from 800 to 12,000 followers in 3 months. Sales tripled.", avatar: "AO" },
  { name: "James Motsepe", role: "Restaurant owner", text: "The AI chatbot handles 80% of our bookings automatically. Incredible ROI from day one.", avatar: "JM" },
  { name: "Priya Naidoo", role: "Life coach", text: "My personal brand finally looks premium. Clients tell me they chose me because my site looked so professional.", avatar: "PN" },
];

export default function LuthandoDigital() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there 👋 I'm the Luthando Digital assistant. Ask me about our pricing, services, or how we can grow your business!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [billing, setBilling] = useState("monthly");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingPlan, setBookingPlan] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", business: "", plan: "" });
  const [formSent, setFormSent] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const openBooking = (plan) => { setBookingPlan(plan); setFormData(f => ({ ...f, plan })); setBookingOpen(true); };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { sender: "user", text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const history = newMessages.map((m) => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are the sales and support assistant for Luthando Digital — a premium AI digital marketing agency.

Pricing plans:
- Starter: $299/month — 1 chatbot, social media strategy, 5 posts/month, basic analytics, email support
- Growth: $599/month — 3 chatbots, full social media management, 20 posts/month, Meta & Google ads, advanced analytics, priority support
- Premium: $999/month — unlimited chatbots, complete brand management, unlimited content, all ad platforms, custom website, dedicated manager, weekly calls

Your goal is to help visitors understand which plan suits them and encourage them to book a free discovery call or get started. Be warm, concise, and persuasive without being pushy. Use emojis sparingly. Always mention the free discovery call as a no-risk next step.`,
          messages: history,
        }),
      });
      const data = await res.json();
      const reply = data?.content?.[0]?.text || "Thanks for reaching out! Book a free call and we'll help you get started.";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "Apologies, I'm having trouble right now. Please try again shortly!" }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.email) return;
    setLoading(true);
    try {
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "YOUR_SERVICE_ID",
          template_id: "YOUR_TEMPLATE_ID",
          user_id: "YOUR_PUBLIC_KEY",
          template_params: {
            to_email: "tcebekhulu771@gmail.com",
            from_name: formData.name,
            from_email: formData.email,
            business: formData.business || "Not provided",
            plan: formData.plan || "Not specified",
            message: "New booking from " + formData.name + " | Email: " + formData.email + " | Business: " + (formData.business || "Not provided") + " | Plan: " + (formData.plan || "Not specified"),
          },
        }),
      });
    } catch (e) {
      console.error("Email error:", e);
    }
    setLoading(false);
    setFormSent(true);
    setTimeout(() => { setBookingOpen(false); setFormSent(false); setFormData({ name: "", email: "", business: "", plan: "" }); }, 4000);
  };

  const annualPrice = (p) => Math.round(parseInt(p) * 0.8);

  return (
    <div style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }} className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 3px; }
        .glow-cyan { text-shadow: 0 0 40px rgba(34,211,238,0.5); }
        .card-hover { transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); border-color: #22d3ee !important; box-shadow: 0 20px 40px rgba(34,211,238,0.12); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-ring { 0% { box-shadow:0 0 0 0 rgba(34,211,238,0.4); } 70% { box-shadow:0 0 0 12px rgba(34,211,238,0); } 100% { box-shadow:0 0 0 0 rgba(34,211,238,0); } }
        @keyframes float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); } }
        @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes dot-blink { 0%,80%,100% { opacity:0.2; transform:scale(0.8); } 40% { opacity:1; transform:scale(1); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .animate-fadeUp { animation: fadeUp 0.8s ease both; }
        .delay-1 { animation-delay:0.1s; } .delay-2 { animation-delay:0.2s; } .delay-3 { animation-delay:0.3s; } .delay-4 { animation-delay:0.4s; }
        .hero-gradient { background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.15) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(99,102,241,0.1) 0%, transparent 60%), #030712; }
        .grid-bg { background-image: linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px); background-size:60px 60px; }
        .shimmer-btn { background: linear-gradient(90deg,#06b6d4,#0ea5e9,#22d3ee,#0ea5e9,#06b6d4); background-size:200% auto; animation:shimmer 3s linear infinite; }
        .typing-dot { width:7px; height:7px; border-radius:50%; background:#22d3ee; display:inline-block; }
        .typing-dot:nth-child(1) { animation:dot-blink 1.2s 0s infinite; }
        .typing-dot:nth-child(2) { animation:dot-blink 1.2s 0.2s infinite; }
        .typing-dot:nth-child(3) { animation:dot-blink 1.2s 0.4s infinite; }
        .stat-card { background:linear-gradient(135deg,rgba(6,182,212,0.08),rgba(99,102,241,0.05)); border:1px solid rgba(34,211,238,0.12); }
        .floating-orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; }
        .chat-bubble-bot { background:linear-gradient(135deg,#0f172a,#0c1a2e); border:1px solid rgba(34,211,238,0.15); }
        .chat-bubble-user { background:linear-gradient(135deg,#0891b2,#0e7490); }
        .nav-blur { background:rgba(3,7,18,0.8); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.75); backdrop-filter:blur(8px); z-index:100; display:flex; align-items:center; justify-content:center; animation:fadeIn 0.2s ease; }
        .plan-popular { background:linear-gradient(135deg,rgba(6,182,212,0.1),rgba(14,165,233,0.05)); }
        .check-icon::before { content:'✓'; color:#22d3ee; font-weight:700; margin-right:10px; }
      `}</style>

      {/* BOOKING MODAL */}
      {bookingOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setBookingOpen(false)}>
          <div className="bg-[#070d1f] border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 relative">
            <button onClick={() => setBookingOpen(false)} className="absolute top-5 right-5 text-gray-500 hover:text-white text-xl">✕</button>
            {formSent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>You're booked in!</h3>
                <p className="text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>We'll email you within 24 hours to confirm your free discovery call.</p>
              </div>
            ) : (
              <>
                <div className="shimmer-btn text-black text-xs font-bold px-3 py-1 rounded-full inline-block mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                  FREE DISCOVERY CALL
                </div>
                <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.03em" }}>
                  Book Your Free Call
                </h3>
                <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {bookingPlan ? `Interested in the ${bookingPlan} plan · ` : ""}30 min · No commitment · We'll build your custom growth plan
                </p>
                <div className="space-y-4">
                  <input type="text" placeholder="Your full name *" value={formData.name}
                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }} />
                  <input type="email" placeholder="Your email address *" value={formData.email}
                    onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }} />
                  <input type="text" placeholder="Your business / niche" value={formData.business}
                    onChange={(e) => setFormData(f => ({ ...f, business: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }} />
                  <select value={formData.plan} onChange={(e) => setFormData(f => ({ ...f, plan: e.target.value }))}
                    className="w-full bg-[#0a1628] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-gray-300 outline-none focus:border-cyan-500/50 transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <option value="">Which plan interests you?</option>
                    <option>Starter — $299/mo</option>
                    <option>Growth — $599/mo</option>
                    <option>Premium — $999/mo</option>
                    <option>Not sure yet</option>
                  </select>
                  <button onClick={handleFormSubmit}
                    className="w-full shimmer-btn text-black py-4 rounded-2xl font-bold text-base shadow-2xl shadow-cyan-500/30 hover:scale-[1.02] transition-transform"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    Book My Free Call →
                  </button>
                  <p className="text-center text-xs text-gray-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    No spam. No pressure. Just a friendly conversation.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="nav-blur fixed top-0 w-full z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl shimmer-btn flex items-center justify-center text-black font-bold text-sm">L</div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, letterSpacing: "-0.03em" }} className="text-xl">
              Luthando <span className="text-cyan-400">Digital</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`}
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "0.9rem" }}
                className="text-gray-400 hover:text-cyan-300 transition-colors duration-200">{l}</a>
            ))}
            <button onClick={() => openBooking("")} className="shimmer-btn text-black px-5 py-2 rounded-full text-sm font-semibold"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              Book Free Call
            </button>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2">
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-cyan-300 transition-colors">{l}</a>
            ))}
            <button onClick={() => { openBooking(""); setMenuOpen(false); }}
              className="shimmer-btn text-black px-5 py-3 rounded-2xl text-sm font-semibold text-center"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              Book Free Call
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="hero-gradient grid-bg pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="floating-orb w-96 h-96 bg-cyan-500/20 -top-20 -left-20" style={{ animation: "float 6s ease-in-out infinite" }}></div>
        <div className="floating-orb w-64 h-64 bg-indigo-500/15 top-40 right-10" style={{ animation: "float 8s ease-in-out infinite 2s" }}></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="animate-fadeUp inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-400/20 rounded-full px-4 py-2 text-sm text-cyan-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400" style={{ animation: "pulse-ring 2s infinite" }}></span>
            AI-Powered Marketing Platform
          </div>
          <h1 className="animate-fadeUp delay-1 glow-cyan text-5xl md:text-7xl font-extrabold leading-tight mb-6"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, letterSpacing: "-0.04em" }}>
            Grow Smarter with{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Luthando Digital
            </span>
          </h1>
          <p className="animate-fadeUp delay-2 text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
            Supercharge your brand with intelligent chatbots, automated campaigns, and data-driven strategies — all powered by cutting-edge AI.
          </p>
          <div className="animate-fadeUp delay-3 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => openBooking("")}
              className="shimmer-btn text-black px-8 py-4 rounded-2xl font-bold text-base shadow-2xl shadow-cyan-500/30 transition-transform hover:scale-105"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              Book Free Discovery Call →
            </button>
            <a href="#pricing" className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-medium text-base hover:bg-white/10 transition-colors"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              See Pricing
            </a>
          </div>
          <div className="animate-fadeUp delay-4 grid grid-cols-3 gap-4 mt-20 max-w-2xl mx-auto">
            {[{ n: "500+", l: "Brands Scaled" }, { n: "12×", l: "Avg. ROI" }, { n: "24/7", l: "AI Support" }].map((s) => (
              <div key={s.l} className="stat-card rounded-2xl py-5 px-4">
                <div className="text-3xl font-extrabold text-cyan-300 mb-1"
                  style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.04em" }}>{s.n}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="px-6 py-24 bg-[#030712]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>What We Offer</p>
            <h2 className="text-4xl md:text-5xl font-extrabold"
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, letterSpacing: "-0.04em" }}>Services Built for Growth</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div key={s.title} className="card-hover bg-[#070d1f] border border-white/5 rounded-3xl p-7">
                <div className="text-4xl mb-5">{s.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white"
                  style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, letterSpacing: "-0.02em" }}>{s.title}</h3>
                <p className="text-gray-500 text-sm leading-7" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 py-24" style={{ background: "linear-gradient(180deg, #030712, #050d1a, #030712)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-cyan-400 text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Transparent Pricing</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4"
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, letterSpacing: "-0.04em" }}>
              Simple, Scalable Plans
            </h2>
            <p className="text-gray-500 mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>No hidden fees. Cancel anytime. Start with a free discovery call.</p>

            {/* Billing toggle */}
            <div className="inline-flex bg-white/5 border border-white/10 rounded-full p-1">
              {["monthly", "annual"].map((b) => (
                <button key={b} onClick={() => setBilling(b)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${billing === b ? "shimmer-btn text-black" : "text-gray-400"}`}
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  {b === "monthly" ? "Monthly" : "Annual (save 20%)"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div key={plan.name}
                className={`relative rounded-3xl border p-8 flex flex-col ${plan.badge ? "plan-popular" : "bg-[#070d1f]"} ${plan.color}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 shimmer-btn text-black text-xs font-bold px-4 py-1 rounded-full"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    {plan.badge}
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}>{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>{plan.desc}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-extrabold text-white"
                      style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.04em" }}>
                      ${billing === "monthly" ? plan.price : annualPrice(plan.price)}
                    </span>
                    <span className="text-gray-500 mb-2 text-sm">/mo</span>
                  </div>
                  {billing === "annual" && (
                    <p className="text-cyan-400 text-xs mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Billed annually · Save ${(parseInt(plan.price) - annualPrice(plan.price)) * 12}/yr
                    </p>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="check-icon text-sm text-gray-300 flex items-start"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                      <span className="text-cyan-400 font-bold mr-3 mt-0.5 flex-shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => openBooking(plan.name)}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-transform hover:scale-[1.02] ${
                    plan.badge ? "shimmer-btn text-black shadow-2xl shadow-cyan-500/30" : "bg-white/8 border border-white/10 text-white hover:bg-white/15"
                  }`}
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  Get Started →
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm mt-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Not sure which plan? <button onClick={() => openBooking("")} className="text-cyan-400 hover:underline">Book a free 30-min call</button> and we'll recommend the right fit.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-24 bg-[#030712]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Social Proof</p>
            <h2 className="text-4xl md:text-5xl font-extrabold"
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, letterSpacing: "-0.04em" }}>
              Clients Who've Grown With Us
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card-hover bg-[#070d1f] border border-white/5 rounded-3xl p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>{t.name}</div>
                    <div className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{t.role}</div>
                  </div>
                </div>
                <div className="text-yellow-400 text-sm mb-3">★★★★★</div>
                <p className="text-gray-400 text-sm leading-7" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-6 py-24" style={{ background: "linear-gradient(180deg, #030712, #050d1a, #030712)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-cyan-400 text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Our Story</p>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6"
                style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, letterSpacing: "-0.04em" }}>Marketing That Thinks</h2>
              <p className="text-gray-400 leading-8 mb-6" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                Luthando Digital was born from a belief that every business — from solo creators to growing enterprises — deserves access to enterprise-grade marketing intelligence.
              </p>
              <p className="text-gray-400 leading-8 mb-8" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                Our team of marketers and AI engineers have built a platform that automates the hard parts of growth, so you can focus on what you do best.
              </p>
              <button onClick={() => openBooking("")}
                className="shimmer-btn text-black px-7 py-3.5 rounded-2xl font-bold text-sm"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                Work With Us →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ n: "2022", l: "Founded" }, { n: "50+", l: "Countries" }, { n: "98%", l: "Client Retention" }, { n: "$2M+", l: "Revenue Generated" }].map((s) => (
                <div key={s.l} className="stat-card rounded-2xl p-6">
                  <div className="text-3xl font-extrabold text-white mb-1"
                    style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.04em" }}>{s.n}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CHAT */}
      <section id="chat" className="px-6 py-24 bg-[#030712]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-cyan-400 text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Live Demo</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4"
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, letterSpacing: "-0.04em" }}>Chat with Our AI</h2>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Powered by Claude · Ask about pricing, services, or anything</p>
          </div>
          <div className="bg-[#070d1f] border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/5">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
              <div className="w-9 h-9 rounded-full shimmer-btn flex items-center justify-center text-black text-sm font-bold">L</div>
              <div>
                <div className="text-sm font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>Luthando Digital Assistant</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "pulse-ring 2s infinite" }}></span>
                  <span className="text-xs text-green-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Online</span>
                </div>
              </div>
            </div>
            <div className="h-80 overflow-y-auto px-5 py-5 space-y-4 bg-[#04091a]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-7 ${msg.sender === "user" ? "chat-bubble-user text-white" : "chat-bubble-bot text-gray-200"}`}
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{msg.text}</div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="chat-bubble-bot px-5 py-4 rounded-2xl flex items-center gap-2">
                    <span className="typing-dot"></span><span className="typing-dot"></span><span className="typing-dot"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-3 px-5 py-4 border-t border-white/5">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
                placeholder="Ask about pricing, services…"
                className="flex-1 bg-white/5 border border-white/8 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }} />
              <button onClick={sendMessage} disabled={loading || !input.trim()}
                className="shimmer-btn text-black w-12 h-12 rounded-2xl flex items-center justify-center disabled:opacity-40 transition-opacity flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="px-6 py-16" style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(99,102,241,0.08))", borderTop: "1px solid rgba(34,211,238,0.1)", borderBottom: "1px solid rgba(34,211,238,0.1)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, letterSpacing: "-0.04em" }}>
            Ready to Start Making Money? 💰
          </h2>
          <p className="text-gray-400 mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Book a free 30-minute call. We'll build you a custom growth plan — no commitment required.
          </p>
          <button onClick={() => openBooking("")}
            className="shimmer-btn text-black px-10 py-4 rounded-2xl font-bold text-base shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-transform"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            Book My Free Call →
          </button>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-6 py-24" style={{ background: "linear-gradient(180deg, #030712, #050d1a)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-cyan-400 text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, letterSpacing: "-0.04em" }}>Let's Build Your Brand ✨</h2>
          <p className="text-gray-500 mb-12 text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Tell us about your business and we'll craft a custom growth plan.
          </p>
          <div className="bg-[#070d1f] border border-white/5 rounded-3xl p-8 text-left space-y-4">
            <input type="text" placeholder="Your Name"
              className="w-full bg-white/5 border border-white/8 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }} />
            <input type="email" placeholder="Your Email"
              className="w-full bg-white/5 border border-white/8 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }} />
            <textarea rows={5} placeholder="Tell us about your business and goals…"
              className="w-full bg-white/5 border border-white/8 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/50 transition-colors resize-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }} />
            <button className="w-full shimmer-btn text-black py-4 rounded-2xl font-bold text-base shadow-2xl shadow-cyan-500/30 hover:scale-[1.02] transition-transform"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              Send Message →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#020509] border-t border-white/5 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg shimmer-btn flex items-center justify-center text-black font-bold text-xs">L</div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, letterSpacing: "-0.03em" }} className="text-base">
              Luthando <span className="text-cyan-400">Digital</span>
            </span>
          </div>
          <p className="text-gray-600 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>© 2026 Luthando Digital. All Rights Reserved.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="text-gray-600 hover:text-cyan-400 text-sm transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
      <Analytics />
    </div>
  );
}
