// src/components/profile/FormField.tsx

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  select?: boolean;
  options?: { value: string; label: string }[];
  disabled?: boolean;
  readOnly?: boolean;
  half?: boolean;
}

export function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  textarea,
  select,
  options,
  disabled,
  readOnly,
  half,
}: Props) {
  return (
    <div className={`form-field ${half ? "half" : ""}`}>
      <label className="form-label">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-input form-textarea"
          disabled={disabled}
          readOnly={readOnly}
        />
      ) : select ? (
        <div className="form-select-wrapper">
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="form-input form-select"
            disabled={disabled}
          >
            {options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg
            className="select-arrow"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-input"
          disabled={disabled}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}
