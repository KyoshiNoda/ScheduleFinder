import LandingNavBar from '../components/Landing/LandingNavBar';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
const LandingPage = () => {
  return (
    <div className="min-h-full w-full bg-slate-100 p-3 dark:bg-slate-900">
      <LandingNavBar />
      <div className="flex flex-col gap-48">
        <Hero />
        <Features />
      </div>
    </div>
  );
};

export default LandingPage;
