import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import * as React from "react";
import { useWindowDimensions, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';


type MonthStat = {
    month: string;
    year: number;
    amount: number;
    expenses: number;
    income: number;
    amountState: number;
    isCurrentMonth: boolean;
}

const styles = StyleSheet.create({
    card: {
        boxShadow: '1px 1px 10px 0 rgba(0, 0, 0, 0.1)',
        padding: 16,
        borderRadius: 16,
        margin: 16,
        height: 250,

    },
    currentMonth: {
        backgroundColor: 'rgb(93, 180, 31)',
    },
    incomeContainer: {
        backgroundColor: 'transparent',
    },
    date: {
        fontSize: 32,
        lineHeight: 32,
        fontWeight: 'thin',
        marginBottom: 8,
        color: 'rgb(107, 114, 128)',
        fontFamily: 'Ubuntu',
        backgroundColor: 'transparent',
    },
    dateCurrentMonth: {
        color: 'white',
    },
    incomeLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: 'rgb(107, 114, 128)',
        fontFamily: 'UbuntuBold',
    },
    incomeLabelCurrentMonth: {
        color: 'white',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'transparent',
    },
    totalAmount: {
        fontSize: 24,
        fontFamily: 'UbuntuBold',
        backgroundColor: 'transparent',
    },
    totalAmountCurrentMonth: {
        color: 'white',
    },

    incomeValue: {
        fontSize: 40,
        lineHeight: 40,
        fontFamily: 'UbuntuBold',
    },
    incomeValueCurrentMonth: {
        color: 'white',
    },
    incomeCurrency: {
        fontSize: 16,
        color: 'rgb(107, 114, 128)',
        fontFamily: 'Ubuntu',
    },
    incomeCurrencyCurrentMonth: {
        color: 'white',
    },
    col2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    currentMonthText: {
        fontSize: 16,
        fontFamily: 'UbuntuBold',
        color: 'rgb(172, 217, 25)',
    },
})

const MonthCard = ({item}: {item: MonthStat}) => {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.push({pathname: '/month-details', params: { month: item.month, year: item.year}})}>
        <ThemedView style={[styles.card, item.isCurrentMonth ? styles.currentMonth : {}]}>
             {item.isCurrentMonth && (
                <ThemedView style={{ backgroundColor: 'transparent'}}>
                    <ThemedText style={styles.currentMonthText}>Current Month</ThemedText>
                </ThemedView>
            )}
            <ThemedView style={{...styles.flexRow, ...styles.date}}>
                <ThemedText style={[styles.date, item.isCurrentMonth ? styles.dateCurrentMonth : {}]}>{item.month}</ThemedText>
                <ThemedText style={[styles.date, item.isCurrentMonth ? styles.dateCurrentMonth : {}]}>{item.year}</ThemedText>
            </ThemedView>
           

            <ThemedView style={styles.flexRow}>
            <ThemedView style={[styles.incomeContainer, { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                    <ThemedText style={[styles.incomeLabel, item.isCurrentMonth ? styles.incomeLabelCurrentMonth : {}]}>Total</ThemedText>
                    <ThemedView style={styles.flexRow}>
                        <ThemedText style={[styles.totalAmount, item.isCurrentMonth ? styles.totalAmountCurrentMonth : {}]}>{item.amountState}</ThemedText>
                        <ThemedText style={[styles.incomeCurrency, item.isCurrentMonth ? styles.incomeCurrencyCurrentMonth : {}]}>Ariary</ThemedText>
                    </ThemedView>
                </ThemedView>
            </ThemedView>

            <ThemedView style={styles.col2}>
                <ThemedView style={[styles.incomeContainer, { flex: 1 }]}>
                <Ionicons name="enter-outline" size={24} color="black" />
                        <ThemedText style={[styles.incomeLabel, item.isCurrentMonth ? styles.incomeLabelCurrentMonth : {}]}>Income</ThemedText>
                        <ThemedView style={styles.flexRow}>
                            <ThemedText style={[styles.incomeValue, item.isCurrentMonth ? styles.incomeValueCurrentMonth : {}]}>{item.income}</ThemedText>
                            <ThemedText style={[styles.incomeCurrency, item.isCurrentMonth ? styles.incomeCurrencyCurrentMonth : {}]}>Ariary</ThemedText>
                        </ThemedView>
                </ThemedView>

                <ThemedView style={[styles.incomeContainer, { flex: 1 }]}>
                    <Ionicons name="exit-outline" size={24} color="black" />                   
                    <ThemedText style={[styles.incomeLabel, item.isCurrentMonth ? styles.incomeLabelCurrentMonth : {}]}>
                        
                        Expenses
                        
                        </ThemedText>
                    <ThemedView style={styles.flexRow}>
                        <ThemedText style={[styles.incomeValue, item.isCurrentMonth ? styles.incomeValueCurrentMonth : {}]}>{item.expenses}</ThemedText>
                        <ThemedText style={[styles.incomeCurrency, item.isCurrentMonth ? styles.incomeCurrencyCurrentMonth : {}]}>Ariary</ThemedText>
                    </ThemedView>
                </ThemedView>

            </ThemedView>
        </ThemedView>
        </TouchableOpacity>
    )
}

const renderItem = ({ item }: { item: MonthStat }) => {
    return <MonthCard item={item} />
}

const data: MonthStat[] = [
    { month: 'January', year: 2024, amount: 1000, expenses: 500, income: 500, amountState: 1000, isCurrentMonth: true },
    { month: 'February', year: 2024, amount: 1000, expenses: 500, income: 500, amountState: 1000, isCurrentMonth: false },
    { month: 'March', year: 2024, amount: 1000, expenses: 500, income: 500, amountState: 1000, isCurrentMonth: false },
]
 
function MonthStatCarousel() {

    const { width: screenWidth } = useWindowDimensions()

    const sliderWidth = screenWidth;

	const progress = useSharedValue<number>(0);

 
      
 
	return (
		<ThemedView
			id="carousel-component"
			dataSet={{ kind: "basic-layouts", name: "parallax" }}
		>
			<Carousel
                autoPlayInterval={2000}
                data={data}
                height={258}
                loop={false}
                pagingEnabled={true}
                snapEnabled={true}
                width={sliderWidth}
                style={{ width: sliderWidth }}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                }}
                onProgressChange={progress}
				renderItem={renderItem} // ✅ ne pas appeler la fonction ici
			/>

		</ThemedView>
	);
}
 
export default MonthStatCarousel;
 