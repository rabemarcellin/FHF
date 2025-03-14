import React from 'react'
import { selectTotalCash } from '../../../store/cash/selector';
import { useSelector } from 'react-redux';

function TotalCash({ currency }) {

    const totalCash = useSelector(selectTotalCash)
    // todo: format amount to 3 digits
    const formattedAmount = totalCash.toLocaleString('fr-FR');
  return (
    <div className="border p-2 bg-slate-200 my-4 rounded-xl">
    <div className="mb-2">Total caisse</div>
    <div className="flex gap-2">
        <h1 className="font-bold text-4xl">{formattedAmount}</h1>
        <span>{currency}</span>
    </div>
    
</div>
  )
}

export default TotalCash