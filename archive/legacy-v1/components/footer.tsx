interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={`w-full text-center z-10 ${className}`}>
      <div className="text-sm text-zinc-400">
        Copyright © {new Date().getFullYear()} Yeonhee Kim. All rights reserved.
      </div>
    </footer>
  );
};