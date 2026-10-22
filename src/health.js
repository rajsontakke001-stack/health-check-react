export const EMPTY_FORM = {
  name: '', sex: '', height: '', weight: '', waist: '',
  fasting: '', post: '', sys: '', dia: '',
};

const LIMITS = {
  height: [80, 250], weight: [20, 300], waist: [40, 200],
  fasting: [30, 600], post: [30, 800], sys: [60, 260], dia: [30, 160],
};

const RANK = { good: 0, warn: 1, bad: 2 };
const worst = (tones) => tones.reduce((a, b) => (RANK[b] > RANK[a] ? b : a), 'good');
const band = (v, bands) => bands.find(([max]) => v < max)[1];
const waistLimits = (sex) => (sex === 'male' ? [94, 102] : [80, 88]);

const NORMAL = { key: 'normal', label: 'Normal', tone: 'good' };
const PRE = { key: 'pre', label: 'Prediabetes range', tone: 'warn' };
const DIA = { key: 'dia', label: 'Diabetic range', tone: 'bad' };

const BMI_BANDS = [
  [18.5, { key: 'under', label: 'Underweight', tone: 'warn' }],
  [25, { key: 'healthy', label: 'Healthy weight', tone: 'good' }],
  [30, { key: 'over', label: 'Overweight', tone: 'warn' }],
  [Infinity, { key: 'obese', label: 'Obese', tone: 'bad' }],
];
const FASTING_BANDS = [
  [70, { key: 'low', label: 'Low', tone: 'warn' }],
  [100, NORMAL], [126, PRE], [Infinity, DIA],
];
const POST_BANDS = [[140, NORMAL], [200, PRE], [Infinity, DIA]];

const VERDICTS = {
  good: 'Looking good overall',
  warn: 'Some areas need attention',
  bad: 'Some readings need medical attention',
};

function bpResult(s, d) {
  if (s > 180 || d > 120) return { key: 'crisis', label: 'Unhealthy: hypertensive crisis', tone: 'bad' };
  if (s >= 140 || d >= 90) return { key: 's2', label: 'Unhealthy: stage 2 hypertension', tone: 'bad' };
  if (s >= 130 || d >= 80) return { key: 's1', label: 'Unhealthy: stage 1 hypertension', tone: 'warn' };
  if (s >= 120) return { key: 'elev', label: 'Unhealthy: elevated', tone: 'warn' };
  return { key: 'normal', label: 'Healthy', tone: 'good' };
}

function waistResult(w, sex) {
  const [mid, high] = waistLimits(sex);
  if (w >= high) return { key: 'high', label: 'High risk', tone: 'bad' };
  if (w >= mid) return { key: 'mid', label: 'Increased risk', tone: 'warn' };
  return { key: 'low', label: 'Low risk', tone: 'good' };
}

export function validate(f) {
  const errs = [];
  const check = (label, v, [min, max], required) => {
    if (v === '') {
      if (required) errs.push(`${label} is needed.`);
      return;
    }
    const n = Number(v);
    if (!Number.isFinite(n) || n < min || n > max) errs.push(`${label} should be between ${min} and ${max}.`);
  };
  if (!f.sex) errs.push('Choose a gender, since waist standards differ for men and women.');
  check('Height (cm)', f.height, LIMITS.height, true);
  check('Weight (kg)', f.weight, LIMITS.weight, true);
  check('Waist (cm)', f.waist, LIMITS.waist, true);
  check('Fasting sugar (mg/dL)', f.fasting, LIMITS.fasting, false);
  check('Post-meal sugar (mg/dL)', f.post, LIMITS.post, false);
  check('Systolic pressure (mmHg)', f.sys, LIMITS.sys, false);
  check('Diastolic pressure (mmHg)', f.dia, LIMITS.dia, false);
  if ((f.sys === '') !== (f.dia === '')) errs.push('Enter both blood pressure numbers, or leave both empty.');
  else if (f.sys !== '' && Number(f.sys) <= Number(f.dia)) errs.push('Systolic pressure should be higher than diastolic pressure.');
  return errs;
}

