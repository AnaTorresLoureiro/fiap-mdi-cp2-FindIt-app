import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './authContext';

const ReportContext = createContext();
const REPORTS_STORAGE_KEY = '@itensperdidos/userReports';

export function ReportProvider({ children }) {
  const { currentUser } = useAuth();
  const [foundReports, setFoundReports] = useState([]);
  const [lostReports, setLostReports] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const didLoadStorage = useRef(false);

  // Carrega relatórios do usuário atual
  useEffect(() => {
    async function loadReports() {
      try {
        if (!currentUser) {
          setFoundReports([]);
          setLostReports([]);
          setIsHydrated(true);
          return;
        }

        const storageKey = `${REPORTS_STORAGE_KEY}/${currentUser.id}`;
        const storedData = await AsyncStorage.getItem(storageKey);

        if (storedData) {
          const parsedData = JSON.parse(storedData);

          if (Array.isArray(parsedData.foundReports)) {
            setFoundReports(parsedData.foundReports);
          } else {
            setFoundReports([]);
          }

          if (Array.isArray(parsedData.lostReports)) {
            setLostReports(parsedData.lostReports);
          } else {
            setLostReports([]);
          }
        } else {
          setFoundReports([]);
          setLostReports([]);
        }
      } catch (error) {
        console.warn('Erro ao carregar relatorios do armazenamento local', error);
        setFoundReports([]);
        setLostReports([]);
      } finally {
        didLoadStorage.current = true;
        setIsHydrated(true);
      }
    }

    loadReports();
  }, [currentUser]);

  // Salva relatórios do usuário atual
  useEffect(() => {
    if (!didLoadStorage.current || !currentUser) {
      return;
    }

    const storageKey = `${REPORTS_STORAGE_KEY}/${currentUser.id}`;
    const payload = JSON.stringify({ foundReports, lostReports });

    AsyncStorage.setItem(storageKey, payload).catch((error) => {
      console.warn('Erro ao salvar relatorios no armazenamento local', error);
    });
  }, [foundReports, lostReports, currentUser]);

  function addFoundReport(report) {
    const newReport = {
      id: `${Date.now()}-found`,
      createdAt: new Date().toISOString(),
      status: 'Aguardando entrega na secretaria',
      userId: currentUser?.id,
      ...report,
    };

    setFoundReports((prev) => [newReport, ...prev]);
  }

  function addLostReport(report) {
    const newReport = {
      id: `${Date.now()}-lost`,
      createdAt: new Date().toISOString(),
      status: 'Aguardando novas informações',
      userId: currentUser?.id,
      ...report,
    };

    setLostReports((prev) => [newReport, ...prev]);
  }

  return (
    <ReportContext.Provider
      value={{
        foundReports,
        lostReports,
        isHydrated,
        addFoundReport,
        addLostReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  return useContext(ReportContext);
}