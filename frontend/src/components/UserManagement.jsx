import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Modal,
  Form,
  Select,
  Switch,
  message,
  Input,
} from "antd";

const UserManagement = () => {
  const [users, setUser] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm] = Form.useForm();

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      console.log("Fetched User:", response.data); // Check the response structure
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roles");
      console.log("Fetched Roles:", response.data); // Check the response structure
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleAddOrEditUser = async (values) => {
    try {
      const { name, email, role, status } = values;
      const userData = {
        name,
        email,
        role_id: role,
        status: status ? "Active" : "Inactive", // Status as a string
      };

      if (editingUser) {
        // Editing an existing users
        await axios.put(
          `http://localhost:5000/api/users/${editingUser.id}`,
          userData
        );
        message.success("User updated successfully!");
      } else {
        // Adding a new users
        await axios.post("http://localhost:5000/api/users", userData);
        message.success("User added successfully!");
      }
      fetchUser();
      setIsModalVisible(false);
      setEditingUser(null);
      userForm.resetFields();
    } catch (error) {
      message.error("Failed to save users!");
    }
  };

  const handleEditUser = (users) => {
    setEditingUser(users);
    userForm.setFieldsValue({
      name: users.name,
      email: users.email,
      role: users.role_id,
      status: users.status === "Active", // Set status to true if Active, false if Inactive
    });
    setIsModalVisible(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      message.success("User deleted successfully!");
      fetchUser();
    } catch (error) {
      message.error("Failed to delete users!");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role_id",
      key: "role",
      render: (roleId) => roles.find((role) => role.id === roleId)?.name,
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (_, users) => (
        <>
          <Button type="link" onClick={() => handleEditUser(users)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDeleteUser(users.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add User
      </Button>
      <Table columns={columns} dataSource={users} rowKey="id" />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={userForm} layout="vertical" onFinish={handleAddOrEditUser}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Email is required" }]}>
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: "Role is required" }]}>
            <Select placeholder="Select role">
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Modal> 
      
    </>
  );
};

export default UserManagement;
