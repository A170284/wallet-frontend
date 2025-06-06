// react custom hook file

import { useCallback, useState } from "react";
import { Alert } from "react-native";
import {API_URL } from "../constants/api";


export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary,setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    
    // useCallback is used for performancereasons, it will memorize the function
    const fetchTransactions = useCallback(async () => {
        try{
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error){
            console.error("Error fetching transactions: ", error);
        }
    },[userId]);

    const fetchSummary = useCallback(async () => {
        try{
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`)
            const data = await response.json();
            setSummary(data);
        }catch (error){
            console.error("Error fetching summary: ", error);
        }
    },[userId]
    )

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
        const [transactionsRes, summaryRes] = await Promise.all([
            fetch(`${API_URL}/transactions/${userId}`),
            fetch(`${API_URL}/transactions/summary/${userId}`)
        ]);
        
        if (!transactionsRes.ok) throw new Error("Failed to fetch transactions");
        if (!summaryRes.ok) throw new Error("Failed to fetch summary");

        const [transactionsData, summaryData] = await Promise.all([
            transactionsRes.json(),
            summaryRes.json()
        ]);
        
        setTransactions(transactionsData);
        setSummary({
            balance: parseFloat(summaryData.balance) || 0,
            income: parseFloat(summaryData.income) || 0,
            expenses: parseFloat(summaryData.expenses) || 0
        });
    } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert("Error", error.message);
    } finally {
        setIsLoading(false);
    }
}, [userId]);

    const deleteTransaction = async (id) => {
        try{
            const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete transactions");
            
            // Refresh data after deletion
            loadData();
            Alert.alert("Success","Transaction deleted successfully");
        } catch (error) {
            console.error("Error deleting transaction: ",error);
            Alert.alert("Error",error.message);
        }
    };

    return{ transactions, summary, isLoading, loadData, deleteTransaction};
};