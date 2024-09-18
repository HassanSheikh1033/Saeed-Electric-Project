import { useState, useReducer, createContext, useContext, useEffect } from 'react'

const ProductsContext = createContext()

const Reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_PRODUCT':
            return {
                ...state,
                products: action.payload
            }
        default:
            return state
    }
}


const initialState = {
    products: null
}



export const ProductsContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(Reducer, initialState)
    const [loading, setLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(false)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // setLoading(true);
                const response = await fetch('http://localhost:4000/api/products/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                dispatch({ type: 'ADD_PRODUCT', payload: data });
                setLoading(false);

            } catch (error) {
                console.error("Failed to fetch products:", error);
                setLoading(false);

            } finally {
                setLoading(false);
            }
        };

        fetchProducts()
    }, [refreshTrigger])


    return (
        <ProductsContext.Provider value={{ ...state, dispatch, loading, setLoading, refreshTrigger, setRefreshTrigger }}>
            {children}
        </ProductsContext.Provider>
    )

}


export const useProductsContext = () => {
    const context = useContext(ProductsContext)

    if (!context) {
        throw new Error('useProductsContext must be used within a ProductsContextProvider')
    }

    return context
}




