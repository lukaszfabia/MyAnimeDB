import { ReactNode, createContext, useState } from "react";

interface UserContextType {
  user: any; // Zastąp 'any' odpowiednim typem dla użytkownika
  setUser: React.Dispatch<React.SetStateAction<any>>; // Zastąp 'any' odpowiednim typem dla użytkownika
}

// Utwórz kontekst z domyślną wartością
export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null); // Zastąp 'any' odpowiednim typem dla użytkownika

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
