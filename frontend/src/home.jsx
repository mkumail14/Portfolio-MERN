import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);

  const [contactForm, setContactForm] = useState({ name: '', email: '', text: '' });
  const [formStatus, setFormStatus] = useState({ text: '', type: '' });

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await axios.post('https://portfolio-mern-pvfn.vercel.app/api/visits', {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language
        });
      } catch (err) {
        console.warn("Analytics tracking failed", err);
      }
    };
    trackVisit();
  }, []);

  useEffect(() => {
    Promise.all([
      axios.get('https://portfolio-mern-pvfn.vercel.app/api/profile'),
      axios.get('https://portfolio-mern-pvfn.vercel.app/api/projects')
    ])
    .then(([profileRes, projectsRes]) => {
      setProfile(profileRes.data);
      if (projectsRes.data && projectsRes.data.length > 0) {
        setProjects(projectsRes.data);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.error("Server connection failed. Triggering offline protocol.", err);
      setServerError(true);
      setLoading(false);
    });
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    axios.post('https://portfolio-mern-pvfn.vercel.app/api/contact', contactForm)
      .then(() => {
        setFormStatus({ text: "Message sent successfully!", type: "success" });
        setContactForm({ name: '', email: '', text: '' });
      })
      .catch(() => {
        setFormStatus({ text: "Failed to connect to server. Check backend port 5000.", type: "danger" });
      });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#0b0f19' }}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Booting UI Engine...</span>
        </div>
      </div>
    );
  }

  if (serverError) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center p-4" style={{ backgroundColor: '#0b0f19', color: '#f3f4f6', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div className="rounded-circle d-flex justify-content-center align-items-center mb-4" style={{ width: '100px', height: '100px', backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.2)' }}>
           <i className="bi bi-hdd-network text-danger" style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px rgba(220,53,69,0.5))' }}></i>
        </div>
        <h1 className="fw-bold tracking-tight mb-3 text-white">System Offline</h1>
        <p className="text-secondary mb-5" style={{ maxWidth: '450px', lineHeight: '1.6' }}>
          The Database or Server is currently unreachable or undergoing scheduled maintenance. Please stand by and try again shortly.
        </p>
        <button onClick={() => window.location.reload()} className="btn btn-outline-info rounded-3 px-4 py-2 fw-bold">
          <i className="bi bi-arrow-clockwise me-2"></i>Initiate Reconnection
        </button>
      </div>
    );
  }

  // Fallbacks
  const displayName = profile?.bio?.name || "Mohammad Kumail Asghar";
  const displayTitle = profile?.bio?.title || "Junior Computer Science Student";
  const displayBio = profile?.bio?.summary || "Computer Science student at SZABIST with a genuine interest in building efficient software and understanding modern cloud infrastructure. I enjoy working on problems across web development, mobile applications, and secure networking.";
  
  const displayGithub = profile?.bio?.github || "https://github.com/mkumail14";
  const displayLinkedin = profile?.bio?.linkedin || "https://www.linkedin.com/in/kumail14/";
  const displayEmail = profile?.bio?.email || "mkumail7860@gmail.com";
  const displayLocation = profile?.bio?.location || "PECHS, Karachi, Pakistan";

  const displayStatus = profile?.status || "Available for New Opportunities";
  const displayHeroHeading = profile?.heroHeading || "Crafting Digital <br /><span style=\"background: linear-gradient(90deg, #0dcaf0, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;\">Experiences</span>";
  const displayContactText = profile?.contactText || "Have an opening, an interesting project framework suggestion, or want to discuss full-stack or security challenges? Send a message directly into my database cluster console.";

  const metrics = (profile?.metrics && profile.metrics.length > 0) ? profile.metrics : [
    // { title: "3+", text: "Years Coding" },
    // { title: "15+", text: "Projects Built" },
    // { title: "3.08", text: "Major CGPA" }
  ];

  const certifications = (profile?.certifications && profile.certifications.length > 0) ? profile.certifications : [
    // { title: "AWS Academy Graduate: Cloud Foundations", issuer: "AWS Academy" },
    // { title: "Web & Mobile App Development", issuer: "Saylani Mass IT Training Program (SMIT)" },
    // { title: "Career Essentials in Software Development", issuer: "Microsoft & LinkedIn" }
  ];

  const education = (profile?.education && profile.education.length > 0) ? profile.education : [
    // { institution: "SZABIST", degree: "BS Computer Science", timeline: "2021 - 2025", details: "Major CGPA: 3.08" }
  ];

  const experience = (profile?.experience && profile.experience.length > 0) ? profile.experience : [
    // { company: "Tech Startup", role: "Software Engineer Intern", timeline: "2023 - Present", description: "Built full-stack React and Node applications." }
  ];

  const skillsData = profile?.skills || {
    // languages: ["JavaScript", "Python", "Java"],
    // frameworks: ["React", "Node.js", "Express", "Bootstrap"],
    // databases: ["MongoDB", "SQL"],
    // tools: ["Git", "Docker", "AWS", "Postman"]
  };

  
  let initials = 'MKA';


  const metricWidgets = [];
  for (let i = 0; i < metrics.length; i++) {
    const stat = metrics[i];
    metricWidgets.push(
      <div className="col-4 col-md-3" key={i}>
        <div className="p-3 glass-card">
          <h3 className="fw-bold text-white m-0 h4">{stat.title}</h3>
          <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{stat.text}</span>
        </div>
      </div>
    );
  }

  const projectCards = [];
  if (Array.isArray(projects) && projects.length > 0) {
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      const techBadges = [];
      if (Array.isArray(project.techStack)) {
          for (let j = 0; j < project.techStack.length; j++) {
            techBadges.push(
              <span key={j} className="badge bg-dark text-info border border-info-subtle px-2 py-1" style={{ fontSize: '0.75rem' }}>{project.techStack[j]}</span>
            );
          }
      }

      projectCards.push(
        <div className="col-md-6" key={project._id}>
          <div className="card h-100 p-4 glass-card border-0 bg-transparent">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h4 className="h5 fw-bold text-white m-0">{project.title}</h4>
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-secondary hover-info fs-5">
                  <i className="bi bi-github"></i>
                </a>
              )}
            </div>
            <p className="text-secondary small flex-grow-1" style={{ lineHeight: '1.5' }}>{project.description}</p>
            <div className="d-flex flex-wrap gap-1 mt-3">
              {techBadges}
            </div>
          </div>
        </div>
      );
    }
  } else {
    // projectCards.push(<p key="no-proj" className="text-muted small ps-3">DB Error or Empty array.</p>);
  }

  const certWidgets = [];
  for (let i = 0; i < certifications.length; i++) {
    const cert = certifications[i];
    certWidgets.push(
      <div className="col-md-4" key={i}>
        <div className="p-3 glass-card d-flex flex-column gap-2 h-100">
          <div className="d-flex align-items-start gap-3">
            <i className="bi bi-patch-check-fill text-info fs-4"></i>
            <div>
              <h6 className="text-white fw-bold m-0 small">{cert.title}</h6>
              <span className="text-muted d-block mt-1" style={{ fontSize: '0.75rem' }}>{cert.issuer}</span>
            </div>
          </div>
          {cert.pdfUrl && (
            <a href={cert.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info mt-auto align-self-start" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-file-earmark-pdf me-1"></i> View Certificate
            </a>
          )}
        </div>
      </div>
    );
  }

  const eduWidgets = [];
  for (let i = 0; i < education.length; i++) {
    const edu = education[i];
    eduWidgets.push(
      <div className="col-md-6" key={i}>
        <div className="p-4 rounded-4 h-100 transition-card" style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="fw-bold text-white m-0">{edu.institution}</h5>
            <span className="badge bg-dark text-info border border-info-subtle px-2 py-1" style={{ fontSize: '0.75rem' }}>{edu.timeline}</span>
          </div>
          <h6 className="text-info small mb-3">{edu.degree}</h6>
          {edu.details && <p className="text-secondary small m-0" style={{ lineHeight: '1.5' }}>{edu.details}</p>}
        </div>
      </div>
    );
  }

  const expWidgets = [];
  for (let i = 0; i < experience.length; i++) {
    const exp = experience[i];
    expWidgets.push(
      <div className="col-md-6" key={i}>
        <div className="p-4 glass-card h-100">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="fw-bold text-white m-0">{exp.company}</h5>
            <span className="badge bg-dark text-info border border-info-subtle px-2 py-1" style={{ fontSize: '0.75rem' }}>{exp.timeline}</span>
          </div>
          <h6 className="text-info small mb-3">{exp.role}</h6>
          {exp.description && <p className="text-secondary small m-0" style={{ lineHeight: '1.5' }}>{exp.description}</p>}
        </div>
      </div>
    );
  }

  const skillWidgets = [];
  const skillCats = Object.keys(skillsData);
  for (let i = 0; i < skillCats.length; i++) {
    const cat = skillCats[i];
    if (skillsData[cat] && skillsData[cat].length > 0) {
      const pillWidgets = [];
      for (let j = 0; j < skillsData[cat].length; j++) {
        pillWidgets.push(
          <span key={j} className="badge bg-dark text-white border border-secondary border-opacity-25 px-3 py-2" style={{ fontSize: '0.85rem' }}>{skillsData[cat][j]}</span>
        );
      }
      skillWidgets.push(
        <div className="col-md-6" key={cat}>
          <div className="p-4 glass-card h-100">
            <h5 className="fw-bold text-info text-capitalize mb-3">{cat}</h5>
            <div className="d-flex flex-wrap gap-2">
              {pillWidgets}
            </div>
          </div>
        </div>
      );
    }
  }

  // Developer mock skills
  const devSkills = profile?.skills?.frameworks?.length > 0 ? profile.skills.frameworks : ['React', 'Node.js', 'MongoDB'];
  let devSkillsStr = '';
  for(let i=0; i<devSkills.length; i++) {
      devSkillsStr += `<span class="text-success">'${devSkills[i]}'</span>`;
      if (i < devSkills.length - 1) devSkillsStr += ', ';
  }

  return (
    <div className="min-vh-100">
      
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top py-3 glass-nav">
        <div className="container">
          <a className="navbar-brand fw-bold tracking-tight text-white d-flex align-items-center" href="#">
            <span className="text-info me-2">&lt;/&gt;</span> {initials}.dev
          </a>
          <div className="ms-auto d-flex align-items-center gap-3">
            <a href="#projects" className="nav-link text-secondary small d-none d-sm-block hover-white">Projects</a>
            <a href="#skills" className="nav-link text-secondary small d-none d-sm-block hover-white">Skills</a>
            <a href="#education" className="nav-link text-secondary small d-none d-sm-block hover-white">Education</a>
            <a href="#experience" className="nav-link text-secondary small d-none d-sm-block hover-white">Experience</a>
            <a href="#certifications" className="nav-link text-secondary small d-none d-sm-block hover-white">Certifications</a>
            <a href="#contact" className="nav-link text-secondary small d-none d-sm-block hover-white">Contact</a>
            <a href={displayGithub} target="_blank" rel="noreferrer" className="text-secondary fs-5 ms-2 hover-white"><i className="bi bi-github"></i></a>
            <a href={displayLinkedin} target="_blank" rel="noreferrer" className="text-secondary fs-5 hover-white"><i className="bi bi-linkedin"></i></a>
          </div>
        </div>
      </nav>

      <header className="container py-5 my-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-7">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4" style={{ backgroundColor: 'rgba(13, 202, 240, 0.1)', border: '1px solid rgba(13, 202, 240, 0.2)' }}>
              <span className="d-inline-block rounded-circle bg-info dynamic-pulse" style={{ width: '8px', height: '8px' }}></span>
              <span className="text-info small fw-semibold tracking-wide" style={{ fontSize: '0.8rem' }}>{displayStatus}</span>
            </div>
            
            <h1 className="display-3 fw-bold text-white mb-3 tracking-tight" style={{ lineHeight: '1.1' }} dangerouslySetInnerHTML={{__html: displayHeroHeading}}>
            </h1>
            
            <p className="text-secondary fs-5 mb-4" style={{ lineHeight: '1.6', maxWidth: '620px' }}>
              {displayBio}
            </p>
            
            <div className="d-flex flex-wrap gap-3 mb-5">
              {/* <a href="#projects" className="btn btn-info text-dark fw-bold px-4 py-2 shadow-lg rounded-3">
                View Work <i className="bi bi-arrow-right ms-2"></i>
              </a> */}
              <a href={profile?.resumeUrl || "/Kumail_Asghar_Resume.pdf"} target="_blank" rel="noreferrer" className="btn btn-info fw-bold px-4 py-2 rounded-3 shadow-lg">
                Resume <i className="bi bi-download ms-2"></i>
              </a>
            </div>

            <div className="row g-3">
              {metricWidgets}
            </div>
          </div>

          <div className="col-lg-5 position-relative mt-5 mt-lg-0">
            {profile?.profilePicUrl ? (
              <div className="profile-frame-container">
                <div className="glow-ring"></div>
                <div className="profile-frame">
                  <img src={profile.profilePicUrl} alt={displayName} className="profile-img" />
                </div>
                <div className="floating-code d-none d-md-block glass-card overflow-hidden shadow-lg">
                  <div className="d-flex align-items-center px-3 py-2 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <div className="d-flex gap-1.5 me-3">
                      <span className="rounded-circle bg-danger d-inline-block" style={{ width: '8px', height: '8px' }}></span>
                      <span className="rounded-circle bg-warning d-inline-block mx-1" style={{ width: '8px', height: '8px' }}></span>
                      <span className="rounded-circle bg-success d-inline-block" style={{ width: '8px', height: '8px' }}></span>
                    </div>
                    <span className="text-muted small font-monospace" style={{ fontSize: '0.7rem' }}>developer.js</span>
                  </div>
                  <div className="p-3 font-monospace small" style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '0.75rem' }}>
                    <div><span className="text-info">const</span> <span className="text-warning">dev</span> = &#123;</div>
                    <div className="ps-3">name: <span className="text-success">'{displayName.split(' ')[0]}'</span>,</div>
                    <div className="ps-3">status: <span className="text-success">'active'</span></div>
                    <div>&#125;;</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-100 glass-card overflow-hidden shadow-lg">
                <div className="d-flex align-items-center px-3 py-2 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                  <div className="d-flex gap-1.5 me-3">
                    <span className="rounded-circle bg-danger d-inline-block" style={{ width: '10px', height: '10px' }}></span>
                    <span className="rounded-circle bg-warning d-inline-block mx-1" style={{ width: '10px', height: '10px' }}></span>
                    <span className="rounded-circle bg-success d-inline-block" style={{ width: '10px', height: '10px' }}></span>
                  </div>
                  <span className="text-muted small font-monospace" style={{ fontSize: '0.75rem' }}>💻 developer.js</span>
                </div>
                <div className="p-4 font-monospace small" style={{ color: '#9ca3af', lineHeight: '1.7' }}>
                  <div><span className="text-info">const</span> <span className="text-warning">developer</span> = &#123;</div>
                  <div className="ps-4">name: <span className="text-success">'{displayName}'</span>,</div>
                  <div className="ps-4">role: <span className="text-success">'{displayTitle}'</span>,</div>
                  <div className="ps-4">skills: [<span dangerouslySetInnerHTML={{__html: devSkillsStr}}></span>],</div>
                  <div className="ps-4">status: <span className="text-success">'{displayStatus}'</span></div>
                  <div>&#125;;</div>
                  <div className="mt-3"><span className="text-info">export default</span> <span className="text-warning">developer</span>;</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
{projectCards.length !== 0 && (

      <section id="projects" className="container py-5 border-top" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <h2 className="fw-bold text-white mb-4"><span className="text-info">#</span> Engineering Showroom</h2>
        <div className="row g-4">
          {projectCards}
        </div>
      </section>
)}


      <section id="skills" className="container py-5 border-top" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <h2 className="fw-bold text-white mb-4"><span className="text-info">#</span> Technical Arsenal</h2>
        <div className="row g-4">
          {skillWidgets}
        </div>
      </section>

{eduWidgets.length !== 0 && (


      <section id="education" className="container py-5 border-top" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <h2 className="fw-bold text-white mb-4"><span className="text-info">#</span> Academic Background</h2>
        <div className="row g-4">
          {eduWidgets}
        </div>
      </section>
)}
{expWidgets.length !== 0 && (
        <section id="experience" className="container py-5 border-top" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <h2 className="fw-bold text-white mb-4"><span className="text-info">#</span> Professional Experience</h2>
        <div className="row g-4">
          {expWidgets}
        </div>
      </section>
)}
      <section id="certifications" className="container py-5 border-top" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <h2 className="fw-bold text-white mb-4"><span className="text-info">#</span> Professional Certifications</h2>
        <div className="row g-3">
          {certWidgets}
        </div>
      </section>

      <section id="contact" className="container py-5 my-5 border-top" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="row g-5 justify-content-between">
          <div className="col-lg-5">
            <h2 className="fw-bold text-white mb-3"><span className="text-info">#</span> Let's Connect</h2>
            <p className="text-secondary small mb-4" style={{ lineHeight: '1.6' }}>
              {displayContactText}
            </p>
            <div className="d-flex flex-column gap-2 text-secondary small">
              <div><i className="bi bi-envelope text-info me-2"></i> {displayEmail}</div>
              <div><i className="bi bi-geo-alt text-info me-2"></i> {displayLocation}</div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="p-4 glass-card">
              {formStatus.text && (
                <div className={`alert alert-${formStatus.type} small p-2 mb-3`}>{formStatus.text}</div>
              )}
              <form onSubmit={handleContactSubmit}>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">Your Name</label>
                  <input type="text" className="form-control text-white custom-input-dark" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} placeholder="Ali" required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">Email Address</label>
                  <input type="email" className="form-control text-white custom-input-dark" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} placeholder="ali@example.com" required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">Message Body</label>
                  <textarea rows="4" className="form-control text-white custom-input-dark" value={contactForm.text} onChange={e => setContactForm({...contactForm, text: e.target.value})} placeholder="Hey Kumail, let's talk about a project ..." required></textarea>
                </div>
                <button type="submit" className="btn btn-info text-dark fw-bold w-100 py-2 rounded-3">
                  Transmit Message <i className="bi bi-send-fill ms-1"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="glass-nav border-top-0 mt-5 py-4 text-center text-secondary small">
        <p className="mb-0">© 2026 MKA • Engineered & Designed by Mohammad Kumail</p>
      </footer>
    </div>
  );
}

export default Home;