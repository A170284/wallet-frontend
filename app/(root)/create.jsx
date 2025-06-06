// create.jsx
import { View, Text, Alert, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { styles } from '../../assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { API_URL } from '../../constants/api';

const CATEGORIES = [
  { id: 'Food & Drinks', name: 'Food & Drinks ', icon: 'fast-food-outline' },
  { id: 'Shopping', name: 'Shopping  ', icon: 'bag-outline' },
  { id: 'Transportation', name: 'Transportation  ', icon: 'car-outline' },
  { id: 'Healthcare', name: 'Healthcare ', icon: 'medkit-outline' },
  { id: 'Entertainment', name: 'Entertainment ' , icon: 'film-outline' },
  { id: 'Bills', name: 'Bills ', icon: 'receipt-outline' },
  { id: 'Salary', name: 'Salary ', icon: 'wallet-outline' },
  { id: 'Investment', name: 'Investment ', icon: 'trending-up-outline' },
  { id: 'Groceries', name: 'Groceries ', icon: 'cart-outline' },
  { id: 'Insurance', name: 'Insurance ', icon: 'shield-checkmark-outline' },
  { id: 'Taxes', name: 'Taxes ', icon: 'document-text-outline' },
  { id: 'Rent', name: 'Rent ', icon: 'home-outline' },
  { id: 'Utilities', name: 'Utilities ', icon: 'flash-outline' },
  { id: 'Travel', name: 'Travel ', icon: 'airplane-outline' },
  { id: 'Education', name: 'Education ', icon: 'school-outline' },
  { id: 'Other', name: 'Other ', icon: 'ellipsis-horizontal-outline' },
];

const CreateScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [type, setType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
  if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    Alert.alert('Error', 'Please enter a valid amount');
    return;
  }
  if (!selectedCategory) {
    Alert.alert('Error', 'Please select a category');
    return;
  }
  if (!type) {
    Alert.alert('Error', 'Please select a transaction type');
    return;
  }

  setIsLoading(true);

  try {
    const formattedAmount = type === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));
    const finalTitle = title.trim() || 'Untitled';

    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        title: finalTitle,
        amount: formattedAmount,
        category: selectedCategory,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create transaction');
    }

    ToastAndroid.show('Transaction created successfully', ToastAndroid.SHORT);
    router.back();
  } catch (error) {
    console.error('Create transaction error:', error);
    Alert.alert('Error', error.message || 'Failed to create transaction');
  } finally {
    setIsLoading(false);
  }
};


  const toggleType = (selectedType) => {
    setType(type === selectedType ? null : selectedType);
  };

  const toggleCategory = (id) => {
    setSelectedCategory(selectedCategory === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Transaction</Text>
        <TouchableOpacity
          style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.saveButton}>{isLoading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
            onPress={() => toggleType('expense')}
          >
            <Ionicons
              name="arrow-down-circle"
              size={22}
              color={type === 'expense' ? COLORS.white : COLORS.expense}
            />
            <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
            onPress={() => toggleType('income')}
          >
            <Ionicons
              name="arrow-up-circle"
              size={22}
              color={type === 'income' ? COLORS.white : COLORS.income}
            />
            <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>Income</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={COLORS.textLight}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="create-outline" size={22} color={COLORS.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Transaction Title"
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <Text style={styles.sectionTitle}>
          <Ionicons name="pricetag-outline" size={16} color={COLORS.text} /> Category
        </Text>

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryButton, selectedCategory === category.id && styles.categoryButtonActive]}
              onPress={() => toggleCategory(category.id)}
            >
              <Ionicons
                name={category.icon}
                size={20}
                color={selectedCategory === category.id ? COLORS.white : COLORS.text}
                style={styles.categoryIcon}
              />
              <Text
                style={[styles.categoryButtonText, selectedCategory === category.id && styles.categoryButtonTextActive]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};

export default CreateScreen;
