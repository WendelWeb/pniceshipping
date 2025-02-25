// your-react-app/src/components/UserList.js
import { useState, useEffect } from "react";
type User = {
  id: string;
  imageUrl: string;
  emailAddresses: { emailAddress: string }[];
  firstName: string;
  lastName: string;
  username: string;
  createdAt: string;
};

// Dans ton useState :

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://pniceshippingbackend-2.onrender.com/api/users"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data.data);
        console.log(data);
        console.log("erdtfgbyh");
      } catch (err) {
        console.log(err);
        alert(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
//   if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users</h2>
      <ul className="flex flex-wrap">
        {users?.map((user) => (
          <li key={user.id} className="m-5">
            <img src={user.imageUrl} width={50} height={50} alt="" />
            <div>
              <strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}
            </div>
            <div>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </div>
            <div>
              <strong>UserName:</strong> {user.username}
            </div>
            <div>
              <strong>Created:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;

// import { useState, useEffect } from 'react';

// const UserList = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('http://localhost:5000/api/users');
//         if (!response.ok) {
//           throw new Error('Échec de la récupération des utilisateurs');
//         }
//         const data = await response.json();
//         console.log(data);

//         // Vérifier si data est un tableau
//         if (!Array.isArray(data)) {
//           throw new Error('Les données attendues doivent être un tableau d\'utilisateurs');
//         }

//         setUsers(data);
//       } catch (err) {
//         setError(err.message);
//         setUsers([]); // S'assurer que users reste un tableau vide en cas d'erreur
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   if (loading) return <div>Chargement des utilisateurs...</div>;
//   if (error) return <div>Erreur : {error}</div>;

//   return (
//     <div>
//       <h2>Utilisateurs</h2>
//       <ul>
//         {users.map((user) => (
//           <li key={user.id}>
//             <div>
//               <strong>Email :</strong> {user.emailAddresses[0]?.emailAddress}
//             </div>
//             <div>
//               <strong>Nom :</strong> {user.firstName} {user.lastName}
//             </div>
//             <div>
//               <strong>Créé le :</strong> {new Date(user.createdAt).toLocaleDateString()}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default UserList;
