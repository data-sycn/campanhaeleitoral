import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone, MapPin, Mail, CreditCard, Briefcase, FileText,
  Home, Building, Map, Hash,
} from "lucide-react";

interface SupporterData {
  nome: string;
  email: string | null;
  telefone: string | null;
  cpf: string | null;
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  funcao_politica: string | null;
  observacao: string | null;
  foto_url: string | null;
}

interface ProfileDataCardProps {
  supporter: SupporterData | null;
  userEmail: string | null;
}

function DataRow({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

export function ProfileDataCard({ supporter, userEmail }: ProfileDataCardProps) {
  if (!supporter) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ficha Cadastral</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhum cadastro de apoiador vinculado ao seu perfil.
          </p>
        </CardContent>
      </Card>
    );
  }

  const address = [supporter.endereco, supporter.bairro].filter(Boolean).join(", ");
  const cityState = [supporter.cidade, supporter.estado].filter(Boolean).join("/");

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Ficha Cadastral</CardTitle>
          {supporter.funcao_politica && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Briefcase className="w-3 h-3" />
              {supporter.funcao_politica}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0">
          {/* Contact */}
          <div className="space-y-0">
            <DataRow icon={Mail} label="Email" value={supporter.email || userEmail} />
            <DataRow icon={Phone} label="Telefone" value={supporter.telefone} />
            <DataRow icon={CreditCard} label="CPF" value={supporter.cpf} />
            <DataRow icon={Briefcase} label="Função Política" value={supporter.funcao_politica} />
          </div>

          {/* Address */}
          <div className="space-y-0 pt-2 sm:pt-0">
            <DataRow icon={Home} label="Endereço" value={address || null} />
            <DataRow icon={Building} label="Cidade / UF" value={cityState || null} />
            <DataRow icon={Hash} label="CEP" value={supporter.cep} />
          </div>
        </div>

        {supporter.observacao && (
          <div className="mt-4 pt-3 border-t">
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Observação</p>
                <p className="text-sm whitespace-pre-wrap">{supporter.observacao}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
