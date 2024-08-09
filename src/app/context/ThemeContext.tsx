import { createContext, useState } from "react";

type Props = {
    children: React.ReactNode;
};

const lightTheme = {

}

const darkTheme = {
    
}

export const ThemeContext = createContext({});

export const ThemeContextProvider: React.FC<Props> = ({ children }) => {

    // const [darkMode, setDarkMode] = useState(false);
    // const toggleDarkMode = () => {
    //     setDarkMode(!darkMode);
    // }





    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}