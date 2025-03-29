
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const DataProviderContext = createContext();
export const DataProvider = ({ children }) => {
    const [newsItemsList, setNewsItemList] = useState([]);
    const [newsItemValueFilter, setNewsItemValueFIlter] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [filters, setFilters] = useState({
        author: '',
        dateRange: [],
    });

    const addNewsItem = useCallback((val) => {
        setNewsItemList([...val]);

    })

    const changeNewsItemFilter = useCallback((val) => {
        setNewsItemValueFIlter(val)
    })

    const toggleDarkMode = useCallback((darkModeVal) => {
        setDarkMode(darkModeVal);
    }, [])

    const updateFilter = useCallback((updatedFilter) => {
        setFilters(updatedFilter)
    })
    return <DataProviderContext.Provider value={{
        newsItemsList, addNewsItem, newsItemValueFilter, changeNewsItemFilter,
        filters, updateFilter, darkMode, toggleDarkMode
    }}>
        {children}
    </DataProviderContext.Provider>
}



export const useDataProvider = () => {
    const authValues = useContext(DataProviderContext);
    return authValues;
}