import { useState, useEffect } from 'react';
import axios from 'axios';

function Admin({ onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [visits, setVisits] = useState([]);
  const [profile, setProfile] = useState({
    bio: { name: '', title: '', summary: '', email: '', linkedin: '', github: '', location: '' },
    skills: { languages: [], frameworks: [], databases: [], tools: [] },
    education: [],
    experience: [],
    status: '', heroHeading: '', contactText: '',
    metrics: [], certifications: []
  });

  // Form States
  const [newProj, setNewProj] = useState({ title: '', description: '', techStack: '', githubLink: '' });
  const [eduInput, setEduInput] = useState({ institution: '', degree: '', timeline: '', details: '' });
  const [expInput, setExpInput] = useState({ company: '', role: '', timeline: '', description: '' });
  const [metricInput, setMetricInput] = useState({ title: '', text: '' });
  const [certInput, setCertInput] = useState({ title: '', issuer: '' });
  const [certFile, setCertFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    axios.get('https://portfolio-mern-pvfn.vercel.app/api/profile').then(res => {
        let p = res.data;
        if(!p.status) p.status = "Available for New Opportunities";
        if(!p.heroHeading) p.heroHeading = "Crafting Digital Experiences";
        if(!p.contactText) p.contactText = "Have an opening, an interesting project framework suggestion, or want to discuss full-stack or security challenges? Send a message directly into my database cluster console.";
        if(!p.metrics) p.metrics = [{ title: "3+", text: "Years Coding" }, { title: "15+", text: "Projects Built" }, { title: "3.08", text: "Major CGPA" }];
        if(!p.certifications) p.certifications = [{ title: "AWS Academy Graduate: Cloud Foundations", issuer: "AWS Academy" }, { title: "Web & Mobile App Development", issuer: "Saylani Mass IT Training Program (SMIT)" }, { title: "Career Essentials in Software Development", issuer: "Microsoft & LinkedIn" }];
        setProfile(p);
    }).catch(err => console.log(err));
    axios.get('https://portfolio-mern-pvfn.vercel.app/api/projects').then(res => setProjects(res.data)).catch(err => console.log(err));
    axios.get('https://portfolio-mern-pvfn.vercel.app/api/contact').then(res => setMessages(res.data || [])).catch(() => {});
    axios.get('https://portfolio-mern-pvfn.vercel.app/api/visits').then(res => setVisits(res.data || [])).catch(() => {});
  };

  const showMsg = (text, type = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
  };

  const saveProfileData = (updatedData) => {
    axios.put('https://portfolio-mern-pvfn.vercel.app/api/profile', updatedData)
      .then((res) => {
        setProfile(res.data);
        showMsg("Changes synchronized with MongoDB.");
      })
      .catch(() => showMsg("Sync failure encountered.", "danger"));
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    const techArr = [];
    const splitTech = newProj.techStack.split(',');
    for (let i = 0; i < splitTech.length; i++) {
        let t = splitTech[i].trim();
        if (t) techArr.push(t);
    }

    const payload = {
      ...newProj,
      techStack: techArr
    };
    axios.post('https://portfolio-mern-pvfn.vercel.app/api/projects', payload).then(() => {
      setNewProj({ title: '', description: '', techStack: '', githubLink: '' });
      loadAllData();
      showMsg("Project document created successfully.");
    });
  };

  const handleDeleteProject = (id) => {
    axios.delete(`https://portfolio-mern-pvfn.vercel.app/api/projects/${id}`).then(() => {
      loadAllData();
      showMsg("Project document deleted.");
    });
  };

  const handleResumeSubmit = (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    const formData = new FormData();
    formData.append('resume', resumeFile);
    axios.post('https://portfolio-mern-pvfn.vercel.app/api/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => {
      showMsg("Resume PDF file replaced in system assets.");
      setResumeFile(null);
      saveProfileData({ ...profile, resumeUrl: res.data.url });
    }).catch(() => showMsg("Upload stream rejected.", "danger"));
  };

  // Rendering Loops
  const tabButtons = [];
  const tabNames = ['profile', 'skills', 'education', 'experience', 'projects', 'resume', 'inbox', 'analytics', 'site content'];
  for (let i = 0; i < tabNames.length; i++) {
    const tab = tabNames[i];
    tabButtons.push(
      <button key={tab} className={`btn btn-sm text-capitalize border-0 rounded-2 py-2 fw-medium ${activeTab === tab ? 'btn-info text-dark fw-bold' : 'text-secondary'}`} onClick={() => setActiveTab(tab)}>
        {tab}
      </button>
    );
  }

  const bioFields = [];
  const bioKeys = Object.keys(profile.bio);
  for (let i = 0; i < bioKeys.length; i++) {
    const key = bioKeys[i];
    bioFields.push(
      <div className="col-md-6" key={key}>
        <label className="form-label small text-uppercase text-muted fw-bold">{key}</label>
        <input type="text" className="form-control text-white custom-input-dark bg-dark border-0" value={profile.bio[key]} 
          onChange={(e) => {
            const nextBio = { ...profile.bio, [key]: e.target.value };
            setProfile({ ...profile, bio: nextBio });
          }} />
      </div>
    );
  }

  const skillFields = [];
  const skillCats = Object.keys(profile.skills);
  for (let i = 0; i < skillCats.length; i++) {
    const cat = skillCats[i];
    
    // Convert array to string without map
    let currentSkillsStr = '';
    for(let j = 0; j < profile.skills[cat].length; j++) {
       currentSkillsStr += profile.skills[cat][j];
       if (j < profile.skills[cat].length - 1) currentSkillsStr += ', ';
    }

    skillFields.push(
      <div className="mb-3" key={cat}>
        <label className="form-label small text-capitalize fw-bold text-muted">{cat}</label>
        <input type="text" className="form-control text-white custom-input-dark bg-dark border-0" 
          value={currentSkillsStr} 
          onChange={(e) => {
            const splitVals = e.target.value.split(',');
            const updatedCat = [];
            for (let k = 0; k < splitVals.length; k++) {
              updatedCat.push(splitVals[k].trim());
            }
            const nextSkills = { ...profile.skills, [cat]: updatedCat };
            setProfile({ ...profile, skills: nextSkills });
          }} />
      </div>
    );
  }

  const eduRows = [];
  for (let i = 0; i < profile.education.length; i++) {
    const edu = profile.education[i];
    eduRows.push(
      <tr key={i} style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <td className="fw-bold text-white">{edu.institution}</td><td>{edu.degree}</td><td>{edu.timeline}</td>
        <td className="text-end">
          <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={() => {
            const nextEdu = [];
            for (let j = 0; j < profile.education.length; j++) {
                if (j !== i) nextEdu.push(profile.education[j]);
            }
            saveProfileData({ ...profile, education: nextEdu });
          }}><i className="bi bi-trash-fill"></i></button>
        </td>
      </tr>
    );
  }

  const expRows = [];
  for (let i = 0; i < profile.experience.length; i++) {
    const exp = profile.experience[i];
    expRows.push(
      <tr key={i} style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <td className="fw-bold text-white">{exp.company}</td><td>{exp.role}</td><td>{exp.timeline}</td>
        <td className="text-end">
          <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={() => {
            const nextExp = [];
            for (let j = 0; j < profile.experience.length; j++) {
                if (j !== i) nextExp.push(profile.experience[j]);
            }
            saveProfileData({ ...profile, experience: nextExp });
          }}><i className="bi bi-trash-fill"></i></button>
        </td>
      </tr>
    );
  }

  const projList = [];
  if (Array.isArray(projects)) {
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      projList.push(
        <div className="list-group-item bg-dark border-0 text-white border-bottom d-flex justify-content-between align-items-center" key={p._id} style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div><div className="fw-bold text-white">{p.title}</div><span className="text-muted d-block text-truncate" style={{maxWidth: '320px'}}>{p.description}</span></div>
          <button type="button" className="btn btn-sm text-danger" onClick={() => handleDeleteProject(p._id)}><i className="bi bi-trash3-fill"></i></button>
        </div>
      );
    }
  }

  const msgList = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    msgList.push(
      <div key={msg._id} className="p-3 rounded-3" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="d-flex justify-content-between flex-wrap gap-1 mb-2">
          <span className="fw-bold text-info small">{msg.name} ({msg.email})</span>
          <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-secondary small m-0" style={{ lineHeight: '1.5' }}>{msg.text}</p>
      </div>
    );
  }

  const metricRows = [];
  for (let i = 0; i < profile.metrics.length; i++) {
    const metric = profile.metrics[i];
    metricRows.push(
      <tr key={i} style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <td className="fw-bold text-white">{metric.title}</td><td>{metric.text}</td>
        <td className="text-end">
          <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={() => {
            const nextMetrics = [];
            for (let j = 0; j < profile.metrics.length; j++) {
                if (j !== i) nextMetrics.push(profile.metrics[j]);
            }
            saveProfileData({ ...profile, metrics: nextMetrics });
          }}><i className="bi bi-trash-fill"></i></button>
        </td>
      </tr>
    );
  }

  const certRows = [];
  for (let i = 0; i < profile.certifications.length; i++) {
    const cert = profile.certifications[i];
    certRows.push(
      <tr key={i} style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <td className="fw-bold text-white">{cert.title}</td>
        <td>
          {cert.issuer}
          {cert.pdfUrl && <a href={cert.pdfUrl} target="_blank" rel="noreferrer" className="ms-2 badge bg-info text-dark text-decoration-none">PDF</a>}
        </td>
        <td className="text-end">
          <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={() => {
            const nextCerts = [];
            for (let j = 0; j < profile.certifications.length; j++) {
                if (j !== i) nextCerts.push(profile.certifications[j]);
            }
            saveProfileData({ ...profile, certifications: nextCerts });
          }}><i className="bi bi-trash-fill"></i></button>
        </td>
      </tr>
    );
  }

  const visitRows = [];
  for (let i = 0; i < visits.length; i++) {
    const v = visits[i];
    visitRows.push(
      <tr key={v._id} style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <td className="text-white">{v.ip}</td>
        <td><span className="text-info">{v.platform}</span> <br/><span className="text-muted" style={{fontSize:'0.7rem'}}>{v.userAgent}</span></td>
        <td>{v.language}</td>
        <td>{new Date(v.createdAt).toLocaleString()}</td>
      </tr>
    );
  }

  return (
    <div style={{ backgroundColor: '#0b0f19', color: '#f3f4f6', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }} className="py-5">
      <div className="container">
        
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-5" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <h1 className="h3 fw-bold text-white m-0"><span className="text-info">#</span> Main Control Panel</h1>
            <p className="text-muted small m-0">Direct administrative access pipeline over live portfolio components.</p>
          </div>
          <div className="d-flex gap-2">
            <a href="/" className="btn btn-sm btn-outline-info rounded-pill px-3"><i className="bi bi-arrow-left me-1"></i> Public View</a>
            <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => {
              localStorage.removeItem('adminToken');
              delete axios.defaults.headers.common['Authorization'];
              if (onLogout) onLogout();
            }}>Logout <i className="bi bi-box-arrow-right ms-1"></i></button>
          </div>
        </div>

        {statusMsg.text && (
          <div className={`alert alert-dark border-${statusMsg.type === 'danger' ? 'danger' : 'info'} text-white small py-2 shadow-sm mb-4`}>
            <i className={`bi bi-${statusMsg.type === 'danger' ? 'exclamation-octagon' : 'check-circle'}-fill text-info me-2`}></i> {statusMsg.text}
          </div>
        )}

        <div className="btn-group w-100 mb-4 p-1 rounded-3 border flex-wrap" style={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.05)' }}>
          {tabButtons}
        </div>

        <div className="card p-4 rounded-4 shadow-lg border-0" style={{ backgroundColor: '#111827' }}>
          
          {activeTab === 'profile' && (
            <div>
              <h5 className="fw-bold text-white mb-4 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Edit Biography Details</h5>
              <div className="row g-3">
                {bioFields}
                <div className="col-12 text-end mt-4">
                  <button className="btn btn-info text-dark fw-bold px-4" onClick={() => saveProfileData(profile)}>Save Biography Configuration</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <h5 className="fw-bold text-white mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Update Technical Toolkits</h5>
              <p className="text-muted small mb-4">Provide software development stack skills separated strictly with commas.</p>
              {skillFields}
              <div className="text-end mt-4">
                <button className="btn btn-info text-dark fw-bold px-4" onClick={() => saveProfileData(profile)}>Save Technical Skills</button>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div>
              <h5 className="fw-bold text-white mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Manage Academic History</h5>
              <div className="table-responsive mb-4">
                <table className="table table-dark table-hover small border border-secondary border-opacity-10 align-middle">
                  <thead><tr className="table-dark"><th>Institution</th><th>Degree</th><th>Timeline</th><th className="text-end">Action</th></tr></thead>
                  <tbody>
                    {eduRows}
                  </tbody>
                </table>
              </div>
              <h6 className="fw-bold text-white mb-3">Append New Institution Row</h6>
              <div className="row g-2">
                <div className="col-md-3"><input type="text" placeholder="Institution" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm" value={eduInput.institution} onChange={e => setEduInput({...eduInput, institution: e.target.value})} /></div>
                <div className="col-md-3"><input type="text" placeholder="Degree" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm" value={eduInput.degree} onChange={e => setEduInput({...eduInput, degree: e.target.value})} /></div>
                <div className="col-md-3"><input type="text" placeholder="Timeline" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm" value={eduInput.timeline} onChange={e => setEduInput({...eduInput, timeline: e.target.value})} /></div>
                <div className="col-md-3"><input type="text" placeholder="Details (GPA / Grade)" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm" value={eduInput.details} onChange={e => setEduInput({...eduInput, details: e.target.value})} /></div>
              </div>
              <button type="button" className="btn btn-sm btn-info text-dark fw-bold mt-3 px-3" onClick={() => {
                saveProfileData({ ...profile, education: [...profile.education, eduInput] });
                setEduInput({ institution: '', degree: '', timeline: '', details: '' });
              }}>Insert Education Row</button>
            </div>
          )}

          {activeTab === 'experience' && (
            <div>
              <h5 className="fw-bold text-white mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Manage Experience Array</h5>
              <div className="table-responsive mb-4">
                <table className="table table-dark table-hover small border border-secondary border-opacity-10 align-middle">
                  <thead><tr className="table-dark"><th>Company</th><th>Role</th><th>Timeline</th><th className="text-end">Action</th></tr></thead>
                  <tbody>
                    {expRows}
                  </tbody>
                </table>
              </div>
              <h6 className="fw-bold text-white mb-3">Append New Experience Row</h6>
              <div className="row g-2">
                <div className="col-md-3"><input type="text" placeholder="Company" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm" value={expInput.company} onChange={e => setExpInput({...expInput, company: e.target.value})} /></div>
                <div className="col-md-3"><input type="text" placeholder="Role" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm" value={expInput.role} onChange={e => setExpInput({...expInput, role: e.target.value})} /></div>
                <div className="col-md-3"><input type="text" placeholder="Timeline" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm" value={expInput.timeline} onChange={e => setExpInput({...expInput, timeline: e.target.value})} /></div>
                <div className="col-md-3"><input type="text" placeholder="Description Context" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm" value={expInput.description} onChange={e => setExpInput({...expInput, description: e.target.value})} /></div>
              </div>
              <button type="button" className="btn btn-sm btn-info text-dark fw-bold mt-3 px-3" onClick={() => {
                saveProfileData({ ...profile, experience: [...profile.experience, expInput] });
                setExpInput({ company: '', role: '', timeline: '', description: '' });
              }}>Insert Experience Row</button>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <h5 className="fw-bold text-white mb-4 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Manage Live Engineering Projects</h5>
              <div className="row g-4">
                <div className="col-md-5 border-end pe-md-4" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <h6 className="text-white fw-bold mb-3">Add New Record</h6>
                  <form onSubmit={handleAddProject}>
                    <input type="text" placeholder="Project Name / Title" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm mb-2" value={newProj.title} onChange={e => setNewProj({...newProj, title: e.target.value})} required />
                    <textarea placeholder="Architecture Metric Descriptions" rows="4" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm mb-2" value={newProj.description} onChange={e => setNewProj({...newProj, description: e.target.value})} required></textarea>
                    <input type="text" placeholder="Tech Tools (comma-separated tokens)" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm mb-2" value={newProj.techStack} onChange={e => setNewProj({...newProj, techStack: e.target.value})} required />
                    <input type="url" placeholder="Repository Link URL" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm mb-3" value={newProj.githubLink} onChange={e => setNewProj({...newProj, githubLink: e.target.value})} />
                    <button type="submit" className="btn btn-sm btn-info text-dark fw-bold w-100 py-2">Push Project Document</button>
                  </form>
                </div>
                <div className="col-md-7 ps-md-4">
                  <h6 className="text-white fw-bold mb-3">Live Showroom Collections ({Array.isArray(projects) ? projects.length : 0})</h6>
                  <div className="list-group border border-secondary border-opacity-10 small" style={{ maxHeight: '310px', overflowY: 'auto' }}>
                    {projList}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div>
              <h5 className="fw-bold text-white mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Overwrite Public CV Asset Document</h5>
              <p className="text-muted small mb-4">Select an updated resume document. Uploading will replace the active asset file stream location instantly.</p>
              <form onSubmit={handleResumeSubmit}>
                <div className="input-group input-group-sm mb-2" style={{ maxWidth: '500px' }}>
                  <input type="file" accept=".pdf" className="form-control text-white custom-input-dark bg-dark border-0" onChange={e => setResumeFile(e.target.files[0])} required />
                  <button type="submit" className="btn btn-info text-dark fw-bold px-3" disabled={!resumeFile}><i className="bi bi-cloud-arrow-up-fill me-1"></i> Replace Asset</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'inbox' && (
            <div>
              <h5 className="fw-bold text-white mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Inbound Contact Messages</h5>
              <p className="text-muted small mb-4">Live recruiter inquiries captured directly from your contact form collection.</p>
              {messages.length === 0 ? (
                <p className="text-muted small text-center py-4">No incoming message structures found in database.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {msgList}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h5 className="fw-bold text-white mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Public Site Visitor Analytics</h5>
              <div className="table-responsive">
                <table className="table table-dark table-hover small border border-secondary border-opacity-10 align-middle">
                  <thead><tr className="table-dark"><th>IP / Location</th><th>Browser & OS</th><th>Language</th><th>Time of Visit</th></tr></thead>
                  <tbody>
                    {visitRows}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'site content' && (
            <div>
              <h5 className="fw-bold text-white mb-4 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Edit Public Site Content</h5>
              
              <div className="mb-4">
                  <label className="form-label small text-uppercase text-muted fw-bold">Hero Status Badge</label>
                  <input type="text" className="form-control text-white custom-input-dark bg-dark border-0 mb-3" value={profile.status} 
                    onChange={(e) => setProfile({ ...profile, status: e.target.value })} />
                    
                  <label className="form-label small text-uppercase text-muted fw-bold">Hero Main Heading (Supports HTML)</label>
                  <input type="text" className="form-control text-white custom-input-dark bg-dark border-0 mb-3" value={profile.heroHeading} 
                    onChange={(e) => setProfile({ ...profile, heroHeading: e.target.value })} />
                    
                  <label className="form-label small text-uppercase text-muted fw-bold">Contact Section Description</label>
                  <textarea rows="3" className="form-control text-white custom-input-dark bg-dark border-0 mb-3" value={profile.contactText} 
                    onChange={(e) => setProfile({ ...profile, contactText: e.target.value })}></textarea>
              </div>

              <h6 className="fw-bold text-white mb-3 mt-5 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Dashboard Metrics</h6>
              <div className="table-responsive mb-4">
                <table className="table table-dark table-hover small border border-secondary border-opacity-10 align-middle">
                  <thead><tr className="table-dark"><th>Metric Title</th><th>Metric Description</th><th className="text-end">Action</th></tr></thead>
                  <tbody>{metricRows}</tbody>
                </table>
              </div>
              <div className="row g-2 mb-4">
                <div className="col-md-5"><input type="text" placeholder="E.g., 3+" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm" value={metricInput.title} onChange={e => setMetricInput({...metricInput, title: e.target.value})} /></div>
                <div className="col-md-5"><input type="text" placeholder="E.g., Years Coding" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm" value={metricInput.text} onChange={e => setMetricInput({...metricInput, text: e.target.value})} /></div>
                <div className="col-md-2 text-end">
                    <button type="button" className="btn btn-sm btn-info text-dark fw-bold px-3 w-100" onClick={() => {
                        saveProfileData({ ...profile, metrics: [...profile.metrics, metricInput] });
                        setMetricInput({ title: '', text: '' });
                    }}>Add Metric</button>
                </div>
              </div>

              <h6 className="fw-bold text-white mb-3 mt-5 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Certifications</h6>
              <div className="table-responsive mb-4">
                <table className="table table-dark table-hover small border border-secondary border-opacity-10 align-middle">
                  <thead><tr className="table-dark"><th>Certification Title</th><th>Issuer</th><th className="text-end">Action</th></tr></thead>
                  <tbody>{certRows}</tbody>
                </table>
              </div>
              <div className="row g-2 mb-4">
                <div className="col-md-5"><input type="text" placeholder="Certification Name" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm" value={certInput.title} onChange={e => setCertInput({...certInput, title: e.target.value})} /></div>
                <div className="col-md-5"><input type="text" placeholder="Issuer Name" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm" value={certInput.issuer} onChange={e => setCertInput({...certInput, issuer: e.target.value})} /></div>
                <div className="col-md-10 mt-2">
                    <input type="file" accept=".pdf" className="form-control text-white custom-input-dark bg-dark border-0 form-control-sm" onChange={e => setCertFile(e.target.files[0])} />
                    <small className="text-muted" style={{fontSize: '0.7rem'}}>Optional: Upload PDF credential</small>
                </div>
                <div className="col-md-2 mt-2 text-end align-self-end">
                    <button type="button" className="btn btn-sm btn-info text-dark fw-bold px-3 w-100" onClick={async () => {
                        let pdfUrl = '';
                        if (certFile) {
                            const formData = new FormData();
                            formData.append('certificate', certFile);
                            try {
                                const res = await axios.post('https://portfolio-mern-pvfn.vercel.app/api/upload-cert', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                                pdfUrl = res.data.url;
                            } catch(err) {
                                showMsg("PDF upload failed", "danger");
                                return;
                            }
                        }
                        saveProfileData({ ...profile, certifications: [...profile.certifications, { ...certInput, pdfUrl }] });
                        setCertInput({ title: '', issuer: '' });
                        setCertFile(null);
                    }}>Add Cert</button>
                </div>
              </div>

              <div className="col-12 text-end mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <button className="btn btn-info text-dark fw-bold px-4" onClick={() => saveProfileData(profile)}>Save General Content</button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Admin;