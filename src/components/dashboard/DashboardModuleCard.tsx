import { LucideIcon, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  color: "blue" | "green" | "red" | "purple" | "orange";
  stats: string;
}

const colorClasses = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    border: "hover:border-blue-500/50",
    iconBg: "bg-blue-500/20",
  },
  green: {
    bg: "bg-green-500/10",
    text: "text-green-600",
    border: "hover:border-green-500/50",
    iconBg: "bg-green-500/20",
  },
  red: {
    bg: "bg-red-500/10",
    text: "text-red-600",
    border: "hover:border-red-500/50",
    iconBg: "bg-red-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-600",
    border: "hover:border-purple-500/50",
    iconBg: "bg-purple-500/20",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-600",
    border: "hover:border-orange-500/50",
    iconBg: "bg-orange-500/20",
  },
};

export function DashboardModuleCard({
  id,
  title,
  description,
  icon: Icon,
  route,
  color,
  stats,
}: DashboardModuleCardProps) {
  const navigate = useNavigate();
  const colors = colorClasses[color];

  const handleNavigate = () => {
    navigate(route);
  };

  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${colors.border} hover:-translate-y-1`}
      onClick={handleNavigate}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl ${colors.iconBg}`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1" />
        </div>
        <CardTitle className="text-xl mt-4">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`text-sm font-medium ${colors.text} ${colors.bg} px-3 py-1.5 rounded-full inline-block mb-4`}>
          {stats}
        </div>
        <Button
          variant="ghost"
          className="w-full justify-between group-hover:bg-muted/50"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
        >
          Acessar Módulo
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