function buildRecs({ bmi, waist, fasting, post, bp }) {
  const recs = [];
  const add = (title, items) => recs.push({ title, items });
  const sugar = [fasting, post].filter(Boolean);

  if (bmi.key === 'under') {
    add('Body weight', [
      'Eat regular, nutrient-dense meals such as dal, eggs, paneer, nuts and whole grains.',
      'If your weight loss was not intentional, see a doctor.',
    ]);
  } else if (bmi.key === 'healthy') {
    add('Body weight', ['Your weight is in the healthy range. Keep balanced meals and regular activity to maintain it.']);
  } else {
    add('Body weight', [
      'Aim for a gradual loss of about 0.5 to 1 kg per week. Losing 5 to 10% of body weight can meaningfully reduce health risks.',
      'Cut back on fried food, sweets, sugary drinks and refined flour, and fill half your plate with vegetables.',
    ]);
  }

  if (waist.key !== 'low') {
    add('Waist', ['Abdominal fat raises the risk of diabetes and heart disease. Daily walks, more fibre and fewer late-night snacks all help.']);
  }

  if (sugar.some((s) => s.key === 'dia')) {
    add('Blood sugar', [
      'Your readings are in the diabetic range. Please see a doctor soon. Diagnosis usually needs a confirmatory test, such as HbA1c or a repeat glucose test.',
      'Until then, cut back on sugary drinks, sweets and refined carbohydrates.',
    ]);
  } else if (sugar.some((s) => s.key === 'pre')) {
    add('Blood sugar', [
      'Your readings are in the prediabetes range. This is often reversible with diet changes and regular activity.',
      'Walk for 10 to 15 minutes after meals to blunt sugar spikes.',
      'Ask your doctor about an HbA1c test.',
    ]);
  }
  if (fasting && fasting.key === 'low') {
    add('Low fasting sugar', ['Readings below 70 mg/dL can cause shakiness, sweating or dizziness. If this happens, take a quick sugar source and contact a doctor.']);
  }
  if (sugar.length && sugar.every((s) => s.key === 'normal')) {
    add('Blood sugar', ['Your blood sugar is in the normal range. Keep up regular checks as your doctor advises.']);
  }

  if (bp) {
    if (bp.key === 'crisis') {
      add('Blood pressure', ['This is in the hypertensive crisis range. Seek urgent medical care now, especially with chest pain, breathlessness, severe headache or confusion.']);
    } else if (bp.key === 's1' || bp.key === 's2') {
      add('Blood pressure', [
        'Cut salt to under 5 g a day (about one teaspoon), limit alcohol, avoid smoking and manage stress.',
        'See a doctor for a proper evaluation, since treatment decisions depend on your full health profile.',
      ]);
    } else if (bp.key === 'elev') {
      add('Blood pressure', [
        'Lower salt, eat more fruit, vegetables and potassium-rich foods, and stay physically active.',
        'Recheck your reading regularly.',
      ]);
    } else {
      add('Blood pressure', ['Your blood pressure is in the healthy range. Keep checking it from time to time.']);
    }
  }

  add('Physical activity', ['Aim for at least 150 minutes of moderate activity each week, such as brisk walking or cycling, plus strength exercises twice a week.']);
  add('Next step', ['Bring this report to your doctor to confirm the results and decide on any follow-up tests.']);
  return recs;
}

