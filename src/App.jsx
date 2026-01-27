import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  ChevronRight, 
  Menu, 
  X, 
  FileText, 
  BarChart3, 
  Briefcase,
  Users,
  Linkedin,
  Mail,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Loader2,
  Download
} from 'lucide-react';

const apiKey = ""; // Environment handles this

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // AI Tool State
  const [toolActive, setToolActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    problem: '',
    solution: '',
    targetMarket: '',
    revenueModel: ''
  });
  const [generatedDeck, setGeneratedDeck] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // API Call with Exponential Backoff
  const callGemini = async (prompt) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            slides: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING" },
                  subtitle: { type: "STRING" },
                  bulletPoints: { type: "ARRAY", items: { type: "STRING" } },
                  strategicInsight: { type: "STRING" }
                }
              }
            },
            advisorySummary: { type: "STRING" }
          }
        }
      },
      systemInstruction: {
        parts: [{ text: "You are the Irtus Business AI Advisory Engine. Your goal is to take raw startup ideas and transform them into institutional-grade pitch deck narratives based on the Eye-R-Tus methodology (Clarity, Structure, Growth). Focus on the African venture landscape, emphasizing scalability, market validation, and structural scaffolding. Provide sharp, professional, and data-driven language suitable for global investors." }]
      }
    };

    let retries = 0;
    const maxRetries = 5;

    while (retries <= maxRetries) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error('API request failed');
        
        const result = await response.json();
        const contentText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!contentText) throw new Error('Empty response from AI');
        
        return JSON.parse(contentText);
      } catch (err) {
        if (retries === maxRetries) throw err;
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(res => setTimeout(res, delay));
        retries++;
      }
    }
  };

  const handleGenerate = async () => {
    if (!formData.companyName || !formData.problem) return;
    
    setLoading(true);
    setError(null);
    const prompt = `Generate a 6-slide pitch deck narrative for a company called "${formData.companyName}". 
    The problem they solve is: ${formData.problem}. 
    Their solution is: ${formData.solution}. 
    Target Market: ${formData.targetMarket}. 
    How they make money: ${formData.revenueModel}. 
    Ensure the narrative reflects the 'Irtus' vision of professionalizing African startups.`;

    try {
      const data = await callGemini(prompt);
      if (data && data.slides) {
        setGeneratedDeck(data);
        setStep(3);
      } else {
        throw new Error("Invalid format received");
      }
    } catch (err) {
      setError("We encountered an error while synthesizing your strategy. Please check your network or try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetTool = () => {
    setStep(1);
    setFormData({ companyName: '', problem: '', solution: '', targetMarket: '', revenueModel: '' });
    setGeneratedDeck(null);
    setError(null);
    setToolActive(false);
  };

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Methodology', href: '#methodology' },
    { name: 'AI Tools', href: '#ai-tools' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact' },
  ];

  // Helper for rendering icons to avoid cloneElement issues
  const ServiceIcon = ({ icon: IconComponent }) => {
    return <IconComponent className="w-8 h-8" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || toolActive ? 'bg-white shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">
              Irtus <span className="text-blue-600">Business</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                {link.name}
              </a>
            ))}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg active:scale-95">
              Work With Us
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-medium text-slate-700 p-2 hover:bg-slate-50 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <button className="bg-blue-600 text-white py-3 rounded-lg font-bold">
                Work With Us
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 400 400" className="w-full h-full text-blue-600">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Based in Ikeja, Nigeria • Serving 4 Continents</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
              Elevating Ideas into <span className="text-blue-600">Profitable Ventures.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Specialized strategic advisory for the African venture landscape. We provide high-level financial engineering and structural scaffolding.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center group">
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => { setToolActive(true); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                Launch AI Engine
              </button>
            </div>
            <div className="flex items-center space-x-4 pt-4 border-t border-slate-200">
              <div className="flex -space-x-2">
                {[11, 12, 13, 14].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i}`} alt="Founder" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Trusted by founders of <span className="text-slate-900 font-bold">Unicorns</span> and high-growth SMEs.
              </p>
            </div>
          </div>
          <div className="hidden lg:block relative animate-in zoom-in duration-700">
             <div className="bg-white p-8 rounded-3xl shadow-2xl relative z-10 border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl">Financial Modeling Output</h3>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">Live Simulation</div>
                </div>
                <div className="space-y-6">
                  {[
                    { label: 'Projected EBITDA (Y3)', value: '$2.4M', progress: 'w-[75%]' },
                    { label: 'Customer Acquisition Cost', value: '$12.50', progress: 'w-[40%]' },
                    { label: 'Market Penetration', value: '18.5%', progress: 'w-[60%]' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-500">{item.label}</span>
                        <span className="text-slate-900">{item.value}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`h-full bg-blue-500 rounded-full ${item.progress}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Growth Index</p>
                    <p className="text-2xl font-black text-slate-900">+312%</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Runway</p>
                    <p className="text-2xl font-black text-slate-900">24 Mo.</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* AI Tool Overlay */}
      {toolActive && (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto pt-24 pb-12 px-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => setToolActive(false)} className="mb-8 flex items-center text-slate-500 hover:text-blue-600 font-bold transition-colors">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Site
            </button>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <h2 className="text-3xl font-black text-center">Applying Eye-R-Tus Methodology...</h2>
                <p className="text-slate-500 text-center max-w-md">Our AI Engine is synthesizing your inputs into a professional investor narrative. This usually takes 10-15 seconds.</p>
              </div>
            ) : step === 1 ? (
              <div className="space-y-8 animate-in slide-in-from-bottom-4">
                <div className="text-center space-y-4">
                  <div className="inline-block p-3 bg-blue-100 rounded-2xl text-blue-600 mb-2">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-black">AI Pitch Deck Generator</h2>
                  <p className="text-slate-500 text-lg">Input your venture details. We'll handle the narrative scaffolding.</p>
                </div>
                <div className="bg-slate-50 p-8 lg:p-12 rounded-[2.5rem] space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase">Company Name</label>
                      <input 
                        value={formData.companyName} 
                        onChange={e => setFormData({...formData, companyName: e.target.value})}
                        className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        placeholder="e.g. EcoWatt Nigeria" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase">Target Market</label>
                      <input 
                        value={formData.targetMarket} 
                        onChange={e => setFormData({...formData, targetMarket: e.target.value})}
                        className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        placeholder="e.g. Off-grid households in Africa" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase">The Problem</label>
                    <textarea 
                      value={formData.problem} 
                      onChange={e => setFormData({...formData, problem: e.target.value})}
                      rows="3" 
                      className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                      placeholder="What market gap are you addressing?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase">Your Solution</label>
                    <textarea 
                      value={formData.solution} 
                      onChange={e => setFormData({...formData, solution: e.target.value})}
                      rows="3" 
                      className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                      placeholder="How does your business solve this uniquely?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase">Revenue Model</label>
                    <input 
                      value={formData.revenueModel} 
                      onChange={e => setFormData({...formData, revenueModel: e.target.value})}
                      className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                      placeholder="e.g. Subscription based" 
                    />
                  </div>
                  <button 
                    onClick={handleGenerate}
                    disabled={!formData.companyName || !formData.problem}
                    className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl disabled:opacity-50"
                  >
                    Synthesize Strategy
                  </button>
                  {error && <p className="text-red-500 text-center font-medium mt-2">{error}</p>}
                </div>
              </div>
            ) : step === 3 && generatedDeck ? (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-black">{formData.companyName}</h2>
                    <p className="text-blue-600 font-bold uppercase text-sm tracking-wider">Irtus Generated Strategy</p>
                  </div>
                  <button onClick={resetTool} className="bg-slate-100 p-4 rounded-xl font-bold hover:bg-slate-200 transition-all">Start Over</button>
                </div>

                <div className="grid gap-8">
                  {generatedDeck?.slides?.map((slide, i) => (
                    <div key={i} className="bg-white border-2 border-slate-100 p-8 lg:p-12 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-blue-600 font-black text-5xl opacity-20">0{i+1}</span>
                        <div className="bg-blue-50 px-3 py-1 rounded text-blue-700 text-xs font-bold uppercase tracking-widest">Slide Concept</div>
                      </div>
                      <h3 className="text-2xl font-black mb-2 text-slate-900">{slide?.title || "Slide"}</h3>
                      <p className="text-slate-500 font-medium mb-6 italic">{slide?.subtitle}</p>
                      <ul className="space-y-4 mb-8">
                        {slide?.bulletPoints?.map((bp, j) => (
                          <li key={j} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                            <span className="text-slate-700 leading-relaxed font-medium">{String(bp)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-6 border-t border-slate-100">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Irtus Advisory Insight</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{slide?.strategicInsight}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <ShieldCheck className="w-6 h-6" />
                    <span className="font-bold uppercase tracking-widest text-sm">Strategic Advisory Summary</span>
                  </div>
                  <p className="text-lg text-slate-300 leading-relaxed italic">
                    "{String(generatedDeck?.advisorySummary || '')}"
                  </p>
                  <div className="pt-6">
                    <button className="flex items-center space-x-2 text-white font-bold hover:text-blue-400 transition-colors">
                      <Download className="w-5 h-5" />
                      <span>Export as PDF Narrative (Premium)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Services Section */}
      <section id="services" className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">Our Capabilities</h2>
          <p className="text-4xl lg:text-5xl font-black text-slate-900">The Irtus Service Architecture</p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: BarChart3, title: "Financial Engineering", desc: "Dynamic simulations of burn rates, runway, and valuation using rigorous DCF analysis." },
            { icon: FileText, title: "Strategic Documentation", desc: "Development of investor-ready narratives including comprehensive Business Plans and Pitch Decks." },
            { icon: ShieldCheck, title: "CAC Formalization", desc: "Navigating the Corporate Affairs Commission (CRP) to transition ventures to legally recognized entities." },
            { icon: Cpu, title: "AI Pitch Deck Tool", desc: "Democratizing access to high-level strategic tools through our automated narrative synthesis platform." },
            { icon: Briefcase, title: "Startup Due Diligence", desc: "Assisting founders and investors in the rigorous verification of claims and financial health." },
            { icon: Globe, title: "Ecosystem Liaison", desc: "Connecting high-potential startups with the African unicorn pipeline and diaspora capital." }
          ].map((service, i) => (
            <div key={i} className="p-8 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
                <ServiceIcon icon={service.icon} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{service.desc}</p>
              <a href="#" className="inline-flex items-center text-blue-600 font-bold text-sm hover:underline">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-24 bg-slate-900 text-white px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10">
            <h2 className="text-blue-400 font-bold uppercase tracking-widest text-sm">The "Eye-R-Tus" Framework</h2>
            <h3 className="text-4xl lg:text-5xl font-black leading-tight">A Three-Phase Vision for Business Longevity.</h3>
            
            <div className="space-y-12 mt-12">
              {[
                { phase: "I", title: "The Clarity Engine", desc: "Focusing on 'Clarity of Offer' and identifying a core value proposition before customer acquisition." },
                { phase: "II", title: "Structural Scaffolding", desc: "Formalization through CAC registration, corporate governance, and dynamic financial modeling." },
                { phase: "III", title: "The Growth Multiplier", desc: "Scaling through digital marketing and fundraise brokerage to 2x to 10x business sales." }
              ].map((step, i) => (
                <div key={i} className="flex space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border border-blue-500/50 flex items-center justify-center font-black text-blue-400">
                    {step.phase}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                    <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square bg-blue-600/20 rounded-full absolute -top-1/4 -right-1/4 w-[150%] blur-3xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold italic">"Put structure in your business early—it's mathematically proven to increase probability of success."</h4>
                <div className="pt-6 border-t border-white/10 w-full">
                  <p className="font-bold">Tamara Posibi</p>
                  <p className="text-blue-400 text-sm">Founder & Chief Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Promo */}
      <section id="ai-tools" className="py-24 bg-white px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-8 lg:p-16 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="bg-white/20 inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Technological Disruption</div>
            <h2 className="text-4xl lg:text-5xl font-black">AI-Powered Pitch Decks</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Democratizing high-level strategy. Our tool automates the narrative synthesis of your business idea, delivering investor-ready decks in minutes.
            </p>
            <div className="pt-6">
              <button onClick={() => { setToolActive(true); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="bg-white text-blue-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl">
                Try the AI Tool for Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">Strategic Leadership</h2>
              <p className="text-4xl font-black text-slate-900">The Architects of Growth</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {[
              { name: "Tamara Posibi", role: "Chief Consultant", area: "Strategy" },
              { name: "Olaide Okedele", role: "Associate Consultant", area: "Relations" },
              { name: "Hammed Olagoke", role: "Tech Consultant", area: "Research" },
              { name: "Hasanat Rabiu", role: "Business Analyst", area: "Modeling" },
              { name: "Aishat Shuaib", role: "Executive Assistant", area: "Admin" },
            ].map((member, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="aspect-square bg-slate-100 rounded-xl mb-6 flex items-center justify-center text-slate-400 overflow-hidden">
                  <Users className="w-12 h-12" />
                </div>
                <h4 className="font-bold text-lg text-slate-900">{member.name}</h4>
                <p className="text-blue-600 text-sm font-semibold">{member.role}</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Focus</p>
                  <p className="text-sm font-medium text-slate-700">{member.area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t border-slate-100 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <div className="space-y-8">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">I</span>
                </div>
                <span className="font-bold text-2xl tracking-tight text-slate-900">
                  Irtus <span className="text-blue-600">Business</span>
                </span>
              </div>
              <p className="text-xl text-slate-600 leading-relaxed max-w-md">
                Ready to take your business from <span className="font-bold text-slate-900">$1,000/mo</span> to <span className="font-bold text-slate-900">$50,000/mo</span>? Let's build your scaffolding.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Linkedin className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Mail className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div className="bg-slate-50 p-10 rounded-[2.5rem]">
              <h3 className="text-2xl font-bold mb-8">Send a Message</h3>
              <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none mb-4" />
              <textarea placeholder="Tell us about your venture" rows="4" className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none mb-6"></textarea>
              <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all">Inquire for Invitation</button>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-slate-100">
            <p className="text-slate-500 text-sm">© 2026 Irtus Business. Ikeja, Lagos. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;