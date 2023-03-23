import { AiFillGithub } from 'react-icons/ai';
import { FiGithub } from 'react-icons/fi'
type Props = {};

function Github({ }: Props) {
  return (
    <div className='h-96 w-96'>
      <AiFillGithub size={'h-96'} color = 'white'/>
    </div>
  );
}

export default Github;
