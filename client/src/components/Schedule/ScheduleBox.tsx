type Props = {};

function ScheduleBox({}: Props) {
  return (
    <>
      <div className="flex w-full flex-col">
        <div className="flex justify-evenly dark:text-white">
          <div>Monday</div>
          <div>Tuesday</div>
          <div>Wednesday</div>
          <div>Thursday</div>
          <div>Friday</div>
        </div>
        <div className="mb-6 flex h-[1008px] rounded bg-white dark:bg-black dark:text-white">
          <div className="h-[1008px] w-[20px]">
            <div className="relative">
              <span className="absolute top-[0px]">7</span>
              <span className="absolute top-[72px]">8</span>
              <span className="absolute top-[144px]">9</span>
              <span className="absolute top-[216px]">10</span>
              <span className="absolute top-[288px]">11</span>
              <span className="absolute top-[360px]">12</span>
              <span className="absolute top-[432px]">1</span>
              <span className="absolute top-[504px]">2</span>
              <span className="absolute top-[576px]">3</span>
              <span className="absolute top-[648px]">4</span>
              <span className="absolute top-[720px]">5</span>
              <span className="absolute top-[792px]">6</span>
              <span className="absolute top-[864px]">7</span>
              <span className="absolute top-[936px]">8</span>
            </div>
          </div>
          <div className=" left-[100px] top-[0px] flex h-[1008px] w-1/5 flex-col  bg-purple-500"></div>
          <div className=" left-[100px] top-[0px] flex h-[1008px] w-1/5 flex-col  bg-red-500"></div>
          <div className=" left-[100px] top-[0px] flex h-[1008px] w-1/5 flex-col  bg-orange-500"></div>
          <div className=" left-[100px] top-[0px] flex h-[1008px] w-1/5 flex-col  bg-blue-500"></div>
          <div className=" left-[100px] top-[0px] flex h-[1008px] w-1/5 flex-col  bg-green-500"></div>
        </div>
      </div>
    </>
  );
}

export default ScheduleBox;
