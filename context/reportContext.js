import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const ReportContext = createContext();
const STORAGE_KEY = '@itensperdidos/reports';

export function ReportProvider({ children }) {
  const [foundReports, setFoundReports] = useState([]);
  const [lostReports, setLostReports] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const didLoadStorage = useRef(false);

  useEffect(() => {
    async function loadReports() {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedData) {
          const parsedData = JSON.parse(storedData);

          if (Array.isArray(parsedData.foundReports)) {
            setFoundReports(parsedData.foundReports);
          }

          if (Array.isArray(parsedData.lostReports)) {
            setLostReports(parsedData.lostReports);
          }
        }
      } catch (error) {
        console.warn('Erro ao carregar relatorios do armazenamento local', error);
      } finally {
        didLoadStorage.current = true;
        setIsHydrated(true);
      }
    }

    loadReports();
  }, []);

  useEffect(() => {
    if (!didLoadStorage.current) {
      return;
    }

    const payload = JSON.stringify({ foundReports, lostReports });

    AsyncStorage.setItem(STORAGE_KEY, payload).catch((error) => {
      console.warn('Erro ao salvar relatorios no armazenamento local', error);
    });
  }, [foundReports, lostReports]);

  function addFoundReport(report) {
    const newReport = {
      id: `${Date.now()}-found`,
      createdAt: new Date().toISOString(),
      status: 'Aguardando entrega na secretaria',
      ...report,
    };

    setFoundReports((prev) => [newReport, ...prev]);
  }

  function addLostReport(report) {
    const newReport = {
      id: `${Date.now()}-lost`,
      createdAt: new Date().toISOString(),
      status: 'Aguardando novas informações',
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