import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "./SectionLabel";
import { Reveal } from "./Reveal";
import { projects, type Project } from "@/data/projects";

const filterOptions = ["All", "Branding Design", "Packaging", "Campaign"];

export function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter((p) => p.tags.includes(activeFilter));

  const currentProject = projects.find((p) => p.id === selectedProjectId);
  const currentIndex = projects.findIndex((p) => p.id === selectedProjectId);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProjectId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProjectId]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProjectId(null);
      } else if (e.key === "ArrowLeft" && selectedProjectId) {
        prevProject();
      } else if (e.key === "ArrowRight" && selectedProjectId) {
        nextProject();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProjectId, currentIndex]);

  const openProjectModal = (project: Project) => {
    setSelectedProjectId(project.id);
  };

  const closeProjectModal = () => {
    setSelectedProjectId(null);
  };

  const nextProject = () => {
    if (projects.length <= 1) return;
    const nextIdx = (currentIndex + 1) % projects.length;
    setSelectedProjectId(projects[nextIdx].id);
    document.querySelector(".devopus-modal-overlay")?.scrollTo({ top: 0, behavior: "instant" });
  };

  const prevProject = () => {
    if (projects.length <= 1) return;
    const prevIdx = (currentIndex - 1 + projects.length) % projects.length;
    setSelectedProjectId(projects[prevIdx].id);
    document.querySelector(".devopus-modal-overlay")?.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <section id="work" className="portfolio section-pad">
      <div className="shell">
        <SectionLabel index="04">Selected Work</SectionLabel>

        {/* DevOpus Style Section Heading */}
        <div className="devopus-head">
          <Reveal>
            <div className="devopus-title-box">
              <p className="kicker">Case studies &amp; Identity systems</p>
              <h2>Branding Design</h2>
              <div className="devopus-gradient-line" aria-hidden="true" />
            </div>
          </Reveal>

          {/* Controls Bar: Category Filter Pills */}
          <div className="devopus-controls-bar">
            {/* Category Filter Pills */}
            <div className="devopus-filters" role="tablist" aria-label="Portfolio filters">
              {filterOptions.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === f}
                  className={`devopus-filter-btn ${activeFilter === f ? "active" : ""}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4-Column DevOpus Grid View */}
        <div className="devopus-grid" role="list">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              role="listitem"
              className="devopus-card"
              onClick={() => openProjectModal(project)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openProjectModal(project);
                }
              }}
              tabIndex={0}
              aria-label={`Open case study for ${project.title}`}
            >
              <div className="devopus-card-media">
                <img
                  src={project.cover}
                  alt={`${project.title} cover preview`}
                  loading="lazy"
                />
                <div className="devopus-card-overlay" />

                {/* DevOpus Hover Title (bsp-hover) */}
                <div className="devopus-card-hover">
                  <span className="devopus-tag">{project.category}</span>
                  <h3 className="devopus-card-title">{project.title}</h3>
                  <div className="devopus-card-action">
                    <span>View Case Study</span>
                    <ArrowUpRight />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* DEVOPUS-STYLE FULL-SCREEN CASE STUDY POPUP LAYER (MOUNTED TO BODY) */}
      {mounted && currentProject && createPortal(
        <div
          className="devopus-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={currentProject.title}
          onClick={closeProjectModal}
        >
          {/* Top Right Close Button */}
          <button
            type="button"
            className="devopus-modal-close"
            onClick={closeProjectModal}
            aria-label="Close case study"
          >
            <X />
          </button>

          {/* Previous / Next buttons only when more than 1 project exists */}
          {projects.length > 1 && (
            <>
              <button
                type="button"
                className="devopus-modal-nav devopus-nav-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  prevProject();
                }}
                aria-label="Previous project"
              >
                <span className="devopus-nav-circle">
                  <ChevronLeft />
                </span>
                <span className="devopus-nav-label">Previous</span>
              </button>

              <button
                type="button"
                className="devopus-modal-nav devopus-nav-next"
                onClick={(e) => {
                  e.stopPropagation();
                  nextProject();
                }}
                aria-label="Next project"
              >
                <span className="devopus-nav-circle">
                  <ChevronRight />
                </span>
                <span className="devopus-nav-label">Next</span>
              </button>
            </>
          )}

          {/* Modal Container Card */}
          <div
            className="devopus-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Hero Image (1.jpg) */}
            <div className="devopus-modal-hero">
              <img
                src={currentProject.heroImg || currentProject.cover}
                alt={`${currentProject.title} hero mockup`}
              />
            </div>

            {/* Case Study Content Body */}
            <div className="devopus-modal-body">
              {/* Project Headline */}
              <h2 className="devopus-modal-title">
                {currentProject.heroHeadline}
              </h2>

              {/* Two-Column Info: Brand Objective & Our Role */}
              <div className="devopus-modal-info-grid">
                <div className="devopus-modal-col">
                  <h3>Brand Objective</h3>
                  <p>{currentProject.objective}</p>
                </div>

                <div className="devopus-modal-col">
                  <h3>Our Role</h3>
                  <div className="devopus-role-tags">
                    {currentProject.role.map((item) => (
                      <span key={item} className="devopus-role-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Presentation Gallery Stream (2.jpg to 8.jpg) */}
              <div className="devopus-modal-gallery">
                {currentProject.slides.slice(1).map((slide) => (
                  <figure
                    key={slide.src}
                    className="devopus-gallery-item"
                  >
                    <img
                      src={slide.src}
                      alt={slide.alt}
                    />
                  </figure>
                ))}
              </div>

              {/* Modal Footer Call To Action */}
              <div className="devopus-modal-foot">
                <div>
                  <small>BEYOND® / STUDIO</small>
                  <h4>Ready to build your distinctive brand?</h4>
                </div>
                <div className="devopus-modal-actions">
                  <a
                    href="#contact"
                    className="devopus-btn-start-project"
                    onClick={() => {
                      closeProjectModal();
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Start a project <ArrowUpRight />
                  </a>
                  <button
                    type="button"
                    className="devopus-btn-close-showcase"
                    onClick={closeProjectModal}
                  >
                    Close Showcase
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
