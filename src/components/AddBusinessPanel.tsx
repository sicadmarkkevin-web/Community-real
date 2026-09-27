import { useState } from "react";
import type { BusinessCategory } from "../data/userBusiness";
import { CATEGORY_ICON, CATEGORY_LABEL } from "../data/userBusiness";
import type { OsmBuilding } from "./BuildingLayer";

interface Props {
  building: OsmBuilding;
  onCancel: () => void;
  onSubmit: (name: string, category: BusinessCategory) => void;
}

const CATEGORIES: BusinessCategory[] = [
  "store",
  "water",
  "food",
  "service",
  "other",
];

export default function AddBusinessPanel({
  building,
  onCancel,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<BusinessCategory>("store");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed, category);
  };

  return (
    <div className="add-business-overlay" onClick={onCancel}>
      <form
        className="add-business-panel"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="add-business-title">Add a business here</div>
        <div className="add-business-subtitle">
          Building #{building.id}
        </div>

        <label className="add-business-label">
          Business name
          <input
            className="add-business-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aling Nena's Sari-Sari Store"
            autoFocus
            maxLength={60}
          />
        </label>

        <label className="add-business-label">Category</label>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              className={
                "category-option" + (category === cat ? " selected" : "")
              }
              onClick={() => setCategory(cat)}
            >
              <span className="category-icon">{CATEGORY_ICON[cat]}</span>
              <span>{CATEGORY_LABEL[cat]}</span>
            </button>
          ))}
        </div>

        <div className="add-business-actions">
          <button
            type="button"
            className="add-business-btn secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="add-business-btn primary">
            Add Business
          </button>
        </div>
      </form>
    </div>
  );
}
