import { Footer as FBFooter } from 'flowbite-react';

const Footer = () => {
  return (
    <div className="px-4 py-4 dark:bg-slate-900">
      <div className="w-full text-center">
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <span className="text-xl font-semibold dark:text-white">ScheduleFinder</span>
          <FBFooter.LinkGroup className="mt-2 sm:mt-0 flex flex-wrap justify-around">
            <FBFooter.Link href="#" className="text-gray-500 dark:text-gray-400">About</FBFooter.Link>
            <FBFooter.Link href="#" className="text-gray-500 dark:text-gray-400">Privacy Policy</FBFooter.Link>
            <FBFooter.Link href="#" className="text-gray-500 dark:text-gray-400">Licensing</FBFooter.Link>
            <FBFooter.Link href="#" className="text-gray-500 dark:text-gray-400">Contact</FBFooter.Link>
          </FBFooter.LinkGroup>
        </div>
        <FBFooter.Divider className="my-2" />
        <FBFooter.Copyright href="#" by="ScheduleFinder" year={new Date().getFullYear()} className="text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  );
};

export default Footer;
