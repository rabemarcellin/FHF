import { useState } from "react";
import TotalCash from "../../../components/app/CashTrack/TotalCash";
import SwitchCashBtn from "../../../components/app/CashTrack/btn/SwitchCashBtn";
import History from "../../../components/app/CashTrack/History";
import CreateHistoryForm, { createHistoryFormModalId } from "../../../components/app/CashTrack/CreateHistoryForm";

const CashTrack = () => {
    const [activeBtn, setActiveBtn] = useState('expense');
  return (
    <div>
        <TotalCash  currency="Ar" />

        <div className="grid grid-cols-2 gap-4">
            <div>Graphique des dépenses</div>
            <div>Graphique des recettes</div>
        </div>

        <div className="my-4 flex items-center justify-between">
          <SwitchCashBtn activeBtn={activeBtn} setActiveBtn={setActiveBtn} />
          <div>
            <button 
                onClick={()=>document.getElementById(createHistoryFormModalId).showModal()}
                data-tip="Créer une transaction" 
                className="tooltip bg-gray-800 hover:bg-gray-600 transition-colors duration-300 text-white w-10 h-10 rounded-full flex items-center justify-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
          </div>
        </div>

        <History type={activeBtn} />
        <CreateHistoryForm />
    </div>
  );
};

export default CashTrack;