export const createCash  = (state, action) => {
    // todo: verification of action.payload
    console.log("action.payload", action.payload, state)
    state = [...state, action.payload]
    return state
}