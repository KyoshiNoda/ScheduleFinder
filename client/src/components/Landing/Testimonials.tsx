import { useState } from 'react';
import { Avatar } from 'flowbite-react';
import { HiArrowSmLeft, HiArrowSmRight } from 'react-icons/hi';

const Testimonials = () => {
  const quotes = [
    {
      person: 'Kyoshi Noda',
      quote: `"Flowbite is just awesome. It contains tons of predesigned components and pages starting
        from login screen to complex dashboard. Perfect choice for your next SaaS application."`,
      role: 'Frontend Engineer',
      initials: 'KN',
    },
    {
      person: 'Carlos Duque',
      quote: `"Flowbite has code in one place and I'm not joking when I say it took me a matter of minutes to copy the code, 
        customise it and integrate within a Laravel + Vue application."`,
      role: 'Software Engineer',
      initials: 'CD',
    },
    {
      person: 'John Doe',
      quote: `"As someone who mainly designs in the browser, I've been a casual user of Figma, 
      but as soon as I saw and started playing with FlowBite my mind was blown and became so productive."`,
      role: 'UI Designer',
      initials: 'JD',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuote = quotes[currentIndex];

  return (
    <div className="mb-20 flex flex-col items-center justify-center gap-8">
      <div>
        <span className="block text-center text-4xl font-semibold dark:text-white">Testimonials</span>
        <div className="flex justify-center">
          <span className="w-3/4 text-center text-xl text-gray-500 dark:text-gray-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi quaerat numquam nihil
            dolor
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <span className="w-1/2 text-center text-2xl dark:text-white">{currentQuote.quote}</span>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Avatar rounded placeholderInitials={currentQuote.initials} bordered color='info'/>
          <span className="font-semibold dark:text-white">{currentQuote.person}</span>
          <span className="text-3xl font-semibold text-gray-700">|</span>
          <span className="text-gray-500">{currentQuote.role}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <HiArrowSmLeft
          size={48}
          color="gray"
          className="cursor-pointer"
          onClick={() =>
            setCurrentIndex((prevIndex) => (prevIndex === 0 ? quotes.length - 1 : prevIndex - 1))
          }
        />
        <HiArrowSmRight
          size={48}
          color="gray"
          className="cursor-pointer"
          onClick={() =>
            setCurrentIndex((prevIndex) => (prevIndex === quotes.length - 1 ? 0 : prevIndex + 1))
          }
        />
      </div>
    </div>
  );
};

export default Testimonials;
