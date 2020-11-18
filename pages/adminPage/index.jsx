import React, { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAllUsers } from "../../lib/hooks";
import Loader from "../../components/loader"
import Head from "next/head";


const AdminPage = () => {


    const { users, loading } = useAllUsers();
    const [role, setRole] = useState([]);

    console.log(users);

  


    if (loading) {
        return (
          <>
            <Loader />
          </>
        );
      }

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>

                {users.map((user, index) => {
                    return (
                        <tr key = {index}>
                            <td>{index+1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Form.Control as="select" >
                                    <option>Admin</option>
                                    <option>User</option>
                                </Form.Control>
                            </td>
                        </tr>
                    )
                })}


            </Table>

        </>
    );
};
export default AdminPage;