import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const AuthContext = createContext();
const USERS_STORAGE_KEY = '@findit/users';
const AUTH_STORAGE_KEY = '@findit/auth';

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const didLoadStorage = useRef(false);

  // Carrega usuários e estado de autenticação ao iniciar
  useEffect(() => {
    async function loadAuth() {
      try {
        const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

        if (usersData) {
          const parsedUsers = JSON.parse(usersData);
          if (Array.isArray(parsedUsers)) {
            setUsers(parsedUsers);
          }
        }

        if (authData) {
          const parsedAuth = JSON.parse(authData);
          setCurrentUser(parsedAuth);
        }
      } catch (error) {
        console.warn('Erro ao carregar autenticação', error);
      } finally {
        didLoadStorage.current = true;
        setIsHydrated(true);
      }
    }

    loadAuth();
  }, []);

  // Salva usuários no AsyncStorage sempre que mudam
  useEffect(() => {
    if (!didLoadStorage.current) {
      return;
    }

    AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users)).catch((error) => {
      console.warn('Erro ao salvar usuários', error);
    });
  }, [users]);

  // Salva estado de autenticação sempre que muda
  useEffect(() => {
    if (!didLoadStorage.current) {
      return;
    }

    if (currentUser) {
      AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser)).catch((error) => {
        console.warn('Erro ao salvar autenticação', error);
      });
    } else {
      AsyncStorage.removeItem(AUTH_STORAGE_KEY).catch((error) => {
        console.warn('Erro ao remover autenticação', error);
      });
    }
  }, [currentUser]);

  function register(nome, email, senha, foto) {
    const novoUsuario = {
      id: `${Date.now()}`,
      nome,
      email,
      senha,
      foto,
      criadoEm: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, novoUsuario]);
    return novoUsuario;
  }

  function login(email, senha) {
    // Procura o usuário na lista atual ou na lista atualizada
    const usuariosAtualizados = users.find((u) => u.email === email && u.senha === senha);
    
    if (usuariosAtualizados) {
      const userData = {
        id: usuariosAtualizados.id,
        nome: usuariosAtualizados.nome,
        email: usuariosAtualizados.email,
        foto: usuariosAtualizados.foto,
      };
      setCurrentUser(userData);
      return true;
    }
    return false;
  }

  function loginWithUser(usuario) {
    // Função auxiliar para fazer login com dados do usuário já criado
    if (usuario) {
      const userData = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        foto: usuario.foto,
      };
      setCurrentUser(userData);
      return true;
    }
    return false;
  }

  function logout() {
    setCurrentUser(null);
  }

  function isEmailTaken(email) {
    return users.some((u) => u.email === email);
  }

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isHydrated,
        register,
        login,
        loginWithUser,
        logout,
        isEmailTaken,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
