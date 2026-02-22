import React, { useState, useEffect } from 'react';
import {
  Check,
  MapPin,
  Maximize,
  Tag,
  Clock,
  MessageSquare,
  Settings2,
  Save,
  Copy,
  Plus,
  Trash2,
  Search,
  Package,
  ShieldCheck,
  Info
} from 'lucide-react';
const DEFAULTS = {
  listingDetails: {
    address: "8 Rean Dr, Toronto, ON M2K 3B9",
    satHours: "Saturday",
    sunHours: "Sunday",
    moveOutDate: "this month"
  },
  questions: [
    {
      id: 'addr',
      title: "What's the address?",
      icon: 'MapPin',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      answers: [
        { label: "Full Address", text: "Hi! The address is {address}. You must bring your own truck & movers for large pieces." }
      ]
    },
    {
      id: 'group',
      title: "Group Selling",
      icon: 'Package',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      answers: [
        { label: "Move Out Sale", text: "Just so you know, I'm doing a move-out sale! Are you interested in anything else I have listed? Can do a deal for multiple items." }
      ]
    },
    {
      id: 'hold',
      title: "Hold Policy",
      icon: 'ShieldCheck',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      answers: [
        { label: "No Holds", text: "Sorry, I don't do holds unless you e-transfer a deposit to secure the item. First come, first served otherwise!" }
      ]
    },
    {
      id: 'offer',
      title: "Can you do $XX price?",
      icon: 'Tag',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      answers: [
        { label: "Price Firm", text: "Sorry, the price is firm. I have a lot of interest from people willing to pay full price already." }
      ]
    },
    {
      id: 'avail',
      title: "When are you available?",
      icon: 'Clock',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      answers: [
        { label: "Saturday", text: "I'm available on {satHours}." },
        { label: "Sunday", text: "I'm available on {sunHours}." }
      ]
    },
    {
      id: 'dims',
      title: "What are the dimensions?",
      icon: 'Maximize',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      answers: [
        { label: "Will Measure Later", text: "I don't have the exact dimensions with me right now, but I will measure it and get back to you later!" }
      ]
    }
  ]
};

