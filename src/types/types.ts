export interface FlagDetails {
  tryInstead: string;
  why: string;
}

export interface TranscriptEntry {
  transcribed: string;
  userLabel: 'teacher' | 'student';
  flag: string | null;
  flagDetails: FlagDetails | null;
}

export interface TranscriptRecord {
  id?: string;
  sentences: TranscriptEntry[];
  createdAt: string;
  title: string;
}


//custom types are almost always objects 
//a types file is created for CUSTOM TYPES
