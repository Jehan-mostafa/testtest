// src/components/profile/SaveButton.tsx
interface Props {
  loading?: boolean;
  label?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function SaveButton({
  loading,
  label = "Save Changes",
  onClick,
  type = "button",
}: Props) {
  return (
    <button
      type={type}
      className="btn-save"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="btn-spinner" />
          Saving...
        </>
      ) : (
        label
      )}
    </button>
  );
}
