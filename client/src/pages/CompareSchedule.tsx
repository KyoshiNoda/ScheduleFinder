import ScheduleBox from '../components/Schedule/ScheduleBox';
import { useParams } from 'react-router-dom';

const CompareSchedule = () => {
  const { userId } = useParams();

  return (
    <div>
      <h1>CompareSchedule Page {userId}</h1>
    </div>
  );
};

export default CompareSchedule;
