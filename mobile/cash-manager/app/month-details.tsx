import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { Stack, useLocalSearchParams } from 'expo-router'
import LatestActivityList from '@/components/ui/list/LatestActivityList';
import MonthChart from '@/components/ui/chart/MonthChart';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
function MonthDetailsScreen() {
    const { month, year } = useLocalSearchParams();

    const income = 1000;
    const expenses = 500;
  return (
    <>
    <Stack.Screen
        options={{
          title: `${month} ${year}`, // 👈 titre custom
          headerTitleStyle: {
            fontFamily: 'UbuntuBold',
            fontSize: 20,
            color: 'rgb(107, 114, 128)',
          },
        }}
      />
    <ThemedView style={{flex: 1}}>
        <ThemedView style={styles.chartContainer}>
            <MonthChart />
        </ThemedView>

        <ThemedView style={styles.col2}>
                <ThemedView style={[styles.incomeContainer, { flex: 1 }]}>
                <Ionicons name="enter-outline" size={24} color="black" />
                        <ThemedView style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                            <ThemedText style={[styles.incomeLabel]}>Income</ThemedText>
                            <ThemedView style={[styles.circle, {backgroundColor: 'rgb(0, 200, 83)'}]} />
                        </ThemedView>
                        <ThemedView style={[styles.flexRow, { gap: 4 }]}>
                            <ThemedText style={[styles.incomeValue]}>{income}</ThemedText>
                            <ThemedText style={[styles.incomeCurrency]}>Ariary</ThemedText>
                        </ThemedView>
                </ThemedView>

                <ThemedView style={[styles.incomeContainer, { flex: 1 }]}>
                    <Ionicons name="exit-outline" size={24} color="black" />     
                    <ThemedView style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                        <ThemedText style={[styles.incomeLabel]}>
                            Expenses
                        </ThemedText>
                        <ThemedView style={[styles.circle, {backgroundColor: 'rgb(255, 100, 0)'}]} />
                    </ThemedView>
                    <ThemedView style={[styles.flexRow, { gap: 4 }]}>
                        <ThemedText style={[styles.incomeValue]}>{expenses}</ThemedText>
                        <ThemedText style={[styles.incomeCurrency]}>Ariary</ThemedText>
                    </ThemedView>
                </ThemedView>

            </ThemedView>

        <ThemedView style={styles.incomeContainer}>
            <ThemedText style={styles.cashHistory}>Cash History</ThemedText>
        </ThemedView>
        <LatestActivityList />
    </ThemedView>
    </>

  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartContainer: {
        margin: 16,
    },
    cashHistory: {
        fontSize: 16,
        fontFamily: 'UbuntuBold',
        margin: 16,
        color: 'rgb(107, 114, 128)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(196, 197, 199)',
    },
    col2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 16,
    },
    incomeContainer: {
        
    },
    circle: {
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: 'rgb(0, 200, 83)',
    },
    incomeLabel: {
        fontSize: 16,
        fontFamily: 'Ubuntu',
        marginBottom: 8,
    },
    incomeValue: {
        fontSize: 32,
        lineHeight: 32,
        fontFamily: 'UbuntuBold',
    },
    incomeCurrency: {
        fontSize: 14,
        fontFamily: 'UbuntuLight',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    incomeLabelCurrentMonth: {
        color: 'rgb(0, 200, 83)',
    },
    incomeValueCurrentMonth: {
        color: 'rgb(0, 200, 83)',
    },
    incomeCurrencyCurrentMonth: {
        color: 'rgb(0, 200, 83)',
    },
    expensesLabelCurrentMonth: {
        color: 'rgb(255, 100, 0)',
    },
    expensesValueCurrentMonth: {
        color: 'rgb(255, 100, 0)',
    },
    expensesCurrencyCurrentMonth: {
        color: 'rgb(255, 100, 0)',
    },
    

})

export default MonthDetailsScreen