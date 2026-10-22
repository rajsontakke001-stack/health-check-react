import { useCallback, useState } from 'react';
import Hero from './components/Hero.jsx';
import MeasureForm from './components/MeasureForm.jsx';
import Report from './components/Report.jsx';
import { EMPTY_FORM, analyze, validate } from './health.js';

export default function App() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState([]);
  const [report, setReport] = useState(null);
  const [open, setOpen] = useState(false);

  const onChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const generate = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (errs.length) {
      setReport(null);
      setOpen(false);
      return;
    }
    setReport(analyze(form));
    setOpen(true);
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setErrors([]);
    setReport(null);
    setOpen(false);
  };

  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="app">
      <Hero />

      <section className="check" id="check">
        <div className="section-intro">
          <h2>Enter your measurements</h2>
          <p>Height and weight are required. Blood sugar and blood pressure are optional, but they make the report more complete.</p>
        </div>

        <form className="panel" onSubmit={generate} noValidate>
          <MeasureForm form={form} onChange={onChange} />
          {errors.length > 0 && (
            <div className="errors" role="alert">
              {errors.map((msg) => <p key={msg}>{msg}</p>)}
            </div>
          )}
          <div className="actions">
            <button type="submit" className="btn primary">Generate report</button>
            {report && !open && (
              <button type="button" className="btn ghost" onClick={() => setOpen(true)}>View last report</button>
            )}
            <button type="button" className="btn ghost" onClick={reset}>Clear all</button>
          </div>
        </form>
      </section>

      {open && report && <Report report={report} onClose={close} />}
    </div>
  );
}
