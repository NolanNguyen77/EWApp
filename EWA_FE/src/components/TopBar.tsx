import { ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  onBack: () => void;
}

export default function TopBar({ title, onBack }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl">
      <div className="flex items-center px-6 h-16 w-full">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors active:scale-95 -ml-2 text-indigo-600"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="ml-2 font-bold text-lg tracking-tight text-indigo-900">{title}</h1>
      </div>
    </header>
  );
}
