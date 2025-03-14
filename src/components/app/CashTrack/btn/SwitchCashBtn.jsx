
const SwitchCashBtn = ({ activeBtn, setActiveBtn }) => {
    const btns = [
        { id: 'expense', label: 'Dépense' },
        { id: 'income', label: 'Recette' },
    ]
    return (
        <div className="flex gap-2 bg-slate-100 border-slate-300 border w-fit p-1 rounded-xl">
            {btns.map((btn) => (
                <button 
                key={btn.id} 
                className={`px-4 py-2 rounded-lg ${activeBtn === btn.id ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                onClick={() => setActiveBtn(btn.id)}
                >
                    {btn.label}
                </button>
            ))}
        </div>
    )
}
export default SwitchCashBtn;