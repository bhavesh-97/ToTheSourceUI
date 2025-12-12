import { ValidationRules } from "../shared/utilities/validation-rules.enum";

export interface FormFieldConfig {
  name: string;
  isMandatory?: boolean;
  validationMessage?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  events?: { type: string; validationRule: ValidationRules }[];
}