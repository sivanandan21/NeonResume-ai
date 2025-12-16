import React, { useState, useEffect } from 'react';
import Background from './components/Background';
import ResumePreview from './components/ResumePreview';
import { ResumeData, INITIAL_RESUME_DATA, TemplateType, Experience, Education, Project } from './types';
import { generateProfessionalSummary, optimizeWorkDescription, suggestSkills, optimizeProjectDescription, generateInterviewQuestions } from './services/geminiService';
import { themes, DEFAULT_THEME, Theme } from './themes';

// Ensure html2pdf types or use 'any' if not available in environment
declare const html2pdf: any;

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'builder'>('home');
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [template, setTemplate] = useState<TemplateType>('futuristic');
  const [currentTheme, setCurrentTheme] = useState<Theme>(DEFAULT_THEME);
  const [isAiLoading, setIsAiLoading] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.65);
  
  // New State for Interview Prep
  const [interviewPrep, setInterviewPrep] = useState<string>("");
  
  // Mobile Tab State: 'editor' or 'preview'
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  // Adjust initial zoom for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setZoom(0.35);
      } else {
        setZoom(0.65);
      }
    };
    
    // Set initial
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Form Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = <S extends 'experience' | 'education' | 'projects'>(
    section: S,
    id: string,
    field: S extends 'experience' ? keyof Experience :
           S extends 'education' ? keyof Education :
           S extends 'projects' ? keyof Project : never,
    value: string
  ) => {
    setData(prev => {
      // Cast to any[] to avoid union type issues during map, relying on the function signature for type safety
      const items = prev[section] as any[];
      return {
        ...prev,
        [section]: items.map((item: any) => item.id === id ? { ...item, [field]: value } : item)
      };
    });
  };

  const addItem = (section: 'experience' | 'education' | 'projects') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newItems: any = {
      experience: { id, role: '', company: '', startDate: '', endDate: '', description: '' },
      education: { id, degree: '', school: '', year: '' },
      projects: { id, name: '', techStack: '', description: '' }
    };
    
    setData(prev => ({
      ...prev,
      [section]: [...prev[section], newItems[section]]
    }));
  };

  const removeItem = (section: 'experience' | 'education' | 'projects', id: string) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].filter((item: any) => item.id !== id)
    }));
  };

  // Helper to handle AI errors gracefully
  const handleAiError = (error: any) => {
    console.error(error);
    const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
    alert("AI Generation Failed: " + msg);
  };

  // AI Actions with better error handling
  const handleGenerateSummary = async () => {
    if (!data.targetJobTitle) {
      alert("Please enter a Target Job Title first.");
      return;
    }
    
    try {
      setIsAiLoading('summary');
      const summary = await generateProfessionalSummary(data);
      if (summary) {
        setData(prev => ({ ...prev, summary }));
      }
    } catch (error) {
      handleAiError(error);
    } finally {
      setIsAiLoading(null);
    }
  };

  const handleSuggestSkills = async () => {
     if (!data.targetJobTitle) {
      alert("Please enter a Target Job Title first.");
      return;
    }
    
    try {
      setIsAiLoading('skills');
      const skills = await suggestSkills(data.targetJobTitle);
      if (skills) {
        setData(prev => ({ ...prev, skills }));
      }
    } catch (error) {
       handleAiError(error);
    } finally {
       setIsAiLoading(null);
    }
  };

  const handleOptimizeDescription = async (expId: string, role: string, currentDesc: string) => {
    if (!role || !currentDesc) return;
    
    try {
      setIsAiLoading(`exp-${expId}`);
      const optimized = await optimizeWorkDescription(role, currentDesc);
      if (optimized) {
        handleArrayChange('experience', expId, 'description', optimized);
      }
    } catch (error) {
      handleAiError(error);
    } finally {
      setIsAiLoading(null);
    }
  };

  const handleOptimizeProject = async (projId: string, name: string, techStack: string, currentDesc: string) => {
    if (!name || !currentDesc) return;
    
    try {
      setIsAiLoading(`proj-${projId}`);
      const optimized = await optimizeProjectDescription(name, techStack, currentDesc);
      if (optimized) {
        handleArrayChange('projects', projId, 'description', optimized);
      }
    } catch (error) {
      handleAiError(error);
    } finally {
      setIsAiLoading(null);
    }
  };

  const handleGenerateInterview = async () => {
    if (!data.targetJobTitle) {
      alert("Please enter a Target Job Title in the Personal section first.");
      return;
    }
    try {
      setIsAiLoading('interview');
      const result = await generateInterviewQuestions(data.targetJobTitle, data.skills, data.summary);
      setInterviewPrep(result);
    } catch (error) {
      handleAiError(error);
    } finally {
      setIsAiLoading(null);
    }
  };

  // Download PDF
  const downloadPDF = () => {
    const element = document.getElementById('resume-preview-content');
    const opt = {
      margin: 0,
      filename: `${data.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  // Steps Configuration
  const steps = [
    { title: "Personal", icon: "👤" },
    { title: "Experience", icon: "💼" },
    { title: "Projects", icon: "🚀" },
    { title: "Education", icon: "🎓" },
    { title: "Skills", icon: "⚡" },
    { title: "Themes", icon: "🎨" },
    { title: "Interview", icon: "🎙️" },
  ];

  return (
    <div className="min-h-screen text-white font-body">
      <Background />

      {/* --- HERO SECTION --- */}
      {view === 'home' && (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 fade-in relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full glass-panel border border-purple-500/30 text-purple-300 text-xs md:text-sm font-semibold tracking-wide">
             ✨ V 2.0 AI GENERATION
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-purple-200 neon-text-glow leading-tight">
            NeonResume AI
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 mb-10 max-w-2xl leading-relaxed px-4">
            The ultimate <span className="text-cyan-400">AI-powered</span> resume builder. 
            Generates summaries, optimizes descriptions, and suggests skills instantly.
          </p>
          <button 
            onClick={() => setView('builder')}
            className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
          >
            <span className="relative z-10">Start Building</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      )}

      {/* --- BUILDER SECTION --- */}
      {view === 'builder' && (
        <div className="flex flex-col h-screen fade-in">
          {/* Header */}
          <header className="h-16 border-b border-white/10 glass-panel flex items-center justify-between px-4 md:px-6 z-20 shrink-0">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
              <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-sm md:text-base">N</div>
              <span className="font-bold text-sm md:text-lg tracking-tight hidden md:block">NeonResume AI</span>
            </div>
            
            <div className="flex gap-2 md:gap-4 items-center">
               <select 
                  className="bg-black/50 border border-white/20 rounded-lg px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm focus:outline-none focus:border-cyan-500 max-w-[120px] md:max-w-none"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value as TemplateType)}
               >
                 <option value="futuristic">Futuristic</option>
                 <option value="modern">Modern</option>
                 <option value="minimal">Minimal</option>
               </select>

               <button 
                onClick={downloadPDF}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-1.5 md:px-4 md:py-1.5 rounded-lg text-xs md:text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-cyan-900/50 flex items-center gap-2"
               >
                 <span className="hidden md:inline">Download PDF</span>
                 <span className="md:hidden">⬇ PDF</span>
               </button>
            </div>
          </header>

          {/* Main Layout - Split on Desktop, Toggle on Mobile */}
          <main className="flex-1 overflow-hidden flex flex-col md:flex-row relative">
            
            {/* Left: Form Inputs (Editor) */}
            <div className={`w-full md:w-1/2 lg:w-5/12 overflow-y-auto p-4 md:p-6 scrollbar-hide pb-24 md:pb-20 ${mobileTab === 'preview' ? 'hidden md:block' : 'block'}`}>
               
               {/* Stepper - Horizontally scrollable on mobile */}
               <div className="flex justify-between mb-8 relative overflow-x-auto no-scrollbar pb-2 md:pb-0 min-w-full">
                 <div className="absolute top-[18px] md:top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10 min-w-[300px]" />
                 <div className="flex w-full min-w-[300px] justify-between px-1">
                    {steps.map((step, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveStep(idx)}
                        className={`flex flex-col items-center gap-2 transition-all min-w-[50px] ${activeStep === idx ? 'scale-110 text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center glass-panel border ${activeStep === idx ? 'border-cyan-500 bg-cyan-900/20 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-white/10 bg-black'}`}>
                          <span className="text-sm md:text-base">{step.icon}</span>
                        </div>
                        <span className="text-[10px] md:text-xs font-medium whitespace-nowrap">{step.title}</span>
                      </button>
                    ))}
                 </div>
               </div>

               {/* Form Content */}
               <div className="glass-panel p-4 md:p-6 rounded-2xl border border-white/5 space-y-6 mb-20 md:mb-0">
                 
                 {/* Step 0: Personal */}
                 {activeStep === 0 && (
                   <div className="space-y-4 animate-fadeIn">
                     <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
                     
                     {/* Photo Upload */}
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-white/20">
                            {data.photoUrl ? (
                                <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl">📷</span>
                            )}
                        </div>
                        <div>
                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-sm transition-colors border border-white/10 inline-block">
                                Upload Photo
                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                            </label>
                            {data.photoUrl && (
                                <button 
                                    onClick={() => setData(prev => ({ ...prev, photoUrl: '' }))}
                                    className="ml-2 text-xs text-red-400 hover:text-red-300"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="fullName" placeholder="Full Name" value={data.fullName} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg p-3 focus:border-purple-500 focus:outline-none w-full text-sm md:text-base" />
                        <input name="email" placeholder="Email" value={data.email} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg p-3 focus:border-purple-500 focus:outline-none w-full text-sm md:text-base" />
                        <input name="phone" placeholder="Phone" value={data.phone} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg p-3 focus:border-purple-500 focus:outline-none w-full text-sm md:text-base" />
                        <input name="location" placeholder="City, Country" value={data.location} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg p-3 focus:border-purple-500 focus:outline-none w-full text-sm md:text-base" />
                        <input name="linkedin" placeholder="LinkedIn URL" value={data.linkedin} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg p-3 focus:border-purple-500 focus:outline-none w-full text-sm md:text-base" />
                        <input name="website" placeholder="Portfolio URL" value={data.website} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg p-3 focus:border-purple-500 focus:outline-none w-full text-sm md:text-base" />
                     </div>
                     <div className="pt-4 border-t border-white/10">
                        <label className="text-sm text-cyan-400 font-semibold mb-2 block">Target Job Title (Required for AI)</label>
                        <input name="targetJobTitle" placeholder="e.g. Senior Software Engineer" value={data.targetJobTitle} onChange={handleChange} className="bg-black/40 border border-cyan-500/30 rounded-lg p-3 focus:border-cyan-500 focus:outline-none w-full mb-4 text-sm md:text-base" />
                        
                        <div className="flex justify-between items-center mb-2">
                           <label className="text-sm font-semibold">Professional Summary</label>
                           <button 
                            onClick={handleGenerateSummary}
                            disabled={isAiLoading === 'summary'}
                            className="text-xs bg-purple-600/20 text-purple-300 border border-purple-500/50 px-2 py-1 rounded hover:bg-purple-600/40 transition-colors flex items-center gap-1"
                           >
                             {isAiLoading === 'summary' ? 'Thinking...' : '✨ Generate with AI'}
                           </button>
                        </div>
                        <textarea name="summary" rows={4} value={data.summary} onChange={handleChange} className="bg-black/40 border border-white/10 rounded-lg p-3 focus:border-purple-500 focus:outline-none w-full text-sm leading-relaxed" placeholder="Brief summary of your career..." />
                     </div>
                   </div>
                 )}

                 {/* Step 1: Experience */}
                 {activeStep === 1 && (
                   <div className="space-y-6 animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Experience</h2>
                        <button onClick={() => addItem('experience')} className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20">+ Add Role</button>
                      </div>
                      
                      {data.experience.map((exp, i) => (
                        <div key={exp.id} className="p-4 bg-white/5 rounded-lg border border-white/10 relative group">
                           <button onClick={() => removeItem('experience', exp.id)} className="absolute top-2 right-2 text-red-400 opacity-70 hover:opacity-100 transition-opacity p-1">×</button>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                              <input placeholder="Job Title" value={exp.role} onChange={(e) => handleArrayChange('experience', exp.id, 'role', e.target.value)} className="bg-black/40 border border-white/10 rounded p-2 text-sm w-full" />
                              <input placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange('experience', exp.id, 'company', e.target.value)} className="bg-black/40 border border-white/10 rounded p-2 text-sm w-full" />
                              <input placeholder="Start Date" value={exp.startDate} onChange={(e) => handleArrayChange('experience', exp.id, 'startDate', e.target.value)} className="bg-black/40 border border-white/10 rounded p-2 text-sm w-full" />
                              <input placeholder="End Date" value={exp.endDate} onChange={(e) => handleArrayChange('experience', exp.id, 'endDate', e.target.value)} className="bg-black/40 border border-white/10 rounded p-2 text-sm w-full" />
                           </div>
                           <div className="flex justify-between items-center mb-1">
                               <label className="text-xs text-gray-400">Description (Bullet points)</label>
                               <button 
                                onClick={() => handleOptimizeDescription(exp.id, exp.role, exp.description)}
                                disabled={isAiLoading === `exp-${exp.id}`}
                                className="text-[10px] bg-cyan-600/20 text-cyan-300 border border-cyan-500/50 px-2 py-0.5 rounded hover:bg-cyan-600/40 transition-colors"
                               >
                                 {isAiLoading === `exp-${exp.id}` ? 'Optimizing...' : '✨ Rewrite for ATS'}
                               </button>
                           </div>
                           <textarea rows={4} value={exp.description} onChange={(e) => handleArrayChange('experience', exp.id, 'description', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-sm leading-relaxed" />
                        </div>
                      ))}
                   </div>
                 )}

                 {/* Step 2: Projects */}
                 {activeStep === 2 && (
                    <div className="space-y-6 animate-fadeIn">
                       <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Projects</h2>
                        <button onClick={() => addItem('projects')} className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20">+ Add Project</button>
                      </div>
                      {data.projects.map((proj) => (
                        <div key={proj.id} className="p-4 bg-white/5 rounded-lg border border-white/10 relative group">
                           <button onClick={() => removeItem('projects', proj.id)} className="absolute top-2 right-2 text-red-400 opacity-70 hover:opacity-100 transition-opacity p-1">×</button>
                           <input placeholder="Project Name" value={proj.name} onChange={(e) => handleArrayChange('projects', proj.id, 'name', e.target.value)} className="bg-black/40 border border-white/10 rounded p-2 text-sm w-full mb-2" />
                           <input placeholder="Tech Stack (e.g. React, Node)" value={proj.techStack} onChange={(e) => handleArrayChange('projects', proj.id, 'techStack', e.target.value)} className="bg-black/40 border border-white/10 rounded p-2 text-sm w-full mb-2" />
                           
                           <div className="flex justify-between items-center mb-1">
                               <label className="text-xs text-gray-400">Description</label>
                               <button 
                                onClick={() => handleOptimizeProject(proj.id, proj.name, proj.techStack, proj.description)}
                                disabled={isAiLoading === `proj-${proj.id}`}
                                className="text-[10px] bg-purple-600/20 text-purple-300 border border-purple-500/50 px-2 py-0.5 rounded hover:bg-purple-600/40 transition-colors"
                               >
                                 {isAiLoading === `proj-${proj.id}` ? 'Rewriting...' : '✨ Rewrite with AI'}
                               </button>
                           </div>
                           <textarea placeholder="Description" rows={3} value={proj.description} onChange={(e) => handleArrayChange('projects', proj.id, 'description', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-sm leading-relaxed" />
                        </div>
                      ))}
                    </div>
                 )}

                 {/* Step 3: Education */}
                 {activeStep === 3 && (
                    <div className="space-y-6 animate-fadeIn">
                       <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Education</h2>
                        <button onClick={() => addItem('education')} className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20">+ Add Education</button>
                      </div>
                      {data.education.map((edu) => (
                        <div key={edu.id} className="p-4 bg-white/5 rounded-lg border border-white/10 relative group">
                           <button onClick={() => removeItem('education', edu.id)} className="absolute top-2 right-2 text-red-400 opacity-70 hover:opacity-100 transition-opacity p-1">×</button>
                           <input placeholder="School / University" value={edu.school} onChange={(e) => handleArrayChange('education', edu.id, 'school', e.target.value)} className="bg-black/40 border border-white/10 rounded p-2 text-sm w-full mb-2" />
                           <div className="grid grid-cols-2 gap-3">
                               <input placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange('education', edu.id, 'degree', e.target.value)} className="bg-black/40 border border-white/10 rounded p-2 text-sm w-full" />
                               <input placeholder="Year" value={edu.year} onChange={(e) => handleArrayChange('education', edu.id, 'year', e.target.value)} className="bg-black/40 border border-white/10 rounded p-2 text-sm w-full" />
                           </div>
                        </div>
                      ))}
                    </div>
                 )}

                 {/* Step 4: Skills */}
                 {activeStep === 4 && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Skills</h2>
                             <button 
                                onClick={handleSuggestSkills}
                                disabled={isAiLoading === 'skills'}
                                className="text-xs bg-purple-600/20 text-purple-300 border border-purple-500/50 px-2 py-1 rounded hover:bg-purple-600/40 transition-colors flex items-center gap-1"
                            >
                                {isAiLoading === 'skills' ? 'Thinking...' : '✨ Suggest Skills'}
                            </button>
                        </div>
                        <textarea 
                            name="skills" 
                            rows={6} 
                            value={data.skills} 
                            onChange={handleChange} 
                            className="bg-black/40 border border-white/10 rounded-lg p-3 focus:border-purple-500 focus:outline-none w-full text-sm leading-loose" 
                            placeholder="Java, Python, Leadership, Public Speaking..." 
                        />
                        <p className="text-xs text-gray-500">Separate skills with commas.</p>
                    </div>
                 )}

                 {/* Step 5: Themes */}
                 {activeStep === 5 && (
                    <div className="space-y-6 animate-fadeIn">
                      <h2 className="text-2xl font-bold">Color Themes</h2>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {themes.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setCurrentTheme(t)}
                            className={`relative group rounded-lg p-2 transition-all border border-white/10 hover:border-white/30 flex flex-col items-center gap-2 ${currentTheme.id === t.id ? 'ring-2 ring-cyan-500 bg-white/5' : ''}`}
                          >
                            <div className="w-full aspect-square rounded shadow-lg overflow-hidden relative border border-white/5">
                                {/* Theme Preview Circle */}
                                <div 
                                  className="absolute inset-0"
                                  style={{ backgroundColor: t.colors.background }}
                                />
                                <div 
                                  className="absolute top-0 right-0 w-1/2 h-full"
                                  style={{ backgroundColor: t.colors.primary, opacity: 0.2 }}
                                />
                                <div 
                                  className="absolute bottom-2 right-2 w-4 h-4 rounded-full border border-white/20 shadow-sm"
                                  style={{ backgroundColor: t.colors.accent }}
                                />
                            </div>
                            <span className="text-[10px] text-center w-full truncate text-gray-400 group-hover:text-white">{t.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                 )}
                 
                 {/* Step 6: Interview Prep */}
                 {activeStep === 6 && (
                    <div className="space-y-6 animate-fadeIn h-full flex flex-col">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold">Interview Prep</h2>
                            <p className="text-sm text-gray-400">AI-generated questions and tips based on your resume profile.</p>
                        </div>
                        
                        <div className="flex-1 bg-black/30 rounded-lg border border-white/10 overflow-hidden flex flex-col min-h-[300px]">
                             {!interviewPrep ? (
                                 <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                     <span className="text-4xl mb-4">🎤</span>
                                     <p className="text-gray-400 mb-6">Ready to practice? Click below to generate tailored interview questions.</p>
                                     <button 
                                        onClick={handleGenerateInterview}
                                        disabled={isAiLoading === 'interview'}
                                        className="bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-3 rounded-full font-bold shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
                                     >
                                         {isAiLoading === 'interview' ? 'Generating...' : 'Generate Interview Questions'}
                                     </button>
                                 </div>
                             ) : (
                                 <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                     <div className="whitespace-pre-wrap leading-relaxed text-sm text-gray-200 font-sans">
                                         {interviewPrep}
                                     </div>
                                     <div className="mt-6 text-center">
                                         <button 
                                            onClick={handleGenerateInterview}
                                            disabled={isAiLoading === 'interview'}
                                            className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                                         >
                                             Regenerate Questions
                                         </button>
                                     </div>
                                 </div>
                             )}
                        </div>
                    </div>
                 )}

                 <div className="flex justify-between pt-4 mt-4 border-t border-white/10">
                    <button 
                        onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                        disabled={activeStep === 0}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 text-sm"
                    >
                        Previous
                    </button>
                    <button 
                        onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                        disabled={activeStep === steps.length - 1}
                        className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-sm font-semibold"
                    >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next Step'}
                    </button>
                 </div>

               </div>
            </div>

            {/* Right: Preview (Hidden on mobile if editor tab active) */}
            <div className={`w-full md:w-1/2 lg:w-7/12 bg-[#050505] relative flex-col h-full overflow-hidden ${mobileTab === 'editor' ? 'hidden md:flex' : 'flex'}`}>
                 <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] pointer-events-none" />
                 
                 {/* Zoom Toolbar */}
                 <div className="absolute top-4 right-4 z-30 flex gap-2">
                    <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="glass-panel w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 text-white">-</button>
                    <span className="glass-panel px-3 h-8 rounded text-sm text-white flex items-center min-w-[3rem] justify-center">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="glass-panel w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 text-white">+</button>
                 </div>

                 {/* Scrollable Container */}
                 <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar flex justify-center items-start pb-24 md:pb-8">
                     <div 
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                        className="transition-transform duration-200 ease-out origin-top"
                     >
                         <div className="w-[210mm] min-h-[297mm] shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-colors duration-300" style={{ backgroundColor: currentTheme.colors.background }}>
                            <ResumePreview data={data} template={template} theme={currentTheme} />
                         </div>
                     </div>
                 </div>
            </div>

            {/* Mobile Bottom Navigation - Visible only on mobile */}
            <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex gap-2 bg-black/80 backdrop-blur-xl p-1.5 rounded-full border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <button 
                  onClick={() => setMobileTab('editor')}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${mobileTab === 'editor' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <span>✏️ Editor</span>
                </button>
                <div className="w-px bg-white/10 my-1"></div>
                <button 
                  onClick={() => setMobileTab('preview')}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${mobileTab === 'preview' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <span>👁️ Preview</span>
                </button>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;