const Field = ({ label, hint, children }) => (
  <label className="field">
    <span className="field-label">{label}</span>
    {children}
    {hint && <span className="hint">{hint}</span>}
  </label>
);

export default function MeasureForm({ form, onChange }) {
  const numField = (name, label, placeholder, hint) => (
    <Field label={label} hint={hint}>
      <input
        type="number"
        inputMode="decimal"
        step="any"
        placeholder={placeholder}
        value={form[name]}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </Field>
  );

  return (
    <>
      <fieldset className="section">
        <legend>About you</legend>
        <div className="grid">
          <Field label="Name (optional)">
            <input type="text" value={form.name} onChange={(e) => onChange('name', e.target.value)} />
          </Field>
          <Field label="Gender">
            <select value={form.sex} onChange={(e) => onChange('sex', e.target.value)}>
              <option value="">Choose</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Field>
          {numField('height', 'Height (cm)', 'e.g. 170')}
          {numField('weight', 'Weight (kg)', 'e.g. 72')}
          {numField('waist', 'Waist (cm)', 'e.g. 90', 'Measure midway between the lowest rib and the hip bone.')}
        </div>
      </fieldset>

      <fieldset className="section">
        <legend>Blood sugar <span className="optional">optional</span></legend>
        <div className="grid">
          {numField('fasting', 'Fasting sugar (mg/dL)', 'e.g. 95', 'Empty stomach, before your first meal of the morning.')}
          {numField('post', 'Post-meal sugar (mg/dL)', 'e.g. 130', 'Measured about 1.5 hours after a meal.')}
        </div>
      </fieldset>

      <fieldset className="section">
        <legend>Blood pressure <span className="optional">optional</span></legend>
        <div className="grid">
          {numField('sys', 'Systolic, top number (mmHg)', 'e.g. 120')}
          {numField('dia', 'Diastolic, bottom number (mmHg)', 'e.g. 80')}
        </div>
      </fieldset>
    </>
  );
}
