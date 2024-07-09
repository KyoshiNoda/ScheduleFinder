import { Footer as FBFooter } from 'flowbite-react';
const Footer = () => {
  return (
    <div className="px-1">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <span className="text-xl font-semibold dark:text-white">ScheduleFinder</span>
          <FBFooter.LinkGroup>
            <FBFooter.Link href="#">About</FBFooter.Link>
            <FBFooter.Link href="#">Privacy Policy</FBFooter.Link>
            <FBFooter.Link href="#">Licensing</FBFooter.Link>
            <FBFooter.Link href="#">Contact</FBFooter.Link>
          </FBFooter.LinkGroup>
        </div>
        <FBFooter.Divider />
        <FBFooter.Copyright href="#" by="ScheduleFinder" year={new Date().getFullYear()} />
      </div>
    </div>
  );
};

export default Footer;
