import { useState, useRef } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const resultsRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setResume(file);
    }
  };
  const handleAnalyze = async () => {
    console.log("Analyze button clicked");
  if (!resume) {
    alert("Please upload your resume.");
    return;
  }

  if (!jobDescription.trim()) {
    alert("Please enter a job description.");
    return;
  }

  const formData = new FormData();

  formData.append("resume_file", resume);
  formData.append("job_description", jobDescription);
  console.log("Sending request to FastAPI...");
  try {

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/predict`,
      {
        method: "POST",
        body: formData
  }
);

    const data = await response.json();

      console.log(data);

      setResult(data);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100);

  } catch (error) {

    console.error("Error:", error);

    alert("Unable to connect to the backend.");

  }
};
  return (
    <div className= {`app ${darkMode ? "dark-mode" : ""}`}>

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          <div className="logo-icon">📄</div>
          <span>AI Resume Matching</span>
        </div>

        <div className="nav-links">
          <a href="#home" className="active">Home</a>
          <a href="#about">About</a>
          <a href="#how-it-works">How It Works</a>
          <button
  className="theme-button"
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "☀" : "☾"}
</button>
          <button className="get-started" onClick={() => {
    document.getElementById("get-started")?.scrollIntoView({
      behavior: "smooth"
    });
  }} >Get Started</button>
        </div>

      </nav>


      {/* Hero Section */}
      <main id="home">

        <section className="hero">

          <div className="hero-decoration left">
            Your Opportunity
            <br />
            Starts Here
          </div>

          <div className="hero-content">

            <h1>AI Resume Matching System</h1>

            <p>
              Upload your resume and paste the job description
              to find your best match using AI
            </p>

            <div className="features">

              <div className="feature">
                <span className="feature-icon blue">⚡</span>
                <span>AI Powered</span>
              </div>

              <div className="feature">
                <span className="feature-icon pink">🎯</span>
                <span>Skill Analysis</span>
              </div>

              <div className="feature">
                <span className="feature-icon green">▮</span>
                <span>Actionable Insights</span>
              </div>

            </div>

          </div>

          <div className="hero-decoration right">
            Better Resumes
            <br />
            Brighter Careers
          </div>

        </section>


        {/* Input Section */}
        <section  id="get-started" className="input-container">

          {/* Resume Upload */}
          <div className="input-card">

            <div className="card-heading">
              <div className="heading-icon upload-icon">
                ↑
              </div>

              <div>
                <h2>Upload Resume</h2>
                <p>Upload your resume in PDF or DOCX format</p>
              </div>
            </div>


            <label className="upload-area">

              <div className="upload-symbol">
                ↑
              </div>

              <h3>Drag and drop your resume here</h3>

              <span>or</span>

              <div className="choose-button">
                Choose File
              </div>

              <p>Supported formats: PDF, DOCX (Max 5 MB)</p>

              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                hidden
              />

            </label>


            {/* Selected file */}
            {resume && (
              <div className="selected-file">

                <div className="file-icon">
                  PDF
                </div>

                <div className="file-details">
                  <strong>{resume.name}</strong>
                  <span>
                    {(resume.size / 1024).toFixed(0)} KB
                  </span>
                </div>

                <div className="file-success">
                  ✓
                </div>

                <button
                  className="remove-file"
                  onClick={() => setResume(null)}
                >
                  ×
                </button>

              </div>
            )}

          </div>


          {/* Job Description */}
          <div className="input-card">

            <div className="card-heading">

              <div className="heading-icon job-icon">
                ▤
              </div>

              <div>
                <h2>Job Description</h2>
                <p>Paste the job description here</p>
              </div>

              <button className="sample-button">
                ▤ Sample JD
              </button>

            </div>


            <textarea
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
              placeholder="Paste the job description here..."
              maxLength={5000}
            />

            <div className="character-count">
              {jobDescription.length} / 5000 characters
            </div>

          </div>

        </section>


        {/* Analyze Button */}
        <div className="analyze-container">

          <button className="analyze-button"
            onClick={handleAnalyze}>
            ✨ Analyze Resume
            <span>→</span>
          </button>

        </div>
        {result && (
  <section  ref={resultsRef} className="results-section">

    <h2>Resume Analysis Result</h2>

    <div className="result-score">
       <div className="score-circle" style={{
    "--score": result.match_score
  }}>
        <div className="score-circle-inner">
          <strong>{result.match_score}%</strong>
          <span>Match</span>
        </div>
      </div>

      <div className="score-label">
        <span>Resume Match Score</span>
        <p>
          Based on skills, experience, and resume-job similarity
        </p>
      </div>
    </div>

    <div className="result-card">

      <div className="result-column">
        <h3>✓ Matched Skills</h3>

        <div className="skills-list">
          {result.matched_skills.map((skill, index) => (
            <span key={index} className="skill matched">
              {skill}
            </span>
          ))}
        </div>
      </div>


      <div className="result-column">
        <h3>✕ Missing Skills</h3>

        <div className="skills-list">
          {result.missing_skills.map((skill, index) => (
            <span key={index} className="skill missing">
              {skill}
            </span>
          ))}
        </div>
      </div>

    </div>

    <div className="experience-result">

      <p>
        Candidate Experience:
        <strong>
          {result.candidate_experience} years
        </strong>
      </p>

      <p>
        Required Experience:
        <strong>
          {result.required_experience} years
        </strong>
      </p>

    </div>
          <button
                className="analyze-again-button"
                onClick={() => {
                  setResult(null);
                  setResume(null);
                  setJobDescription("");

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }}
              >
                ↻ Analyze Another Resume
              </button>
  </section>
)}
      <section id="about" className="info-section">

        <h2>About the System</h2>

        <p>
          AI Resume Matching System helps candidates understand how closely
          their resume matches a specific job description.
        </p>

        <div className="info-points">
          <span>✓ Skill Analysis</span>
          <span>✓ Resume-JD Similarity</span>
          <span>✓ Experience Analysis</span>
          <span>✓ AI Match Score</span>
        </div>

      </section>    

      <section id="how-it-works" className="info-section">

  <h2>How It Works</h2>

  <div className="workflow">

    <div className="workflow-step">
      <strong>1</strong>
      <h3>Upload Resume</h3>
      <p>Upload your PDF or DOCX resume.</p>
    </div>

    <div className="workflow-step">
      <strong>2</strong>
      <h3>Enter Job Description</h3>
      <p>Provide the job requirements you want to match against.</p>
    </div>

    <div className="workflow-step">
      <strong>3</strong>
      <h3>AI Analysis</h3>
      <p>The system analyzes skills, similarity and experience.</p>
    </div>

    <div className="workflow-step">
      <strong>4</strong>
      <h3>Get Results</h3>
      <p>View your match score, matched skills and missing skills.</p>
    </div>

  </div>

</section> 


        {/* Bottom Features */}
        <section className="bottom-features">

          {/* Skill Gap */}

          <div className="bottom-feature">

            <div className="bottom-icon pink-icon">
              ⚠
            </div>

            <div>
              <h3>Skill Gap</h3>

              <p>
                {result
                  ? `${result.missing_skills.length} skills missing`
                  : "Skills missing from your resume"}
              </p>
            </div>

          </div>


          {/* Experience Gap */}

          <div className="bottom-feature">

            <div className="bottom-icon purple-icon">
              ◷
            </div>

            <div>
              <h3>Experience Gap</h3>

              <p>
                {result
                  ? `${result.candidate_experience} / ${result.required_experience} years`
                  : "Candidate vs required experience"}
              </p>
            </div>

          </div>


          {/* Resume Strengths */}

          <div className="bottom-feature">

            <div className="bottom-icon green-icon">
              ✓
            </div>

            <div>
              <h3>Resume Strengths</h3>

              <p>
                {result
                  ? `${result.matched_skills.length} skills matched`
                  : "Your strongest matching skills"}
              </p>
            </div>

          </div>


          {/* Improvement Tips */}

          <div className="bottom-feature">

            <div className="bottom-icon yellow-icon">
              💡
            </div>

            <div>
              <h3>Improvement Tips</h3>

              <p>
                {result
                  ? result.missing_skills.length > 0
                    ? `Consider adding ${result.missing_skills[0]}`
                    : "Your skills match the requirements"
                  : "Suggestions to improve your resume"}
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;