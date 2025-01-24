import React, { memo } from "react";
import { recoveryModalId } from "../../../helpers/jsx-ids";
import CopyableContent from "../../ui/CopyableContent";

const RecoveryToken = ({ token }) => {
  return (
    <dialog id={recoveryModalId} className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-black text-lg">Upload terminé!</h3>
        <p className="py-4">
          Vous pouvez récupérer votre video dans la page facebook{" "}
          <span
            className="tooltip tooltip-bottom"
            data-tip="Aller vers la page"
          >
            <a
              href="https://www.facebook.com/profile.php?id=100089271829072"
              target="_blank"
              className="font-bold bg-slate-50 hover:bg-slate-200 transition duration-300 p-1"
            >
              Fifohazam-panahy
            </a>{" "}
          </span>
          avec cette clé:{" "}
        </p>
        <CopyableContent text={token} />
      </div>
    </dialog>
  );
};

export default memo(RecoveryToken, (prevState, lastState) => {
  return prevState.token === lastState.token;
});
