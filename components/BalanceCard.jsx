import { View, Text } from "react-native"
import { styles } from "../assets/styles/home.styles"
import { COLORS } from "../constants/colors"

export const BalanceCard = ({ summary }) => {
    // Default values if summary is undefined
    const safeSummary = summary || {
        balance: 0,
        income: 0,
        expenses: 0
    };

    // Helper function to safely format currency
    const formatCurrency = (value) => {
        const num = parseFloat(value) || 0;
        return num.toFixed(2);
    };

    return (
        <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Total Balance</Text>
            <Text style={styles.balanceAmount}>
                ₹{formatCurrency(safeSummary.balance)}
            </Text>
            
            <View style={styles.balanceStats}>
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>Income </Text>
                    <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
                        +₹{formatCurrency(safeSummary.income)}
                    </Text>
                </View>
                
                <View style={[styles.balanceStatItem, styles.statDivider]} />
                
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>Expenses</Text>
                    <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
                        -₹{formatCurrency(Math.abs(safeSummary.expenses))}
                    </Text>
                </View>
            </View>
        </View>
    );
};