const App = () => {
  const [listingDetails, setListingDetails] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mkt_listingDetails')) || DEFAULTS.listingDetails; }
    catch { return DEFAULTS.listingDetails; }
  });
  const [questions, setQuestions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mkt_questions')) || DEFAULTS.questions; }
    catch { return DEFAULTS.questions; }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [copyStatus, setCopyStatus] = useState(null);

  // --- Persist to localStorage on change ---
  useEffect(() => { localStorage.setItem('mkt_listingDetails', JSON.stringify(listingDetails)); }, [listingDetails]);
  useEffect(() => { localStorage.setItem('mkt_questions', JSON.stringify(questions)); }, [questions]);

  // --- Utility: Inject Variables into Text ---
  const processText = (text) => {
    return text
      .replace(/{address}/g, listingDetails.address)
      .replace(/{satHours}/g, listingDetails.satHours)
      .replace(/{sunHours}/g, listingDetails.sunHours)
      .replace(/{moveOutDate}/g, listingDetails.moveOutDate);
  };
  // --- Utility: Copy to Clipboard ---
  const handleCopy = (text, id) => {
    const processed = processText(text);
    const el = document.createElement('textarea');
    el.value = processed;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };
  // --- State Updaters ---
  const updateQuestionTitle = (qId, title) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, title } : q));
  };
  const updateAnswer = (qId, ansIdx, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newAnswers = [...q.answers];
        newAnswers[ansIdx] = { ...newAnswers[ansIdx], [field]: value };
        return { ...q, answers: newAnswers };
      }
      return q;
    }));
  };
  const addAnswer = (qId) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, answers: [...q.answers, { label: "New Tag", text: "New response text..." }] } : q));
  };
  const removeAnswer = (qId, ansIdx) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, answers: q.answers.filter((_, i) => i !== ansIdx) };
      }
      return q;
    }));
  };
  const iconMap = {
    MapPin: (color) => <MapPin className={`w-5 h-5 ${color}`} />,
    Package: (color) => <Package className={`w-5 h-5 ${color}`} />,
    ShieldCheck: (color) => <ShieldCheck className={`w-5 h-5 ${color}`} />,
    Tag: (color) => <Tag className={`w-5 h-5 ${color}`} />,
    Clock: (color) => <Clock className={`w-5 h-5 ${color}`} />,
    Maximize: (color) => <Maximize className={`w-5 h-5 ${color}`} />
  };
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans selection:bg-blue-100">
      {/* Top App Bar - Google Style */}
      <nav className="sticky top-0 z-30 bg-white border-b border-[#dadce0] px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
            <MessageSquare className="text-[#1a73e8] w-6 h-6" />
          </div>
          <h1 className="text-[22px] font-normal tracking-tight text-[#5f6368]">
            Marketplace <span className="text-[#202124] font-medium">Assistant</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm active:scale-95 ${
              isEditing
              ? 'bg-[#1a73e8] text-white hover:bg-[#1765cc] hover:shadow-md'
              : 'bg-white text-[#1a73e8] border border-[#dadce0] hover:bg-blue-50'
            }`}
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Settings2 className="w-4 h-4" />}
            {isEditing ? 'Finish Editing' : 'Customize App'}
          </button>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto p-4 md:p-8">

        {/* Quick Config - Material Card */}
        <section className="bg-white rounded-3xl border border-[#dadce0] p-6 mb-8 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2 mb-6 text-[#1a73e8]">
            <Search className="w-5 h-5" />
            <h2 className="text-sm font-medium uppercase tracking-wider">Quick Settings</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(listingDetails).map(key => (
              <div key={key} className="relative group">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-[#1a73e8] z-10">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-[#dadce0] rounded-xl text-sm focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none transition-all"
                  value={listingDetails[key]}
                  onChange={(e) => setListingDetails({...listingDetails, [key]: e.target.value})}
                />
              </div>
            ))}
          </div>
        </section>
        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((q) => (
            <div key={q.id} className={`bg-white rounded-[2rem] border transition-all flex flex-col ${isEditing ? 'border-[#1a73e8] ring-4 ring-blue-50' : 'border-[#dadce0] hover:shadow-lg'}`}>

              {/* Card Header */}
              <div className="px-6 py-5 flex items-center justify-between border-b border-[#f1f3f4]">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${q.bgColor}`}>
                    {iconMap[q.icon](q.color)}
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      className="font-medium text-[#202124] bg-[#f8f9fa] border-b-2 border-transparent focus:border-[#1a73e8] px-2 py-1 outline-none text-lg w-full"
                      value={q.title}
                      onChange={(e) => updateQuestionTitle(q.id, e.target.value)}
                    />
                  ) : (
                    <h3 className="text-lg font-medium text-[#202124]">{q.title}</h3>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => addAnswer(q.id)}
                    className="p-2 text-[#1a73e8] hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Answer List */}
              <div className="p-2 flex-1">
                {q.answers.map((ans, idx) => (
                  <div key={idx} className={`m-2 rounded-2xl p-4 transition-all relative ${isEditing ? 'bg-[#f8f9fa] border border-[#dadce0]' : 'hover:bg-[#f1f3f4]'}`}>

                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            className="text-[11px] font-bold px-3 py-1 bg-white border border-[#dadce0] rounded-full uppercase text-[#5f6368] outline-none"
                            value={ans.label}
                            onChange={(e) => updateAnswer(q.id, idx, 'label', e.target.value)}
                          />
                          <button
                            onClick={() => removeAnswer(q.id, idx)}
                            className="p-1.5 text-[#5f6368] hover:text-red-600 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          className="w-full p-3 text-sm bg-white border border-[#dadce0] rounded-xl outline-none focus:border-[#1a73e8] resize-none"
                          rows="2"
                          value={ans.text}
                          onChange={(e) => updateAnswer(q.id, idx, 'text', e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="mb-2">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${q.bgColor} ${q.color}`}>
                              {ans.label}
                            </span>
                          </div>
                          <p className="text-sm text-[#3c4043] leading-relaxed">
                            {processText(ans.text)}
                          </p>
                        </div>

                        <button
                          onClick={() => handleCopy(ans.text, `${q.id}_${idx}`)}
                          className={`flex items-center justify-center p-4 rounded-full transition-all shrink-0 shadow-sm border ${
                            copyStatus === `${q.id}_${idx}`
                            ? 'bg-[#1e8e3e] border-[#1e8e3e] text-white'
                            : 'bg-white border-[#dadce0] text-[#1a73e8] hover:shadow-md hover:bg-blue-50 active:scale-90'
                          }`}
                        >
                          {copyStatus === `${q.id}_${idx}` ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <footer className="mt-16 text-center text-[#70757a] pb-12 border-t border-[#dadce0] pt-8">
          <p className="text-sm flex items-center justify-center gap-2 italic">
            "I don't do holds unless they e-transfer a deposit"
          </p>
        </footer>
      </div>
    </div>
  );
};
export default App;
