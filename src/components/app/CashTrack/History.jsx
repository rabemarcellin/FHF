import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllCash } from "../../../store/cash/selector";

const filterHistoryByType = (histories, type) => {
    return histories.filter(each => each.type === type)
}


const History = ({ type }) => {
    const [histories, setHistories] = useState([]);
   
    const allHistories = useSelector(selectAllCash)

    useEffect(() => {
        console.log(type)
        const result = filterHistoryByType(allHistories, type);
        console.log(result)
        setHistories(result);
    }, [type, allHistories]);

    // todo: table of id, date, amount, type, description
    return (
        <div className="border border-slate-400 rounded-xl max-w-4xl mx-auto overflow-x-auto">
            <table className="border-collapse w-full max-w-5xl">
                <thead>
                    <tr className="bg-slate-100 border-b border-slate-400">
                        <th className="p-2">Date</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {histories.map((history) => (
                        <tr key={history.id}>
                            <td className="p-2">{history.date}</td>
                            <td className="p-2">{history.description}</td>
                            <td className="p-2">{history.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default History;