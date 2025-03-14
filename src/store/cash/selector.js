export const selectAllCash = (state) => state.cash


export const selectExpenseCash = (state) => {
    return state.cash.filter(each => each.type === "expense")
}

export const selectIncomeCash = (state) => {
    return state.cash.filter(each => each.type === "income")
}

export const selectTotalExpenseCash = (state) => {
    return selectExpenseCash(state).reduce((acc, curr) => acc + curr.amount, 0)
}

export const selectTotalIncomeCash = (state) => {
    return selectIncomeCash(state).reduce((acc, curr) => acc + curr.amount, 0)
}

export const selectTotalCash = (state) => {
    const expenseCash = selectExpenseCash(state) 
    const incomeCash = selectIncomeCash(state)
    console.log("expenseCash", expenseCash)
    console.log("incomeCash", incomeCash)
    console.log(typeof selectTotalExpenseCash(state),
        selectTotalExpenseCash(state),
        typeof selectTotalIncomeCash(state),
        selectTotalIncomeCash(state))
    return selectTotalExpenseCash(state) - selectTotalIncomeCash(state)
}


