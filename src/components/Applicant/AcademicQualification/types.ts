export interface Qualification {
  id: number;
  education_level_id: string;
  category_id: string;
  programme_id: string;
  institution_id: string;
  country_id: string;
  education_level: string;
  programme: string;
  institution: string;
  country: string;
  started: string;
  ended: string;
}

export interface OptionType {
  value: string | number;
  label: string;
}
