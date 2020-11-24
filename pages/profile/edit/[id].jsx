import React, { useState, useEffect } from 'react';
import { useUser, useRouterUser } from '../../../lib/hooks';
import { useRouter } from 'next/router'
import { Form } from "react-bootstrap";
import Axios from 'axios';
import Loader from "../../../components/loader"

const userRoles = ["Admin", "User"];

const ProfileSection = () => {
    const { user, mutate } = useUser();
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    
    const [msg, setMsg] = useState({ message: '', isError: false });
    const routerUser = useRouterUser();


    if (!routerUser) {
        return <Loader />;
    }




    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isUpdating) return;
        setIsUpdating(true);
        const body = {
            name: event.currentTarget.name.value,
            email: event.currentTarget.email.value,
            id: routerUser._id
        }
        if(event.currentTarget.role){
            body.isAdmin = event.currentTarget.role.value === userRoles[0] ? true : false;
        }
        try {
            const res = await Axios.put('/api/user/', body);
            const userData = await res.data;
            mutate({
                user: {
                    ...user,
                    ...userData.user,
                },
            });
            setMsg({ message: 'Profile updated' });
        } catch (e) {
            setMsg({ message: 'Error, try again' });


        }



    };


    const handleSubmitPasswordChange = async (e) => {
        e.preventDefault();
        const body = {
            oldPassword: e.currentTarget.oldPassword.value,
            newPassword: e.currentTarget.newPassword.value,
        };
        e.currentTarget.oldPassword.value = '';
        e.currentTarget.newPassword.value = '';

        try {
            const res = await Axios.put('/api/user/password', body);
            setMsg({ message: 'Password updated' });

        } catch (e) {
            setMsg({ message: 'Error, try again' });

        }
    };

    return (
        <>
            <style jsx>
                {`
          p {
            text-align: center;
            color: #888;
          }
          h3 {
            color: #555;
          }
          .edit-form{
              display:flex;
              flex-direction:column;
              
              width:100%;
          }
          .edit-elements{
              width:50%;
              margin-left:auto;
              margin-right:auto;
          }
          .edit-submit{
              width:50%;
              margin-left:auto;
              margin-right:auto;
          }
          label{
              display:flex;
              align-items:center;
          }
          input, textarea{
            font-family: monospace;
            -webkit-flex: 1 1 0%;
            -ms-flex: 1 1 0%;
            flex: 1 1 0%;
            margin-left: 0.5rem;
            box-shadow: none;
            width: 90%;
            color: #000;
            background-color: transparent;
            border: 1px solid #d8d8d8;
            border-radius: 5px;
            outline: 0px;
            padding: 10px 25px;          }
        `}
            </style>

            <section>
                <h2>Edit Profile</h2>
                {msg.message ? <p style={{ color: msg.isError ? 'red' : '#0070f3', textAlign: 'center' }}>{msg.message}</p> : null}
                <form className="edit-form" onSubmit={handleSubmit}>
                    <label className="edit-elements" htmlFor="name">
                        Name
                        <input
                            required
                            id="name"
                            name="name"
                            type="text"
                            defaultValue={routerUser.name}

                        />
                    </label>

                    <label className="edit-elements" htmlFor="name">
                        Email
                        <input
                            required
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={routerUser.email}
                        />
                    </label>

                    {user.isAdmin ? (
                        <label className="edit-elements" htmlFor="name">
                            Role
                 
                            <Form.Control as="select"
                                defaultValue={routerUser.isAdmin ? userRoles[0] : userRoles[1]}
                                id="role"
                                name="role"
                            >
                                {
                                    userRoles.map((role)=><option key={role}>{role}</option>)
                                }
                             

                            </Form.Control>

                        </label>
                    ) : null}



                    <button className="edit-submit" disabled={isUpdating} type="submit">Save</button>
                </form>


                {user._id === routerUser._id ? (
                    <form className="edit-form" onSubmit={handleSubmitPasswordChange}>
                        <label className="edit-elements" htmlFor="oldpassword">
                            Old Password
             <input
                                type="password"
                                name="oldPassword"
                                id="oldpassword"
                                required
                            />
                        </label>
                        <label className="edit-elements" htmlFor="newpassword">
                            New Password
             <input
                                type="password"
                                name="newPassword"
                                id="newpassword"
                                required
                            />
                        </label>
                        <button className="edit-submit" type="submit">Change Password</button>
                    </form>
                ) : null}

            </section>
        </>
    );
};
const SettingPage = () => {
    const { user } = useUser();
    if (!user) {
        return (
            <>
                <p>Please sign in</p>
            </>
        );
    }
    return (
        <>
            <ProfileSection />
        </>
    );
};
export default SettingPage;