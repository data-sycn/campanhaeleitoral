import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const supporterSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  telefone: z.string().trim().max(20).optional().or(z.literal("")),
  email: z.string().trim().email("Email inválido").max(255).optional().or(z.literal("")),
  endereco: z.string().trim().max(200).optional().or(z.literal("")),
  bairro: z.string().trim().max(100).optional().or(z.literal("")),
  cidade: z.string().trim().max(100).optional().or(z.literal("")),
  estado: z.string().trim().max(2).optional().or(z.literal("")),
  cep: z.string().trim().max(10).optional().or(z.literal("")),
  cpf: z.string().trim().max(14).optional().or(z.literal("")),
});

type SupporterFormData = z.infer<typeof supporterSchema>;

interface SupporterFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const initialForm: SupporterFormData = {
  nome: "",
  telefone: "",
  email: "",
  endereco: "",
  bairro: "",
  cidade: "Barreiras",
  estado: "BA",
  cep: "",
  cpf: "",
};

export function SupporterForm({ onSuccess, onCancel }: SupporterFormProps) {
  const { campanhaId, isMaster } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState<SupporterFormData>(initialForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof SupporterFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = supporterSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!campanhaId) {
      toast({ title: "Erro", description: isMaster ? "Selecione uma campanha primeiro." : "Campanha não identificada.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const data = result.data;
      const { error } = await supabase.from("supporters").insert({
        campanha_id: campanhaId,
        nome: data.nome,
        telefone: data.telefone || null,
        email: data.email || null,
        endereco: data.endereco || null,
        bairro: data.bairro || null,
        cidade: data.cidade || null,
        estado: data.estado || null,
        cep: data.cep || null,
        cpf: data.cpf || null,
      });

      if (error) throw error;

      toast({ title: "Apoiador cadastrado!", description: `${data.nome} foi adicionado com sucesso.` });
      setForm(initialForm);
      onSuccess();
    } catch (err: any) {
      toast({ title: "Erro ao cadastrar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Cadastrar Novo Apoiador</CardTitle>
        <CardDescription>Preencha os dados do apoiador para registrá-lo na campanha</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              placeholder="Nome do apoiador"
              maxLength={100}
            />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
          </div>

          {/* Telefone + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={form.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                placeholder="(77) 99999-0000"
                maxLength={20}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@exemplo.com"
                maxLength={255}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
          </div>

          {/* CPF */}
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={form.cpf}
              onChange={(e) => handleChange("cpf", e.target.value)}
              placeholder="000.000.000-00"
              maxLength={14}
            />
          </div>

          {/* Endereço */}
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={form.endereco}
              onChange={(e) => handleChange("endereco", e.target.value)}
              placeholder="Rua, número, complemento"
              maxLength={200}
            />
          </div>

          {/* Bairro + Cidade + Estado + CEP */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                value={form.bairro}
                onChange={(e) => handleChange("bairro", e.target.value)}
                placeholder="Bairro"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={form.cidade}
                onChange={(e) => handleChange("cidade", e.target.value)}
                placeholder="Cidade"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">UF</Label>
              <Input
                id="estado"
                value={form.estado}
                onChange={(e) => handleChange("estado", e.target.value.toUpperCase())}
                placeholder="BA"
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={form.cep}
                onChange={(e) => handleChange("cep", e.target.value)}
                placeholder="47800-000"
                maxLength={10}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving} variant="campaign">
              {saving ? "Salvando..." : "Cadastrar Apoiador"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
