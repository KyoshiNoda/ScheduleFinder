import LandingNavBar from '../components/Landing/LandingNavBar';
import Hero from '../components/Landing/Hero';
const LandingPage = () => {
  return (
    <div className="flex min-h-full w-full flex-col gap-6 bg-slate-100 p-3 dark:bg-slate-900">
      <LandingNavBar />
      <Hero />
    </div>
  );
};

export default LandingPage;
