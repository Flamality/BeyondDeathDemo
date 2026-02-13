import React, { createContext, useContext, type ReactNode } from 'react';

interface ConsoleContextType {
    consoleLog: (...message: string[]) => void;
    console: any[];
}

const ConsoleContext = createContext<ConsoleContextType | undefined>(undefined);

export const ConsoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [console, setConsole] = React.useState<any>([]);

    const consoleLog = (...message: string[]) => {
        const formattedMessage = message.join(' ');
        setConsole((prevConsole: any) => [formattedMessage, ...prevConsole, ]);
    }
    
    const value: ConsoleContextType = {
        consoleLog,
        console
    };

    return (
        <ConsoleContext.Provider value={value}>
            {children}
        </ConsoleContext.Provider>
    );
};

export const useConsole = (): ConsoleContextType => {
    const context = useContext(ConsoleContext);
    if (context === undefined) {
        throw new Error('useConsole must be used within a ConsoleProvider');
    }
    return context;
};