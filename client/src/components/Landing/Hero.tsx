import compareSchedule from '../../assets/compareSchedule.png';
const Hero = () => {
  return (
    <div className="flex h-full flex-col items-center text-white">
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <div className="text-center text-8xl font-extrabold">
          <span>Meet People</span>
          <br />
          <span>On Your Cloak.</span>
        </div>
        <span className="text-center text-xl font-bold text-gray-500">
          Create schedules, compare with friends, <br />
          and discover new connections.
        </span>
        <img src={compareSchedule} className="w-full rounded-xl bg-gray-400 p-1" />
      </div>
    </div>
  );
};

export default Hero;
