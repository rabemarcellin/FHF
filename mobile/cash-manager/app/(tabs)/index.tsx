import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import MonthStatCarousel from '@/components/ui/carousel/MonthStatCarousel';
import LatestActivityList from '@/components/ui/list/LatestActivityList'


function HomeScreen() {


  return (
        <ThemedView style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
                {/* Search Bar */}
    

                {/* Amount Card */}
                <ThemedView style={styles.amountCard}>
                    <ThemedText style={styles.totalAmountLabel}>Caisse actuelle</ThemedText>
                    <ThemedView style={styles.totalAmount}>
                        <ThemedText style={styles.totalAmountValue}>1000</ThemedText>
                        <ThemedText style={styles.totalAmountCurrency}>Ariary</ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Month Stats */}
                <MonthStatCarousel />

                {/* Recent Transactions */}
                <ThemedView style={styles.recentTransactions}>
                    <ThemedText style={styles.recentTransactionsLabel}>Recent Transactions</ThemedText>
                </ThemedView>

                <LatestActivityList />

            </SafeAreaView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  amountCard: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 16,
    margin: 16,
  },
  totalAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'transparent',
  },
  totalAmountLabel: {
    fontSize: 16,
    fontFamily: 'UbuntuBold',
    textAlign: 'center',
    color: 'rgb(107, 114, 128)',
    marginBottom: 8,
  },
  totalAmountValue: {
    fontSize: 62,
    height: 62,
    lineHeight: 62,
    fontFamily: 'UbuntuBold',
  },
  totalAmountCurrency: {
    fontSize: 16,
    fontFamily: 'Ubuntu',
  },
  searchBar: {
    padding: 16,
    borderRadius: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: 'rgb(208, 214, 245)',
  },
  recentTransactions: {
    padding: 8,
    paddingBottom: 0,
    borderRadius: 16,
    marginTop: 8,
  },
  recentTransactionsLabel: {
    fontSize: 16,
    fontFamily: 'UbuntuBold',
    color: 'rgb(107, 114, 128)',
    marginHorizontal: 10,
    
  },
  recentTransactionsList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  recentTransactionsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  recentTransactionsItemTitle: {
    fontSize: 16,
    fontFamily: 'UbuntuBold',
    textAlign: 'center',
    color: 'rgb(107, 114, 128)',
    marginBottom: 8,
  },
  
})

export default HomeScreen;