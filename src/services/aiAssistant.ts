import { GoogleGenAI } from '@google/genai';
import { ComplaintCategory, ComplaintPriority, Complaint } from '../types';

interface ComplaintAnalysisResult {
  title: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  suggestedAction: string;
  safetyHazard: boolean;
  improvedDescription: string;
}

const CATEGORIES: ComplaintCategory[] = [
  'Infrastructure',
  'Electrical',
  'Plumbing',
  'Network & Wi-Fi',
  'Sanitation & Cleanliness',
  'Hostel & Housing',
  'Cafeteria & Food',
  'Security & Safety',
  'Classroom & Labs'
];

export async function analyzeComplaintDescription(
  rawText: string,
  building?: string,
  room?: string
): Promise<ComplaintAnalysisResult> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any)?.__ENV__?.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are the CampusFix AI Operations Assistant at a university.
Analyze this student issue report:
"${rawText}"
Location context: Building: "${building || 'Campus'}", Room: "${room || 'General Area'}"

Respond ONLY with a valid JSON object with the following keys:
{
  "title": "Concise, professional headline for the issue (max 8 words)",
  "category": "One of: Infrastructure, Electrical, Plumbing, Network & Wi-Fi, Sanitation & Cleanliness, Hostel & Housing, Cafeteria & Food, Security & Safety, Classroom & Labs",
  "priority": "One of: low, medium, high, urgent",
  "suggestedAction": "Immediate recommendation for campus facility staff (1 sentence)",
  "safetyHazard": boolean (true if water near electricity, structural risk, fire hazard, or bodily danger),
  "improvedDescription": "A clear, well-structured description of the problem for the repair technician"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return {
          title: parsed.title || 'Reported Campus Issue',
          category: CATEGORIES.includes(parsed.category) ? parsed.category : 'Infrastructure',
          priority: ['low', 'medium', 'high', 'urgent'].includes(parsed.priority) ? parsed.priority : 'medium',
          suggestedAction: parsed.suggestedAction || 'Dispatch technician for on-site assessment.',
          safetyHazard: Boolean(parsed.safetyHazard),
          improvedDescription: parsed.improvedDescription || rawText
        };
      }
    } catch (e) {
      console.warn('Gemini analysis error, using intelligent campus fallback parser', e);
    }
  }

  // Intelligent fallback rules engine
  const lower = rawText.toLowerCase();
  let category: ComplaintCategory = 'Infrastructure';
  let priority: ComplaintPriority = 'medium';
  let safetyHazard = false;

  if (lower.includes('water') || lower.includes('leak') || lower.includes('pipe') || lower.includes('toilet') || lower.includes('clog') || lower.includes('drain') || lower.includes('sink')) {
    category = 'Plumbing';
    if (lower.includes('flood') || lower.includes('burst') || lower.includes('severe') || lower.includes('near electric')) {
      priority = 'urgent';
      safetyHazard = true;
    } else {
      priority = 'high';
    }
  } else if (lower.includes('spark') || lower.includes('wire') || lower.includes('shock') || lower.includes('electric') || lower.includes('power out') || lower.includes('flicker') || lower.includes('blackout')) {
    category = 'Electrical';
    if (lower.includes('spark') || lower.includes('smoke') || lower.includes('shock')) {
      priority = 'urgent';
      safetyHazard = true;
    } else {
      priority = 'high';
    }
  } else if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet') || lower.includes('ethernet') || lower.includes('eduroam') || lower.includes('network')) {
    category = 'Network & Wi-Fi';
    priority = lower.includes('exam') || lower.includes('entire building') ? 'high' : 'medium';
  } else if (lower.includes('dorm') || lower.includes('bed') || lower.includes('radiator') || lower.includes('heater') || lower.includes('roommate') || lower.includes('hostel')) {
    category = 'Hostel & Housing';
    priority = lower.includes('freezing') || lower.includes('lock') || lower.includes('window') ? 'high' : 'medium';
  } else if (lower.includes('trash') || lower.includes('garbage') || lower.includes('smell') || lower.includes('dirty') || lower.includes('spill') || lower.includes('clean')) {
    category = 'Sanitation & Cleanliness';
    priority = lower.includes('hazard') || lower.includes('bio') ? 'high' : 'medium';
  } else if (lower.includes('food') || lower.includes('cafeteria') || lower.includes('dining') || lower.includes('meal')) {
    category = 'Cafeteria & Food';
    priority = 'medium';
  } else if (lower.includes('dark') || lower.includes('light') || lower.includes('stalk') || lower.includes('lock') || lower.includes('security') || lower.includes('theft') || lower.includes('broken door')) {
    category = 'Security & Safety';
    priority = 'urgent';
    safetyHazard = true;
  } else if (lower.includes('projector') || lower.includes('board') || lower.includes('desk') || lower.includes('chair') || lower.includes('mic') || lower.includes('lab')) {
    category = 'Classroom & Labs';
    priority = 'medium';
  }

  const generatedTitle = rawText.split('\n')[0].slice(0, 60).trim();

  return {
    title: generatedTitle || 'Campus Facility Issue',
    category,
    priority,
    suggestedAction: safetyHazard ? 'Immediate emergency dispatch required.' : 'Schedule standard campus inspection.',
    safetyHazard,
    improvedDescription: rawText.trim()
  };
}

