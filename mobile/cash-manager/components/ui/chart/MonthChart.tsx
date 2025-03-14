import React from 'react'
import { BarChart } from 'react-native-chart-kit'
import { Dimensions, StyleSheet } from 'react-native'
import { ThemedView } from '@/components/ThemedView';

function MonthChart() {
    const data = {
        labels: ["Income", "Expenses"],
        datasets: [
          {
            data: [30000, 10000],
            colors: [
                (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,     // Income: green
                (opacity = 1) => `rgba(255, 100, 0, ${opacity})`,    // Expenses: red
              ],          }
        ]
      };

      const chartConfig = {  
        fromZero: true,
        backgroundGradientFrom: "rgb(255, 255, 245)",
        backgroundGradientTo: "rgb(255, 255, 245)",
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        
        strokeWidth: 2,
        barPercentage: 2,
        withHorizontalLabels: false,
        showValuesOnTopOfBars: true,
        xAxisSuffix: " Ariary",
        propsForLabels: {
          fontFamily: 'Ubuntu',
          fontSize: 12,
        }
      };
      

      const graphStyle = {
        borderRadius: 16,
        fontFamily: "Ubuntu",
      }

      const screenWidth = Dimensions.get('window').width - 32;
      

  return (
    <ThemedView style={styles.chartContainer}>
        <BarChart
            style={graphStyle}
            data={data}
            width={screenWidth}
            height={250}
            yAxisLabel="Ariary"
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            withHorizontalLabels={false}
            xAxisLabel='(Ar)'
            fromZero={true}
            withCustomBarColorFromData={true}
            flatColor={true}
        />  
    </ThemedView>
    )
}

const styles = StyleSheet.create({
    chartContainer: {
        backgroundColor: "rgb(255, 255, 255)",
        borderWidth: 1,
        borderColor: "rgb(196, 197, 199)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        fontFamily: "Ubuntu",
    }
})

export default MonthChart