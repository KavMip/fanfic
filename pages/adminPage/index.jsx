import React, { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAllUsers } from "../../lib/hooks";
import Loader from "../../components/loader"
import Head from "next/head";
import Link from "next/link";


const AdminPage = () => {


    const { users, loading } = useAllUsers();
    console.log(users);
    const [role, setRole] = useState([]);

    console.log(users);




    if (loading) {
        return (
            <>
                <Loader />
            </>
        );
    }
    <style >
        {`
        .user-element{
            cursor: pointer
        }
        `}
    </style>

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
                    {users.map((user, index) => {
                        return (
                            <Link key={index} href={"/profile?id="+ user._id}>
                                <tr className="user-element" >
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isAdmin ?
                                        <p>Admin</p> : <p>User</p>} </td>
                                </tr>
                            </Link>

                        )
                    })}
                </tbody>
            </Table>

        </>
    );
};
export default AdminPage;