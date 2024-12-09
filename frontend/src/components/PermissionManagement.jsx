import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Permissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState('');

  // Fetch permissions from the backend
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/permissions');
      setPermissions(response.data);
    } catch (error) {
      console.log('Error fetching permissions:', error);
    }
  };

//   // Handle adding a new permission
//   const handleAddPermission = async () => {
//     if (newPermission.trim() === '') {
//       alert('Permission name cannot be empty');
//       return;
//     }

//     try {
//       // Send the new permission to the backend
//       const response = await axios.post('http://localhost:5000/api/permissions', {
//         name: newPermission.trim(),
//       });

//       // After successfully adding, fetch the updated list of permissions
//       fetchPermissions();
//       setNewPermission(''); // Clear the input field
//     } catch (error) {
//       console.log('Error adding permission:', error);
//       alert('Failed to add permission');
//     }
//   };
    // Handle adding a new permission
    const handleAddPermission = async () => {
        if (newPermission.trim() === '') {
            alert('Permission name cannot be empty');
            return;
        }

        try {
            // Send the new permission to the backend
            const response = await axios.post('http://localhost:5000/api/permissions', {
                name: newPermission.trim(),
            });

            // Check if the request was successful
            if (response.status === 201) {
                // After successfully adding, fetch the updated list of permissions
                fetchPermissions();
                setNewPermission(''); // Clear the input field
            } else {
                alert('Failed to add permission');
            }
        } catch (error) {
            console.log('Error adding permission:', error);
            alert('Failed to add permission. See console for details.');
        }
    };


  return (
    <div>
      <h2>Permissions</h2>

      {/* Input field for adding a new permission */}
      <div>
        <input
          type="text"
          value={newPermission}
          onChange={(e) => setNewPermission(e.target.value)}
          placeholder="Enter new permission"
        />
        <button onClick={handleAddPermission}>Add Permission</button>
      </div>

      {/* List of permissions */}
      <ul>
        {permissions.map((permission) => (
          <li key={permission.id}>
            {permission.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Permissions;




// import React, { useEffect, useState } from 'react';

// const Permissions = () => {
//   const [permissions, setPermissions] = useState([]);
//   const [newPermission, setNewPermission] = useState('');

//   // Simulate fetching permissions from an API
//   useEffect(() => {
//     fetch('http://localhost:5000/api/permissions')
//       .then(response => response.json())
//       .then(data => setPermissions(data))
//       .catch(error => console.log('Error fetching permissions:', error));
//   }, []);

//   // Handle adding a new permission
//   const handleAddPermission = () => {
//     if (newPermission.trim() === '') {
//       alert('Permission name cannot be empty');
//       return;
//     }

//     const newPerm = {
//       id: permissions.length + 1, // Simulate an id (in reality, this would be returned from the API)
//       name: newPermission.trim(),
//     };

//     // Add the new permission to the state
//     setPermissions([...permissions, newPerm]);
//     setNewPermission(''); // Clear the input field
//   };

//   return (
//     <div>
//       <h2>Permissions</h2>

//       {/* Input field for adding a new permission */}
//       <div>
//         <input
//           type="text"
//           value={newPermission}
//           onChange={(e) => setNewPermission(e.target.value)}
//           placeholder="Enter new permission"
//         />
//         <button onClick={handleAddPermission}>Add Permission</button>
//       </div>

//       {/* List of permissions */}
//       <ul>
//         {permissions.map((permission) => (
//           <li key={permission.id}>
//             {permission.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Permissions;
