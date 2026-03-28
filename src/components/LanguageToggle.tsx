import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-1.5 text-xs font-medium"
      title={language === "en" ? "Mudar para Português" : "Switch to English"}
    >
      <Globe className="w-4 h-4" />
      <span className="hidden sm:inline">{language === "en" ? "PT" : "EN"}</span>
      <span className="sm:hidden">{language === "en" ? "PT" : "EN"}</span>
    </Button>
  );
};

export default LanguageToggle;
