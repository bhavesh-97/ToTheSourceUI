
interface FontOption {
  label: string;
  value: string;
  family: string;
}

interface TableConfig {
  rows: number;
  cols: number;
  header: boolean;
  border: boolean;
  striped: boolean;
  cellPadding: number;
}

interface Emoji {
  emoji: string;
  description: string;
  category: string;
}

interface EditorStyle {
  fontSize: string;
  fontFamily: string;
  lineHeight: number;
  textAlign: string;
}

interface HistoryItem {
  content: string;
  timestamp: Date;
}
