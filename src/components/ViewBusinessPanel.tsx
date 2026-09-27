import type { UserBusiness } from "../data/userBusiness";
import { CATEGORY_ICON, CATEGORY_LABEL } from "../data/userBusiness";

interface Props {
  business: UserBusiness;
  onClose: () => void;
  onRemove: () => void;
}

export default function ViewBusinessPanel({
  business,
  onClose,
  onRemove,
}: Props) {
  return (
    <div className="add-business-overlay" onClick={onClose}>
      <div
        className="add-business-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="add-business-title">
          {CATEGORY_ICON[business.category]} {business.name}
        </div>
        <div className="add-business-subtitle">
          {CATEGORY_LABEL[business.category]} · Building #{business.buildingId}
        </div>
        <div className="view-business-note">
          Added by you in this session. This is a prototype — nothing is
          saved to a server yet.
        </div>
        <div className="add-business-actions">
          <button
            type="button"
            className="add-business-btn secondary"
            onClick={onRemove}
          >
            Remove
          </button>
          <button
            type="button"
            className="add-business-btn primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
