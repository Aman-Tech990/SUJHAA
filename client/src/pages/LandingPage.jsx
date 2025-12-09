import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Autoplay from "embla-carousel-autoplay"
import carousel3 from '../assets/carousel3.webp'
import carousel2 from '../assets/carousel2.webp'
import carousel1 from '../assets/carousel1.webp'
import thumbnail from '../assets/thumbnail.webp'
import {
  Building2,
  GraduationCap,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  FileText,
  Landmark,
  Menu,
  Play,
} from 'lucide-react';
// Shadcn UI Component Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
import ChatWidget from './ChatWidget';

// --- Configuration & Data ---

const SITE_CONFIG = {
  title: "PM-AJAY",
  fullName: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana",
  primaryColor: "blue",
  secondaryColor: "amber"
};

const HERO_SLIDES = [
  { id: 1, image: carousel1 },
  { id: 2, image: "https://pmajay.dosje.gov.in/public/uploads/banner/89771741176639.jpg" },
  { id: 3, image: carousel2 },
  { id: 4, image: "https://grant-in-aid.upscfdc.in/assets/banner1.webp" },
  { id: 5, image: carousel3 },
];

const PILLARS = [
  {
    icon: Briefcase,
    keyTitle: "pillar_income_title",
    keyDesc: "pillar_income_desc",
  },
  {
    icon: GraduationCap,
    keyTitle: "pillar_skill_title",
    keyDesc: "pillar_skill_desc",
  },
  {
    icon: Building2,
    keyTitle: "pillar_infra_title",
    keyDesc: "pillar_infra_desc",
  }
];

const STEPS = [
  { id: 1, keyTitle: "step_1_title", keyDesc: "step_1_desc", icon: FileText },
  { id: 2, keyTitle: "step_2_title", keyDesc: "step_2_desc", icon: FileText },
  { id: 3, keyTitle: "step_3_title", keyDesc: "step_3_desc", icon: CheckCircle2 },
  { id: 4, keyTitle: "step_4_title", keyDesc: "step_4_desc", icon: Landmark },
];

// --- Components ---

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const current = i18n.language?.slice(0, 2) || "en";

  const btnBase =
    "px-2 py-1 text-xs rounded-full border transition-all hover:border-orange-400 hover:text-orange-600";

  return (
    <div className="flex items-center gap-1 ml-2">
      <span className="hidden md:inline text-[11px] text-slate-500 mr-1">
        🌐
      </span>
      <button
        onClick={() => i18n.changeLanguage("en")}
        className={`${btnBase} ${current === "en" ? "bg-orange-50 border-orange-500 text-orange-700" : "border-slate-200 text-slate-500"}`}
      >
        EN
      </button>
      <button
        onClick={() => i18n.changeLanguage("hi")}
        className={`${btnBase} ${current === "hi" ? "bg-orange-50 border-orange-500 text-orange-700" : "border-slate-200 text-slate-500"}`}
      >
        हिंदी
      </button>
      <button
        onClick={() => i18n.changeLanguage("od")}
        className={`${btnBase} ${current === "od" ? "bg-orange-50 border-orange-500 text-orange-700" : "border-slate-200 text-slate-500"}`}
      >
        ଓଡ଼ିଆ
      </button>
    </div>
  );
};

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="top-0 z-50 w-full border-b bg-white/95">
      <div className="container mx-auto flex h-23 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold">
            <img
              src="https://pmajay.dosje.gov.in/public/latest/images/logo.png"
              alt="PM-AJAY"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-900 leading-tight">
              {t("app_name")}
            </h2>
            <p className="text-md text-muted-foreground hidden md:block">
              {t("slogan")}
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#about"
            className="text-lg font-medium hover:text-blue-700 transition-colors"
          >
            {t("nav_about")}
          </a>
          <a
            href="#pillars"
            className="text-lg font-medium hover:text-blue-700 transition-colors"
          >
            {t("nav_pillars")}
          </a>
          <a
            href="#process"
            className="text-lg font-medium hover:text-blue-700 transition-colors"
          >
            {t("nav_process")}
          </a>
          <Link to="/login">
            <Button className="bg-orange-400 text-lg hover:text-amber-300 hover:cursor-pointer hover:bg-blue-900">
              {t("nav_login")}
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-orange-400 text-lg cursor-pointer hover:bg-blue-900 hover:text-amber-300">
              {t("nav_register")}
            </Button>
          </Link>

          <LanguageSwitcher />
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <a href="#about" className="text-lg font-medium">
                  {t("nav_about")}
                </a>
                <a href="#pillars" className="text-lg font-medium">
                  {t("nav_pillars")}
                </a>
                <a href="#process" className="text-lg font-medium">
                  {t("nav_process")}
                </a>
                <Link to="/login">
                  <Button className="w-full bg-blue-800">
                    {t("nav_login")}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full bg-orange-500">
                    {t("nav_register")}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

