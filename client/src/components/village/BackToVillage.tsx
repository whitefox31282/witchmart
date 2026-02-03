interface BackToVillageProps {
  onReturn: () => void;
}

export default function BackToVillage({ onReturn }: BackToVillageProps) {
  return (
    <button
      onClick={onReturn}
      className="back-to-village"
      aria-label="Return to village"
      data-testid="button-back-to-village"
    >
      <span className="back-rune">ᚱ</span>
      <span>Back to Village</span>
    </button>
  );
}
