import { fraudMLService } from '../src/ml/fraudMLPipeline';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      const metrics = fraudMLService.trainPipeline();
      res.status(200).json({ success: true, data: metrics, message: 'Model retrained on 10,000 synthetic samples.' });
    } else {
      const metrics = fraudMLService.getMetrics();
      res.status(200).json({ success: true, data: metrics });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