export function analyze(f) {
  const hm = Number(f.height) / 100;
  const waist = Number(f.waist);
  const bmi = Number(f.weight) / (hm * hm);
  const [mid, high] = waistLimits(f.sex);
  const bmiRes = band(bmi, BMI_BANDS);
  const waistRes = waistResult(waist, f.sex);
  const fasting = f.fasting !== '' ? band(Number(f.fasting), FASTING_BANDS) : null;
  const post = f.post !== '' ? band(Number(f.post), POST_BANDS) : null;
  const bp = f.sys !== '' ? bpResult(Number(f.sys), Number(f.dia)) : null;

  const metrics = [
    {
      title: 'BMI', valueText: `${bmi.toFixed(1)} kg/m²`, value: bmi, result: bmiRes,
      min: 15, max: 40, zones: [[18.5, 'warn'], [25, 'good'], [30, 'warn'], [40, 'bad']],
      ref: '18.5 to 24.9',
      note: `Healthy weight for your height is about ${(18.5 * hm * hm).toFixed(1)} to ${(24.9 * hm * hm).toFixed(1)} kg.`
        + (bmi >= 23 && bmi < 25 ? ' For Asian adults, health risk already rises from a BMI of 23.' : ''),
    },
    {
      title: 'Waist', valueText: `${waist} cm`, value: waist, result: waistRes,
      min: 50, max: 130, zones: [[mid, 'good'], [high, 'warn'], [130, 'bad']],
      ref: f.sex === 'male' ? 'under 94 cm (men)' : 'under 80 cm (women)',
      note: 'Measured midway between the lowest rib and the hip bone. Risk thresholds differ for men and women.',
    },
  ];
  if (fasting) metrics.push({
    title: 'Fasting sugar', valueText: `${f.fasting} mg/dL`, value: Number(f.fasting), result: fasting,
    min: 50, max: 200, zones: [[70, 'warn'], [100, 'good'], [126, 'warn'], [200, 'bad']],
    ref: '70 to 99 mg/dL',
    note: 'Taken on an empty stomach, before the first meal of the day.',
  });
  if (post) metrics.push({
    title: 'Post-meal sugar', valueText: `${f.post} mg/dL`, value: Number(f.post), result: post,
    min: 70, max: 300, zones: [[140, 'good'], [200, 'warn'], [300, 'bad']],
    ref: 'under 140 mg/dL',
    note: 'Taken about 1.5 hours after a meal. Standard targets are set at 2 hours, so treat this as a screening estimate.',
  });
  if (bp) metrics.push({
    title: 'Blood pressure', valueText: `${f.sys}/${f.dia} mmHg`, value: Number(f.sys), result: bp,
    min: 80, max: 200, zones: [[120, 'good'], [140, 'warn'], [200, 'bad']],
    ref: 'under 120/80 mmHg',
    note: 'Classified on both numbers using the ACC/AHA 2017 guideline. The marker shows the top number.',
  });

  const tone = worst(metrics.map((m) => m.result.tone));
  return {
    name: f.name.trim(),
    date: new Date(),
    metrics,
    tone,
    verdictText: VERDICTS[tone],
    recs: buildRecs({ bmi: bmiRes, waist: waistRes, fasting, post, bp }),
    urgent: bp !== null && bp.key === 'crisis',
  };
}

export const STANDARDS = [
  { title: 'BMI (kg/m²)', rows: [['Underweight', 'Below 18.5'], ['Healthy', '18.5 to 24.9'], ['Overweight', '25.0 to 29.9'], ['Obese', '30.0 and above']] },
  { title: 'Waist (cm)', rows: [['Low risk', 'Men under 94, women under 80'], ['Increased', 'Men 94 to 101, women 80 to 87'], ['High risk', 'Men 102 and above, women 88 and above']] },
  { title: 'Fasting sugar (mg/dL)', rows: [['Low', 'Below 70'], ['Normal', '70 to 99'], ['Prediabetes', '100 to 125'], ['Diabetes range', '126 and above']] },
  { title: 'Post-meal sugar (mg/dL)', rows: [['Normal', 'Below 140'], ['Prediabetes', '140 to 199'], ['Diabetes range', '200 and above']] },
  { title: 'Blood pressure (mmHg)', rows: [['Healthy', 'Below 120 and below 80'], ['Elevated', '120 to 129, and below 80'], ['Stage 1', '130 to 139, or 80 to 89'], ['Stage 2', '140 and above, or 90 and above'], ['Crisis', 'Above 180 and/or above 120']] },
];
