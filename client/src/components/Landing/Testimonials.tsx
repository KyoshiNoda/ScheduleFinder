import { useState } from 'react';
import { Avatar } from 'flowbite-react';
import { HiArrowSmLeft, HiArrowSmRight } from 'react-icons/hi';

const Testimonials = () => {
  const quotes = [
    {
      person: 'Carlos Duque',
      quote:
        'Finding a time that works for everyone used to mean jumping between group chats and calendars. ScheduleFinder shows our shared free time in seconds.',
      role: 'Engineering Student',
      initials: 'CD',
    },
    {
      person: 'Joyce Jorda',
      quote: 'It’s an easy way to see my classes without having to pull out my laptop.',
      role: 'College Student',
      initials: 'JJ',
    },
    {
      person: 'Kyoshi Noda',
      quote:
        'I can build my week, meet people with similar interests, and compare schedules in one place. Planning a study session finally feels effortless.',
      role: 'Computer Science Student',
      initials: 'KN',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuote = quotes[currentIndex];

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="mb-20 mt-20 flex scroll-mt-28 flex-col items-center justify-center gap-2 md:mt-0 md:gap-8"
    >
      <div>
        <h2
          id="testimonials-heading"
          className="block text-center text-4xl font-semibold dark:text-white md:text-6xl"
        >
          Testimonials
        </h2>
        <div className="flex justify-center">
          <span className="w-3/4 text-center text-lg text-gray-500 dark:text-gray-400 md:text-2xl">
            Less time comparing calendars. More time studying, meeting up, and making campus
            connections.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <blockquote className="w-full text-center text-lg dark:text-white md:w-1/2 md:text-2xl">
            “{currentQuote.quote}”
          </blockquote>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Avatar rounded placeholderInitials={currentQuote.initials} bordered color="info" />
          <h3 className="font-semibold dark:text-white">{currentQuote.person}</h3>
          <span className="text-3xl font-semibold text-gray-700">|</span>
          <span className="text-gray-500">{currentQuote.role}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous testimonial"
          className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={() =>
            setCurrentIndex((prevIndex) => (prevIndex === 0 ? quotes.length - 1 : prevIndex - 1))
          }
        >
          <HiArrowSmLeft size={48} color="gray" />
        </button>
        <button
          type="button"
          aria-label="Next testimonial"
          className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={() =>
            setCurrentIndex((prevIndex) => (prevIndex === quotes.length - 1 ? 0 : prevIndex + 1))
          }
        >
          <HiArrowSmRight size={48} color="gray" />
        </button>
      </div>
    </section>
  );
};

export default Testimonials;
