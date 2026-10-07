import { fraudMLService } from '../src/ml/fraudMLPipeline';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const prediction = fraudMLService.predict(body);
    res.status(200).json({ success: true, data: prediction });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
