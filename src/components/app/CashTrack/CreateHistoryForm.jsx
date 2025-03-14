import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { createCashAction } from '../../../store/cash/reducer';


export const createHistoryFormModalId = 'createHistoryFormModal';

const currency = "Ariary"

function CreateHistoryForm() {
    const dispatch = useDispatch()
    const [form, setForm] = useState({
        type: "expense",
        date: "",
        amount: 0,
        description: ""
    })

    const updateForm = (type, value) => {
        setForm({...form, [type]: value})
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log("form", form)
        dispatch(createCashAction(form))
        setForm({
            type: "expense",
            date: "",
            amount: 0,
            description: ""
        })
        document.getElementById(createHistoryFormModalId).close()
    }
    
  return (
    <dialog id={createHistoryFormModalId} className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg">Nouvelle transaction</h3>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Type</span>
                    <select className="select select-bordered w-full max-w-xs" value={form.type} onChange={event => {
                        console.log("event", event)
                        updateForm("type", event.target.value)
                    }}>
                        <option value="expense">Dépense</option>
                        <option value="income">Recette</option>
                    </select>
                </label>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Date</span>
                    <input 
                    type="date" 
                    value={form.date}
                    onChange={event => updateForm("date", event.target.value)}
                    className="input input-bordered w-full max-w-xs" />
                </label>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Montant({currency})</span>
                    <input 
                    type="number" 
                    value={form.amount}
                    onChange={event => updateForm("amount", parseFloat(event.target.value))}
                    className="input input-bordered w-full max-w-xs" />
                </label>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Description</span>
                    <textarea 
                    value={form.description}
                    onChange={event => updateForm("description", event.target.value)}
                    className="textarea textarea-bordered w-full max-w-xs" />
                </label>
            </div>

            <div className="modal-action">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                    <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
                </form>
            </div>
        </div>  
    </dialog>
  )
}

export default CreateHistoryForm