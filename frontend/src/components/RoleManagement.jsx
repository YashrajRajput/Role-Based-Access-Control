import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Modal, Form, Input, message, Checkbox } from "antd";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm] = Form.useForm();

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  // Fetch roles from the backend
  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roles");
      setRoles(response.data);
    } catch (error) {
      message.error("Failed to fetch roles!");
    }
  };

  // Fetch permissions from the backend
  const fetchPermissions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/permissions");
      setPermissions(response.data);
    } catch (error) {
      message.error("Failed to fetch permissions!");
    }
  };

  // Handle adding or editing a role
  const handleAddOrEditRole = async (values) => {
    try {
      if (editingRole) {
        // Update existing role
        await axios.put(`http://localhost:5000/api/roles/${editingRole.id}`, {
          name: values.name,
          permissions: values.permissions,
        });
        message.success("Role updated successfully!");
      } else {
        // Create new role
        await axios.post("http://localhost:5000/api/roles", {
          name: values.name,
          permissions: values.permissions,
        });
        message.success("Role added successfully!");
      }
      fetchRoles();
      setIsModalVisible(false);
      setEditingRole(null);
      roleForm.resetFields();
    } catch (error) {
      message.error("Failed to save role!");
    }
  };

  // Handle editing a role
  const handleEditRole = (role) => {
    setEditingRole(role);
    roleForm.setFieldsValue({
      name: role.name,
      permissions: role.permissions.map((perm) => perm.id),
    });
    setIsModalVisible(true);
  };

  // Handle deleting a role
  const handleDeleteRole = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/roles/${id}`);
      message.success("Role deleted successfully!");
      fetchRoles();
    } catch (error) {
      message.error("Failed to delete role!");
    }
  };

  // Table columns configuration
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions) =>
        permissions.map((perm) => perm.name).join(", "),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, role) => (
        <>
          <Button type="link" onClick={() => handleEditRole(role)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDeleteRole(role.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add Role
      </Button>
      <Table columns={columns} dataSource={roles} rowKey="id" />

      <Modal
        title={editingRole ? "Edit Role" : "Add Role"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={roleForm} layout="vertical" onFinish={handleAddOrEditRole}>
          <Form.Item name="name" label="Role Name" rules={[{ required: true, message: "Role name is required" }]}>
            <Input placeholder="Enter role name" />
          </Form.Item>

          {/* Show Permissions only when they are available */}
          <Form.Item name="permissions" label="Permissions" rules={[{ required: true, message: "At least one permission is required" }]}>
            <Checkbox.Group
              options={permissions.length > 0 ? permissions.map((perm) => ({ label: perm.name, value: perm.id })) : []}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" disabled={permissions.length === 0}>
            Save
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default RoleManagement;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button, Table, Modal, Form, Input, message, Checkbox } from "antd";

// const RoleManagement = () => {
//   const [roles, setRoles] = useState([]);
//   const [permissions, setPermissions] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editingRole, setEditingRole] = useState(null);
//   const [roleForm] = Form.useForm();

//   useEffect(() => {
//     fetchRoles();
//     fetchPermissions();
//   }, []);

//   // Fetch roles from the backend
//   const fetchRoles = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/roles");
//       setRoles(response.data);
//     } catch (error) {
//       message.error("Failed to fetch roles!");
//     }
//   };

//   // Fetch permissions from the backend
//   const fetchPermissions = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/permissions");
//       setPermissions(response.data);
//     } catch (error) {
//       message.error("Failed to fetch permissions!");
//     }
//   };

//   // Handle adding or editing a role
//   const handleAddOrEditRole = async (values) => {
//     try {
//       if (editingRole) {
//         // Update existing role
//         await axios.put(`http://localhost:5000/api/roles/${editingRole.id}`, {
//           name: values.name,
//           permissions: values.permissions,
//         });
//         message.success("Role updated successfully!");
//       } else {
//         // Create new role
//         await axios.post("http://localhost:5000/api/roles", {
//           name: values.name,
//           permissions: values.permissions,
//         });
//         message.success("Role added successfully!");
//       }
//       fetchRoles();
//       setIsModalVisible(false);
//       setEditingRole(null);
//       roleForm.resetFields();
//     } catch (error) {
//       message.error("Failed to save role!");
//     }
//   };

//   // Handle editing a role
//   const handleEditRole = (role) => {
//     setEditingRole(role);
//     roleForm.setFieldsValue({
//       name: role.name,
//       permissions: role.permissions.map((perm) => perm.id),
//     });
//     setIsModalVisible(true);
//   };

//   // Handle deleting a role
//   const handleDeleteRole = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/roles/${id}`);
//       message.success("Role deleted successfully!");
//       fetchRoles();
//     } catch (error) {
//       message.error("Failed to delete role!");
//     }
//   };

//   // Table columns configuration
//   const columns = [
//     { title: "Name", dataIndex: "name", key: "name" },
//     {
//       title: "Permissions",
//       dataIndex: "permissions",
//       key: "permissions",
//       render: (permissions) =>
//         permissions.map((perm) => perm.name).join(", "),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, role) => (
//         <>
//           <Button type="link" onClick={() => handleEditRole(role)}>
//             Edit
//           </Button>
//           <Button type="link" danger onClick={() => handleDeleteRole(role.id)}>
//             Delete
//           </Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Button type="primary" onClick={() => setIsModalVisible(true)}>
//         Add Role
//       </Button>
//       <Table columns={columns} dataSource={roles} rowKey="id" />

//       <Modal
//         title={editingRole ? "Edit Role" : "Add Role"}
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//       >
//         <Form form={roleForm} layout="vertical" onFinish={handleAddOrEditRole}>
//           <Form.Item name="name" label="Role Name" rules={[{ required: true, message: "Role name is required" }]}>
//             <Input placeholder="Enter role name" />
//           </Form.Item>
//           <Form.Item name="permissions" label="Permissions" rules={[{ required: true, message: "At least one permission is required" }]}>
//             <Checkbox.Group options={permissions.map((perm) => ({ label: perm.name, value: perm.id }))} />
//           </Form.Item>
//           <Button type="primary" htmlType="submit">
//             Save
//           </Button>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default RoleManagement;