const HeroCarousel = () => {
  return (
    <section className="relative w-full bg-slate-900">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent>
          {HERO_SLIDES.map((slide) => (
            <CarouselItem key={slide.id} className="relative h-[50vh] w-full">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${slide.image}')` }}
              >
                <div className="absolute inset-0 to-transparent" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 border-white/20 bg-black/20 text-white hover:bg-black/40 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 border-white/20 bg-black/20 text-white hover:bg-black/40 hidden md:flex" />
      </Carousel>
    </section>
  );
};

const SchemeCategories = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const categories = [
    {
      title: "Skill Development & Employment",
      desc: "Training, job skills, support",
      image: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png",
      bg: "bg-indigo-100/50",
      border: "border-indigo-200",
    },
    {
      title: "Education & Learning",
      desc: "Smart classrooms, libraries",
      image: "https://cdn-icons-png.flaticon.com/128/3976/3976625.png",
      bg: "bg-red-100/50",
      border: "border-red-200",
    },
    {
      title: "Health & Wellness",
      desc: "Health camps, medical equipment",
      image: "https://cdn-icons-png.flaticon.com/128/2966/2966334.png",
      bg: "bg-emerald-100/50",
      border: "border-emerald-200",
    },
    {
      title: "Social Welfare & Empowerment",
      desc: "Community centres, support",
      image: "https://cdn-icons-png.flaticon.com/128/4542/4542031.png",
      bg: "bg-rose-100/50",
      border: "border-rose-200",
    },
    {
      title: "Infrastructure & Community Assets",
      desc: "Roads, lights, community halls",
      image: "https://cdn-icons-png.flaticon.com/128/619/619034.png",
      bg: "bg-slate-200/50",
      border: "border-slate-300",
    },
    {
      title: "Livelihood & Entrepreneurship",
      desc: "Small business, income generation",
      image: "https://cdn-icons-png.flaticon.com/128/2910/2910768.png",
      bg: "bg-amber-100/50",
      border: "border-amber-200",
    },
    {
      title: "Agriculture & Rural Development",
      desc: "Irrigation, vermicompost, farms",
      image: "https://cdn-icons-png.flaticon.com/128/1188/1188077.png",
      bg: "bg-green-100/50",
      border: "border-green-200",
    },
    {
      title: "Water, Sanitation & Hygiene",
      desc: "Drinking water, toilets",
      image: "https://cdn-icons-png.flaticon.com/128/2829/2829802.png",
      bg: "bg-cyan-100/50",
      border: "border-cyan-200",
    },
    {
      title: "Hostels & Residential Facilities",
      desc: "Student hostels, working women",
      image: "https://cdn-icons-png.flaticon.com/128/263/263115.png",
      bg: "bg-violet-100/50",
      border: "border-violet-200",
    },
    {
      title: "Women & Youth Development",
      desc: "Safety, sports, self-help groups",
      image: "https://cdn-icons-png.flaticon.com/128/4140/4140047.png",
      bg: "bg-pink-100/50",
      border: "border-pink-200",
    }
  ];

  const handleCardClick = () => {
    navigate('/login');
  };

  return (
    <section className="py-20 relative bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#3b82f6 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {t("categories_title")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-green-500">
              {t("categories_highlight")}
            </span>
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-green-500 mx-auto rounded-full mt-6" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {categories.map((item, index) => (
            <div
              key={index}
              onClick={handleCardClick}
              className={`
                group cursor-pointer flex flex-col items-center text-center p-6 rounded-[2rem] 
                transition-all duration-500 ease-out
                bg-white/80 backdrop-blur-sm border-2 ${item.border} hover:border-blue-200
                shadow-sm hover:shadow-2xl hover:-translate-y-2
              `}
            >
              <div
                className={`w-20 h-20 rounded-full ${item.bg} flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 p-4 ring-4 ring-inset ring-white/40`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
              <h3 className="text-slate-800 font-bold text-base md:text-lg leading-snug mb-2 group-hover:text-blue-700 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2 px-1 font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  const { t } = useTranslation();
  const VIDEO_URL = "https://www.youtube.com/watch?v=yiEPqyay7X4";
  const THUMBNAIL_URL = thumbnail;

  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900">
              {t("about_title")}
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed">
              {t("about_para")}
            </p>

            <div className="h-1 w-24 bg-amber-400 rounded-full"></div>

            <div className="bg-white border-l-4 border-blue-600 p-5 shadow-sm rounded-r-lg">
              <p className="text-lg text-slate-700 font-medium">
                <span className="text-blue-700 font-bold block mb-1">
                  {t("about_vision_heading")}
                </span>
                {t("about_vision_text")}
              </p>
            </div>
          </div>

          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full aspect-video rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200"
          >
            <img
              src={THUMBNAIL_URL}
              alt="Watch Video"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-600 text-white rounded-full p-5 shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-red-700 pl-6">
                <Play size={32} fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              <span className="bg-black/70 text-white text-sm px-4 py-1 rounded-full backdrop-blur-sm">
                {t("about_watch_youtube")} ↗
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

const VideoGuide = () => {
  const { t } = useTranslation();
  const VIDEO_URL = "https://youtu.be/TH0EGRd4FHc";
  const THUMBNAIL_URL = "/SUJHAA-Guide.png";

  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900">
              {t("Registration Process on SUJHAA")}
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed">
              {t("Follow this video for proper guidance on SUJHAA Registration and other processes.")}
            </p>

            <div className="h-1 w-24 bg-amber-400 rounded-full"></div>

            <div className="bg-white border-l-4 border-blue-600 p-5 shadow-sm rounded-r-lg">
              <p className="text-lg text-slate-700 font-medium">
                <span className="text-blue-700 font-bold block mb-1">
                  {t("about_vision_heading")}
                </span>
                {t("To make each individual accessible and feasible with SUJHAA Portal for seamless experience.")}
              </p>
            </div>
          </div>

          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full aspect-video rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200"
          >
            <img
              src={THUMBNAIL_URL}
              alt="Watch Video"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-600 text-white rounded-full p-5 shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-red-700 pl-6">
                <Play size={32} fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              <span className="bg-black/70 text-white text-sm px-4 py-1 rounded-full backdrop-blur-sm">
                {t("about_watch_youtube")} ↗
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

const PillarsSection = () => {
  const { t } = useTranslation();

  return (
    <section id="pillars" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900">
            {t("pillars_title")}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t("pillars_sub")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden border-t-4 border-t-orange-500 hover:shadow-lg transition-shadow group"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-amber-100 rounded-full opacity-50 transition-transform group-hover:scale-150" />
                <CardHeader className="relative">
                  <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-700">
                    <Icon size={28} />
                  </div>
                  <CardTitle className="text-xl">
                    {t(pillar.keyTitle)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t(pillar.keyDesc)}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
  const { t } = useTranslation();

  return (
    <section id="process" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900">
            {t("process_title")}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t("process_sub")}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-blue-200 z-0"></div>

          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-white border-4 border-blue-200 flex items-center justify-center mb-4 shadow-sm">
                  <Icon size={32} className="text-blue-700" />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  Step {step.id}: {t(step.keyTitle)}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {t(step.keyDesc)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-200 py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            {t("footer_title")}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Ministry of Social Justice and Empowerment,
            <br />
            Government of India.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t("footer_quick_links")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                {t("footer_guidelines")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                {t("footer_faq")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                {t("footer_contact")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                {t("footer_grievance")}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t("footer_note_title")}
          </h3>
          <p className="text-sm text-slate-400">
            {t("footer_note_text")}
          </p>
        </div>
      </div>
      <Separator className="my-8 bg-slate-800" />
      <div className="container mx-auto px-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {t("footer_rights")}
      </div>
    </footer>
  );
};

// --- Main Export ---
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Navbar />
      <main className="flex-grow">
        <HeroCarousel />
        <PillarsSection />
        <SchemeCategories />
        <ProcessSection />
        <AboutSection />
        <VideoGuide />
      </main>
      <Footer />
      <ChatWidget />
    </div >
  );
};

export default LandingPage;
