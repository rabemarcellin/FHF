import React, { useRef, useMemo, useCallback, useState } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const DATA = [
  {
    id: '1',
    title: 'First Item',
    amount: 1000,
    date: '2024-01-01',
    motif: 'First Item',
    type: 'income',
  },
  {
    id: '2',
    title: 'Second Item',
    amount: 2000,
    date: '2024-01-02',
    motif: 'Second Item',
    type: 'expense',
  },
  {
    id: '3',
    title: 'Third Item',
    amount: 1500,
    date: '2024-01-03',
    motif: 'Third Item',
    type: 'income',
  },
];

type ItemProps = {
  title: string;
  amount: number;
  date: string;
  motif: string;
  type: string;
};

const Item = ({ title, amount, date, motif, type }: ItemProps) => (
  <ThemedView style={[styles.item]}>
    <ThemedView style={styles.flexRow}>
      <ThemedView>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.date}>{date}</ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedView style={[styles.flexRow, { gap: 4 }]}>
          <ThemedText style={styles.amount}>{amount}</ThemedText>
          <ThemedText style={styles.currency}>Ariary</ThemedText>
        </ThemedView>
        <ThemedText
          style={[
            styles.currency,
            {
              color: type === 'income' ? 'green' : 'red',
              fontFamily: 'UbuntuBold',
            },
          ]}
        >
          {type}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  </ThemedView>
);

const LatestActivityList = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['100%'], []);
  const [selectedItem, setSelectedItem] = useState<ItemProps | null>(null);

  const handleOpenSheet = useCallback((item: ItemProps) => {
    setSelectedItem(item);
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={DATA}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleOpenSheet(item)}>
                <Item {...item} />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>

        {/* BottomSheet EN DEHORS de SafeAreaView */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          enableDynamicSizing={false}
          style={styles.bottomSheet}
        >
          <BottomSheetView style={styles.sheetContent}>
            {selectedItem && (
              <>
                <Text style={styles.sheetTitle}>{selectedItem.title}</Text>
                <Text>Date : {selectedItem.date}</Text>
                <Text>Motif : {selectedItem.motif}</Text>
                <Text>Montant : {selectedItem.amount} Ariary</Text>
                <Text
                  style={{
                    color:
                      selectedItem.type === 'income' ? 'green' : 'red',
                    marginTop: 8,
                    fontWeight: 'bold',
                  }}
                >
                  Type : {selectedItem.type}
                </Text>
              </>
            )}
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'UbuntuBold',
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontFamily: 'UbuntuBold',
  },
  date: {
    fontSize: 14,
    fontFamily: 'UbuntuLight',
  },
  currency: {
    fontSize: 14,
    fontFamily: 'UbuntuLight',
  },
  sheetContent: {
    backgroundColor: '#fff',
    padding: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});

export default LatestActivityList;