export async function askCampusAssistant(
  userQuery: string,
  complaintsContext: Complaint[],
  userRole: string
): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any)?.__ENV__?.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const complaintsSummary = complaintsContext.slice(0, 10).map(c => 
        `[ID: ${c.id}, Title: "${c.title}", Status: ${c.status}, Priority: ${c.priority}, Location: ${c.building} - ${c.room}]`
      ).join('\n');

      const systemPrompt = `You are "CampusFix AI", the university's 24/7 campus complaint and facilities assistant.
User role: ${userRole}.
Here are recent campus complaints in the system for reference:
${complaintsSummary}

Instructions:
1. Provide concise, helpful, direct answers.
2. If asked about a complaint ID, provide its current status, location, and resolution progress.
3. If asked about how to report an issue, remind them they can click "Submit Complaint" from their sidebar or header.
4. Keep emergency contact information handy: Campus Security Dispatch: ext. 4444 (24/7), Facilities Emergency: ext. 3333.
5. Max 2-3 short paragraphs. No jargon.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\nUser Question: ${userQuery}`,
      });

      if (response.text) {
        return response.text;
      }
    } catch (e) {
      console.warn('Gemini chat error, falling back to local campus bot knowledge base', e);
    }
  }

  // Robust knowledge-base fallback
  const query = userQuery.toLowerCase();

  // Check if query references a complaint ID
  const idMatch = query.match(/cf-\d{4}-\d+/i);
  if (idMatch) {
    const id = idMatch[0].toUpperCase();
    const found = complaintsContext.find(c => c.id.toUpperCase() === id);
    if (found) {
      return `**Complaint #${found.id}**: "${found.title}"
• **Current Status**: ${found.status.replace('_', ' ').toUpperCase()}
• **Location**: ${found.building} (${found.room})
• **Priority**: ${found.priority.toUpperCase()}
• **Assigned Staff**: ${found.assignedTo?.name || 'Awaiting assignment'}
• **Last Update**: ${new Date(found.updatedAt).toLocaleDateString()}
${found.resolutionNotes ? `• **Resolution Notes**: ${found.resolutionNotes}` : ''}`;
    } else {
      return `I could not find complaint #${id} in our current database. Please double-check the ID or view your active complaints in your dashboard.`;
    }
  }

  if (query.includes('how to report') || query.includes('submit complaint') || query.includes('report issue')) {
    return `To report an issue:
1. Click **"Submit Complaint"** in your left navigation menu or top bar.
2. Choose your building and specific room/area.
3. Describe the problem (you can click **"AI Auto-Fill"** to automatically determine category and priority).
4. Optionally upload a photo attachment.
5. Click **"Submit Report"** — you will receive an instant tracking ID and timeline updates.`;
  }

  if (query.includes('emergency') || query.includes('fire') || query.includes('gas') || query.includes('flood') || query.includes('urgent')) {
    return `⚠️ **For immediate life safety or active campus hazards**:
• **Campus Police & Emergency**: Dial **911** or internal extension **(555) 019-4444**.
• **24/7 Facilities Emergency Dispatch**: **(555) 019-3333**.
• For standard non-emergency maintenance, please file a ticket with "Urgent" priority in CampusFix.`;
  }

  if (query.includes('wifi') || query.includes('internet') || query.includes('eduroam')) {
    return `For Wi-Fi issues on campus:
• Connect to **eduroam** using your student email (e.g. \`username@campus.edu\`) and university password.
• If Wi-Fi is failing in a specific classroom or dorm, submit a report under the **"Network & Wi-Fi"** category so Campus IT can inspect the localized access point.`;
  }

  if (query.includes('library') || query.includes('hours')) {
    return `**Central University Library Hours**:
• Monday – Thursday: 7:30 AM – 12:00 Midnight
• Friday: 7:30 AM – 9:00 PM
• Saturday & Sunday: 9:00 AM – 11:00 PM
• 24-Hour Study Lounge available on the 1st Floor with student ID card access.`;
  }

  if (query.includes('dorm') || query.includes('heating') || query.includes('housing') || query.includes('room')) {
    return `For residential dormitory issues (heating, hot water, broken window locks, or appliances):
• Submit a complaint with category **"Hostel & Housing"** and specify your hall and room number.
• Residential maintenance technicians inspect dorm requests every weekday from 8:00 AM to 5:00 PM.`;
  }

  return `Hello! I'm your **CampusFix Assistant**. I can help you:
• Check the live status of any complaint (e.g., "Check status of CF-2026-101")
• Guide you on reporting maintenance, Wi-Fi, or sanitation issues
• Provide emergency contact numbers for campus facilities and security
• Explain resolution timelines and campus policies

How can I help you today?`;
}
