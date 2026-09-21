import { useEffect, useRef, useState } from 'react';
import findUsers from '../../assets/findUsers.png';
import hourlyView from '../../assets/24HourView.png';
import AIHobbies from '../../assets/AIHobbies.png';

const features = [
  {
    title: 'Find people who fit your schedule',
    description:
      'Search by school, major, or name, then connect through friend requests. Turn compatible schedules and shared interests into study partners, project teammates, and new campus connections.',
    image: findUsers,
    alt: 'Find users by shared interests and availability',
  },
  {
    title: 'Sync Google Calendar',
    description:
      'Keep classes, study blocks, and events together in one student-friendly calendar. Move between day, week, and month views to understand your schedule and spot open time at a glance.',
    image: hourlyView,
    alt: 'Daily schedule calendar view',
  },
  {
    title: 'Connect beyond the calendar',
    description:
      'Get the full picture before you connect. Browse profiles with school, major, and hobbies, preview a class schedule, then send or accept friend requests—all in one place.',
    image: AIHobbies,
    alt: 'Student profile with hobbies and weekly schedule',
  },
];

const Features = () => {
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleFeatures, setVisibleFeatures] = useState<boolean[]>(() =>
    features.map(() => false)
  );

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setVisibleFeatures(features.map(() => true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = Number((entry.target as HTMLElement).dataset.featureIndex);
          setVisibleFeatures((current) => {
            if (current[index]) return current;

            const next = [...current];
            next[index] = true;
            return next;
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    featureRefs.current.forEach((feature) => {
      if (feature) observer.observe(feature);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="mb-12 h-screen scroll-mt-28 overflow-x-clip md:mb-36 lg:px-12"
    >
      <div className="mb-4 flex items-center justify-center lg:mb-12">
        <h2 id="features-heading" className="text-4xl font-bold dark:text-white lg:text-6xl">
          Features
        </h2>
      </div>

      {features.map((feature, index) => {
        const image = (
          <img
            src={feature.image}
            className="w-2/5 rounded-xl border-4 border-gray-500 object-cover shadow-xl"
            alt={feature.alt}
          />
        );
        const copy = (
          <div className="flex w-3/5 flex-col justify-center">
            <h3 className="block text-center text-lg font-bold dark:text-white lg:text-3xl">
              {feature.title}
            </h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 md:text-xl">
              {feature.description}
            </p>
          </div>
        );

        return (
          <div
            key={feature.title}
            ref={(element) => {
              featureRefs.current[index] = element;
            }}
            data-feature-index={index}
            data-testid={`feature-${index}`}
            className={`feature-reveal flex h-1/3 gap-4 ${
              index % 2 === 0 ? 'feature-reveal-from-left' : 'feature-reveal-from-right'
            } ${visibleFeatures[index] ? 'feature-reveal-visible' : ''}`}
          >
            {index % 2 === 0 ? (
              <>
                {image}
                {copy}
              </>
            ) : (
              <>
                {copy}
                {image}
              </>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default Features;
