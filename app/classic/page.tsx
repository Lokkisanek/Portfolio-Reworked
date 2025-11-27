"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

const services = [
  {
    title: "Custom Web Design",
    description:
      "Unique, tailor-made website designs that reflect your brand and engage your audience.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Web Development",
    description:
      "Bringing designs to life with clean, efficient code and the latest web technologies.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </svg>
    ),
  },
  {
    title: "Responsive Design",
    description:
      "Ensuring your website looks and works perfectly on all devices – desktops, tablets, and mobiles.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
        />
      </svg>
    ),
  },
];

const skills = [
  {
    name: "HTML5",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "CSS3",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
];

const projects = [
  {
    title: "Project-Union",
    description:
      "A website made for my school that showcases student projects, facilitating discovery and collaboration.",
    image: "/resources/photos/project-union.png",
    href: "https://project-union.mzf.cz/index.html",
    direction: "left",
  },
  {
    title: "Project-Infinity",
    description:
      "My previous portfolio, exploring a unique visual style to present my skills and past work in an engaging manner.",
    image: "/resources/photos/project-infinity.png",
    href: "https://odehnalm.4fan.cz/mujweb/lost.html",
    direction: "right",
  },
  {
    title: "Nail studio",
    description:
      "My no-code project focused on creating a user-friendly platform for nail art enthusiasts.",
    image: "/resources/photos/nail_studio.png",
    href: "public_html/nail_studio/index.html",
    direction: "right",
  },
];

const socialLinks = [
  {
    href: "https://www.linkedin.com/in/matyas-odehnal/",
    label: "LinkedIn",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    href: "https://github.com/lokkisan",
    label: "GitHub",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/matyas.ode/",
    label: "Instagram",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

type FormStatus = "idle" | "submitting" | "success" | "error";
type FormState = { status: FormStatus; message: string };

const createEmptyFormState = (): FormState => ({ status: "idle", message: "" });

export default function ClassicPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(createEmptyFormState());

  const contactAction = useMemo(() => "https://formspree.io/f/mvgaldlv", []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const bodyEl = document.body;
    const color1 = { r: 224, g: 242, b: 254 };
    const color2 = { r: 254, g: 226, b: 226 };

    const updateGradient = (percentage: number) => {
      const baseAngle = 135;
      const angleVariation = 30;
      const currentAngle = baseAngle + Math.sin((percentage / 100) * Math.PI) * angleVariation;

      const baseStop = 60;
      const stopVariation = 20;
      const currentStop = Math.max(
        10,
        Math.min(90, baseStop + Math.sin((percentage / 100) * Math.PI * 1.5) * stopVariation)
      );

      bodyEl.style.backgroundImage = `linear-gradient(${currentAngle.toFixed(1)}deg, rgb(${color1.r},${color1.g},${color1.b}), rgb(${color2.r},${color2.g},${color2.b}) ${currentStop.toFixed(0)}%)`;
    };

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolledPercentage = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
        updateGradient(scrolledPercentage);
        ticking = false;
      });
    };

    updateGradient(0);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      bodyEl.style.backgroundImage = "";
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const elements = document.querySelectorAll<HTMLElement>(".scroll-animate");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setFormState({ status: "submitting", message: "" });

    try {
      const response = await fetch(contactAction, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Form submission failed");
      }

      await response.json();
      setFormState({ status: "success", message: "Message sent successfully!" });
      form.reset();
      const timeout = window.setTimeout(() => {
        setIsModalOpen(false);
        setFormState(createEmptyFormState());
        window.clearTimeout(timeout);
      }, 2500);
    } catch (error) {
      setFormState({
        status: "error",
        message:
          error instanceof Error ? error.message : "Something went wrong. Please try again or email me directly.",
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormState(createEmptyFormState());
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-700">
      <header className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 backdrop-blur-md shadow-sm bg-white/85">
        <div className="container mx-auto flex justify-between items-center">
          <a
            href="#home"
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
          >
            <span className="text-xl sm:text-2xl font-bold text-gray-800">Matyas Odehnal</span>
          </a>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
              <a
                href="#home"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors focus:outline-none focus:text-indigo-600 focus:underline"
              >
                Home
              </a>
              <a
                href="#services"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors focus:outline-none focus:text-indigo-600 focus:underline"
              >
                Services
              </a>
              <a
                href="#skills"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors focus:outline-none focus:text-indigo-600 focus:underline"
              >
                Skills
              </a>
              <a
                href="#portfolio"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors focus:outline-none focus:text-indigo-600 focus:underline"
              >
                Portfolio
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors focus:outline-none focus:text-indigo-600 focus:underline"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors focus:outline-none focus:text-indigo-600 focus:underline"
              >
                Contact
              </a>
              <Link href="/visual" className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors">
                Visual
              </Link>
            </nav>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 hidden sm:inline-block text-sm sm:text-base font-semibold"
            >
              Get a Quote
            </button>
            <div className="md:hidden">
              <button
                id="mobile-menu-button"
                aria-label="Open Menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-2 -mr-2"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          id="mobile-menu"
          className={`md:hidden absolute top-full left-0 right-0 mt-0.5 bg-white/95 backdrop-blur-sm shadow-lg py-2 z-40 ${
            mobileMenuOpen ? "" : "hidden"
          }`}
        >
          <div className="px-4 space-y-1 pb-3 pt-2">
            {["home", "services", "skills", "portfolio", "about", "contact"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className="block text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md px-3 py-2 font-medium focus:outline-none focus:bg-indigo-100 focus:text-indigo-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
            <Link
              href="/visual"
              className="block text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md px-3 py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Visual Portfolio
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="block mt-3 w-full bg-black text-white text-center px-4 py-2.5 rounded-md shadow-md hover:bg-gray-800 transition duration-150 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Get a Quote
            </button>
          </div>
        </div>
      </header>

      <main
        id="home"
        className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center pt-20 pb-16 md:pt-28 md:pb-24 lg:pt-36 lg:pb-28 relative z-10"
      >
        <div className="mb-6 sm:mb-8 scroll-animate fade-in-up">
          <div className="inline-block bg-indigo-400 p-3 sm:p-4 rounded-2xl shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 sm:h-10 sm:w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-serif-display font-bold text-gray-900 leading-tight scroll-animate fade-in-up"
          style={{ transitionDelay: "0.1s" }}
        >
          Crafting <em className="font-normal">Digital Experiences</em> That Convert.
        </h1>
        <p
          className="mt-6 text-md sm:text-lg md:text-xl text-gray-700 max-w-xl sm:max-w-2xl scroll-animate fade-in-up"
          style={{ transitionDelay: "0.2s" }}
        >
          Hi, I'm Matyas Odehnal. I build modern, responsive, and user-friendly websites that help businesses grow and achieve their online goals.
        </p>
        <div
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 scroll-animate fade-in-up"
          style={{ transitionDelay: "0.3s" }}
        >
          <a
            href="#portfolio"
            className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg shadow-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 text-lg font-semibold inline-flex items-center justify-center"
          >
            View My Work
          </a>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-indigo-500 text-white px-8 py-3 rounded-lg shadow-xl hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 text-lg font-semibold inline-flex items-center justify-center"
          >
            Let's Talk
          </button>
          <Link
            href="/visual"
            className="w-full sm:w-auto bg-white text-indigo-600 border border-indigo-200 px-8 py-3 rounded-lg shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 text-lg font-semibold inline-flex items-center justify-center"
          >
            Visual Portfolio
          </Link>
        </div>
        <div className="mt-10 sm:mt-12 lg:mt-16 text-center scroll-animate fade-in-up" style={{ transitionDelay: "0.4s" }}>
          <a
            href="#services"
            className="inline-flex flex-col items-center text-gray-600 hover:text-indigo-600 transition-colors group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md p-1"
          >
            <span className="text-sm mb-1 font-medium">Discover More</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </main>

      <section id="services" className="py-16 md:py-24 relative z-10 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif-display font-bold text-gray-900 mb-4 scroll-animate fade-in-up">
            My Services
          </h2>
          <p
            className="text-lg text-gray-600 mb-12 max-w-xl mx-auto scroll-animate fade-in-up"
            style={{ transitionDelay: "0.1s" }}
          >
            I offer a range of web development services to bring your vision to life.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="bg-gray-50 p-6 sm:p-8 rounded-lg shadow-lg text-left hover-card-scale scroll-animate fade-in-up"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="text-indigo-500 mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="py-16 md:py-24 relative z-10 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif-display font-bold text-gray-900 mb-4 scroll-animate fade-in-up">
            My Skills & Toolkit
          </h2>
          <p
            className="text-lg text-gray-600 mb-12 max-w-xl mx-auto scroll-animate fade-in-up"
            style={{ transitionDelay: "0.1s" }}
          >
            The technologies and tools I use to bring ideas to life.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover-card-scale scroll-animate fade-in-up"
                style={{ transitionDelay: `${0.1 + index * 0.05}s` }}
              >
                <img src={skill.icon} alt={`${skill.name} Icon`} className="w-12 h-12 sm:w-16 sm:h-16 mb-3" loading="lazy" />
                <h3 className="text-md sm:text-lg font-semibold text-gray-700">{skill.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif-display font-bold text-gray-900 mb-4 scroll-animate fade-in-up">
            My Recent Work
          </h2>
          <p
            className="text-lg text-gray-700 mb-12 max-w-xl mx-auto scroll-animate fade-in-up"
            style={{ transitionDelay: "0.1s" }}
          >
            Here are a few examples of projects I've worked on.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className={`bg-white rounded-xl shadow-xl overflow-hidden hover-card-scale scroll-animate fade-in-${project.direction}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="md:flex md:items-stretch">
                  <div className="md:w-1/2">
                    <Image
                      src={project.image}
                      alt={`${project.title} Screenshot`}
                      className="h-64 w-full object-cover md:h-full transition-transform duration-300"
                      width={640}
                      height={640}
                    />
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                    <p className="text-gray-600 mb-5 text-sm leading-relaxed">{project.description}</p>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block self-start bg-indigo-600 text-white px-5 py-2.5 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 text-sm font-semibold"
                    >
                      View Project <span aria-hidden="true" className="ml-1.5">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-16 md:py-24 relative z-10 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-serif-display font-bold text-gray-900 mb-12 text-center scroll-animate fade-in-up">
            About Me
          </h2>
          <div className="md:grid md:grid-cols-5 md:gap-12 items-center">
            <div className="md:col-span-2 mb-8 md:mb-0 text-center scroll-animate fade-in-left">
              <Image
                src="/resources/photos/me.JPG"
                alt="Photo of Matyas Odehnal"
                width={640}
                height={800}
                className="w-full max-w-xs mx-auto md:max-w-sm rounded-lg shadow-xl object-cover h-auto"
              />
            </div>
            <div className="md:col-span-3 text-lg text-gray-700 space-y-5 scroll-animate fade-in-right" style={{ transitionDelay: "0.1s" }}>
              <p className="text-2xl font-semibold text-gray-800">Hello! I'm Matyas Odehnal.</p>
              <p>
                A web developer from <strong className="text-indigo-600">Trebic, Czech Republic</strong>, I'm passionate about crafting digital solutions that are not just functional, but also intuitive and
                enjoyable to use.
              </p>
              <p>
                My journey into web development began with my fascination with technology. This spark ignited a continuous drive to master modern technologies like HTML, CSS, JavaScript, and frameworks such as React, Vue, Tailwind.
              </p>
              <p>
                I believe a great website is born from a blend of thoughtful design, clean, efficient code, and a genuine understanding of user needs. Whether it's a sleek portfolio, a dynamic e-commerce platform, or an informative business site, I approach each project with dedication and a commitment to delivering high-quality, impactful results.
              </p>
              <p>Beyond coding, I enjoy playing basketball and travelling.</p>
              <p>I'm always excited to connect and discuss how I can help bring your digital vision to life!</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 md:py-24 relative z-10 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif-display font-bold text-gray-900 mb-4 scroll-animate fade-in-up">
            Let's Build Something Together
          </h2>
          <p className="text-lg text-gray-700 mb-12 max-w-xl mx-auto scroll-animate fade-in-up" style={{ transitionDelay: "0.1s" }}>
            Have a project in mind or just want to discuss possibilities? I'd love to hear from you!
          </p>
          <div className="max-w-lg mx-auto space-y-8 scroll-animate fade-in-up" style={{ transitionDelay: "0.2s" }}>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Direct Email</h3>
              <p className="text-gray-600 mb-4">Feel free to send me an email directly:</p>
              <a
                href="mailto:odehnalm.08@spst.eu"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                odehnalm.08@spst.eu
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-sm font-medium text-gray-500">OR</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Send a Quick Message</h3>
              <p className="text-gray-600 mb-4">Prefer a form? Click below to send me your details.</p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
              >
                Get a Quote / Send Message
              </button>
            </div>
          </div>
          <div className="mt-16 scroll-animate fade-in-up" style={{ transitionDelay: "0.3s" }}>
            <p className="text-lg text-gray-700 mb-5">Connect with me on social media:</p>
            <div className="flex justify-center space-x-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-gray-500 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-gray-500 text-sm border-t border-gray-200 relative z-10">
        © {new Date().getFullYear()} Matyas Odehnal. All rights reserved.
      </footer>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-300 ease-out"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg relative transform transition-all duration-300 ease-out">
            <div className="flex justify-between items-center mb-6">
              <h3 id="modalTitle" className="text-2xl font-serif-display font-bold text-gray-900">
                Get in Touch
              </h3>
              <button
                aria-label="Close modal"
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
                onClick={closeModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form id="contactForm" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="modalName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="modalName"
                  required
                  autoComplete="name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <label htmlFor="modalEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="modalEmail"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="modalPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="modalPhone"
                  required
                  autoComplete="tel"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="+420 123 456 789"
                />
              </div>
              <div>
                <label htmlFor="modalMessage" className="block text-sm font-medium text-gray-700 mb-1">
                  How can I help you?
                </label>
                <textarea
                  name="message"
                  id="modalMessage"
                  rows={4}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Tell me about your project or inquiry..."
                />
              </div>
              <div className="mt-8 text-right flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                <button
                  type="button"
                  className="w-full sm:w-auto border border-gray-200 text-gray-600 px-6 py-3 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formState.status === "submitting"}
                  className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 font-semibold disabled:opacity-60"
                >
                  {formState.status === "submitting" ? "Sending..." : "Send Message"}
                </button>
              </div>
              {formState.status === "success" && (
                <div className="p-4 bg-green-100 text-green-700 rounded-md" role="alert">
                  {formState.message}
                </div>
              )}
              {formState.status === "error" && (
                <div className="p-4 bg-red-100 text-red-700 rounded-md" role="alert">
                  {formState.message}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
