import React, { useState } from 'react';
import loginIcon from '../assets/login.jpeg';

function Login() {
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Matricula:', matricula);
        console.log('Senha:', senha);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    registration: matricula,
                    password: senha
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login realizado!');
                console.log('Token', data.accessToken);
                console.log('Refresh Token: ', data.refreshToken);

                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken); // corrigido: estava "refrestToken"

                alert('Login bem-sucedido!');
            } else {
                alert(data.message || "Matrícula ou senha inválida");
            }
        } catch (err) {
            console.error("Erro ao tentar logar:", err);
            alert("Erro ao conectar com o servidor");
        }
    };

    return (
        <div className='login-page'>
            <div className="login-container">
                <div className='login-left'>
                    <h1 className='logo-title'>MONITORA+</h1>
                    <form className='login-form'>
                        <input
                            type='text'
                            placeholder='Matrícula'
                            className='login-input'
                            value={matricula}
                            onChange={(e) => setMatricula(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Senha'
                            className='login-input'
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <button type='submit' className='login-button' onClick={handleLogin}>
                            Entrar
                        </button>
                    </form>
                </div>
                <div className='login-right'>
                    <img src={loginIcon} alt='Login Illustration' />
                </div>
            </div>
        </div>
    );
}

export default Login;
