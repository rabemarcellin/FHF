import React from "react";

export default function ExitFSModal({ exitFS }) {
  const closeModal = () => {
    document.getElementById("modal_exit_fs").close();
  };
  return (
    <dialog id="modal_exit_fs" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-black text-base">Vidéo en cours</h3>
        <p className="py-4">
          Si vous quittez maintenant, toutes les modifications que vous avez
          fait seront perdu pour de bon.
        </p>

        <div className="modal-action">
          {/* if there is a button, it will close the modal */}
          <div className="flex gap-4">
            <button
              className="btn btn-ghost hover:bg-red-500 hover:text-white"
              onClick={() => {
                closeModal();
                exitFS();
              }}
            >
              Quitter
            </button>
            <form method="dialog">
              <button className="btn btn-neutral">Annuler</button>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
}
