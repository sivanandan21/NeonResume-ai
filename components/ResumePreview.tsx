import React from 'react';
import { ResumeData, TemplateType } from '../types';
import { Theme } from '../themes';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateType;
  theme: Theme;
  id?: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, theme, id = "resume-preview-content" }) => {
  const skillsArray = data.skills.split(',').map(s => s.trim()).filter(Boolean);
  const { colors } = theme;

  // Helper styles
  const textPrimary = { color: colors.primary };
  const textSecondary = { color: colors.secondary };
  const textMain = { color: colors.text };
  const textAccent = { color: colors.accent };
  const bgAccent = { backgroundColor: colors.accent };
  const borderAccent = { borderColor: colors.accent };
  const borderPrimary = { borderColor: colors.primary };

  // --- FUTURISTIC TEMPLATE ---
  if (template === 'futuristic') {
    return (
      <div id={id} className="w-full min-h-full p-8 relative font-sans print:p-8" style={{ backgroundColor: colors.background, color: colors.text }}>
        <div className="absolute top-0 left-0 w-full h-2" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.primary})` }} />
        
        {/* Header */}
        <header className="mb-8 border-b pb-6 relative flex justify-between items-start" style={{ borderColor: `${colors.secondary}40` }}>
            <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase" style={{ color: colors.primary }}>{data.fullName || 'YOUR NAME'}</h1>
                <p className="text-lg tracking-widest uppercase mb-4" style={{ color: colors.accent }}>{data.targetJobTitle || 'TARGET ROLE'}</p>
                <div className="flex flex-wrap gap-4 text-sm" style={{ color: colors.secondary }}>
                    {data.email && <span>📧 {data.email}</span>}
                    {data.phone && <span>📱 {data.phone}</span>}
                    {data.location && <span>📍 {data.location}</span>}
                    {data.website && <span>🔗 {data.website}</span>}
                </div>
            </div>
            {data.photoUrl && (
                 <div className="w-24 h-24 rounded-xl overflow-hidden border-2 shadow-lg flex-shrink-0 ml-4" style={{ borderColor: colors.accent, boxShadow: `0 0 15px ${colors.accent}40` }}>
                    <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
            )}
        </header>

        <div className="grid grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="col-span-8 space-y-8">
                {/* Summary */}
                {data.summary && (
                    <section>
                        <h3 className="text-xl font-bold mb-3 border-l-4 pl-3" style={{ color: colors.primary, borderColor: colors.accent }}>PROFILE</h3>
                        <p className="text-sm leading-relaxed" style={{ color: colors.text, opacity: 0.9 }}>{data.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section>
                        <h3 className="text-xl font-bold mb-4 border-l-4 pl-3" style={{ color: colors.primary, borderColor: colors.accent }}>EXPERIENCE</h3>
                        <div className="space-y-6">
                            {data.experience.map(exp => (
                                <div key={exp.id} className="relative pl-4 border-l" style={{ borderColor: `${colors.secondary}30` }}>
                                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.accent }} />
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="text-lg font-semibold" style={{ color: colors.text }}>{exp.role}</h4>
                                        <span className="text-xs font-mono" style={{ color: colors.secondary }}>{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p className="text-sm mb-2" style={{ color: colors.accent }}>{exp.company}</p>
                                    <div className="text-sm whitespace-pre-line leading-relaxed" style={{ color: colors.text, opacity: 0.8 }}>
                                      {exp.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                 {/* Projects */}
                 {data.projects.length > 0 && (
                    <section>
                        <h3 className="text-xl font-bold mb-4 border-l-4 pl-3" style={{ color: colors.primary, borderColor: colors.accent }}>PROJECTS</h3>
                        <div className="space-y-4">
                            {data.projects.map(proj => (
                                <div key={proj.id} className="p-4 border rounded" style={{ backgroundColor: `${colors.primary}05`, borderColor: `${colors.secondary}30` }}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold" style={{ color: colors.text }}>{proj.name}</h4>
                                        {proj.link && <span className="text-xs" style={{ color: colors.accent }}>{proj.link}</span>}
                                    </div>
                                    <p className="text-xs mb-2 font-mono" style={{ color: colors.secondary }}>{proj.techStack}</p>
                                    <p className="text-sm" style={{ color: colors.text, opacity: 0.8 }}>{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Right Column */}
            <div className="col-span-4 space-y-8">
                 {/* Skills */}
                 {skillsArray.length > 0 && (
                    <section>
                        <h3 className="text-xl font-bold mb-4 border-l-4 pl-3" style={{ color: colors.accent, borderColor: colors.primary }}>SKILLS</h3>
                        <div className="flex flex-wrap gap-2">
                            {skillsArray.map((skill, i) => (
                                <span key={i} className="px-3 py-1 rounded text-xs border" style={{ backgroundColor: `${colors.accent}15`, color: colors.text, borderColor: `${colors.accent}30` }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <section>
                        <h3 className="text-xl font-bold mb-4 border-l-4 pl-3" style={{ color: colors.accent, borderColor: colors.primary }}>EDUCATION</h3>
                        <div className="space-y-4">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <h4 className="font-semibold" style={{ color: colors.text }}>{edu.degree}</h4>
                                    <p className="text-sm" style={{ color: colors.secondary }}>{edu.school}</p>
                                    <p className="text-xs mt-1" style={{ color: colors.secondary, opacity: 0.7 }}>{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
      </div>
    );
  }

  // --- MODERN TEMPLATE ---
  if (template === 'modern') {
    return (
      <div id={id} className="w-full min-h-full p-8 relative print:p-8" style={{ backgroundColor: colors.background, color: colors.text }}>
        <div className="flex justify-between items-start border-b-2 pb-6 mb-8" style={{ borderColor: colors.primary }}>
            <div className="flex gap-6 items-center">
                {data.photoUrl && (
                    <img src={data.photoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 shadow-sm" style={{ borderColor: colors.secondary }} />
                )}
                <div>
                    <h1 className="text-5xl font-bold tracking-tighter mb-2" style={{ color: colors.primary }}>{data.fullName || 'Your Name'}</h1>
                    <p className="text-xl font-light" style={{ color: colors.secondary }}>{data.targetJobTitle}</p>
                </div>
            </div>
            <div className="text-right text-sm space-y-1" style={{ color: colors.secondary }}>
                <p>{data.email}</p>
                <p>{data.phone}</p>
                <p>{data.location}</p>
                <p className="font-medium" style={{ color: colors.accent }}>{data.website}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
            {data.summary && (
                <section>
                    <p className="text-lg leading-relaxed italic border-l-4 pl-4" style={{ color: colors.text, borderColor: colors.secondary }}>{data.summary}</p>
                </section>
            )}

            {skillsArray.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: colors.secondary }}>Core Competencies</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                         {skillsArray.map((skill, i) => (
                            <span key={i} className="font-semibold border-b-2 transition-colors" style={{ color: colors.primary, borderColor: 'transparent' }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {data.experience.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: colors.secondary }}>Professional Experience</h3>
                    <div className="space-y-8">
                        {data.experience.map(exp => (
                            <div key={exp.id} className="grid grid-cols-12 gap-4">
                                <div className="col-span-3 text-sm font-medium pt-1" style={{ color: colors.secondary }}>
                                    {exp.startDate} — {exp.endDate}
                                </div>
                                <div className="col-span-9">
                                    <h4 className="text-xl font-bold" style={{ color: colors.primary }}>{exp.role}</h4>
                                    <p className="mb-2 font-medium" style={{ color: colors.accent }}>{exp.company}</p>
                                    <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: colors.text }}>
                                        {exp.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-8">
                {data.education.length > 0 && (
                    <section>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: colors.secondary }}>Education</h3>
                        {data.education.map(edu => (
                            <div key={edu.id} className="mb-3">
                                <h4 className="font-bold" style={{ color: colors.primary }}>{edu.school}</h4>
                                <p style={{ color: colors.text }}>{edu.degree}</p>
                                <p className="text-xs" style={{ color: colors.secondary }}>{edu.year}</p>
                            </div>
                        ))}
                    </section>
                )}
                {data.projects.length > 0 && (
                    <section>
                         <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: colors.secondary }}>Projects</h3>
                         {data.projects.map(proj => (
                            <div key={proj.id} className="mb-4">
                                <div className="flex justify-between">
                                    <h4 className="font-bold" style={{ color: colors.primary }}>{proj.name}</h4>
                                </div>
                                <p className="text-xs mb-1" style={{ color: colors.accent }}>{proj.techStack}</p>
                                <p className="text-sm" style={{ color: colors.text }}>{proj.description}</p>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
      </div>
    );
  }

  // --- MINIMAL TEMPLATE ---
  return (
    <div id={id} className="w-full min-h-full p-10 shadow-xl relative print:p-10" style={{ backgroundColor: colors.background, color: colors.text }}>
        <header className="text-center mb-10">
            {data.photoUrl && (
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border" style={{ borderColor: colors.secondary }}>
                     <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
            )}
            <h1 className="text-3xl font-light mb-2 tracking-wide uppercase" style={{ color: colors.primary }}>{data.fullName}</h1>
            <div className="flex justify-center gap-4 text-xs uppercase tracking-wider" style={{ color: colors.secondary }}>
                <span>{data.email}</span>
                <span>{data.phone}</span>
                <span>{data.location}</span>
            </div>
        </header>

        {data.summary && (
            <section className="mb-8 text-center max-w-lg mx-auto">
                <p className="text-sm leading-relaxed" style={{ color: colors.text }}>{data.summary}</p>
            </section>
        )}

        <div className="border-t my-6" style={{ borderColor: `${colors.secondary}40` }}></div>

        {data.experience.length > 0 && (
            <section className="mb-8">
                <h3 className="text-xs font-bold uppercase mb-4 text-center tracking-widest" style={{ color: colors.secondary }}>Experience</h3>
                <div className="space-y-6">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-end mb-1">
                                <h4 className="font-semibold" style={{ color: colors.primary }}>{exp.role} <span className="font-normal" style={{ color: colors.secondary }}>at</span> {exp.company}</h4>
                                <span className="text-xs" style={{ color: colors.secondary }}>{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: colors.text }}>{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {skillsArray.length > 0 && (
            <section className="text-center mb-8">
                <h3 className="text-xs font-bold uppercase mb-4 tracking-widest" style={{ color: colors.secondary }}>Skills</h3>
                <p className="text-sm" style={{ color: colors.text }}>{skillsArray.join('  •  ')}</p>
            </section>
        )}

        {data.education.length > 0 && (
            <section className="text-center">
                 <h3 className="text-xs font-bold uppercase mb-4 tracking-widest" style={{ color: colors.secondary }}>Education</h3>
                 {data.education.map(edu => (
                     <div key={edu.id} className="mb-2">
                         <span className="font-semibold" style={{ color: colors.primary }}>{edu.degree}</span>
                         <span className="mx-2" style={{ color: colors.secondary }}>|</span>
                         <span style={{ color: colors.text }}>{edu.school}</span>
                         <span className="text-xs ml-2" style={{ color: colors.secondary }}>({edu.year})</span>
                     </div>
                 ))}
            </section>
        )}
    </div>
  );
};

export default ResumePreview;