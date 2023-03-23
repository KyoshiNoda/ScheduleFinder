import { useState, useEffect } from 'react';
import User from './User';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  photoURL: string;
  email: string;
  password: string;
  gender: string;
  school: string;
};

const UserContainer = () => {
  const [users, setUsers] = useState<User[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section>
      {users &&
        users.map((user) => (
          <User
            key={user._id}
            photoURL={user.photoURL}
            firstName={user.firstName}
            lastName={user.lastName}
          />
        ))}
    </section>
  );
};

export default UserContainer;
