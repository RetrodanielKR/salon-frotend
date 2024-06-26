// src/components/UserList.tsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/Axiosconfig';

interface User {
    UserID: string;
    Nombre: string;
    correo: string;
    telefono: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/usuarios');
                console.log("Response from backend:", response.data); // Asegúrate de recibir datos aquí
                if (response.data && response.data.data) {
                    setUsers(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                // Manejo de errores aquí
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Listado de Usuarios</h2>
            <ul>
                {users.map(user => (
                    <li key={user.UserID}>
                        <strong>Nombre:</strong> {user.Nombre}<br />
                        <strong>Correo:</strong> {user.correo}<br />
                        <strong>Teléfono:</strong> {user.telefono}<br />
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
